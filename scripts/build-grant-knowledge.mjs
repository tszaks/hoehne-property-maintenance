import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const legacyRoot = '/Users/tyler/Google Drive/My Drive/Tyler Workspace/Legacy Root/Clients/GNA';
const outputPath = path.join(repoRoot, 'src/data/grant-knowledge.json');
const sourceLibraryLabel = 'Legacy Root/Clients/GNA';

const SOURCE_LIBRARY = [
    {
        category: 'offers',
        id: 'gna-offer-stack',
        path: path.join(legacyRoot, 'Sales Content/Sales Materials/GNA_Complete_Offer_Stack.docx'),
        tags: ['offers', 'academy', 'coaching', 'management-team', 'weekly-meetings', 'project-management', 'business-development'],
        title: 'GNA Complete Offer Stack',
    },
    {
        category: 'offers',
        id: 'gna-academy-sales-intro',
        path: path.join(legacyRoot, 'Sales Essentials/GNA Academy Sales Team Intro.pdf'),
        tags: ['academy', 'cadence', 'lms', 'coaching', 'execution', 'positioning'],
        title: 'GNA Academy Sales Team Intro',
    },
    {
        category: 'frameworks',
        id: 'three-steps-workbook',
        path: path.join(legacyRoot, 'Course Content/3_Steps_To_Power_Academy_Workbook.docx'),
        tags: ['accountability', 'metrics', 'reports', 'weekly-meetings', 'promises', 'coaching', 'breakthrough'],
        title: '3 Steps to Power Academy Workbook',
    },
    {
        category: 'frameworks',
        id: 'real-accountability-workbook',
        path: path.join(legacyRoot, 'GNA Workbook - Real Accountability.pdf'),
        tags: ['accountability', 'metrics', 'reports', 'weekly-meetings', 'promises'],
        title: 'Real Accountability Workbook',
    },
    {
        category: 'frameworks',
        id: 'conversation-for-action',
        path: path.join(legacyRoot, 'Course Content/CFA.pdf'),
        tags: ['communication', 'requests', 'promises', 'conditions-of-satisfaction', 'leadership'],
        title: 'Communication for Action',
    },
    {
        category: 'frameworks',
        id: 'measures-of-successful-leadership',
        path: path.join(legacyRoot, 'Sales Content/Sales Materials/Measures_of_Successful_Leadership.pdf'),
        tags: ['leadership', 'accountability', 'integrity', 'coaching', 'commitment', 'financials'],
        title: 'Measures of Successful Leadership',
    },
    {
        category: 'frameworks',
        id: 'five-stages-of-business',
        path: path.join(legacyRoot, 'Course Content/Five Stages of Business.pdf'),
        tags: ['stages', 'growth', 'owner-dependence', 'management-team', 'exit'],
        title: 'Five Stages of Business',
    },
    {
        category: 'psychology',
        id: 'gregbot-training-manual',
        path: path.join(legacyRoot, 'Business Operations/GregBot Training Manual.docx'),
        tags: ['autonomy', 'mastery', 'purpose', 'owner-fit', 'positioning', 'transformation'],
        title: 'GregBot Training Manual',
    },
    {
        category: 'operations',
        id: 'pain-points-reference',
        path: path.join(legacyRoot, 'Sales Content/Sales Materials/Pain_Points_And_Coaching_Topics_Reference.docx'),
        tags: ['owner-bottleneck', 'profit', 'sales', 'management', 'coaching', 'marketing'],
        title: 'Pain Points and Coaching Topics Reference',
    },
    {
        category: 'operations',
        id: 'business-assessment',
        path: path.join(legacyRoot, 'Business Operations/GNA Business Assessment.pdf'),
        tags: ['assessment', 'financials', 'sales', 'team', 'operations', 'customer'],
        title: 'GNA Business Assessment',
    },
    {
        category: 'operations',
        id: 'bottleneck-assessment',
        path: path.join(legacyRoot, 'Marketing Materials/bottleneck-assessment.pdf'),
        tags: ['bottleneck', 'delegation', 'leadership', 'cost-of-inaction'],
        title: 'Bottleneck Assessment',
    },
    {
        category: 'operations',
        id: 'team-empowerment',
        path: path.join(legacyRoot, 'Sales Content/Presentations/Team_Empowerment_Overview.docx'),
        tags: ['empowerment', 'ownership', 'morale', 'productivity', 'culture'],
        title: 'Team Empowerment Overview',
    },
    {
        category: 'operations',
        id: 'project-manager-rules',
        path: path.join(legacyRoot, 'Course Content/First Year Program/Production/10 Rules.pdf'),
        tags: ['project-management', 'coordination', 'customer', 'team', 'learning'],
        title: '10 Rules for Project Managers',
    },
];

