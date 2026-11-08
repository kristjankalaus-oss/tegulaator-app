import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscription/checkout
 * Initiates a PRO subscription checkout via Montonio / Maksekeskus.
 * In production, this would create a payment order and return a redirect URL.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractorId, plan, returnUrl } = body;

    if (!contractorId || !plan) {
      return NextResponse.json(
        { error: 'contractorId and plan are required' },
        { status: 400 }
      );
    }

    if (!['free', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "free" or "pro"' },
        { status: 400 }
      );
    }

    // --- PRODUCTION INTEGRATION POINT ---
    // Replace this block with actual Montonio / Maksekeskus API call:
    //
    // const montonioOrder = await createMontonioOrder({
    //   amount: plan === 'pro' ? 9.90 : 0,
    //   currency: 'EUR',
    //   merchantReference: `plaatija24-pro-${contractorId}-${Date.now()}`,
    //   customer: { email: contractorEmail },
    //   returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/contractor/dashboard`,
    //   notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription/webhook`,
    //   recurringEnabled: true,
    //   recurringInterval: 'monthly',
    // });
    // return NextResponse.json({ checkoutUrl: montonioOrder.paymentUrl, orderId: montonioOrder.id });

    // Demo/sandbox response
    const mockOrderId = `PLT24-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      plan,
      amount: plan === 'pro' ? 9.90 : 0,
      currency: 'EUR',
      status: 'pending',
      // In production this would be the Montonio/Maksekeskus redirect URL:
      checkoutUrl: returnUrl || '/contractor/dashboard',
      expiresAt: expiresAt.toISOString(),
      message:
        plan === 'pro'
          ? 'PRO tellimus algatatud. Montonio pangalink: integreerimiseks lisa MONTONIO_SECRET_KEY keskkonnamuutuja.'
          : 'Tasuta pakett aktiveeritud.',
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[subscription/checkout] Error:', err);
    return NextResponse.json(
      { error: 'Checkout initiation failed', details: err.message },
      { status: 500 }
    );
  }
}
