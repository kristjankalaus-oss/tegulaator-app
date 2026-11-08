import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const STYLE_PRESETS: Record<string, string> = {
  marble_luxury:
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&auto=format&fit=crop&q=80',
  modern_anthracite:
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=900&auto=format&fit=crop&q=80',
  scandi_terrazzo:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomType = 'bathroom', tileFormat = 'standard_30x60', style = 'marble_luxury', userPhoto = null } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });

        const formatDesc =
          tileFormat === 'standard_30x60'
            ? '30x60cm ceramic wall tiles and matching floor tiles'
            : tileFormat === 'large_60x60'
            ? '60x60cm porcelain stoneware tiles with slim 2mm grout joints'
            : tileFormat === 'slab_120x240'
            ? 'large format 120x240cm porcelain slabs, seamless marble look'
            : tileFormat === 'herringbone'
            ? 'herringbone subway tile pattern with contrasting grout'
            : 'mosaic accent tile in shower area';

        const styleDesc =
          style === 'modern_anthracite'
            ? 'Nordic minimalist bathroom with charcoal dark slate tiles, matte black fixtures, warm oak accents'
            : style === 'scandi_terrazzo'
            ? 'Scandinavian light aesthetic, terrazzo floor, white glazed vertical tiles, brass fittings'
            : 'Luxury modern bathroom with white Carrara marble tiles, warm recessed LED lighting, walk-in glass shower';

        const prompt = `Architectural interior photography of a finished modern ${roomType}. Professional tiling craftsmanship: ${formatDesc}. Style: ${styleDesc}. Perfect grout lines, clean 45-degree mitered corners, beautiful lighting, realistic 8k resolution.`;

        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        });

        const generatedUrl = imageResponse.data?.[0]?.url;

        if (generatedUrl) {
          return NextResponse.json({
            success: true,
            source: 'dall-e-3',
            mockupUrl: generatedUrl,
            prompt,
          });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('DALL-E generation failed, falling back to preset concept:', message);
      }
    }

    // Fallback preset
    const fallbackUrl = STYLE_PRESETS[style] || STYLE_PRESETS.marble_luxury;

    return NextResponse.json({
      success: true,
      source: 'preset-concept',
      mockupUrl: fallbackUrl,
      basePhotoUsed: Boolean(userPhoto),
      apiKeyConfigured: Boolean(apiKey),
      message: 'Visual mockup loaded. Add OPENAI_API_KEY in .env.local for dynamic DALL-E 3 rendering.',
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Mockup generation error';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
