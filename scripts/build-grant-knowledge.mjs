import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const defaultLegacyRoot = '/Users/tyler/Google Drive/My Drive/Tyler Workspace/Legacy Root/Clients/GNA';
const archivedDownloadsRoot = '/Users/tyler/Google Drive/My Drive/Tyler Workspace/Files/Downloads/Archived Downloads';
const gregDocumentsArchiveRoot = `${archivedDownloadsRoot}/Private & Shared/Greg’s Documents 2097fee997858041a388e29c4e54afee`;
const gregSalesTeamArchiveRoot = `${archivedDownloadsRoot}/GNA Academy - Greg's Version/Sales Team docs`;
const outputPath = path.join(repoRoot, 'src/data/grant-knowledge.json');
const DEFAULT_SOURCE_ROOTS = [
    {
        label: 'Legacy Root/Clients/GNA',
        path: defaultLegacyRoot,
    },
    {
        label: 'OneDrive GNA (Tyler)',
        path: '/Users/tyler/Library/CloudStorage/OneDrive-Personal/GNA (Tyler)',
    },
    {
        label: 'Archived Downloads/Greg Documents',
        path: gregDocumentsArchiveRoot,
    },
    {
        label: 'Archived Downloads/GNA Academy Sales Team docs',
        path: gregSalesTeamArchiveRoot,
    },
];
const configuredSourceRoots = process.env.GNA_SOURCE_ROOTS
    ? process.env.GNA_SOURCE_ROOTS.split(path.delimiter).filter(Boolean).map((sourcePath) => ({
        label: path.basename(sourcePath),
        path: sourcePath,
    }))
    : DEFAULT_SOURCE_ROOTS;
