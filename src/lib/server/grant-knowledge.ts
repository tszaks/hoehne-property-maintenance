import { readFileSync } from 'node:fs';

type ChatMessage = {
    content: string;
    role: 'assistant' | 'user';
};

type GrantKnowledgeSource = {
    category: string;
    id: string;
    path: string;
    tags: string[];
    title: string;
    wordCount: number;
};

type GrantKnowledgeCard = {
    category: string;
    cues: string[];
    id: string;
    priority?: number;
    sourceIds: string[];
    tags: string[];
    text: string;
    title: string;
};

type GrantKnowledgeBundle = {
    cards: GrantKnowledgeCard[];
    generatedAt: string;
    sourceLibraryPath: string;
    sources: GrantKnowledgeSource[];
};

type TopicRule = {
    regex: RegExp;
    tags: string[];
};

const STOP_WORDS = new Set([
    'about',
    'after',
    'again',
    'also',
    'been',
    'being',
    'between',
    'both',
    'came',
    'come',
    'does',
    'doing',
    'from',
    'have',
    'help',
    'here',
    'into',
    'just',
    'like',
    'more',
    'need',
    'really',
    'said',
    'same',
    'should',
    'still',
    'than',
    'that',
    'their',
    'them',
    'then',
    'there',
    'they',
    'this',
    'through',
    'want',
    'what',
    'when',
    'where',
    'which',
    'while',
    'with',
    'would',
    'your',
]);

const TOPIC_RULES: TopicRule[] = [
    {
        regex: /\b(owner|bottleneck|step away|vacation|firefighting|everything depends on me|safety net|middle of everything)\b/i,
        tags: ['owner-bottleneck', 'stress', 'leadership', 'fit'],
    },
    {
        regex: /\b(gm|manager|management team|leadership team|leaders|superintendent)\b/i,
        tags: ['management-team', 'leadership', 'gm'],
    },
    {
        regex: /\b(meeting|meetings|weekly report|update meeting|facts not stories|promise)\b/i,
        tags: ['weekly-meetings', 'promises', 'accountability'],
    },
    {
        regex: /\b(accountability|ownership|own results|job descriptions|who owns what)\b/i,
        tags: ['accountability', 'ownership', 'metrics', 'reports'],
    },
    {
        regex: /\b(margin|margins|profit|profitability|gp|cash flow|collections|wip|job cost|markup|financial)\b/i,
        tags: ['profit', 'margin', 'cash-flow', 'financials', 'job-costing'],
    },
    {
        regex: /\b(leads|lead flow|marketing|sales|conversion|close rate|business development|estimating|adjuster|property manager)\b/i,
        tags: ['sales', 'business-development', 'estimating', 'lead-flow'],
    },
    {
        regex: /\b(project|project management|project coordination|closeout|change order|schedule|subs|production)\b/i,
        tags: ['project-management', 'coordination', 'production', 'customer'],
    },
    {
        regex: /\b(hire|hiring|turnover|morale|employee|employees|team|culture|coachable|uncoachable)\b/i,
        tags: ['hiring', 'team', 'culture', 'coaching'],
    },
    {
        regex: /\b(academy|offer|coaching|call|discovery|mastermind|weekly meetings training)\b/i,
        tags: ['academy', 'offer', 'coaching'],
    },
    {
        regex: /\b(sell|sale|retire|retirement|succession|exit|business value)\b/i,
        tags: ['succession', 'exit', 'sale', 'business-value'],
    },
    {
        regex: /\b(autonomy|mastery|purpose|motivate|motivation)\b/i,
        tags: ['autonomy', 'mastery', 'purpose', 'motivation'],
    },
];

let cachedBundle: GrantKnowledgeBundle | null = null;

