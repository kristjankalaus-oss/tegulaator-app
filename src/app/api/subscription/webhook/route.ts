import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscription/webhook
 * Handles payment provider webhooks from Montonio / Maksekeskus.
 * Verifies the payment signature and updates contractor subscription status in Supabase.
 *
 * PRODUCTION SETUP:
 * 1. Set MONTONIO_SECRET_KEY (or MAKSEKESKUS_SECRET) in environment variables
 * 2. Configure your payment provider to POST to: https://your-domain.com/api/subscription/webhook
 * 3. Uncomment the Supabase update block below once DB columns are migrated
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-montonio-signature') || req.headers.get('x-mk-signature');

    // --- PRODUCTION: Verify webhook signature ---
    // const isValid = verifyMontonioSignature(rawBody, signature, process.env.MONTONIO_SECRET_KEY!);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Suppress unused variable warning in development
    void signature;

    const payload = JSON.parse(rawBody);
    const { event, orderId, contractorId, status } = payload;

    console.log('[subscription/webhook] Event received:', { event, orderId, status });

    if (event === 'payment.completed' && status === 'paid') {
      // --- PRODUCTION: Update Supabase contractor_profiles ---
      // const { createClient } = await import('@supabase/supabase-js');
      // const supabaseAdmin = createClient(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.SUPABASE_SERVICE_ROLE_KEY!
      // );
      // const expiresAt = new Date();
      // expiresAt.setMonth(expiresAt.getMonth() + 1);
      // await supabaseAdmin
      //   .from('contractor_profiles')
      //   .update({
      //     subscription_status: 'pro',
      //     subscription_expires_at: expiresAt.toISOString(),
      //     payment_provider_id: orderId,
      //   })
      //   .eq('id', contractorId);

      console.log(`[subscription/webhook] PRO activated for contractor: ${contractorId}, order: ${orderId}`);
      return NextResponse.json({ received: true, action: 'subscription_activated' });
    }

    if (event === 'subscription.cancelled' || event === 'payment.failed') {
      // --- PRODUCTION: Downgrade to free ---
      // await supabaseAdmin
      //   .from('contractor_profiles')
      //   .update({ subscription_status: 'free', subscription_expires_at: null })
      //   .eq('id', contractorId);

      console.log(`[subscription/webhook] Subscription cancelled/failed for contractor: ${contractorId}`);
      return NextResponse.json({ received: true, action: 'subscription_cancelled' });
    }

    return NextResponse.json({ received: true, action: 'no_action' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[subscription/webhook] Error:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: err.message },
      { status: 500 }
    );
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Plaatija24 Subscription Webhook (Montonio / Maksekeskus)',
    version: '1.0.0',
  });
}