const CURATED_CARDS = [
    {
        category: 'positioning',
        cues: ['who is greg', 'why greg', 'different', 'credible', 'experience', 'licensed contractor'],
        id: 'greg-credibility',
        priority: 14,
        sourceIds: ['gna-academy-sales-intro', 'gregbot-training-manual'],
        tags: ['credibility', 'fit', 'restoration', 'construction', 'coach'],
        text: 'Greg is a licensed contractor who has spent three decades building teams, fixing broken execution, and helping restoration and construction owners stop being the driving force of the company. His authority comes from pattern recognition in real shops, not generic business-coach language.',
        title: 'Greg credibility and point of view',
    },
    {
        category: 'fit',
        cues: ['fit', 'ideal client', 'who is this for', 'sweet spot', 'right fit'],
        id: 'best-fit-owner',
        priority: 12,
        sourceIds: ['gregbot-training-manual', 'five-stages-of-business'],
        tags: ['fit', 'owner', 'sweet-spot', 'stage-two', 'stage-three', 'stage-four'],
        text: 'Best fit is usually an owner in restoration or construction who has built something real, often around $5M to $35M, but still feels like the hub for hard calls, accountability, and key decisions. Greg is strongest when the business has enough demand and now needs leadership depth, stronger managers, and less owner dependence.',
        title: 'Who Greg is best for',
    },
    {
        category: 'offers',
        cues: ['academy', 'gna academy', 'how does academy work', 'what do you get', 'lms', 'live coaching'],
        id: 'gna-academy',
        priority: 14,
        sourceIds: ['gna-academy-sales-intro', 'gna-offer-stack'],
        tags: ['academy', 'offer', 'coaching', 'lms', 'execution'],
        text: 'GNA Academy is the main structured offer. It combines lifetime LMS access with two live Zoom coaching sessions each month so operators get the playbooks plus a regular cadence to diagnose bottlenecks, reset commitments, and keep execution moving.',
        title: 'GNA Academy structure',
    },
    {
        category: 'offers',
        cues: ['what does academy include', 'academy include', 'what comes with academy', 'academy outcomes'],
        id: 'gna-academy-outcomes',
        priority: 13,
        sourceIds: ['gna-academy-sales-intro'],
        tags: ['academy', 'offer', 'outcomes', 'execution', 'meetings', 'profitability'],
        text: 'The Academy outcome is not theory. It is better meetings, stronger ownership, faster execution, more reliable pipelines, and better profitability because the system makes it hard to hide and easier for managers and teams to keep their word.',
        title: 'GNA Academy outcomes',
    },
    {
        category: 'offers',
        cues: ['one-on-one', 'one to one', 'private coaching', 'custom coaching'],
        id: 'one-to-one-coaching',
        priority: 11,
        sourceIds: ['gna-offer-stack'],
        tags: ['coaching', 'custom', 'one-to-one', 'full-service'],
        text: 'One-to-one coaching is Greg’s higher-touch custom work. It reaches across business development, sales, financial management, project coordination, project management, collections, leadership, and accountability when the owner needs hands-on help across the whole business.',
        title: 'One-to-one coaching',
    },
    {
        category: 'offers',
        cues: ['exit', 'succession', 'sell', 'retire', 'business value'],
        id: 'succession-and-exit',
        priority: 11,
        sourceIds: ['gna-offer-stack', 'five-stages-of-business'],
        tags: ['succession', 'exit', 'sale', 'owner-dependence', 'business-value'],
        text: 'Succession and exit work is about making the business valuable without the owner in the middle. Greg helps owners strengthen financials, operational discipline, management depth, and everyday independence so the company can be sold or handed off cleanly.',
        title: 'Succession and exit strategy',
    },
    {
        category: 'offers',
        cues: ['weekly meetings', 'meeting training', 'team meetings', 'our meetings suck'],
        id: 'weekly-team-meetings-course',
        priority: 13,
        sourceIds: ['gna-offer-stack', 'real-accountability-workbook'],
        tags: ['weekly-meetings', 'accountability', 'ownership', 'facts-not-stories'],
        text: 'The weekly meetings training turns vague update meetings into short operating reviews built around facts, promised targets versus actuals, breakdowns, team problem-solving, and acknowledgements. The point is not more meetings. The point is meetings that create ownership after the room clears.',
        title: 'Highly Effective Weekly Team Meetings',
    },
    {
        category: 'offers',
        cues: ['management team', 'gm', 'leaders', 'leadership team', 'management bench'],
        id: 'dynamic-management-team-course',
        priority: 13,
        sourceIds: ['gna-offer-stack', 'five-stages-of-business'],
        tags: ['management-team', 'gm', 'leadership', 'owner-dependence'],
        text: 'Build a Dynamic Powerful Management Team is about making the team the driving force of the business. It covers motivation, ownership, leadership behavior, and how to move the owner out of carrying every hard call and backstop decision.',
        title: 'Build a Dynamic Powerful Management Team',
    },
    {
        category: 'offers',
        cues: ['project management', 'project coordination', 'pm', 'pc', 'jobs dragging', 'closeout', 'subs'],
        id: 'project-management-course',
        priority: 13,
        sourceIds: ['gna-offer-stack', 'project-manager-rules'],
        tags: ['project-management', 'coordination', 'margin', 'schedule', 'closeout'],
        text: 'Greg treats project management and project coordination as two sides of the same coin. The goal is faster, cleaner jobs with tighter schedules, better buyout discipline, stronger pre-con planning, better milestone tracking, and fewer closed-date drifts that bleed margin.',
        title: 'Highly Effective Project Management and Project Coordination',
    },
    {
        category: 'offers',
        cues: ['coaching for excellence', 'coachable', 'uncoachable', 'coach my team', 'command and control'],
        id: 'coaching-for-excellence-course',
        priority: 13,
        sourceIds: ['gna-offer-stack', 'three-steps-workbook'],
        tags: ['coaching', 'coachable', 'uncoachable', 'leadership', 'performance'],
        text: 'Coaching for Excellence moves leaders out of command-and-control and into real coaching. Greg teaches how to distinguish coachable from uncoachable behavior, reinforce the right people, and challenge strong performers to a higher level instead of carrying everybody the same way.',
        title: 'Coaching for Excellence and High Performance',
    },
    {
        category: 'framework',
        cues: ['accountability', 'ownership', 'job descriptions', 'who owns what', 'people do not own results'],
        id: 'real-accountability',
        priority: 14,
        sourceIds: ['real-accountability-workbook', 'three-steps-workbook'],
        tags: ['accountability', 'ownership', 'metrics', 'reports'],
        text: 'Real accountability means every task, outcome, and needed result in the business lives inside a clear accountability. Greg’s version is not forced compliance. It works best when people understand the whole result, choose into it, and can report on it with real metrics.',
        title: 'Real accountability',
    },
    {
        category: 'framework',
        cues: ['metrics', 'reports', 'kpis', 'scorecard', 'what should we measure'],
        id: 'metrics-and-reports',
        priority: 12,
        sourceIds: ['real-accountability-workbook', 'measures-of-successful-leadership'],
        tags: ['metrics', 'reports', 'kpis', 'leadership', 'financials'],
        text: 'Greg wants metrics that are specific, measurable, challenging, and tied to the company vision, with simple reports that can be read in about a minute. The point is fast transparency. If the reports are clear, the breakdowns show up quickly and the team can solve them before the owner has to.',
        title: 'Metrics and one-minute reports',
    },
    {
        category: 'framework',
        cues: ['weekly meetings', 'facts not stories', 'promises', 'acknowledgements'],
        id: 'weekly-meeting-rhythm',
        priority: 13,
        sourceIds: ['real-accountability-workbook', 'three-steps-workbook'],
        tags: ['weekly-meetings', 'promises', 'acknowledgements', 'breakdowns'],
        text: 'A healthy weekly meeting in Greg’s world runs on facts, not stories. Each person reports promised target versus actual, names what did not work, asks the team for solutions, makes clear promises for next week, and acknowledges wins so the meeting becomes a performance engine instead of a complaint circle.',
        title: 'Weekly meeting rhythm',
    },
    {
        category: 'framework',
        cues: ['communication', 'cfa', 'promise', 'request', 'conditions of satisfaction'],
        id: 'communication-for-action',
        priority: 12,
        sourceIds: ['conversation-for-action'],
        tags: ['communication', 'promises', 'leadership', 'requests'],
        text: 'Communication for Action is Greg’s communication loop for producing results instead of confusion. The work is to make clear requests, negotiate conditions of satisfaction, make real promises, perform, and then explicitly declare completion and satisfaction so work does not drift inside assumptions.',
        title: 'Communication for Action',
    },
    {
        category: 'framework',
        cues: ['stages', 'stage', 'grow', 'stuck', 'owner does everything', 'sell someday'],
        id: 'five-stages',
        priority: 14,
        sourceIds: ['five-stages-of-business'],
        tags: ['stages', 'growth', 'owner-dependence', 'management-team', 'exit'],
        text: 'Greg’s Five Stages of Business is a practical growth model: owner does everything, then delegates, then builds a playbook and management team, then the business runs independent of the owner, then the company has real value without the owner. The key question is always whether the owner’s direct involvement is shrinking as leadership depth grows.',
        title: 'Five Stages of Business',
    },
    {
        category: 'framework',
        cues: ['leadership', 'successful leadership', 'what should leaders do', 'scorecard'],
        id: 'leadership-scorecard',
        priority: 11,
        sourceIds: ['measures-of-successful-leadership'],
        tags: ['leadership', 'accountability', 'integrity', 'coaching', 'commitment', 'financials'],
        text: 'Greg’s leadership scorecard focuses on six things: accountability, integrity, coaching, commitment, financials, and leadership. In plain English, leaders should keep their word, coach people well, understand the numbers, and build a culture that carries the company forward without drama.',
        title: 'Measures of Successful Leadership',
    },
    {
        category: 'psychology',
        cues: ['coachable', 'uncoachable', 'bad hire', 'wrong person', 'can they be coached'],
        id: 'coachable-vs-uncoachable',
        priority: 12,
        sourceIds: ['three-steps-workbook'],
        tags: ['coaching', 'coachable', 'uncoachable', 'performance'],
        text: 'Greg puts a lot of weight on coachable versus uncoachable behavior. If someone will take feedback, own breakdowns, and move, they are worth coaching hard. If they stay commitment-light and results stay stuck after clear support, Greg sees that as an exit-path issue, not a forever coaching project.',
        title: 'Coachable versus uncoachable',
    },
    {
        category: 'psychology',
        cues: ['autonomy', 'mastery', 'purpose', 'motivate', 'motivation', 'money'],
        id: 'autonomy-mastery-purpose',
        priority: 11,
        sourceIds: ['gregbot-training-manual'],
        tags: ['autonomy', 'mastery', 'purpose', 'motivation', 'culture'],
        text: 'Greg’s deeper human model is autonomy, mastery, and purpose. He does not treat money as the only motivator. His belief is that when people have room to think, a path to get better, and a sense the company stands for something larger than payroll, productivity rises and profits follow.',
        title: 'Autonomy, mastery, and purpose',
    },
    {
        category: 'operations',
        cues: ['owner bottleneck', 'do everything', 'middle of everything', 'step away', 'vacation', 'firefighting'],
        id: 'owner-bottleneck',
        priority: 14,
        sourceIds: ['pain-points-reference', 'business-assessment', 'bottleneck-assessment'],
        tags: ['owner-bottleneck', 'firefighting', 'step-away', 'leadership'],
        text: 'The most repeated GNA pain pattern is owner-centric leadership: the owner is still driving sales, ops, hiring, decisions, and crisis management. The business may be growing, but the owner still feels like the safety net, the firefighter, and the one person everything important lands back on.',
        title: 'Owner bottleneck pattern',
    },
    {
        category: 'operations',
        cues: ['profit', 'margin', 'cash flow', 'collections', 'gp', 'job cost', 'wip', 'overhead'],
        id: 'margin-and-cash-flow',
        priority: 13,
        sourceIds: ['pain-points-reference', 'business-assessment'],
        tags: ['profit', 'margin', 'cash-flow', 'collections', 'job-costing', 'financials'],
        text: 'Greg links weak margins to unclear markups, incomplete job costing, slow collections, weak GP targets, and production misses that the owner ends up absorbing. In GNA’s language, money problems are rarely just accounting problems. They usually expose leadership, accountability, and operational breakdowns upstream.',
        title: 'Margin and cash-flow problems',
    },
    {
        category: 'operations',
        cues: ['sales', 'business development', 'leads', 'estimating', 'close rate', 'price competition'],
        id: 'sales-and-business-development',
        priority: 12,
        sourceIds: ['pain-points-reference', 'business-assessment'],
        tags: ['sales', 'business-development', 'estimating', 'price-competition', 'lead-flow'],
        text: 'GNA treats sales weakness as a system problem: poor lead flow, no formal sales training, weak outreach to adjusters or property managers, low conversion, flat sales, and constant price competition. Greg also warns that sales and production should stay in healthy tension so the business can sell aggressively without overpromising what ops cannot deliver.',
        title: 'Sales and business development issues',
    },
    {
        category: 'operations',
        cues: ['project management', 'coordination', 'jobs drag', 'closeout', 'customer angry', 'adjuster', 'change order'],
        id: 'project-management-issues',
        priority: 13,
        sourceIds: ['project-manager-rules', 'business-assessment'],
        tags: ['project-management', 'coordination', 'closeout', 'customer', 'adjuster', 'change-order'],
        text: 'In restoration and construction, profit gets won or lost in the handoffs. Greg’s PM lens is close customer contact, meticulous coordination, visible project promises, real documentation, and fast follow-up on approvals, change orders, supplements, collections, and closeout. If those handoffs are sloppy, margin and reputation both suffer.',
        title: 'Project management and coordination issues',
    },
    {
        category: 'operations',
        cues: ['hiring', 'turnover', 'good people', 'morale', 'team', 'branches', 'employees'],
        id: 'hiring-and-team-performance',
        priority: 12,
        sourceIds: ['pain-points-reference', 'business-assessment', 'team-empowerment'],
        tags: ['hiring', 'turnover', 'morale', 'team', 'ownership', 'productivity'],
        text: 'Greg sees team problems as more than hiring problems. Yes, turnover and weak recruiting matter, but the deeper issue is often a culture where people work mechanically, avoid ownership, and wait for the owner to think for them. His answer is stronger accountability, coaching, clearer standards, and a culture that calls for better performance.',
        title: 'Hiring and team performance',
    },
    {
        category: 'operations',
        cues: ['meetings', 'phone calls', 'communication', 'office and field', 'handoff', 'broken communication'],
        id: 'communication-and-handoffs',
        priority: 12,
        sourceIds: ['business-assessment', 'conversation-for-action', 'project-manager-rules'],
        tags: ['communication', 'handoffs', 'office-field', 'requests', 'promises'],
        text: 'A recurring operational failure in these docs is communication by loose phone calls, missing notes, and unclear next-step ownership. Greg’s response is structured communication: clearer requests, clearer promises, cleaner written follow-up, and fewer handoff gaps between field, office, estimators, PMs, coordinators, and customers.',
        title: 'Communication and handoff breakdowns',
    },
    {
        category: 'psychology',
        cues: ['owner stress', 'work weekends', 'exhausted', 'retire', 'do it myself'],
        id: 'owner-emotional-load',
        priority: 12,
        sourceIds: ['pain-points-reference', 'gregbot-training-manual'],
        tags: ['stress', 'owner', 'weekends', 'emotional-load', 'freedom'],
        text: 'Greg’s language assumes the owner has built something real and is paying for it with stress, constant mental load, and not being able to step away. He does not frame that as weakness. He frames it as a predictable ceiling that shows up when the company has grown past pure hustle but leadership and ownership have not caught up yet.',
        title: 'Owner stress and emotional load',
    },
];

