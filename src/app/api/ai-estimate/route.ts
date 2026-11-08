import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { calculateDetailedEstimate } from '@/lib/estimation-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      floorSqm = 6.5,
      wallSqm = 22.0,
      roomType = 'bathroom',
      tileFormat = 'standard_30x60',
      preferredManufacturer = 'Mira',
      substrateCondition = 'new_drywall',
      needsWaterproofing = true,
      needsFloorHeatingPrep = false,
      needsEpoxyGrout = false,
      notes = '',
    } = body;

    // 1. Calculate deterministic baseline using domain calculation engine
    const baseline = calculateDetailedEstimate({
      floorSqm,
      wallSqm,
      roomType,
      tileFormat,
      preferredManufacturer,
      substrateCondition,
      needsWaterproofing,
      needsFloorHeatingPrep,
      needsEpoxyGrout,
    });

    const apiKey = process.env.OPENAI_API_KEY;

    // 2. If OpenAI key is present, enrich with GPT-4o scope assessment & contractor advice
    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });

        const systemPrompt = `Oled kogenud plaatimistööde peainsener ja ehituskeemia spetsialist (EVS standardid, RYL ja ETAG 022 märgala normid). 
Sinu ülesanne on koostada professionaalne tehniline hinnang antud ruumi plaatimistöödele ja kontrollida materjalikulu.
Vasta eesti keeles struktureeritult lühikese kokkuvõtte ja soovitustena tellijale ja plaatijale.`;

        const userPrompt = `Ruumi parameetrid:
- Ruumi tüüp: ${roomType}
- Põrandapind: ${floorSqm} m²
- Seinapind: ${wallSqm} m² (Kokku ${floorSqm + wallSqm} m²)
- Keraamilise plaadi formaat: ${tileFormat}
- Eelistatud ehituskeemia: ${preferredManufacturer} (krunt, hüdroisolatsioon, liim, vuuk)
- Aluspind: ${substrateCondition}
- Hüdroisolatsioon vajalik: ${needsWaterproofing ? 'JAH (2 kihti + tugevduskangad)' : 'EI'}
- Põrandakütte ettevalmistus: ${needsFloorHeatingPrep ? 'JAH' : 'EI'}
- Epoksiidvuuk: ${needsEpoxyGrout ? 'JAH' : 'EI'}
- Tellija lisamärkmed: ${notes || 'Puuduvad'}

Baasarvutus:
- Materjalide kulu: ca ${baseline.materialsCost} €
- Tööde kulu: ca ${baseline.laborCost} €
- Eeldatav tööaeg: ${baseline.estimatedDays} tööpäeva

Anna:
1. Tehniline kokkuvõte ja kuivamisajad (eriti hüdroisolatsiooni ja plaatimissegu vahel).
2. Peamised riskikohad (trapikalded, nurgad, toruläbiviigud).
3. Nõuanne materjalide ja garantiide kohta.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 600,
        });

        const aiAnalysis = completion.choices[0]?.message?.content || null;

        return NextResponse.json({
          success: true,
          source: 'openai-gpt-4o',
          estimate: baseline,
          aiAnalysis,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('OpenAI API call failed, falling back to local calculation engine:', message);
      }
    }

    // Default response using local calculation engine
    return NextResponse.json({
      success: true,
      source: 'plaatija24-engine',
      estimate: baseline,
      aiAnalysis: `Hinnang koostatud ${preferredManufacturer} süsteeminormide järgi ${baseline.totalSqm.toFixed(
        1
      )} m² pinnale. Tööde eeldatav kestus on ${baseline.estimatedDays} tööpäeva (sh hüdroisolatsiooni kuivamisaeg). Vajalik tagada trapikalded min 1:50-1:100 ja toruläbiviikude manšetid.`,
      apiKeyConfigured: Boolean(apiKey),
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Kalkulatsiooni viga';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
