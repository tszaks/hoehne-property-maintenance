export interface MaterialPriceEntry {
  label: string;
  unit: string;
  low: number;
  high: number;
  notes?: string;
  sourceNote?: string;
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
  region: 'Pottstown / Spring City / Owen J. Roberts corridor planning ranges',
  disclaimer:
    'Cached planning ranges only, not live store quotes. Prices vary by store, quantity, and season. Use for rough project planning only.',
  sources: [
    'Home Depot Lower Pottsgrove / Pottstown PA store reference',
    'Lowe\'s Pottstown PA store reference',
    'Pottstown / Spring City / OJR Exa local service-area pass',
    'homedepot.com (Exa-verified retail snippets)',
    'lowes.com (Exa-verified retail snippets)',
    'sherwin-williams.com (retail reference)',
    'Mr. Mulch West Chester PA (Exa-verified 2026 bulk material pricing)',
    'Lawn Depot bulk mulch (Exa-verified bulk pricing)',
    'Homewyse 2026 (national install cost references)',
    'CostFigure 2026 (PA bathroom remodel norms)',
    'KitchenSearch 2026 (PA kitchen remodel norms)',
    'LawnBySeason 2026 (PA landscaping labor and seasonal service norms)',
    'Thumbtack and GreenPal (snow removal and spring cleanup norms)',
    'Recommended.app and Terraskydays 2026 (Philadelphia handyman job norms)',
  ],
  items: {
    interior_paint_gallon: {
      label: 'Interior paint (1 gallon)',
      unit: 'gallon',
      low: 20,
      high: 110,
      notes: 'budget $20-$30, mid $30-$55, premium $55-$110',
      sourceNote: 'Home Depot 1-gal interior lines commonly ~$19-$53; premium/specialty lines run higher',
    },
    primer_gallon: {
      label: 'Primer (1 gallon)',
      unit: 'gallon',
      low: 15,
      high: 60,
      sourceNote: 'Home Depot KILZ PVA Drywall Primer ~$14.98; bonding and specialty primers higher',
    },
    drywall_sheet_4x8: {
      label: 'Drywall sheet (4x8 ft)',
      unit: 'sheet',
      low: 15,
      high: 25,
      sourceNote: 'Home Depot / Lowe\'s product pages verify standard 1/2-in drywall sheet category',
    },
    joint_compound_bucket: {
      label: 'Joint compound (bucket)',
      unit: 'bucket',
      low: 18,
      high: 35,
      sourceNote: 'Home Depot 4.5-gal ready-mix joint compound product pages',
    },
    drywall_tape_roll: {
      label: 'Drywall tape (roll)',
      unit: 'roll',
      low: 5,
      high: 15,
      sourceNote: 'Home Depot 150 / 250 / 500 ft paper and mesh drywall tape rolls',
    },
    lumber_2x4_8ft: {
      label: '2x4 lumber (8 ft)',
      unit: 'board',
      low: 4,
      high: 7,
      sourceNote: 'Home Depot recent pricing $3.65-$3.98; GlassIt price history avg ~$3.88. Range includes local variance and waste',
    },
    pressure_treated_deck_board: {
      label: 'Pressure treated deck board (5/4x6x12 ft)',
      unit: 'board',
      low: 10,
      high: 22,
      sourceNote: 'Home Depot 12 ft standard ~$9.68, premium ~$14.28-$14.48; 16 ft up to ~$19.38',
    },
    composite_deck_board_12ft: {
      label: 'Composite deck board (12 ft)',
      unit: 'board',
      low: 25,
      high: 80,
      sourceNote: 'Home Depot Trex category starts ~$21.37 per board; mid and premium colors run higher',
    },
    mulch_cubic_yard_bulk: {
      label: 'Bulk mulch',
      unit: 'cubic yard',
      low: 30,
      high: 75,
      sourceNote: 'Mr. Mulch West Chester PA bulk mulch / topsoil ~$29-$48; Lawn Depot ~$32. Delivery and premium dyes push higher',
    },
    mulch_bag_2cuft: {
      label: 'Bagged mulch (2 cu ft)',
      unit: 'bag',
      low: 3,
      high: 8,
      sourceNote: 'Spring sale bags ~$2-$4 at Home Depot / Lowe\'s; regular and premium ~$4-$8',
    },
    vanity_basic: {
      label: 'Bathroom vanity (basic)',
      unit: 'unit',
      low: 250,
      high: 900,
      sourceNote: 'Home Depot 36-in examples $249-$779+ across budget and basic categories',
    },
    vanity_midrange: {
      label: 'Bathroom vanity (mid-range)',
      unit: 'unit',
      low: 900,
      high: 2200,
      sourceNote: 'Home Depot / Lowe\'s mid-range 36-48 in vanities, often with stone tops',
    },
    toilet_basic: {
      label: 'Toilet (basic to mid)',
      unit: 'unit',
      low: 150,
      high: 450,
      sourceNote: 'Home Depot basic two-piece and comfort-height toilets in this band',
    },
    faucet_basic_to_mid: {
      label: 'Faucet (basic to mid-range)',
      unit: 'unit',
      low: 75,
      high: 350,
      sourceNote: 'Home Depot bath and kitchen faucet category for basic to mid trims',
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