function normalizeWhitespace(text) {
    return text
        .replaceAll('\r', '\n')
        .replaceAll('\u00a0', ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[‐‑‒–—]/g, '-')
        .trim();
}

function wordCount(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function extractText(filePath) {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === '.docx') {
        return execFileSync('textutil', ['-convert', 'txt', '-stdout', filePath], {
            encoding: 'utf8',
            maxBuffer: 20 * 1024 * 1024,
        });
    }

    if (extension === '.pdf') {
        return execFileSync('pdftotext', ['-layout', filePath, '-'], {
            encoding: 'utf8',
            maxBuffer: 20 * 1024 * 1024,
        });
    }

    throw new Error(`Unsupported file type: ${filePath}`);
}

function isUsefulParagraph(paragraph) {
    const text = paragraph.trim();
    if (!text) return false;

    const letters = (text.match(/[A-Za-z]/g) ?? []).length;
    if (letters < 45) return false;

    if (/^(gregory neil|greg neil|contact us today|please call|https?:\/\/)/i.test(text)) {
        return false;
    }

    if (/\$\s*\d|\b15,?000\b|\b1,800\b|\bper year\b|\bper month\b|\binvestment\b|\breturn on investment\b|\broi\b|\d+\s*%/i.test(text)) {
        return false;
    }

    if ((text.match(/[_□☐]/g) ?? []).length > 8) {
        return false;
    }

    return true;
}

