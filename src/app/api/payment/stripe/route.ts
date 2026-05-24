import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency = "usd", trackTitle, clientId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Stripe payment intent would be created here with real API key
    const paymentData = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: "pending",
      trackTitle: trackTitle || "Licensing Fee",
      clientId,
      createdAt: new Date().toISOString(),
    };

    // Simulate successful payment for demo
    return NextResponse.json({
      success: true,
      payment: paymentData,
      message: "Payment initialized. Add STRIPE_SECRET_KEY to .env.local for real processing.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    supported: ["stripe", "paypal", "bank_transfer"],
    currencies: ["USD", "EUR", "GBP"],
  });
}