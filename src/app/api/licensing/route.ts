import { NextResponse } from "next/server";

const licenses = [
  {
    id: "personal",
    name: "Personal Use",
    price: 49,
    description: "For indie projects, student films, non-commercial content",
    features: ["Web & social media", "Up to 10k views", "No TV/film", "1 year license"],
  },
  {
    id: "commercial",
    name: "Commercial",
    price: 299,
    description: "For businesses, ads, branded content, TV",
    features: ["Unlimited views", "TV & film allowed", "Broadcast rights", "2 year license"],
    popular: true,
  },
  {
    id: "exclusive",
    name: "Exclusive Rights",
    price: 999,
    description: "Full buyout, exclusive licensing, sync placements",
    features: ["All platforms", "Unlimited term", "Worldwide rights", "All media"],
  },
];

export async function GET() {
  return NextResponse.json({ licenses });
}

export async function POST(req: Request) {
  try {
    const { licenseId, trackTitle, customerEmail, paymentMethod } = await req.json();

    const license = licenses.find((l) => l.id === licenseId);
    if (!license) {
      return NextResponse.json({ error: "Invalid license type" }, { status: 400 });
    }

    const orderData = {
      id: `LIC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      licenseId,
      trackTitle: trackTitle || "Unknown Track",
      customerEmail,
      paymentMethod: paymentMethod || "stripe",
      amount: license.price,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      order: orderData,
      message: `License order created for $${license.price}`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create license order" }, { status: 500 });
  }
}