function paragraphToChunks(source, text) {
    const paragraphs = normalizeWhitespace(text)
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
        .filter(isUsefulParagraph);

    const chunks = [];
    let current = '';

    const pushCurrent = () => {
        const value = current.trim();
        if (!value) return;
        if (wordCount(value) < 35) {
            current = '';
            return;
        }

        chunks.push(value);
        current = '';
    };

    for (const paragraph of paragraphs) {
        const combined = current ? `${current}\n${paragraph}` : paragraph;

        if (wordCount(combined) > 120) {
            pushCurrent();
            current = paragraph;
            continue;
        }

        current = combined;
    }

    pushCurrent();

    return chunks.map((chunk, index) => ({
        category: source.category,
        cues: source.tags,
        id: `${source.id}-raw-${index + 1}`,
        priority: 4,
        sourceIds: [source.id],
        tags: source.tags,
        text: chunk.replace(/\s*\n\s*/g, ' '),
        title: `${source.title} reference ${index + 1}`,
    }));
}

function buildBundle() {
    const sources = [];
    const rawCards = [];

    for (const source of SOURCE_LIBRARY) {
        const extracted = extractText(source.path);
        const normalized = normalizeWhitespace(extracted);

        sources.push({
            category: source.category,
            id: source.id,
            path: path.relative(legacyRoot, source.path),
            tags: source.tags,
            title: source.title,
            wordCount: wordCount(normalized),
        });

        rawCards.push(...paragraphToChunks(source, normalized));
    }

    return {
        cards: [...CURATED_CARDS, ...rawCards],
        generatedAt: new Date().toISOString(),
        sourceLibraryPath: sourceLibraryLabel,
        sources,
    };
}

function main() {
    const bundle = buildBundle();

    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');

    console.log(`Wrote ${bundle.cards.length} knowledge cards from ${bundle.sources.length} source documents.`);
    console.log(outputPath);
}

main();