function loadKnowledgeBundle() {
    if (cachedBundle) {
        return cachedBundle;
    }

    try {
        const fileUrl = new URL('../../data/grant-knowledge.json', import.meta.url);
        cachedBundle = JSON.parse(readFileSync(fileUrl, 'utf8')) as GrantKnowledgeBundle;
    } catch {
        cachedBundle = {
            cards: [],
            generatedAt: '',
            sourceLibraryPath: '',
            sources: [],
        };
    }

    return cachedBundle;
}

function normalizeText(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(text: string) {
    return normalizeText(text)
        .split(' ')
        .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function unique<T>(values: T[]) {
    return [...new Set(values)];
}

function detectTags(text: string) {
    const tags = TOPIC_RULES.flatMap((rule) => (rule.regex.test(text) ? rule.tags : []));
    return unique(tags);
}

function buildQuery(messages: ChatMessage[]) {
    return messages
        .filter((message) => message.role === 'user')
        .slice(-6)
        .map((message) => message.content)
        .join(' ');
}

function scoreCard(card: GrantKnowledgeCard, query: string, tokens: string[], detectedTags: string[]) {
    const normalizedTitle = normalizeText(card.title);
    const normalizedText = normalizeText(card.text);
    const normalizedCues = card.cues.map((cue) => normalizeText(cue));
    let score = card.priority ?? 0;

    for (const tag of detectedTags) {
        if (card.tags.includes(tag)) {
            score += 9;
        }
    }

    for (const cue of normalizedCues) {
        if (cue && query.includes(cue)) {
            score += 14;
        }
    }

    for (const token of tokens) {
        if (normalizedTitle.includes(token)) score += 4;
        if (card.tags.some((tag) => tag.includes(token))) score += 3;
        if (normalizedText.includes(token)) score += 1;
    }

    if (card.id.includes('-raw-')) {
        score -= 6;
    }

    return score;
}

function dedupeAndTrim(cards: GrantKnowledgeCard[], maxCards: number) {
    const seen = new Set<string>();
    const categoryCounts = new Map<string, number>();
    const results: GrantKnowledgeCard[] = [];

    for (const card of cards) {
        if (seen.has(card.id)) continue;

        if (card.id.includes('-raw-') && results.some((result) => result.category === card.category && !result.id.includes('-raw-'))) {
            continue;
        }

        const categoryCount = categoryCounts.get(card.category) ?? 0;
        if (categoryCount >= 2 && results.length >= 3) continue;

        results.push(card);
        seen.add(card.id);
        categoryCounts.set(card.category, categoryCount + 1);

        if (results.length >= maxCards) {
            break;
        }
    }

    return results;
}

export function retrieveGrantKnowledge(messages: ChatMessage[], maxCards = 4) {
    const bundle = loadKnowledgeBundle();
    if (!bundle.cards.length) return [];

    const rawQuery = buildQuery(messages);
    if (!rawQuery.trim()) return [];

    const normalizedQuery = normalizeText(rawQuery);
    const queryTokens = tokenize(rawQuery);
    const detectedTags = detectTags(rawQuery);

    const ranked = bundle.cards
        .map((card) => ({
            card,
            score: scoreCard(card, normalizedQuery, queryTokens, detectedTags),
        }))
        .filter((entry) => entry.score > 4)
        .sort((left, right) => right.score - left.score)
        .map((entry) => entry.card);

    return dedupeAndTrim(ranked, maxCards);
}

export function buildGrantKnowledgeBrief(messages: ChatMessage[]) {
    const knowledgeCards = retrieveGrantKnowledge(messages, 3);
    if (!knowledgeCards.length) return '';

    const lines = [
        'SOURCE-BACKED CONTEXT FOR THIS CHAT:',
        'Use only what fits this exact conversation. Pull one or two concrete details. Do not dump frameworks, do not quote price, and do not sound like you are reading notes.',
        ...knowledgeCards.map((card) => `- ${card.title}: ${card.text}`),
    ];

    return lines.join('\n');
}

export function getGrantKnowledgeSources() {
    return loadKnowledgeBundle().sources;
}
