import { QuoteLineItem, RoomType, TileFormat } from './supabase/types';

export interface SystemMaterialItem {
  id: string;
  name: string;
  category: 'waterproofing' | 'tile_adhesive' | 'grout' | 'prep_materials';
  coverageFormula: (totalSqm: number, floorSqm: number, wallSqm: number) => number;
  unit: 'm²' | 'kg' | 'tk' | 'h' | 'komplekt';
  packageSize: number; // e.g. 15kg or 25kg bucket/bag
  unitPricePerPackage: number;
  description: string;
}

export interface MaterialSystemDefinition {
  brand: 'Mira' | 'Mapei' | 'Kiilto';
  tagline: string;
  warrantyYears: number;
  primer: string;
  waterproofing: string;
  sealingTape: string;
  pipeCollars: string;
  adhesiveStandard: string;
  adhesiveLargeFormat: string;
  grout: string;
  silicone: string;
  relativeCostFactor: number; // baseline 1.0, 1.05, 0.98
}

export const MATERIAL_SYSTEMS: Record<'Mira' | 'Mapei' | 'Kiilto', MaterialSystemDefinition> = {
  Mira: {
    brand: 'Mira',
    tagline: 'Taani tippkvaliteet ja kindel süsteemigarantii',
    warrantyYears: 10,
    primer: 'Mira 4180 primer (nakkesild ja poorsuse reguleerija)',
    waterproofing: 'Mira 4400 multicoat elastne hüdroisolatsioonimastiks',
    sealingTape: 'Mira sealband tugevduskangas ja nurgalindid',
    pipeCollars: 'Mira manšetid toruläbiviikudele',
    adhesiveStandard: 'Mira 3110 unifix elastne plaatimissegu (C2TE S1)',
    adhesiveLargeFormat: 'Mira 3130 superfix / Z-force ekstratugev liim',
    grout: 'Mira supercolour hallitusevastane vuugisegu',
    silicone: 'Mira unisil sanitaarsilikoon',
    relativeCostFactor: 1.0,
  },
  Mapei: {
    brand: 'Mapei',
    tagline: 'Itaalia inseneritase, eriti hinnatud suuremõõtmeliste plaatide puhul',
    warrantyYears: 10,
    primer: 'Mapei Primer G sünteetiliste vaikude baasil krunt',
    waterproofing: 'Mapei Mapelastic AquaDefense ülikiire hüdroisolatsioon',
    sealingTape: 'Mapeband PE 120 elastne tihenduslint',
    pipeCollars: 'Mapeband Manset tihendusmansetid',
    adhesiveStandard: 'Mapei Keraflex Maxi S1 madala tolmueraldusega segu',
    adhesiveLargeFormat: 'Mapei Ultralite S2 ülipainduv kergsegu',
    grout: 'Mapei Ultracolor Plus vetthülgav BioBlock® vuugisegu',
    silicone: 'Mapei Mapesil AC äädikhappe baasil silikoonhermeetik',
    relativeCostFactor: 1.08,
  },
  Kiilto: {
    brand: 'Kiilto',
    tagline: 'Soome ilmastikukindlus ja ETAG 022 sertifitseeritud märgala süsteem',
    warrantyYears: 10,
    primer: 'Kiilto Keraprimer / Start Primer märgadele ruumidele',
    waterproofing: 'Kiilto Kerafiber kiudtugevdatud hüdroisolatsioonimastiks',
    sealingTape: 'Kiilto Nurkavahvikenauha ja KeraSafe tugevduslint',
    pipeCollars: 'Kiilto läbiviigumansetid',
    adhesiveStandard: 'Kiilto HighFlex S2 elastne plaatimissegu',
    adhesiveLargeFormat: 'Kiilto Superfix / Pro Fixer keraamikale',
    grout: 'Kiilto Saumalaasti M1 emissiooniklassiga vuugisegu',
    silicone: 'Kiilto Sanitaarsilikoon hallituskindel',
    relativeCostFactor: 0.96,
  },
};

export interface EstimateCalculationInput {
  floorSqm: number;
  wallSqm: number;
  roomType: RoomType;
  tileFormat: TileFormat;
  preferredManufacturer: 'Mira' | 'Mapei' | 'Kiilto' | 'flexible';
  substrateCondition: string;
  needsWaterproofing: boolean;
  needsFloorHeatingPrep: boolean;
  needsEpoxyGrout: boolean;
  customHourlyRate?: number;
  customLaborSqmRate?: number;
}

export interface DetailedEstimateResult {
  totalSqm: number;
  materialsCost: number;
  laborCost: number;
  prepCost: number;
  totalCost: number;
  estimatedDays: number;
  materialBreakdowns: {
    system: 'Mira' | 'Mapei' | 'Kiilto';
    totalMaterials: number;
    deltaVsSelected: number;
    items: QuoteLineItem[];
  }[];
  activeSystem: 'Mira' | 'Mapei' | 'Kiilto';
  lineItems: QuoteLineItem[];
}

