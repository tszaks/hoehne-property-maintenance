export interface MaterialPriceEntry {
  label: string;
  unit: string;
  low: number;
  high: number;
  notes?: string;
}

export interface MaterialPricesDB {
  lastReviewed: string;
  region: string;
  disclaimer: string;
  sources: string[];
  items: Record<string, MaterialPriceEntry>;
}

export const materialPrices: MaterialPricesDB = {
  lastReviewed: '2026-05-20',
  region: 'Pottstown / Montgomery County PA planning ranges',
  disclaimer:
    'Cached planning ranges only, not live store quotes. Prices vary by store, quantity, and season. Use for rough project planning only.',
  sources: [
    'homedepot.com (retail reference)',
    'lowes.com (retail reference)',
    'sherwin-williams.com (retail reference)',
    'costflowai.com PA construction calculators (regional labor/cost multipliers)',
  ],
  items: {
    interior_paint_gallon: {
      label: 'Interior paint (1 gallon)',
      unit: 'gallon',
      low: 25,
      high: 110,
      notes: 'budget $25-$45, mid $45-$75, premium $75-$110',
    },
    primer_gallon: {
      label: 'Primer (1 gallon)',
      unit: 'gallon',
      low: 25,
      high: 55,
    },
    drywall_sheet_4x8: {
      label: 'Drywall sheet (4x8 ft)',
      unit: 'sheet',
      low: 15,
      high: 25,
    },
    joint_compound_bucket: {
      label: 'Joint compound (bucket)',
      unit: 'bucket',
      low: 18,
      high: 35,
    },
    drywall_tape_roll: {
      label: 'Drywall tape (roll)',
      unit: 'roll',
      low: 5,
      high: 15,
    },
    lumber_2x4_8ft: {
      label: '2x4 lumber (8 ft)',
      unit: 'board',
      low: 4,
      high: 9,
    },
    pressure_treated_deck_board: {
      label: 'Pressure treated deck board (5/4x6x12 ft)',
      unit: 'board',
      low: 12,
      high: 28,
    },
    composite_deck_board_12ft: {
      label: 'Composite deck board (12 ft)',
      unit: 'board',
      low: 30,
      high: 70,
    },
    mulch_cubic_yard_bulk: {
      label: 'Bulk mulch',
      unit: 'cubic yard',
      low: 35,
      high: 75,
    },
    mulch_bag_2cuft: {
      label: 'Bagged mulch (2 cu ft)',
      unit: 'bag',
      low: 4,
      high: 8,
    },
    vanity_basic: {
      label: 'Bathroom vanity (basic)',
      unit: 'unit',
      low: 250,
      high: 900,
    },
    vanity_midrange: {
      label: 'Bathroom vanity (mid-range)',
      unit: 'unit',
      low: 900,
      high: 2200,
    },
    toilet_basic: {
      label: 'Toilet (basic to mid)',
      unit: 'unit',
      low: 150,
      high: 400,
    },
    faucet_basic_to_mid: {
      label: 'Faucet (basic to mid-range)',
      unit: 'unit',
      low: 75,
      high: 300,
    },
  },
};

export function formatMaterialsSummary(): string {
  const { items, lastReviewed, region, disclaimer } = materialPrices;
  const lines = Object.values(items).map(
    (item) =>
      `${item.label}: $${item.low}-$${item.high} per ${item.unit}${item.notes ? ` (${item.notes})` : ''}`
  );
  return [
    `Cached material planning ranges for ${region} (last reviewed ${lastReviewed}):`,
    ...lines,
    `Disclaimer: ${disclaimer}`,
  ].join('\n');
}
