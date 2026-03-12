import rawKnowledgeBundle from '../../data/grant-knowledge.json';

type ChatMessage = {
    content: string;
    role: 'assistant' | 'user';
};

type GrantKnowledgeSource = {
    aliasOf?: string;
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
    detailOptions?: string[];
    id: string;
    priority?: number;
    questionAngles?: string[];
    sourceIds: string[];
    statusAnchor?: string;
    tags: string[];
    text: string;
    title: string;
};

type GrantKnowledgeBundle = {
    cards: GrantKnowledgeCard[];
    generatedAt: string;
    skippedSources?: Array<{
        path: string;
        reason: string;
    }>;
    sourceLibraryPath: string;
    sources: GrantKnowledgeSource[];
};

type TopicRule = {
    regex: RegExp;
    tags: string[];
};

type IntentRule = {
    instruction: string;
    intent: 'call' | 'credibility' | 'fit' | 'first-step';
    preferredCardIds: string[];
    regex: RegExp;
};

type QueryParts = {
    combined: string;
    context: string;
    contextTokens: string[];
    latest: string;
    latestTokens: string[];
};

const KNOWLEDGE_BUNDLE = rawKnowledgeBundle as GrantKnowledgeBundle;

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
        regex: /\b(mastermind|peer group|peer groups|other owners|other gms)\b/i,
        tags: ['mastermind', 'peer-group', 'coaching', 'accountability'],
    },
    {
        regex: /\b(delegate|delegation|let go|hand things off|handoff authority)\b/i,
        tags: ['delegation', 'owner-bottleneck', 'leadership'],
    },
    {
        regex: /\b(burnout|burned out|overloaded|checked out|emotional intelligence)\b/i,
        tags: ['burnout', 'emotional-intelligence', 'team', 'coaching'],
    },
    {
        regex: /\b(5 steps|7 steps|steps to power|framework|install sequence)\b/i,
        tags: ['framework', 'steps', 'breakthrough', 'leadership'],
    },
    {
        regex: /\b(eos|consultant|consultants|did not stick|didn't stick|slid back|slide back|waste of money|already tried)\b/i,
        tags: ['skepticism', 'consultant-burn', 'accountability', 'weekly-meetings'],
    },
    {
        regex: /\b(academy|offer|coaching|mastermind|weekly meetings training)\b/i,
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

const INTENT_RULES: IntentRule[] = [
    {
        intent: 'credibility',
        regex: /\b(why should i work with (greg|you|him)|why would i work with (greg|you|him)|why should we work with (greg|you|him)|why would we work with (greg|you|him))\b/i,
        preferredCardIds: ['greg-credibility', 'best-fit-owner'],
        instruction: 'This is defensive skepticism. Validate their caution first, then ask permission to learn about their situation before you make a case for Greg.',
    },
    {
        intent: 'credibility',
        regex: /\b(how is greg different|what makes greg different|why greg|why greg specifically|why would greg be different)\b/i,
        preferredCardIds: ['greg-credibility', 'structure-vs-lived-ownership'],
        instruction: 'This is a credibility question. Answer the difference question first, and lead with licensed contractor plus 30+ years and/or 300+ owners before comparing systems.',
    },
    {
        intent: 'fit',
        regex: /\b(what kind of business are you best for|what kind of owner gets the most out of greg|who gets the most out of greg|what kind of owner gets the most out|who is greg best for|what kind of business is greg best for)\b/i,
        preferredCardIds: ['best-fit-owner', 'owner-bottleneck'],
        instruction: 'This is a fit question. Answer the fit profile first before you talk about diagnostics or booking.',
    },
    {
        intent: 'call',
        regex: /\b(what happens on the call|what is the call about|what happens on that call|what happens on the discovery call|what would the call be about)\b/i,
        preferredCardIds: ['call-as-diagnostic', 'best-fit-owner'],
        instruction: 'This is a discovery-call question. Make the call sound practical and diagnostic before you ask anything back.',
    },
    {
        intent: 'first-step',
        regex: /\b(what would (he|greg|you) do first|where would (he|greg|you) start|what would be the first move|what's the first move|what would he want to see first|what would greg want to see first|what would he look at first|what would greg look at first)\b/i,
        preferredCardIds: ['diy-open-loop', 'owner-bottleneck'],
        instruction: 'This is a first-lens question. Give one sharp first lens before you ask a focused follow-up.',
    },
];

const TRANSACTIONAL_PATTERNS = [
    /\b(full )?name\b/i,
    /\b(best )?email\b/i,
    /\btime ?zone\b/i,
    /\bbook( it|ing)?\b/i,
    /\block it in\b/i,
    /\bslot\b/i,
    /\bwhat times?\b/i,
    /\bavailable times?\b/i,
    /\bopening(s)?\b/i,
    /\bavailability\b/i,
    /\bcalendar\b/i,
    /\breschedule\b/i,
    /\bcancel\b/i,
    /\bthat works\b/i,
    /\bsounds good\b/i,
    /\buse 1-on-1 coaching\b/i,
];

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

function isTransactionalTurn(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return true;

    const normalized = normalizeText(trimmed);
    const words = normalized.split(' ').filter(Boolean);
    const topicalTags = detectTags(trimmed);

    if (words.length <= 2 && /^(hi|hey|hello|thanks|thank you|ok|okay|cool|yes|yep|yeah)$/i.test(trimmed)) {
        return true;
    }

    if (!topicalTags.length && TRANSACTIONAL_PATTERNS.some((pattern) => pattern.test(trimmed))) {
        return true;
    }

    return false;
}

function buildQueryParts(messages: ChatMessage[]): QueryParts | null {
    const userMessages = messages.filter((message) => message.role === 'user');
    const latestMessage = [...userMessages].reverse().find((message) => message.content.trim());

    if (!latestMessage || isTransactionalTurn(latestMessage.content)) {
        return null;
    }

    const latest = latestMessage.content;
    const latestTokens = tokenize(latest);
    const contextMessages = userMessages
        .slice(0, -1)
        .filter((message) => !isTransactionalTurn(message.content))
        .slice(-2)
        .map((message) => message.content);
    const context = contextMessages.join(' ');

    return {
        combined: [latest, context].filter(Boolean).join(' '),
        context,
        contextTokens: tokenize(context),
        latest,
        latestTokens,
    };
}

function detectIntentRule(text: string) {
    return INTENT_RULES.find((rule) => rule.regex.test(text)) ?? null;
}

function scoreTextForTokens(text: string, tokens: string[], perTokenScore: number) {
    let score = 0;

    for (const token of tokens) {
        if (text.includes(token)) {
            score += perTokenScore;
        }
    }

    return score;
}

function scoreCard(card: GrantKnowledgeCard, query: QueryParts, detectedTags: string[], intentRule: IntentRule | null) {
    const normalizedTitle = normalizeText(card.title);
    const normalizedText = normalizeText(card.text);
    const normalizedCues = card.cues.map((cue) => normalizeText(cue));
    const normalizedDetails = (card.detailOptions ?? []).map((detail) => normalizeText(detail));
    let score = card.priority ?? 0;

    for (const tag of detectedTags) {
        if (card.tags.includes(tag)) {
            score += 9;
        }
    }

    for (const cue of normalizedCues) {
        if (cue && query.latest.includes(cue)) {
            score += 18;
            continue;
        }

        if (cue && query.context.includes(cue)) {
            score += 8;
        }
    }

    score += scoreTextForTokens(normalizedTitle, query.latestTokens, 6);
    score += scoreTextForTokens(normalizedTitle, query.contextTokens, 3);
    score += scoreTextForTokens(normalizedText, query.latestTokens, 2);
    score += scoreTextForTokens(normalizedText, query.contextTokens, 1);

    for (const tag of card.tags) {
        if (query.latestTokens.some((token) => tag.includes(token))) {
            score += 4;
        } else if (query.contextTokens.some((token) => tag.includes(token))) {
            score += 2;
        }
    }

    for (const detail of normalizedDetails) {
        if (detail && query.latest.includes(detail)) {
            score += 5;
        }
    }

    if (intentRule) {
        const preferredIndex = intentRule.preferredCardIds.indexOf(card.id);
        if (preferredIndex === 0) {
            score += 42;
        } else if (preferredIndex > 0) {
            score += 22;
        }
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

function formatCard(card: GrantKnowledgeCard) {
    const extras: string[] = [];

    if (card.statusAnchor) {
        extras.push(`status anchor: ${card.statusAnchor}`);
    }

    if (card.detailOptions?.length) {
        extras.push(`detail options: ${card.detailOptions.slice(0, 3).join('; ')}`);
    }

    if (card.questionAngles?.length) {
        extras.push(`question angles: ${card.questionAngles.slice(0, 2).join(' / ')}`);
    }

    return extras.length ? `- ${card.title}: ${card.text} (${extras.join(' | ')})` : `- ${card.title}: ${card.text}`;
}

export function retrieveGrantKnowledge(messages: ChatMessage[], maxCards = 4) {
    if (!KNOWLEDGE_BUNDLE.cards.length) return [];

    const query = buildQueryParts(messages);
    if (!query?.combined.trim()) return [];

    const detectedTags = detectTags(query.combined);
    const intentRule = detectIntentRule(query.latest);
    const ranked = KNOWLEDGE_BUNDLE.cards
        .map((card) => ({
            card,
            score: scoreCard(card, query, detectedTags, intentRule),
        }))
        .filter((entry) => entry.score > 6)
        .sort((left, right) => right.score - left.score)
        .map((entry) => entry.card);

    return dedupeAndTrim(ranked, maxCards);
}

export function buildGrantKnowledgeBrief(messages: ChatMessage[]) {
    const knowledgeCards = retrieveGrantKnowledge(messages, 3);
    if (!knowledgeCards.length) return '';

    const primaryCard = knowledgeCards[0];
    const latestMessage = [...messages].reverse().find((message) => message.role === 'user')?.content ?? '';
    const intentRule = detectIntentRule(latestMessage);
    const lines = [
        'TURN REQUIREMENT:',
        `- Primary source-backed lens for this turn: "${primaryCard.title}".`,
        intentRule ? `- ${intentRule.instruction}` : '',
        intentRule?.intent === 'credibility'
            ? '- First sentence must include at least one concrete Greg credential before you compare systems or explain the failure pattern.'
            : '',
        '- Start with the operating read itself. Do not open with filler like "Greg sees this all the time."',
        '- Use one concrete operating detail from these notes before you pivot back to diagnosis or CTA.',
        primaryCard.statusAnchor ? `- Protect status this way: ${primaryCard.statusAnchor}.` : '',
        primaryCard.detailOptions?.length
            ? `- Best detail options for this turn: ${primaryCard.detailOptions.slice(0, 3).join('; ')}.`
            : '',
        primaryCard.questionAngles?.length
            ? `- If you ask a follow-up, keep it in this lane: ${primaryCard.questionAngles.slice(0, 2).join(' / ')}.`
            : '',
        '- Stay conversational and do not dump frameworks, documents, or the whole playbook.',
        'SOURCE-BACKED CONTEXT FOR THIS CHAT:',
        'Use only what fits this exact conversation. Pull one or two concrete details. Do not quote price, and do not sound like you are reading notes.',
        ...knowledgeCards.map(formatCard),
    ].filter(Boolean);

    return lines.join('\n');
}

export function getGrantKnowledgeSources() {
    return KNOWLEDGE_BUNDLE.sources;
}
