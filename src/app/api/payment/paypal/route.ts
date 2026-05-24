import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency = "USD", trackTitle } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const orderData = {
      id: `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: "CREATED",
      trackTitle: trackTitle || "Licensing Fee",
      links: [
        { rel: "self", href: "#" },
        { rel: "approval_url", href: "#" },
      ],
    };

    return NextResponse.json({
      success: true,
      order: orderData,
      message: "PayPal order created. Add PAYPAL_CLIENT_ID to .env.local for real processing.",
    });
  } catch (error) {
    return NextResponse.json({ error: "PayPal order failed" }, { status: 500 });
  }
}