export function calculateDetailedEstimate(input: EstimateCalculationInput): DetailedEstimateResult {
  const floorSqm = Number(input.floorSqm) || 0;
  const wallSqm = Number(input.wallSqm) || 0;
  const totalSqm = floorSqm + wallSqm;

  // Selected system or default to Mira
  const chosenBrand: 'Mira' | 'Mapei' | 'Kiilto' =
    input.preferredManufacturer === 'flexible' ? 'Mira' : input.preferredManufacturer;

  // 1. Labor Calculations
  // Format multiplier
  let formatMultiplier = 1.0;
  if (input.tileFormat === 'large_60x60') formatMultiplier = 1.15;
  if (input.tileFormat === 'slab_120x240') formatMultiplier = 1.6;
  if (input.tileFormat === 'mosaic') formatMultiplier = 1.45;
  if (input.tileFormat === 'herringbone') formatMultiplier = 1.35;

  const baseLaborRate = (input.customLaborSqmRate || 38) * formatMultiplier;
  const tilingLaborCost = Math.round(totalSqm * baseLaborRate);

  // Hydroisolation labor
  const hydroLaborRate = 14;
  const hydroLaborCost = input.needsWaterproofing ? Math.round(totalSqm * hydroLaborRate) : 0;

  // Substrate prep labor & materials
  let prepCost = 0;
  if (input.substrateCondition === 'old_tiles_strip_needed') {
    prepCost += Math.round(totalSqm * 22); // Tile stripping + debris removal
  } else if (input.substrateCondition === 'uneven_old_surface') {
    prepCost += Math.round(totalSqm * 15); // Leveling screed
  }

  if (input.needsFloorHeatingPrep) {
    prepCost += Math.round(floorSqm * 18); // Heating cable embedding & screed
  }

  // Calculate detailed items for each of the 3 brands
  const systems: ('Mira' | 'Mapei' | 'Kiilto')[] = ['Mira', 'Mapei', 'Kiilto'];

  const allSystemBreakdowns = systems.map((sys) => {
    const sysDef = MATERIAL_SYSTEMS[sys];
    const items: QuoteLineItem[] = [];

    // Primer
    const primerLiters = Math.ceil((totalSqm * 0.15) / 5) * 5; // 5L containers
    const primerPrice = Math.round(primerLiters * 4.8 * sysDef.relativeCostFactor);
    items.push({
      id: `${sys}-primer`,
      category: 'prep_materials',
      name: sysDef.primer,
      quantity: primerLiters,
      unit: 'kg',
      unit_price: Math.round((primerPrice / primerLiters) * 10) / 10,
      total_price: primerPrice,
      brand: sys,
    });

    // Waterproofing
    if (input.needsWaterproofing) {
      const hydroKg = Math.ceil((totalSqm * 1.5) / 15) * 15; // 15kg bucket approx 1.2-1.5kg/m² 2 coats
      const hydroPrice = Math.round(hydroKg * 6.2 * sysDef.relativeCostFactor);
      items.push({
        id: `${sys}-hydro`,
        category: 'waterproofing',
        name: sysDef.waterproofing,
        quantity: hydroKg,
        unit: 'kg',
        unit_price: Math.round((hydroPrice / hydroKg) * 10) / 10,
        total_price: hydroPrice,
        brand: sys,
      });

      // Sealing tape & collars
      const tapeMeters = Math.max(10, Math.ceil(Math.sqrt(floorSqm) * 4 * 1.2 + 5));
      const tapePrice = Math.round(tapeMeters * 2.2 * sysDef.relativeCostFactor);
      items.push({
        id: `${sys}-tape`,
        category: 'waterproofing',
        name: sysDef.sealingTape,
        quantity: tapeMeters,
        unit: 'tk',
        unit_price: 2.2,
        total_price: tapePrice,
        brand: sys,
      });

      items.push({
        id: `${sys}-collars`,
        category: 'waterproofing',
        name: sysDef.pipeCollars,
        quantity: 4,
        unit: 'tk',
        unit_price: 6.5,
        total_price: 26,
        brand: sys,
      });
    }

    // Tile adhesive (C2TE S1) - ~4.5 kg/m²
    const adhesiveBagKg = 25;
    const adhesiveKgNeeded = totalSqm * 4.5;
    const adhesiveBags = Math.ceil(adhesiveKgNeeded / adhesiveBagKg);
    const adhesiveName =
      input.tileFormat === 'large_60x60' || input.tileFormat === 'slab_120x240'
        ? sysDef.adhesiveLargeFormat
        : sysDef.adhesiveStandard;
    const bagPrice = Math.round(21.5 * sysDef.relativeCostFactor);
    const adhesiveTotal = adhesiveBags * bagPrice;
    items.push({
      id: `${sys}-adhesive`,
      category: 'tile_adhesive',
      name: adhesiveName,
      quantity: adhesiveBags * adhesiveBagKg,
      unit: 'kg',
      unit_price: Math.round((adhesiveTotal / (adhesiveBags * adhesiveBagKg)) * 100) / 100,
      total_price: adhesiveTotal,
      brand: sys,
    });

    // Joint Grout
    const groutKg = Math.ceil(totalSqm * (input.tileFormat === 'mosaic' ? 1.2 : 0.45));
    const groutPricePerKg = input.needsEpoxyGrout ? 18.5 : 3.8 * sysDef.relativeCostFactor;
    const groutTotal = Math.round(groutKg * groutPricePerKg);
    items.push({
      id: `${sys}-grout`,
      category: 'grout',
      name: input.needsEpoxyGrout ? `${sys} Epoxy kahekomponentne vuuk` : sysDef.grout,
      quantity: groutKg,
      unit: 'kg',
      unit_price: Math.round(groutPricePerKg * 10) / 10,
      total_price: groutTotal,
      brand: sys,
    });

    // Sanitary silicone
    const siliconeTubes = Math.max(2, Math.ceil(totalSqm / 10));
    const siliconePrice = Math.round(siliconeTubes * 9.5 * sysDef.relativeCostFactor);
    items.push({
      id: `${sys}-silicone`,
      category: 'grout',
      name: sysDef.silicone,
      quantity: siliconeTubes,
      unit: 'tk',
      unit_price: Math.round(9.5 * sysDef.relativeCostFactor * 10) / 10,
      total_price: siliconePrice,
      brand: sys,
    });

    // Tile leveling clips / wedges (tarvikud)
    const clipPacks = Math.max(1, Math.ceil(totalSqm / 12));
    const clipsTotal = clipPacks * 28;
    items.push({
      id: `${sys}-clips`,
      category: 'prep_materials',
      name: 'Kiil-süsteem tasandusklambrid ja kiilud (3D Leveling)',
      quantity: clipPacks,
      unit: 'komplekt',
      unit_price: 28,
      total_price: clipsTotal,
      brand: 'Universal',
    });

    const totalMaterials = items.reduce((acc, curr) => acc + curr.total_price, 0);

    return {
      system: sys,
      totalMaterials,
      deltaVsSelected: 0, // will compute below
      items,
    };
  });

  const selectedBreakdown =
    allSystemBreakdowns.find((b) => b.system === chosenBrand) || allSystemBreakdowns[0];

  allSystemBreakdowns.forEach((b) => {
    b.deltaVsSelected = b.totalMaterials - selectedBreakdown.totalMaterials;
  });

  const totalLabor = tilingLaborCost + hydroLaborCost;
  const finalMaterials = selectedBreakdown.totalMaterials;
  const grandTotal = totalLabor + finalMaterials + prepCost;

  // Estimated days calculation (approx 5-7 m² completed per working day + 1 day drying for waterproofing)
  const estimatedDays = Math.max(3, Math.ceil(totalSqm / 6.5) + (input.needsWaterproofing ? 1 : 0));

  // Build the unified labor line items
  const activeLineItems: QuoteLineItem[] = [
    ...selectedBreakdown.items,
    {
      id: 'labor-tiling',
      category: 'labor',
      name: `Keraamiliste plaatide (${input.tileFormat}) paigaldus ja vuukimine`,
      quantity: totalSqm,
      unit: 'm²',
      unit_price: Math.round(baseLaborRate * 10) / 10,
      total_price: tilingLaborCost,
      is_labor: true,
    },
  ];

  if (input.needsWaterproofing) {
    activeLineItems.push({
      id: 'labor-hydro',
      category: 'labor',
      name: 'Hüdroisolatsiooni paigaldus kahes kihis + nurgalindid ja mansetid',
      quantity: totalSqm,
      unit: 'm²',
      unit_price: hydroLaborRate,
      total_price: hydroLaborCost,
      is_labor: true,
    });
  }

  if (prepCost > 0) {
    activeLineItems.push({
      id: 'labor-prep',
      category: 'labor',
      name: 'Aluspinna ettevalmistustööd, tasandus ja prahi utiliseerimine',
      quantity: 1,
      unit: 'komplekt',
      unit_price: prepCost,
      total_price: prepCost,
      is_labor: true,
    });
  }

  return {
    totalSqm,
    materialsCost: finalMaterials,
    laborCost: totalLabor,
    prepCost,
    totalCost: grandTotal,
    estimatedDays,
    materialBreakdowns: allSystemBreakdowns,
    activeSystem: chosenBrand,
    lineItems: activeLineItems,
  };
}
