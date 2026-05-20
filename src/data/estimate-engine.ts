export type ServiceId =
  | 'small-handyman'
  | 'ceiling-fan'
  | 'drywall-paint'
  | 'room-painting'
  | 'pressure-wash'
  | 'lawn-cleanup'
  | 'snow-removal'
  | 'deck-repair'
  | 'bathroom'
  | 'kitchen'
  | 'basement';

export type LineCategory = 'labor' | 'materials' | 'equipment' | 'specialty' | 'allowance';

export interface EstimateOption {
  id: string;
  label: string;
  sub: string;
  multiplier: number;
  risk: number;
}

export interface CostLineDefinition {
  label: string;
  category: LineCategory;
  unit: 'flat' | 'quantity';
  low: number;
  high: number;
  quantityScale?: number;
  conditionWeight?: number;
  finishWeight?: number;
  accessWeight?: number;
}

export interface ProjectProfile {
  id: ServiceId;
  label: string;
  shortLabel: string;
  quantityLabel: string;
  quantityUnit: string;
  quantityHelp: string;
  defaultQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  step: number;
  minimum: { low: number; high: number };
  baseRisk: number;
  confidenceBase: number;
  scopeSignals: string[];
  assumptions: string[];
  escalationTriggers: string[];
  lines: CostLineDefinition[];
}

export interface EstimateInput {
  serviceId: ServiceId;
  quantity?: number;
  conditionId?: string;
  finishId?: string;
  accessId?: string;
  urgencyId?: string;
}

export interface EstimateLineItem {
  label: string;
  category: LineCategory | 'business' | 'risk';
  low: number;
  high: number;
}

export interface ProjectEstimate {
  profile: ProjectProfile;
  input: Required<EstimateInput>;
  low: number;
  high: number;
  confidence: number;
  confidenceLabel: string;
  lineItems: EstimateLineItem[];
  assumptions: string[];
  escalationTriggers: string[];
  scopeSignals: string[];
}

export const conditionOptions: EstimateOption[] = [
  { id: 'ready', label: 'Clean / ready', sub: 'Minimal prep', multiplier: 0.92, risk: 0.03 },
  { id: 'normal', label: 'Normal wear', sub: 'Typical lived-in condition', multiplier: 1, risk: 0.06 },
  { id: 'repair', label: 'Needs repair', sub: 'Patching, rot, prep, or uneven surfaces', multiplier: 1.18, risk: 0.11 },
  { id: 'unknown', label: 'Heavy / unknown', sub: 'Hidden damage or unclear scope', multiplier: 1.38, risk: 0.18 },
];

export const finishOptions: EstimateOption[] = [
  { id: 'basic', label: 'Basic', sub: 'Budget-friendly, standard materials', multiplier: 0.9, risk: 0.02 },
  { id: 'standard', label: 'Standard', sub: 'Most common homeowner choice', multiplier: 1, risk: 0.04 },
  { id: 'upgraded', label: 'Upgraded', sub: 'Better fixtures, finishes, or materials', multiplier: 1.22, risk: 0.07 },
  { id: 'premium', label: 'Premium / custom', sub: 'Custom details or premium materials', multiplier: 1.55, risk: 0.12 },
];

export const accessOptions: EstimateOption[] = [
  { id: 'easy', label: 'Easy access', sub: 'Open work area, simple staging', multiplier: 0.96, risk: 0.02 },
  { id: 'normal', label: 'Normal access', sub: 'Typical occupied home', multiplier: 1, risk: 0.04 },
  { id: 'tight', label: 'Tight access', sub: 'Stairs, small rooms, furniture, or limited staging', multiplier: 1.12, risk: 0.07 },
  { id: 'difficult', label: 'Difficult access', sub: 'High work, crawlspace, exterior constraints, or heavy protection', multiplier: 1.26, risk: 0.12 },
];