const SOURCE_ROOTS = configuredSourceRoots.filter((sourceRoot) => existsSync(sourceRoot.path));
const EXTRA_SOURCE_RELATIVE_FILES = [
    'Claude_Conversations/Greg_Neil_Voice_Profile_Analysis.md',
    'Claude_Conversations/Greg_LinkedIn_Posts_REVISED.md',
];
const EXTRA_FALLBACK_SOURCE_FILES = [
    path.join(archivedDownloadsRoot, 'Three_Steps_to_Power_-_GNA_Academy_Workbook.docx'),
    path.join(archivedDownloadsRoot, 'GNA PL Diagnostic.pdf'),
    path.join(archivedDownloadsRoot, 'Jun - Great Leadership Really M eans You’re the Head Coach.docx'),
    path.join(archivedDownloadsRoot, '2_12_2020_Plan Right-Win Big_FINAL.pptx'),
];
const SUPPORTED_EXTENSIONS = new Set(['.doc', '.docx', '.html', '.md', '.pdf', '.ppt', '.pptx', '.txt']);
const SOURCE_ALLOWLIST_PATTERNS = [
    /greg_neil_voice_profile_analysis\.md$/i,
    /greg_linkedin_posts_revised\.md$/i,
];
const SOURCE_IGNORE_PATTERNS = [
    /\/archive\/archive\//i,
    /\/august project\//i,
    /\/brand assets\//i,
    /\/claude_conversations\//i,
    /\/images?\//i,
    /\/logos?\//i,
    /\/graphics?\//i,
    /\/media\//i,
    /\/podcasts?\//i,
    /\/testimonials?\//i,
    /\/videos?\//i,
    /batch_\d+_(bounces|unsubscribes)\.txt$/i,
    /\/claude\.md$/i,
    /\/project[_-]?memory\.md$/i,
    /aarons offer/i,
    /brand template/i,
    /\/contracts?\//i,
    /docusign/i,
    /huge banner/i,
    /independant contractor agreement/i,
    /lead tracker/i,
    /\.gdoc$/i,
];
const SOURCE_HINT_RULES = [
    {
        category: 'offers',
        id: 'gna-offer-stack',
        match: /(gna_complete_offer_stack|gna offers)\.docx$/i,
        tags: ['offers', 'academy', 'coaching', 'management-team', 'weekly-meetings', 'project-management', 'business-development'],
        title: 'GNA Complete Offer Stack',
    },
    {
        category: 'offers',
        id: 'gna-academy-sales-intro',
        match: /gna academy sales team intro\.pdf$/i,
        tags: ['academy', 'cadence', 'lms', 'coaching', 'execution', 'positioning'],
        title: 'GNA Academy Sales Team Intro',
    },
    {
        category: 'frameworks',
        id: 'three-steps-workbook',
        match: /(3_steps_to_power_academy_workbook|three_steps_to_power_-_gna_academy_workbook|three steps to power - gna academy workbook)\.docx$/i,
        tags: ['accountability', 'metrics', 'reports', 'weekly-meetings', 'promises', 'coaching', 'breakthrough'],
        title: '3 Steps to Power Academy Workbook',
    },
    {
        category: 'frameworks',
        id: 'real-accountability-workbook',
        match: /gna workbook - real accountability\.pdf$/i,
        tags: ['accountability', 'metrics', 'reports', 'weekly-meetings', 'promises'],
        title: 'Real Accountability Workbook',
    },
    {
        category: 'frameworks',
        id: 'conversation-for-action',
        match: /(^|\/)(cfa\.pdf|conversation_for_action_framework\.docx|com[_ ]4[_ ]action\.docx|conversation[_ ]for[_ ]action\.(ppt|docx))$/i,
        tags: ['communication', 'requests', 'promises', 'conditions-of-satisfaction', 'leadership'],
        title: 'Communication for Action',
    },
    {
        category: 'frameworks',
        id: 'measures-of-successful-leadership',
        match: /measures[_ ]of[_ ]successful[_ ]leadership\.pdf$/i,
        tags: ['leadership', 'accountability', 'integrity', 'coaching', 'commitment', 'financials'],
        title: 'Measures of Successful Leadership',
    },
    {
        category: 'frameworks',
        id: 'five-stages-of-business',
        match: /five stages of business(\.edited)?\.(docx|pdf)$/i,
        tags: ['stages', 'growth', 'owner-dependence', 'management-team', 'exit'],
        title: 'Five Stages of Business',
    },
    {
        category: 'psychology',
        id: 'gregbot-training-manual',
        match: /gregbot training manual\.docx$/i,
        tags: ['autonomy', 'mastery', 'purpose', 'owner-fit', 'positioning', 'transformation'],
        title: 'GregBot Training Manual',
    },
    {
        category: 'operations',
        id: 'pain-points-reference',
        match: /pain_points_and_coaching_topics_reference\.docx$/i,
        tags: ['owner-bottleneck', 'profit', 'sales', 'management', 'coaching', 'marketing'],
        title: 'Pain Points and Coaching Topics Reference',
    },
    {
        category: 'operations',
        id: 'business-assessment',
        match: /gna business assessment\.pdf$|gna business assesment\.doc$/i,
        tags: ['assessment', 'financials', 'sales', 'team', 'operations', 'customer'],
        title: 'GNA Business Assessment',
    },
    {
        category: 'operations',
        id: 'bottleneck-assessment',
        match: /(bottleneck-assessment|bottleneck assessment.*)\.pdf$/i,
        tags: ['bottleneck', 'delegation', 'leadership', 'cost-of-inaction'],
        title: 'Bottleneck Assessment',
    },
    {
        category: 'operations',
        id: 'team-empowerment',
        match: /team_empowerment_overview\.docx$/i,
        tags: ['empowerment', 'ownership', 'morale', 'productivity', 'culture'],
        title: 'Team Empowerment Overview',
    },
    {
        category: 'operations',
        id: 'project-manager-rules',
        match: /(^|\/)10 rules\.pdf$/i,
        tags: ['project-management', 'coordination', 'customer', 'team', 'learning'],
        title: '10 Rules for Project Managers',
    },
    {
        category: 'offers',
        id: 'all-programs-offer-stack',
        match: /complete_offer_stack_all_programs\.docx$/i,
        tags: ['offers', 'academy', 'coaching', 'mastermind', 'weekly-meetings', 'project-management', 'financials'],
        title: 'Complete Offer Stack All Programs',
    },
    {
        category: 'positioning',
        id: 'executive-summary',
        match: /(gna inc\.\s*executive summary|executive summary)\.pdf$/i,
        tags: ['positioning', 'market', 'construction', 'owner-dependence', 'transformation'],
        title: 'GNA Executive Summary',
    },
    {
        category: 'positioning',
        id: 'gna-at-a-glance',
        match: /gna in a glance\.docx$/i,
        tags: ['offers', 'positioning', 'weekly-meetings', 'management-team', 'project-management', 'financials'],
        title: 'GNA in a Glance',
    },
    {
        category: 'frameworks',
        id: 'seven-steps-program',
        match: /(^|\/)(7 steps\.pdf|7 steps to power\.pdf|7 steps\.docx|7_steps_to_power_program\.pdf|7_steps_to_power_overview\.pdf)$/i,
        tags: ['framework', 'breakthrough', 'growth', 'leadership'],
        title: '7 Steps to Power Program',
    },
    {
        category: 'frameworks',
        id: 'five-steps-framework',
        match: /(gna 5 steps v2|5 steps to power|5_steps_to_power_framework)\.docx$|gna 5 steps chart v2\.pdf$/i,
        tags: ['framework', 'breakthrough', 'leadership', 'stages'],
        title: '5 Steps to Power Framework',
    },
    {
        category: 'offers',
        id: 'mastermind-groups',
        match: /(gna mastermind groups|gna_mm_syllabus_|gna_mastermind_syllabus|mastermind groups source doc|we are excited to announce our new offering of master mind groups|cc[_ ]mmgroups[_ -]4-2023( 1)?)\.docx$/i,
        tags: ['mastermind', 'peer-group', 'coaching', 'accountability', 'owners', 'gms'],
        title: 'Mastermind Groups',
    },
    {
        category: 'offers',
        id: 'mastermind-agenda',
        match: /(mastermind agenda|masterminds call agenda|mm grp startup)\.docx$/i,
        tags: ['mastermind', 'peer-group', 'cadence', 'accountability', 'financials'],
        title: 'Mastermind Group Agenda',
    },
    {
        category: 'operations',
        id: 'delegation-blueprint',
        match: /gna-delegation-blueprint\.pdf$/i,
        tags: ['delegation', 'owner-bottleneck', 'leadership', 'hand-offs'],
        title: 'Delegation Blueprint',
    },
    {
        category: 'operations',
        id: 'financial-consulting-outline',
        match: /ouline for financial consulting .*\.docx$/i,
        tags: ['financials', 'profit', 'reports', 'planning', 'cash-flow'],
        title: 'Financial Consulting Outline',
    },
    {
        category: 'psychology',
        id: 'hiring-mistakes',
        match: /(5 hiring mistakes|aug -  5 hiring mistakes)\.(doc|pptx)$/i,
        tags: ['hiring', 'team', 'culture', 'performance'],
        title: 'Five Hiring Mistakes',
    },
    {
        category: 'psychology',
        id: 'employee-burnout',
        match: /how_to_avoid_employee_burnout.*\.pptx$/i,
        tags: ['burnout', 'team', 'management', 'psychology', 'leadership'],
        title: 'How to Avoid Employee Burnout',
    },
    {
        category: 'psychology',
        id: 'emotional-intelligence',
        match: /emotional intelligence of your key employees\.docx$/i,
        tags: ['emotional-intelligence', 'coaching', 'leadership', 'team'],
        title: 'Emotional Intelligence of Your Key Employees',
    },
    {
        category: 'psychology',
        id: 'evaluate-performance',
        match: /evaluate performance\.pdf$/i,
        tags: ['performance', 'coaching', 'leadership', 'accountability'],
        title: 'Evaluate Performance',
    },
    {
        category: 'psychology',
        id: 'productivity-challenges',
        match: /(jul - 3 challenges that kill your companys productivity|jul_-_3_challenges_that_kill_your_companys_productivity)\.doc$/i,
        tags: ['productivity', 'team', 'leadership', 'owner-bottleneck'],
        title: 'Three Challenges That Kill Productivity',
    },
    {
        category: 'psychology',
        id: 'employee-performance-challenges',
        match: /(oct[ _-]+2 challenges to great employee performance|oct_-__2_challenges_to_great_employee_performance|email[ _-]+how[ _-]+to[ _-]+increase[ _-]+employees[ _-]+performance)\.doc$/i,
        tags: ['performance', 'team', 'leadership', 'coaching'],
        title: 'Two Challenges to Great Employee Performance',
    },
    {
        category: 'operations',
        id: 'profit-barriers',
        match: /(sept - 3 barriers that stop contractors from profits|sept_-_3_barriers_that_stop_contractors_from_profits)\.doc$/i,
        tags: ['profit', 'hiring', 'marketing', 'sales', 'margin'],
        title: 'Three Barriers That Stop Contractors from Profits',
    },
    {
        category: 'sales',
        id: 'sales-letter-facts',
        match: /(the_facts_of_business_sales_letter|the facts of bus)\.docx$/i,
        tags: ['sales', 'positioning', 'pain', 'authority'],
        title: 'The Facts of Business Sales Letter',
    },
    {
        category: 'sales',
        id: 'pain-sales-script',
        match: /(the_pain_sales_script|the pain)\.docx$/i,
        tags: ['sales', 'pain', 'owner-bottleneck', 'authority'],
        title: 'Pain Sales Script',
    },
    {
        category: 'sales',
        id: 'freedom-email-sequence',
        match: /freedom_workshop_10_email_sequence\.docx$/i,
        tags: ['sales', 'email', 'freedom', 'positioning'],
        title: 'Freedom Workshop Email Sequence',
    },
    {
        category: 'sales',
        id: 'mastermind-email-sequence',
        match: /(mastermind_promotion_10_email_sequence|gna 10 emails to promote mastermind)\.docx$/i,
        tags: ['sales', 'email', 'mastermind', 'positioning'],
        title: 'Mastermind Promotion Email Sequence',
    },
    {
        category: 'sales',
        id: 'linkedin-outreach',
        match: /linkedin_(outreach_sequence_30_day_60_day|response_scripts|response_templates|sales_navigator_message_templates)\.docx$/i,
        tags: ['sales', 'linkedin', 'outreach', 'positioning'],
        title: 'LinkedIn Outreach Templates',
    },
    {
        category: 'sales',
        id: 'social-video-scripts',
        match: /(social_media_90_second_video_scripts|gna scripts for 90 second videos)\.docx$/i,
        tags: ['sales', 'video', 'positioning', 'authority'],
        title: '90 Second Video Scripts',
    },
    {
        category: 'sales',
        id: 'greg-linkedin-posts',
        match: /greg_linkedin_posts_revised\.md$/i,
        tags: ['sales', 'linkedin', 'positioning', 'authority'],
        title: 'Greg LinkedIn Posts Revised',
    },
    {
        category: 'operations',
        id: 'pl-diagnostic',
        match: /gna pl diagnostic\.pdf$/i,
        tags: ['financials', 'profit', 'margin', 'cash-flow', 'diagnostic'],
        title: 'GNA P&L Diagnostic',
    },
    {
        category: 'frameworks',
        id: 'plan-right-win-big',
        match: /(2_12_2020_plan[_ ]right-win[_ ]big_final( 1)?|2_12_2020_plan right-win big_final)\.pptx$/i,
        tags: ['planning', 'financials', 'framework', 'performance'],
        title: 'Plan Right Win Big',
    },
    {
        category: 'positioning',
        id: 'uvp-discovery-questionnaire',
        match: /chat[_ ]doc_?( 1)?\.docx$/i,
        tags: ['positioning', 'sales', 'authority', 'uvp'],
        title: 'UVP Discovery Questionnaire',
    },
    {
        category: 'psychology',
        id: 'head-coach-leadership',
        match: /(jun - great leadership really m eans you.re the head coach|jun_-_great_leadership_really_m_eans_youre_the_head_coach)\.docx$/i,
        tags: ['leadership', 'coaching', 'management-team', 'performance'],
        title: 'Great Leadership Means You Are the Head Coach',
    },
    {
        category: 'psychology',
        id: 'greg-voice-profile',
        match: /greg_neil_voice_profile_analysis\.md$/i,
        tags: ['voice', 'authority', 'positioning', 'psychology'],
        title: 'Greg Neil Voice Profile Analysis',
    },
];

