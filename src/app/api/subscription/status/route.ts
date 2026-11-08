import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/subscription/status?contractorId=xxx
 * Returns the current subscription status for a contractor.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contractorId = searchParams.get('contractorId');

  if (!contractorId) {
    return NextResponse.json({ error: 'contractorId is required' }, { status: 400 });
  }

  // --- PRODUCTION: Query Supabase ---
  // const { createClient } = await import('@supabase/supabase-js');
  // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  // const { data, error } = await supabase
  //   .from('contractor_profiles')
  //   .select('subscription_status, subscription_expires_at, payment_provider_id')
  //   .eq('id', contractorId)
  //   .single();
  // if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  // return NextResponse.json(data);

  // Demo response
  return NextResponse.json({
    contractorId,
    subscription_status: 'free',
    subscription_expires_at: null,
    payment_provider_id: null,
    quotes_this_month: 2,
    max_quotes_per_month: 3,
  });
}