export const urgencyOptions: EstimateOption[] = [
  { id: 'flexible', label: 'Flexible', sub: 'Fit into normal schedule', multiplier: 1, risk: 0.02 },
  { id: 'month', label: 'Within a month', sub: 'Scheduling priority', multiplier: 1.06, risk: 0.04 },
  { id: 'two-weeks', label: 'About 2 weeks', sub: 'Near-term request', multiplier: 1.14, risk: 0.06 },
  { id: 'rush', label: 'Rush / ASAP', sub: 'Same-week or urgent work', multiplier: 1.25, risk: 0.09 },
];

export const projectProfiles: ProjectProfile[] = [
  {
    id: 'small-handyman',
    label: 'Small Handyman / General Repairs',
    shortLabel: 'Handyman',
    quantityLabel: 'Estimated labor hours',
    quantityUnit: 'hours',
    quantityHelp: 'Use the time a skilled handyman is likely to spend on site.',
    defaultQuantity: 2,
    minQuantity: 1,
    maxQuantity: 16,
    step: 0.5,
    minimum: { low: 175, high: 350 },
    baseRisk: 0.08,
    confidenceBase: 78,
    scopeSignals: ['task list', 'photo or clear description', 'materials needed', 'access', 'location'],
    assumptions: ['Minor repair work only', 'No permit-level electrical, plumbing, or structural work'],
    escalationTriggers: ['Multiple trades', 'water damage', 'hidden rot', 'older-home surprises'],
    lines: [
      { label: 'Service call and setup', category: 'labor', unit: 'flat', low: 85, high: 150, accessWeight: 0.4 },
      { label: 'Skilled repair labor', category: 'labor', unit: 'quantity', low: 85, high: 130, conditionWeight: 0.9, accessWeight: 0.5 },
      { label: 'Small material allowance', category: 'materials', unit: 'flat', low: 30, high: 180, finishWeight: 0.4 },
    ],
  },
  {
    id: 'ceiling-fan',
    label: 'Ceiling Fan / Light Fixture Install',
    shortLabel: 'Fixture',
    quantityLabel: 'Fixture count',
    quantityUnit: 'fixtures',
    quantityHelp: 'Count each fan, light, or similar fixture.',
    defaultQuantity: 1,
    minQuantity: 1,
    maxQuantity: 8,
    step: 1,
    minimum: { low: 225, high: 425 },
    baseRisk: 0.09,
    confidenceBase: 80,
    scopeSignals: ['fixture count', 'existing box condition', 'ceiling height', 'fixture supplied or not', 'location'],
    assumptions: ['Existing wiring is usable', 'No new circuit, panel, or permit-level electrical work'],
    escalationTriggers: ['no rated fan box', 'new wiring needed', 'high ceiling', 'old wiring'],
    lines: [
      { label: 'Trip, protection, and setup', category: 'labor', unit: 'flat', low: 95, high: 165, accessWeight: 0.4 },
      { label: 'Install and test fixtures', category: 'labor', unit: 'quantity', low: 130, high: 320, conditionWeight: 0.7, accessWeight: 0.8 },
      { label: 'Mounting hardware allowance', category: 'materials', unit: 'quantity', low: 20, high: 75, finishWeight: 0.2 },
    ],
  },
  {
    id: 'drywall-paint',
    label: 'Drywall Repair / Paint Touch-up',
    shortLabel: 'Drywall',
    quantityLabel: 'Damaged wall area',
    quantityUnit: 'sq ft',
    quantityHelp: 'Estimate the combined damaged or patched area, not the whole room.',
    defaultQuantity: 30,
    minQuantity: 4,
    maxQuantity: 400,
    step: 1,
    minimum: { low: 350, high: 650 },
    baseRisk: 0.12,
    confidenceBase: 75,
    scopeSignals: ['damaged area', 'hole or crack type', 'texture match', 'paint match', 'water damage status'],
    assumptions: ['No active leak', 'No mold remediation', 'Paint match may require blending'],
    escalationTriggers: ['water damage', 'mold', 'plaster walls', 'texture matching', 'ceiling work'],
    lines: [
      { label: 'Protection, setup, and cleanup', category: 'labor', unit: 'flat', low: 140, high: 260, accessWeight: 0.3 },
      { label: 'Drywall patch, tape, mud, sand', category: 'labor', unit: 'quantity', low: 9, high: 24, quantityScale: 1, conditionWeight: 1, accessWeight: 0.3 },
      { label: 'Drywall and compound materials', category: 'materials', unit: 'quantity', low: 2, high: 7, quantityScale: 1, finishWeight: 0.2 },
      { label: 'Prime, blend, and paint touch-up', category: 'labor', unit: 'flat', low: 160, high: 420, conditionWeight: 0.7, finishWeight: 0.4 },
    ],
  },
  {
    id: 'room-painting',
    label: 'Full Room Painting',
    shortLabel: 'Painting',
    quantityLabel: 'Paintable wall area',
    quantityUnit: 'sq ft',
    quantityHelp: 'A 12x14 room with 8 ft walls is roughly 416 sq ft before openings.',
    defaultQuantity: 420,
    minQuantity: 120,
    maxQuantity: 2500,
    step: 10,
    minimum: { low: 600, high: 950 },
    baseRisk: 0.08,
    confidenceBase: 86,
    scopeSignals: ['wall area', 'coats', 'ceiling or trim', 'wall condition', 'paint quality', 'location'],
    assumptions: ['Walls only unless scope says ceiling or trim', 'Two coats of standard interior paint', 'Normal furniture protection'],
    escalationTriggers: ['major patching', 'dark color change', 'trim or ceiling added', 'high ceilings', 'wallpaper removal'],
    lines: [
      { label: 'Protection, masking, and setup', category: 'labor', unit: 'flat', low: 160, high: 300, accessWeight: 0.4 },
      { label: 'Cut, roll, and second-coat labor', category: 'labor', unit: 'quantity', low: 1.15, high: 2.65, conditionWeight: 0.8, accessWeight: 0.4 },
      { label: 'Paint and consumables', category: 'materials', unit: 'quantity', low: 0.35, high: 0.95, finishWeight: 1 },
      { label: 'Minor patching allowance', category: 'allowance', unit: 'flat', low: 75, high: 275, conditionWeight: 1 },
    ],
  },
  {
    id: 'pressure-wash',
    label: 'Pressure Washing',
    shortLabel: 'Wash',
    quantityLabel: 'Surface area',
    quantityUnit: 'sq ft',
    quantityHelp: 'Driveway, deck, patio, siding, or walkway area.',
    defaultQuantity: 900,
    minQuantity: 150,
    maxQuantity: 6000,
    step: 25,
    minimum: { low: 350, high: 550 },
    baseRisk: 0.08,
    confidenceBase: 84,
    scopeSignals: ['surface type', 'area', 'staining level', 'water access', 'access', 'location'],
    assumptions: ['Residential pressure washing', 'Water source is available on site'],
    escalationTriggers: ['heavy organic staining', 'delicate siding', 'multi-story work', 'no water access'],
    lines: [
      { label: 'Mobilization and equipment setup', category: 'equipment', unit: 'flat', low: 135, high: 225, accessWeight: 0.5 },
      { label: 'Wash labor by surface area', category: 'labor', unit: 'quantity', low: 0.18, high: 0.55, conditionWeight: 0.8, accessWeight: 0.6 },
      { label: 'Cleaner and consumables', category: 'materials', unit: 'flat', low: 35, high: 140, conditionWeight: 0.5 },
    ],
  },
  {
    id: 'lawn-cleanup',
    label: 'Lawn Cleanup / Mulching',
    shortLabel: 'Lawn',
    quantityLabel: 'Mulch or cleanup load',
    quantityUnit: 'cubic yards',
    quantityHelp: 'Use cubic yards of mulch or equivalent cleanup load.',
    defaultQuantity: 4,
    minQuantity: 1,
    maxQuantity: 25,
    step: 0.5,
    minimum: { low: 450, high: 750 },
    baseRisk: 0.1,
    confidenceBase: 78,
    scopeSignals: ['mulch volume', 'bed condition', 'edging needed', 'haul-away', 'access', 'location'],
    assumptions: ['Standard residential beds', 'No tree removal or heavy grading'],
    escalationTriggers: ['steep yard', 'haul-away', 'overgrown beds', 'stone removal', 'drainage work'],
    lines: [
      { label: 'Mobilization and bed prep', category: 'labor', unit: 'flat', low: 180, high: 360, conditionWeight: 0.8, accessWeight: 0.5 },
      { label: 'Mulch material and delivery allowance', category: 'materials', unit: 'quantity', low: 55, high: 115, finishWeight: 0.7 },
      { label: 'Install, edge, and cleanup labor', category: 'labor', unit: 'quantity', low: 85, high: 170, conditionWeight: 0.7, accessWeight: 0.5 },
    ],
  },
  {
    id: 'snow-removal',
    label: 'Snow Removal (per visit)',
    shortLabel: 'Snow',
    quantityLabel: 'Driveway size factor',
    quantityUnit: 'standard driveways',
    quantityHelp: '1 is a standard driveway. Larger or corner lots may be 2 or more.',
    defaultQuantity: 1,
    minQuantity: 1,
    maxQuantity: 5,
    step: 0.5,
    minimum: { low: 90, high: 175 },
    baseRisk: 0.1,
    confidenceBase: 80,
    scopeSignals: ['driveway size', 'sidewalks', 'salt needed', 'snow depth', 'seasonal or per-visit'],
    assumptions: ['Per-visit residential snow removal', 'Normal storm depth'],
    escalationTriggers: ['ice treatment', 'deep snow', 'commercial lot', 'tight parking', 'long walkways'],
    lines: [
      { label: 'Trip and dispatch', category: 'labor', unit: 'flat', low: 55, high: 95, accessWeight: 0.3 },
      { label: 'Driveway clearing', category: 'labor', unit: 'quantity', low: 55, high: 145, conditionWeight: 0.6, accessWeight: 0.5 },
      { label: 'Salt and walkway allowance', category: 'materials', unit: 'flat', low: 15, high: 80, conditionWeight: 0.5 },
    ],
  },
  {
    id: 'deck-repair',
    label: 'Deck Repair / Work',
    shortLabel: 'Deck',
    quantityLabel: 'Affected deck area',
    quantityUnit: 'sq ft',
    quantityHelp: 'Use the area being repaired, resurfaced, or made safe.',
    defaultQuantity: 160,
    minQuantity: 20,
    maxQuantity: 800,
    step: 10,
    minimum: { low: 700, high: 1400 },
    baseRisk: 0.16,
    confidenceBase: 70,
    scopeSignals: ['deck size', 'board vs railing vs framing', 'material', 'height', 'stairs', 'rot level'],
    assumptions: ['Repair scope, not full new deck build', 'No hidden ledger, footing, or structural failure included'],
    escalationTriggers: ['ledger rot', 'sagging frame', 'stairs rebuild', 'high deck', 'composite conversion', 'permit-level rebuild'],
    lines: [
      { label: 'Inspection, setup, and demolition', category: 'labor', unit: 'flat', low: 250, high: 600, conditionWeight: 0.8, accessWeight: 0.8 },
      { label: 'Board, fastener, and rail material allowance', category: 'materials', unit: 'quantity', low: 4.5, high: 16, finishWeight: 1 },
      { label: 'Deck repair carpentry labor', category: 'labor', unit: 'quantity', low: 5.5, high: 18, conditionWeight: 1, accessWeight: 0.8 },
      { label: 'Stair, rail, or framing allowance', category: 'allowance', unit: 'flat', low: 250, high: 1400, conditionWeight: 1, finishWeight: 0.4 },
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom Update / Remodel',
    shortLabel: 'Bathroom',
    quantityLabel: 'Bathroom floor area',
    quantityUnit: 'sq ft',
    quantityHelp: 'A 5x8 bath is 40 sq ft. A larger full bath may be 55-80 sq ft.',
    defaultQuantity: 55,
    minQuantity: 20,
    maxQuantity: 180,
    step: 5,
    minimum: { low: 6500, high: 12000 },
    baseRisk: 0.18,
    confidenceBase: 68,
    scopeSignals: ['bath size', 'refresh vs gut', 'fixture grade', 'tile area', 'plumbing moves', 'condition', 'location'],
    assumptions: ['Existing layout stays mostly intact', 'No structural repair or major plumbing relocation included'],
    escalationTriggers: ['plumbing relocation', 'tile shower', 'rot or water damage', 'old house surprises', 'permits', 'custom glass'],
    lines: [
      { label: 'Demo, protection, and disposal', category: 'labor', unit: 'quantity', low: 14, high: 35, conditionWeight: 0.9, accessWeight: 0.7 },
      { label: 'Carpentry, wall prep, and substrate', category: 'labor', unit: 'quantity', low: 32, high: 90, conditionWeight: 1, accessWeight: 0.5 },
      { label: 'Fixture and finish allowance', category: 'materials', unit: 'quantity', low: 75, high: 240, finishWeight: 1.2 },
      { label: 'Tile, flooring, paint, and finish labor', category: 'labor', unit: 'quantity', low: 85, high: 240, conditionWeight: 0.8, finishWeight: 0.8, accessWeight: 0.4 },
      { label: 'Plumbing and electrical coordination allowance', category: 'specialty', unit: 'flat', low: 1200, high: 5200, conditionWeight: 0.7, finishWeight: 0.5 },
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchen Refresh / Remodel',
    shortLabel: 'Kitchen',
    quantityLabel: 'Kitchen floor area',
    quantityUnit: 'sq ft',
    quantityHelp: 'Use the kitchen footprint, not the whole first floor.',
    defaultQuantity: 150,
    minQuantity: 60,
    maxQuantity: 450,
    step: 10,
    minimum: { low: 12000, high: 24000 },
    baseRisk: 0.2,
    confidenceBase: 62,
    scopeSignals: ['kitchen size', 'refresh vs full remodel', 'cabinet plan', 'countertops', 'appliances', 'layout changes'],
    assumptions: ['Existing layout mostly stays', 'Appliance upgrades and cabinet choices drive the range'],
    escalationTriggers: ['wall removal', 'layout change', 'custom cabinets', 'stone counters', 'old wiring', 'floor leveling'],
    lines: [
      { label: 'Demo, protection, and disposal', category: 'labor', unit: 'quantity', low: 12, high: 32, conditionWeight: 0.8, accessWeight: 0.7 },
      { label: 'Cabinet, counter, and fixture allowance', category: 'materials', unit: 'quantity', low: 75, high: 310, finishWeight: 1.3 },
      { label: 'Carpentry and installation labor', category: 'labor', unit: 'quantity', low: 58, high: 170, conditionWeight: 0.8, finishWeight: 0.7, accessWeight: 0.5 },
      { label: 'Flooring, backsplash, drywall, and paint', category: 'labor', unit: 'quantity', low: 32, high: 115, conditionWeight: 0.8, finishWeight: 0.8 },
      { label: 'Trade coordination allowance', category: 'specialty', unit: 'flat', low: 1800, high: 8500, conditionWeight: 0.8, finishWeight: 0.6 },
    ],
  },
  {
    id: 'basement',
    label: 'Basement Finishing',
    shortLabel: 'Basement',
    quantityLabel: 'Finished basement area',
    quantityUnit: 'sq ft',
    quantityHelp: 'Use the finished living area. Exclude utility/storage rooms that stay unfinished.',
    defaultQuantity: 600,
    minQuantity: 200,
    maxQuantity: 1800,
    step: 25,
    minimum: { low: 18000, high: 32000 },
    baseRisk: 0.18,
    confidenceBase: 64,
    scopeSignals: ['finished area', 'moisture condition', 'bathroom or wet bar', 'ceiling type', 'electrical needs', 'egress'],
    assumptions: ['Standard finish without new bathroom or kitchenette', 'Moisture issues must be solved first'],
    escalationTriggers: ['bathroom addition', 'egress work', 'waterproofing', 'low ceilings', 'HVAC changes', 'permits'],
    lines: [
      { label: 'Framing, insulation, and rough prep', category: 'labor', unit: 'quantity', low: 16, high: 38, conditionWeight: 1, accessWeight: 0.5 },
      { label: 'Drywall, ceiling, paint, and trim labor', category: 'labor', unit: 'quantity', low: 24, high: 58, conditionWeight: 0.8, finishWeight: 0.6 },
      { label: 'Flooring and finish materials', category: 'materials', unit: 'quantity', low: 18, high: 62, finishWeight: 1.2 },
      { label: 'Electrical, lighting, and mechanical allowance', category: 'specialty', unit: 'quantity', low: 14, high: 48, conditionWeight: 0.7, finishWeight: 0.5 },
      { label: 'Permit, inspection, and planning allowance', category: 'allowance', unit: 'flat', low: 900, high: 4200, conditionWeight: 0.6 },
    ],
  },
];

export function getProjectProfile(serviceId: ServiceId): ProjectProfile {
  const profile = projectProfiles.find((item) => item.id === serviceId);
  if (!profile) {
    throw new Error(`Unknown service id: ${serviceId}`);
  }
  return profile;
}

export function fmtCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

export function fmtRange(low: number, high: number): string {
  return `${fmtCurrency(low)}-${fmtCurrency(high)}`;
}

export function estimateProject(input: EstimateInput): ProjectEstimate {
  const profile = getProjectProfile(input.serviceId);
  const condition = findOption(conditionOptions, input.conditionId, 'normal');
  const finish = findOption(finishOptions, input.finishId, 'standard');
  const access = findOption(accessOptions, input.accessId, 'normal');
  const urgency = findOption(urgencyOptions, input.urgencyId, 'flexible');
  const quantity = clamp(input.quantity ?? profile.defaultQuantity, profile.minQuantity, profile.maxQuantity);

  const directItems = profile.lines.map((line) => {
    const quantityFactor = line.unit === 'quantity' ? quantity * (line.quantityScale ?? 1) : 1;
    const conditionMult = weightedMultiplier(condition.multiplier, line.conditionWeight ?? 0);
    const finishMult = weightedMultiplier(finish.multiplier, line.finishWeight ?? 0);
    const accessMult = weightedMultiplier(access.multiplier, line.accessWeight ?? 0);
    const multiplier = conditionMult * finishMult * accessMult;
    return {
      label: line.label,
      category: line.category,
      low: line.low * quantityFactor * multiplier,
      high: line.high * quantityFactor * multiplier,
    };
  });

  const directLow = sum(directItems.map((line) => line.low));
  const directHigh = sum(directItems.map((line) => line.high));
  const overheadLow = directLow * 0.16;
  const overheadHigh = directHigh * 0.24;
  const riskRateLow = Math.min(0.22, profile.baseRisk + condition.risk * 0.45 + access.risk * 0.35);
  const riskRateHigh = Math.min(0.32, profile.baseRisk + condition.risk + access.risk + finish.risk * 0.45);
  const contingencyLow = directLow * riskRateLow;
  const contingencyHigh = directHigh * riskRateHigh;

  const lineItems: EstimateLineItem[] = [
    ...directItems,
    { label: 'Overhead, profit, scheduling, and warranty', category: 'business', low: overheadLow, high: overheadHigh },
    { label: 'Unknowns and contingency', category: 'risk', low: contingencyLow, high: contingencyHigh },
  ];

  const subtotalLow = directLow + overheadLow + contingencyLow;
  const subtotalHigh = directHigh + overheadHigh + contingencyHigh;
  const urgencyLow = subtotalLow * urgency.multiplier;
  const urgencyHigh = subtotalHigh * urgency.multiplier;
  const low = roundToUseful(Math.max(profile.minimum.low, urgencyLow));
  const high = roundToUseful(Math.max(profile.minimum.high, urgencyHigh));
  const confidence = confidenceFor(profile, quantity, condition.id, finish.id, access.id, urgency.id);

  return {
    profile,
    input: {
      serviceId: profile.id,
      quantity,
      conditionId: condition.id,
      finishId: finish.id,
      accessId: access.id,
      urgencyId: urgency.id,
    },
    low,
    high,
    confidence,
    confidenceLabel: confidence >= 82 ? 'High' : confidence >= 68 ? 'Medium' : 'Low',
    lineItems: lineItems.map((line) => ({
      ...line,
      low: roundToUseful(line.low),
      high: roundToUseful(line.high),
    })),
    assumptions: [
      ...profile.assumptions,
      `${condition.label} condition`,
      `${finish.label} finish level`,
      `${access.label}`,
      `${urgency.label} timeline`,
    ],
    escalationTriggers: profile.escalationTriggers,
    scopeSignals: profile.scopeSignals,
  };
}

export function formatEstimatorKnowledge(): string {
  const profileBlocks = projectProfiles.map((profile) => {
    const sample = estimateProject({ serviceId: profile.id });
    return [
      `${profile.label}: default ${profile.defaultQuantity} ${profile.quantityUnit} planning range ${fmtRange(sample.low, sample.high)} at normal condition, standard finish, normal access, flexible timeline.`,
      `Primary quantity: ${profile.quantityLabel}. Scope signals: ${profile.scopeSignals.join(', ')}.`,
      `Escalates for: ${profile.escalationTriggers.join(', ')}.`,
    ].join('\n');
  });

  return [
    'STRUCTURED ESTIMATOR ENGINE:',
    'Use these planning ranges and scope signals instead of freehand guesses. They include labor, materials, overhead, profit, scheduling, warranty, and contingency. They are rough planning ranges, not quotes.',
    ...profileBlocks,
  ].join('\n\n');
}

function findOption(options: EstimateOption[], id: string | undefined, fallbackId: string): EstimateOption {
  return options.find((option) => option.id === id) ?? options.find((option) => option.id === fallbackId) ?? options[0];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function weightedMultiplier(multiplier: number, weight: number): number {
  return 1 + (multiplier - 1) * weight;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function roundToUseful(value: number): number {
  if (value >= 20000) return Math.round(value / 500) * 500;
  if (value >= 5000) return Math.round(value / 250) * 250;
  if (value >= 1000) return Math.round(value / 100) * 100;
  return Math.round(value / 25) * 25;
}

function confidenceFor(
  profile: ProjectProfile,
  quantity: number,
  conditionId: string,
  finishId: string,
  accessId: string,
  urgencyId: string,
): number {
  let score = profile.confidenceBase;
  const quantityRatio = quantity / profile.defaultQuantity;
  if (quantityRatio < 0.5 || quantityRatio > 2) score -= 6;
  if (conditionId === 'repair') score -= 5;
  if (conditionId === 'unknown') score -= 12;
  if (finishId === 'premium') score -= 5;
  if (accessId === 'tight') score -= 4;
  if (accessId === 'difficult') score -= 9;
  if (urgencyId === 'rush') score -= 5;
  return Math.min(92, Math.max(42, Math.round(score)));
}