const CURATED_CARDS = [
    {
        category: 'positioning',
        cues: ['who is greg', 'why greg', 'different', 'credible', 'experience', 'licensed contractor'],
        detailOptions: ['licensed contractor', '30+ years in restoration and construction', '300+ owners helped', 'operator pattern recognition instead of generic coach talk'],
        id: 'greg-credibility',
        priority: 14,
        questionAngles: ['Where does that show up most right now?', 'What keeps finding its way back to you?'],
        sourceIds: ['gna-academy-sales-intro', 'gregbot-training-manual', 'greg-voice-profile'],
        statusAnchor: 'Talk to them like they have built something real and are looking for an operator who has seen this movie before.',
        tags: ['credibility', 'fit', 'restoration', 'construction', 'coach'],
        text: 'Greg is a licensed contractor who has spent three decades building teams, fixing broken execution, and helping restoration and construction owners stop being the driving force of the company. His authority comes from pattern recognition in real shops, not generic business-coach language.',
        title: 'Greg credibility and point of view',
    },
    {
        category: 'sales-psychology',
        cues: ['tone', 'how would greg say it', 'how does greg talk', 'what is greg like', 'will greg just pitch me', 'is greg pushy'],
        detailOptions: ['calm and direct', 'specific instead of theatrical', 'serious about the cost without sounding alarmist', 'operator language instead of motivational fluff'],
        id: 'greg-voice-posture',
        priority: 12,
        questionAngles: ['What would make this conversation feel useful instead of salesy for you?', 'Which part of this are you most skeptical about right now?'],
        sourceIds: ['greg-voice-profile', 'greg-linkedin-posts'],
        statusAnchor: 'Sound grounded, unsurprised, and deeply familiar with the pattern, while still respecting that the problem feels heavy to them.',
        tags: ['authority', 'voice', 'trust', 'sales', 'skepticism'],
        text: 'Greg’s communication style is calm, surgical, and specific. He sounds like someone who has seen this pattern many times before, but he never talks down to the owner or acts like the pain is trivial. That combination of steadiness and precision is a big part of why his sales language feels credible.',
        title: 'Greg voice posture and trust',
    },
    {
        category: 'fit',
        cues: ['fit', 'ideal client', 'who is this for', 'sweet spot', 'right fit'],
        detailOptions: ['restoration or construction owner', 'roughly $5M to $35M', 'hard calls and accountability still land back on the owner', 'demand exists but leadership depth has not caught up yet'],
        id: 'best-fit-owner',
        priority: 12,
        questionAngles: ['If you stepped away for two weeks, what breaks first?', 'Where do hard calls still land back on you?'],
        sourceIds: ['gregbot-training-manual', 'five-stages-of-business'],
        statusAnchor: 'Frame it like they have built something real and now hit a scaling ceiling, not a personal failure.',
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
        detailOptions: ['facts not stories', 'promised targets versus actuals', 'what did not work', 'team problem-solving', 'acknowledgements'],
        id: 'weekly-team-meetings-course',
        priority: 13,
        questionAngles: ['What keeps coming back to you after those meetings?', 'Where do promises usually die right now?'],
        sourceIds: ['gna-offer-stack', 'real-accountability-workbook'],
        statusAnchor: 'Assume they already know meetings matter. The real issue is that the meeting is not transferring ownership.',
        tags: ['weekly-meetings', 'accountability', 'ownership', 'facts-not-stories'],
        text: 'The weekly meetings training turns vague update meetings into short operating reviews built around facts, promised targets versus actuals, breakdowns, team problem-solving, and acknowledgements. The point is not more meetings. The point is meetings that create ownership after the room clears.',
        title: 'Highly Effective Weekly Team Meetings',
    },
    {
        category: 'offers',
        cues: ['management team', 'gm', 'leaders', 'leadership team', 'management bench'],
        detailOptions: ['team becomes the driving force', 'owner stops carrying every hard call', 'leadership behavior and ownership improve together'],
        id: 'dynamic-management-team-course',
        priority: 13,
        questionAngles: ['Which calls still end up with you?', 'Where does the title exist but ownership still does not?'],
        sourceIds: ['gna-offer-stack', 'five-stages-of-business'],
        statusAnchor: 'Treat the issue like a growth-stage leadership transfer problem, not a failure of effort.',
        tags: ['management-team', 'gm', 'leadership', 'owner-dependence'],
        text: 'Build a Dynamic Powerful Management Team is about making the team the driving force of the business. It covers motivation, ownership, leadership behavior, and how to move the owner out of carrying every hard call and backstop decision.',
        title: 'Build a Dynamic Powerful Management Team',
    },
    {
        category: 'offers',
        cues: ['project management', 'project coordination', 'pm', 'pc', 'jobs dragging', 'closeout', 'subs'],
        detailOptions: ['buyout discipline', 'pre-con planning', 'milestone tracking', 'closed-date drift', 'cleaner handoffs between PM, coordinator, customer, and field'],
        id: 'project-management-course',
        priority: 13,
        questionAngles: ['Where do jobs start drifting first?', 'Which handoff is bleeding the most margin right now?'],
        sourceIds: ['gna-offer-stack', 'project-manager-rules'],
        statusAnchor: 'Talk like job drag is operationally normal at scale, but still expensive and fixable.',
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
        detailOptions: ['promised target versus actual', 'what did not work', 'ask the team for solutions', 'clear promises for next week', 'acknowledge wins'],
        id: 'weekly-meeting-rhythm',
        priority: 13,
        questionAngles: ['What keeps landing back on you after the meeting?', 'Where does the follow-through disappear?'],
        sourceIds: ['real-accountability-workbook', 'three-steps-workbook'],
        statusAnchor: 'Do not act like more meetings are the answer. Act like ownership after the meeting is the real problem.',
        tags: ['weekly-meetings', 'promises', 'acknowledgements', 'breakdowns'],
        text: 'A healthy weekly meeting in Greg’s world runs on facts, not stories. Each person reports promised target versus actual, names what did not work, asks the team for solutions, makes clear promises for next week, and acknowledges wins so the meeting becomes a performance engine instead of a complaint circle.',
        title: 'Weekly meeting rhythm',
    },
    {
        category: 'framework',
        cues: ['communication', 'cfa', 'promise', 'request', 'conditions of satisfaction'],
        detailOptions: ['clear requests', 'conditions of satisfaction', 'real promises', 'explicit completion', 'explicit satisfaction'],
        id: 'communication-for-action',
        priority: 12,
        questionAngles: ['Where does work get fuzzy right now?', 'Which handoff keeps running on assumptions?'],
        sourceIds: ['conversation-for-action'],
        statusAnchor: 'Treat confusion as a system problem, not a character flaw.',
        tags: ['communication', 'promises', 'leadership', 'requests'],
        text: 'Communication for Action is Greg’s communication loop for producing results instead of confusion. The work is to make clear requests, negotiate conditions of satisfaction, make real promises, perform, and then explicitly declare completion and satisfaction so work does not drift inside assumptions.',
        title: 'Communication for Action',
    },
    {
        category: 'framework',
        cues: ['stages', 'stage', 'grow', 'stuck', 'owner does everything', 'sell someday'],
        detailOptions: ['owner does everything', 'delegates but stays the center of gravity', 'management team becomes the driving force', 'business runs independent of the owner', 'business has real value without the owner'],
        id: 'five-stages',
        priority: 14,
        questionAngles: ['How much of the hard-call layer still depends on you?', 'Are you trying to build a team-run business or just a busier version of yourself?'],
        sourceIds: ['five-stages-of-business'],
        statusAnchor: 'Frame the problem as a stage transition issue. The owner is hitting a ceiling, not failing.',
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
        detailOptions: ['owner is still the safety net', 'owner is still the firefighter', 'key decisions and crises still land back on the owner'],
        id: 'owner-bottleneck',
        priority: 14,
        questionAngles: ['What pulls you back in first?', 'Where are you still the safety net?'],
        sourceIds: ['pain-points-reference', 'business-assessment', 'bottleneck-assessment'],
        statusAnchor: 'Acknowledge that they built the company. Then frame the pain as a predictable ownership-transfer ceiling.',
        tags: ['owner-bottleneck', 'firefighting', 'step-away', 'leadership'],
        text: 'The most repeated GNA pain pattern is owner-centric leadership: the owner is still driving sales, ops, hiring, decisions, and crisis management. The business may be growing, but the owner still feels like the safety net, the firefighter, and the one person everything important lands back on.',
        title: 'Owner bottleneck pattern',
    },
    {
        category: 'operations',
        cues: ['profit', 'margin', 'cash flow', 'collections', 'gp', 'job cost', 'wip', 'overhead'],
        detailOptions: ['unclear markups', 'incomplete job costing', 'slow collections', 'weak GP targets', 'production misses the owner absorbs'],
        id: 'margin-and-cash-flow',
        priority: 13,
        questionAngles: ['Where do you feel the leak most right now?', 'What keeps eroding profit after the job should already be working?'],
        sourceIds: ['pain-points-reference', 'business-assessment'],
        statusAnchor: 'Talk like the money issue is real, but upstream. It is usually exposing leadership and operational breakdowns, not just accounting.',
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
        detailOptions: ['close customer contact', 'meticulous coordination', 'visible project promises', 'follow-up on approvals and change orders', 'supplements, collections, and closeout discipline'],
        id: 'project-management-issues',
        priority: 13,
        questionAngles: ['Which handoff is breaking first?', 'Where are approvals, supplements, or closeout getting loose?'],
        sourceIds: ['project-manager-rules', 'business-assessment'],
        statusAnchor: 'Treat the pain like a handoff problem at scale, not a personal weakness.',
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
        detailOptions: ['loose phone calls', 'missing notes', 'unclear next-step ownership', 'clean written follow-up', 'fewer handoff gaps between field, office, estimators, PMs, coordinators, and customers'],
        id: 'communication-and-handoffs',
        priority: 12,
        questionAngles: ['Where do assumptions keep replacing clear handoffs?', 'Which handoff gets fuzzy most often?'],
        sourceIds: ['business-assessment', 'conversation-for-action', 'project-manager-rules'],
        statusAnchor: 'Treat the issue like work is moving through assumptions instead of clear requests and promises.',
        tags: ['communication', 'handoffs', 'office-field', 'requests', 'promises'],
        text: 'A recurring operational failure in these docs is communication by loose phone calls, missing notes, and unclear next-step ownership. Greg’s response is structured communication: clearer requests, clearer promises, cleaner written follow-up, and fewer handoff gaps between field, office, estimators, PMs, coordinators, and customers.',
        title: 'Communication and handoff breakdowns',
    },
    {
        category: 'sales-psychology',
        cues: ['eos', 'consultant', 'consultants', 'did not stick', "didn't stick", 'slid back', 'waste of money', 'already tried'],
        detailOptions: ['the structure may have been fine, but the weekly rhythm never changed', 'meetings surfaced issues without transferred ownership', 'manager behavior stayed the same, so the owner became the backstop again'],
        id: 'structure-vs-lived-ownership',
        priority: 14,
        questionAngles: ['What was the first thing that slipped after the rollout?', 'Where did ownership drift back to you?'],
        sourceIds: ['three-steps-workbook', 'conversation-for-action', 'pain-points-reference'],
        statusAnchor: 'Start by validating the frustration. Treat failed consulting as a real scar, not a misunderstanding.',
        tags: ['skepticism', 'consultant-burn', 'weekly-meetings', 'accountability', 'ownership'],
        text: 'When owners say they already tried EOS or consultants, Greg’s read is usually not that structure was wrong. It is that the weekly rhythm never forced promises, follow-up, and manager behavior to change, so the owner ended up carrying the hard calls again.',
        title: 'Structure versus lived ownership',
    },
    {
        category: 'sales-psychology',
        cues: ['what happens on the call', 'what is the call about', 'discovery call', 'sales call', 'what do we talk about', 'what happens on the discovery call'],
        detailOptions: ['map where ownership is breaking', 'see what still lands on the owner', 'sort whether the real issue is meetings, manager authority, margins, or a bigger install problem'],
        id: 'call-as-diagnostic',
        priority: 13,
        questionAngles: ['If Greg mapped that in 30 minutes, what would you want him to look at first?', 'Which part feels most expensive right now?'],
        sourceIds: ['gregbot-training-manual', 'business-assessment', 'five-stages-of-business'],
        statusAnchor: 'Make the call feel practical and diagnostic, not like a pitch.',
        tags: ['call', 'diagnostic', 'fit', 'owner-bottleneck', 'leadership'],
        text: 'The discovery call is a practical diagnostic. Greg uses it to map where ownership is breaking, what still lands on the owner, and whether the main choke point is meetings, manager authority, margins, or a deeper install issue.',
        title: 'Call as diagnostic',
    },
    {
        category: 'sales-psychology',
        cues: ['what would greg do first', 'what would he do first', 'where would greg start', 'what is the first move', 'just tell me the steps', 'can i do this myself'],
        detailOptions: ['look at which hard calls still land on the owner', 'look at which missed promises still bounce back to the owner', 'look at which key numbers still need the owner to force action'],
        id: 'diy-open-loop',
        priority: 13,
        questionAngles: ['Which of those still lands on you most?', 'What keeps boomeranging back to you right now?'],
        sourceIds: ['three-steps-workbook', 'conversation-for-action', 'pain-points-reference'],
        statusAnchor: 'Give one sharp first lens so they feel understood, then leave the full install for the call.',
        tags: ['diy', 'first-step', 'owner-bottleneck', 'promises', 'accountability'],
        text: 'Grant should not turn the chat into free consulting. The move is to give one sharp first lens on where ownership is breaking, then stop there and point to the call for the full install.',
        title: 'DIY open loop',
    },
    {
        category: 'offers',
        cues: ['mastermind', 'peer group', 'peer groups', 'other owners', 'group coaching'],
        detailOptions: ['monthly confidential owner and GM discussions', 'financial facts plus one deep-dive business each session', 'peer accountability with one-to-one follow-up between group meetings'],
        id: 'mastermind-groups-offer',
        priority: 12,
        questionAngles: ['Would peer accountability or custom one-to-one support move faster for you?', 'Do you need direct install help or a room of sharp operators to pressure-test decisions with?'],
        sourceIds: ['mastermind-groups', 'mastermind-agenda', 'mastermind-email-sequence'],
        statusAnchor: 'Position mastermind as structured peer accountability for serious operators, not networking.',
        tags: ['mastermind', 'peer-group', 'coaching', 'accountability', 'owners', 'gms'],
        text: 'GNA mastermind groups are monthly confidential sessions for owners and GMs who want peer accountability, a hard look at financial facts, and best-practice problem solving with other operators. Greg treats them as a faster-learning room, not a social group, and pairs the group cadence with direct follow-up so insights actually turn into execution.',
        title: 'Mastermind groups as peer accountability',
    },
    {
        category: 'operations',
        cues: ['delegation', 'delegate', 'let go', 'hand things off', 'everything still comes back to me'],
        detailOptions: ['delegate outcomes, not just tasks', 'tie new ownership to reports, metrics, and weekly follow-through', 'start with the most expensive hard-call layer that still boomerangs back to the owner'],
        id: 'delegation-install',
        priority: 13,
        questionAngles: ['Which decision type still boomerangs back to you most?', 'What have you delegated that is still really being supervised by you?'],
        sourceIds: ['delegation-blueprint', 'three-steps-workbook', 'project-manager-rules'],
        statusAnchor: 'Talk like delegation is an install problem, not a willpower problem.',
        tags: ['delegation', 'owner-bottleneck', 'leadership', 'accountability', 'reports'],
        text: 'Greg does not treat delegation like dumping work. Real delegation means moving an outcome, the decision rights around it, and the reporting rhythm that proves ownership has actually shifted. If the owner still has to chase, re-decide, or rescue it, the delegation never really happened.',
        title: 'Delegation install versus task dumping',
    },
    {
        category: 'operations',
        cues: ['financials', 'budget', 'balance sheet', 'p and l', 'p&l', 'cash flow', 'numbers', 'reports'],
        detailOptions: ['clear GP targets and margins', 'simple reports that expose breakdowns fast', 'financial planning that lets the owner lead instead of guess'],
        id: 'financial-clarity-install',
        priority: 12,
        questionAngles: ['Which number still feels the foggiest right now?', 'Where do you feel blind financially even though you know the pain is real?'],
        sourceIds: ['financial-consulting-outline', 'executive-summary', 'gna-at-a-glance', 'business-assessment'],
        statusAnchor: 'Treat money confusion like an operating clarity problem that can be fixed, not a character flaw.',
        tags: ['financials', 'profit', 'reports', 'cash-flow', 'planning', 'metrics'],
        text: 'Greg’s financial lane is about making the business legible. That means better reports, tighter GP and margin visibility, clearer planning, and simple financial disciplines that let the owner see where profit is leaking before it turns into stress and guesswork.',
        title: 'Financial clarity and profit discipline',
    },
    {
        category: 'psychology',
        cues: ['burnout', 'hiring', 'cannot find good people', 'retention', 'bad hires', 'employees are checked out'],
        detailOptions: ['good people hide behind average resumes', 'burnout often traces back to poor role clarity and weak leadership support', 'evaluate coachability, emotional intelligence, and follow-through instead of just skill'],
        id: 'hiring-and-burnout-diagnosis',
        priority: 12,
        questionAngles: ['Is the real issue bad hiring, weak leadership, or overloaded good people?', 'Where do you feel the people problem most right now: hiring, managing, or keeping them?'],
        sourceIds: ['hiring-mistakes', 'employee-burnout', 'emotional-intelligence', 'evaluate-performance'],
        statusAnchor: 'Treat people problems as predictable leadership-system problems, not random bad luck.',
        tags: ['hiring', 'burnout', 'emotional-intelligence', 'performance', 'team', 'leadership'],
        text: 'Greg’s people lens is sharper than “we need better employees.” He looks at hiring discipline, emotional intelligence, coachability, role clarity, leadership support, and whether good people are burning out because the company keeps asking them to win inside broken systems.',
        title: 'Hiring, burnout, and people-system diagnosis',
    },
    {
        category: 'sales-psychology',
        cues: ['sell me', 'why should i do this', 'sounds expensive', 'already tried', 'not sure this is worth it', 'can greg really help'],
        detailOptions: ['speak to the pain without humiliating the owner', 'tie the problem to freedom, margin, and time back', 'make the next step feel practical instead of pitchy'],
        id: 'pain-and-freedom-sales-frame',
        priority: 13,
        questionAngles: ['Which part feels most expensive right now: stress, margin, or the fact everything still depends on you?', 'If this actually got lighter, what would change first for you?'],
        sourceIds: ['pain-sales-script', 'sales-letter-facts', 'freedom-email-sequence', 'greg-linkedin-posts', 'gregbot-training-manual'],
        statusAnchor: 'Hold both sides at once: the pain is real, and there is a believable path to relief.',
        tags: ['sales', 'pain', 'freedom', 'authority', 'objections'],
        text: 'Greg’s sales language does not just push on pain. It connects the owner’s current pressure to a cleaner future: stronger margins, less daily drag, more trust in the team, and the ability to step away without the business wobbling. That balance is what makes the pitch feel grounded instead of manipulative.',
        title: 'Pain plus freedom sales framing',
    },
    {
        category: 'framework',
        cues: ['5 steps', '7 steps', 'framework', 'pathway', 'steps to power', 'what is the system'],
        detailOptions: ['Greg has multiple step-based teaching frameworks', 'the point is staged install, not theory for theory’s sake', 'the chat should point to the direction of the system without dumping the whole map'],
        id: 'step-frameworks',
        priority: 11,
        questionAngles: ['Which part of the install are you really asking about: leadership, meetings, delegation, or profit?', 'Do you want the high-level path or the first practical move?'],
        sourceIds: ['five-steps-framework', 'seven-steps-program', 'three-steps-workbook'],
        statusAnchor: 'Use the frameworks to sound structured, but do not hand over the whole install in chat.',
        tags: ['framework', 'steps', 'breakthrough', 'leadership', 'install'],
        text: 'Greg teaches in staged frameworks because owners need a sequence, not random advice. The important thing for Grant is to show there is a real install path behind the work, then stay focused on the one part of that path that matters most to the current conversation.',
        title: 'Step-based install frameworks',
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

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

function titleizeFileName(filePath) {
    return path
        .basename(filePath, path.extname(filePath))
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function stripHtml(text) {
    return text
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"');
}

function inferCategory(filePath) {
    const normalizedPath = filePath.replaceAll('\\', '/').toLowerCase();

    if (normalizedPath.includes('/business operations/')) return 'operations';
    if (normalizedPath.includes('/sales content/email marketing/')) return 'sales';
    if (normalizedPath.includes('/sales content/linkedin outreach/')) return 'sales';
    if (normalizedPath.includes('/sales essentials/')) return 'sales';
    if (normalizedPath.includes('/sales content/offers and programs/')) return 'offers';
    if (normalizedPath.includes('/sales content/sales materials/')) return 'sales';
    if (normalizedPath.includes('/marketing materials/')) return 'offers';
    if (normalizedPath.includes('/course content/')) return 'frameworks';
    if (normalizedPath.includes('voice_profile')) return 'psychology';

    return 'operations';
}

function inferTags(filePath) {
    const normalizedPath = filePath.replaceAll('\\', '/').toLowerCase();
    const tags = new Set();

    const tagRules = [
        { regex: /academy/, tags: ['academy', 'coaching', 'execution'] },
        { regex: /mastermind/, tags: ['mastermind', 'peer-group', 'coaching', 'accountability'] },
        { regex: /delegation/, tags: ['delegation', 'owner-bottleneck', 'leadership'] },
        { regex: /five stages|5 steps|7 steps|steps to power/, tags: ['framework', 'stages', 'breakthrough', 'leadership'] },
        { regex: /cfa|conversation for action|promise/, tags: ['communication', 'promises', 'requests'] },
        { regex: /meeting|accountability|metrics|report/, tags: ['weekly-meetings', 'accountability', 'metrics', 'reports'] },
        { regex: /project|production|coordinator/, tags: ['project-management', 'coordination', 'production'] },
        { regex: /sales|marketing|outreach|linkedin|email|brochure|flyer|workshop/, tags: ['sales', 'marketing', 'business-development', 'positioning'] },
        { regex: /hiring|employee|burnout|emotional intelligence|coachable|performance/, tags: ['team', 'performance', 'coaching', 'leadership'] },
        { regex: /financial|profit|margin|cash|budget|wip|collection/, tags: ['financials', 'profit', 'margin', 'cash-flow'] },
        { regex: /owner|bottleneck|freedom|retire|exit|succession/, tags: ['owner-bottleneck', 'freedom', 'exit'] },
        { regex: /gregbot|voice profile|integrity|purpose/, tags: ['psychology', 'authority', 'autonomy', 'mastery', 'purpose'] },
    ];

    for (const rule of tagRules) {
        if (rule.regex.test(normalizedPath)) {
            for (const tag of rule.tags) tags.add(tag);
        }
    }

    if (!tags.size) {
        tags.add('leadership');
    }

    return [...tags];
}

function describeSource(filePath) {
    const normalizedPath = filePath.replaceAll('\\', '/');
    const hinted = SOURCE_HINT_RULES.find((rule) => rule.match.test(normalizedPath));

    if (hinted) {
        return {
            category: hinted.category,
            hinted: true,
            id: hinted.id,
            tags: hinted.tags,
            title: hinted.title,
        };
    }

    return {
        category: inferCategory(normalizedPath),
        hinted: false,
        id: slugify(normalizedPath.replace(/^\/users\/tyler\//i, '').replace(path.extname(normalizedPath), '')),
        tags: inferTags(normalizedPath),
        title: titleizeFileName(normalizedPath),
    };
}

function shouldIgnoreSource(filePath) {
    const normalizedPath = filePath.replaceAll('\\', '/');
    const extension = path.extname(normalizedPath).toLowerCase();

    if (!SUPPORTED_EXTENSIONS.has(extension)) return true;
    if (SOURCE_ALLOWLIST_PATTERNS.some((pattern) => pattern.test(normalizedPath))) return false;

    return SOURCE_IGNORE_PATTERNS.some((pattern) => pattern.test(normalizedPath));
}

function walkFiles(rootPath) {
    const found = [];
    const entries = readdirSync(rootPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(rootPath, entry.name);

        if (entry.isDirectory()) {
            found.push(...walkFiles(fullPath));
            continue;
        }

        if (!entry.isFile()) continue;
        if (shouldIgnoreSource(fullPath)) continue;

        found.push(fullPath);
    }

    return found;
}

function sortByRootPriority(left, right) {
    if (left.rootIndex !== right.rootIndex) {
        return left.rootIndex - right.rootIndex;
    }

    return left.filePath.localeCompare(right.filePath);
}

function describeLooseSourceRoot(filePath) {
    if (filePath.startsWith(`${archivedDownloadsRoot}/`)) {
        return {
            rootIndex: SOURCE_ROOTS.length,
            rootLabel: 'Archived Downloads',
            rootPath: archivedDownloadsRoot,
        };
    }

    return {
        rootIndex: SOURCE_ROOTS.length,
        rootLabel: path.basename(path.dirname(filePath)),
        rootPath: path.dirname(filePath),
    };
}

function resolveExtraSourceFiles() {
    const resolved = [];
    const seenPaths = new Set();

    for (const relativePath of EXTRA_SOURCE_RELATIVE_FILES) {
        for (const sourceRoot of SOURCE_ROOTS) {
            const candidatePath = path.join(sourceRoot.path, relativePath);
            if (!existsSync(candidatePath) || seenPaths.has(candidatePath)) continue;
            seenPaths.add(candidatePath);
            resolved.push(candidatePath);
        }
    }

    for (const fallbackPath of EXTRA_FALLBACK_SOURCE_FILES) {
        if (!existsSync(fallbackPath) || seenPaths.has(fallbackPath)) continue;
        seenPaths.add(fallbackPath);
        resolved.push(fallbackPath);
    }

    return resolved;
}

function discoverSourceCandidates() {
    const seenPaths = new Set();
    const candidates = [];

    for (const [index, sourceRoot] of SOURCE_ROOTS.entries()) {
        for (const filePath of walkFiles(sourceRoot.path)) {
            if (seenPaths.has(filePath)) continue;
            seenPaths.add(filePath);
            candidates.push({
                filePath,
                rootIndex: index,
                rootLabel: sourceRoot.label,
                rootPath: sourceRoot.path,
            });
        }
    }

    for (const filePath of resolveExtraSourceFiles()) {
        if (!existsSync(filePath) || shouldIgnoreSource(filePath) || seenPaths.has(filePath)) continue;
        seenPaths.add(filePath);
        const extraRoot = describeLooseSourceRoot(filePath);
        candidates.push({
            filePath,
            rootIndex: extraRoot.rootIndex,
            rootLabel: extraRoot.rootLabel,
            rootPath: extraRoot.rootPath,
        });
    }

    return candidates.sort(sortByRootPriority);
}

const PPTX_TEXT_SCRIPT = `
from zipfile import ZipFile
from pathlib import Path
import html
import re
import sys

parts = []
with ZipFile(Path(sys.argv[1])) as archive:
    slide_names = sorted(
        name for name in archive.namelist()
        if re.match(r"ppt/slides/slide\\d+\\.xml$", name)
    )
    for name in slide_names:
        data = archive.read(name).decode("utf-8", errors="ignore")
        texts = [html.unescape(value) for value in re.findall(r"<a:t>(.*?)</a:t>", data)]
        cleaned = " ".join(text.strip() for text in texts if text.strip())
        if cleaned:
            parts.append(cleaned)

print("\\n\\n".join(parts))
`;

function extractText(filePath) {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === '.doc' || extension === '.docx') {
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

    if (extension === '.pptx') {
        return execFileSync('python3', ['-c', PPTX_TEXT_SCRIPT, filePath], {
            encoding: 'utf8',
            maxBuffer: 20 * 1024 * 1024,
        });
    }

    if (extension === '.ppt') {
        return execFileSync('strings', ['-n', '8', filePath], {
            encoding: 'utf8',
            maxBuffer: 20 * 1024 * 1024,
        })
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length >= 20)
            .join('\n\n');
    }

    if (extension === '.html') {
        return stripHtml(readFileSync(filePath, 'utf8'));
    }

    if (extension === '.md' || extension === '.txt') {
        return readFileSync(filePath, 'utf8');
    }

    throw new Error(`Unsupported file type: ${filePath}`);
}

function assertToolAvailable(name) {
    try {
        execFileSync('which', [name], { encoding: 'utf8' });
    } catch {
        throw new Error(`Missing required tool "${name}". Install it first, then rerun the knowledge build.`);
    }
}

function isUsefulParagraph(paragraph) {
    const text = paragraph.trim();
    if (!text) return false;

    const letters = (text.match(/[A-Za-z]/g) ?? []).length;
    if (letters < 45) return false;

    if (/^(gregory neil|greg neil|contact us today|please call|https?:\/\/)/i.test(text)) {
        return false;
    }

    if (/(adobe photoshop|xmpmeta|rdf:rdf|photoshop cs2|jfif|iccprofile|native digest|click to edit master|default design)/i.test(text)) {
        return false;
    }

    if (/\$\s*\d|\b15,?000\b|\b1,800\b|\bper year\b|\bper month\b|\binvestment\b|\breturn on investment\b|\broi\b|\d+\s*%/i.test(text)) {
        return false;
    }

    if ((text.match(/[_□☐]/g) ?? []).length > 8) {
        return false;
    }

    if (/untitled\s*\d+/i.test(text)) {
        return false;
    }

    if (/\[(report preparer|insert [^\]]+|enter [^\]]+|your [^\]]+)\]/i.test(text)) {
        return false;
    }

    return true;
}

function splitLongParagraph(paragraph, maxWords = 110) {
    if (wordCount(paragraph) <= maxWords) {
        return [paragraph];
    }

    const sentences = paragraph
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

    if (!sentences.length || sentences.every((sentence) => wordCount(sentence) > maxWords)) {
        const words = paragraph.split(/\s+/).filter(Boolean);
        const parts = [];
        for (let index = 0; index < words.length; index += maxWords) {
            parts.push(words.slice(index, index + maxWords).join(' '));
        }
        return parts;
    }

    const parts = [];
    let current = '';

    for (const sentence of sentences) {
        const combined = current ? `${current} ${sentence}` : sentence;
        if (wordCount(combined) > maxWords) {
            if (current) parts.push(current);
            current = sentence;
            continue;
        }
        current = combined;
    }

    if (current) parts.push(current);

    return parts.flatMap((part) => (wordCount(part) > maxWords ? splitLongParagraph(part, maxWords) : [part]));
}

function paragraphToChunks(source, text) {
    const paragraphs = normalizeWhitespace(text)
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
        .filter(isUsefulParagraph);
    const segments = paragraphs.flatMap((paragraph) => splitLongParagraph(paragraph));

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

    for (const segment of segments) {
        const combined = current ? `${current}\n${segment}` : segment;

        if (wordCount(combined) > 120) {
            pushCurrent();
            current = segment;
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

function shouldPreserveAlias(primarySource, duplicateSource) {
    return duplicateSource.hinted && duplicateSource.id !== primarySource.id;
}

function buildBundle() {
    const sources = [];
    const rawCards = [];
    const skippedSources = [];
    const seenHashes = new Map();
    const seenSourceIds = new Set();

    for (const candidate of discoverSourceCandidates()) {
        const hintedSource = describeSource(candidate.filePath);

        try {
            const extracted = extractText(candidate.filePath);
            const normalized = normalizeWhitespace(extracted);
            const totalWords = wordCount(normalized);

            if (totalWords < 80) {
                skippedSources.push({
                    path: candidate.filePath,
                    reason: 'too-short',
                });
                continue;
            }

            const contentHash = createHash('sha1').update(normalized).digest('hex');
            if (seenHashes.has(contentHash)) {
                const primarySource = seenHashes.get(contentHash);

                if (shouldPreserveAlias(primarySource, hintedSource) && !seenSourceIds.has(hintedSource.id)) {
                    sources.push({
                        aliasOf: primarySource.id,
                        category: hintedSource.category,
                        id: hintedSource.id,
                        path: `${candidate.rootLabel}/${path.relative(candidate.rootPath, candidate.filePath).replaceAll('\\', '/')}`,
                        tags: hintedSource.tags,
                        title: hintedSource.title,
                        wordCount: totalWords,
                    });
                    seenSourceIds.add(hintedSource.id);
                    continue;
                }

                skippedSources.push({
                    path: candidate.filePath,
                    reason: 'duplicate-content',
                });
                continue;
            }

            const sourceId = seenSourceIds.has(hintedSource.id)
                ? `${hintedSource.id}-${contentHash.slice(0, 8)}`
                : hintedSource.id;
            const relativePath = path.relative(candidate.rootPath, candidate.filePath).replaceAll('\\', '/');
            const source = {
                ...hintedSource,
                id: sourceId,
                path: `${candidate.rootLabel}/${relativePath}`,
            };

            seenHashes.set(contentHash, source);
            seenSourceIds.add(sourceId);

            sources.push({
                category: source.category,
                id: source.id,
                path: source.path,
                tags: source.tags,
                title: source.title,
                wordCount: totalWords,
            });

            rawCards.push(...paragraphToChunks(source, normalized));
        } catch (error) {
            skippedSources.push({
                path: candidate.filePath,
                reason: error instanceof Error ? error.message : String(error),
            });
        }
    }

    return {
        cards: [...CURATED_CARDS, ...rawCards],
        generatedAt: new Date().toISOString(),
        skippedSources,
        sourceLibraryPath: SOURCE_ROOTS.map((sourceRoot) => `${sourceRoot.label}: ${sourceRoot.path}`).join(' | '),
        sources,
    };
}

function main() {
    assertToolAvailable('textutil');
    assertToolAvailable('pdftotext');
    assertToolAvailable('python3');
    assertToolAvailable('strings');

    if (!SOURCE_ROOTS.length) {
        throw new Error('No GNA source roots were found. Set GNA_SOURCE_ROOTS to one or more archive paths and rerun.');
    }

    const bundle = buildBundle();

    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8');

    console.log(`Wrote ${bundle.cards.length} knowledge cards from ${bundle.sources.length} source documents.`);
    console.log(`Skipped ${bundle.skippedSources.length} files (duplicates, placeholders, or low-signal docs).`);
    console.log(outputPath);
}

main();
