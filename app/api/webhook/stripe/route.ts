import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const origin =
      headersList.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

    const body = await request.json();

    if (!body.cartItems || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rentalDays = Math.max(
      Math.floor(
        (new Date(body.endDate).getTime() -
          new Date(body.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1,
      1
    );

    const lineItems = body.cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Rental for ${rentalDays} day(s)`,
        },
        unit_amount: Math.round(item.price * rentalDays * 100), // Price in cents for the entire rental period
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        startDate: body.startDate,
        endDate: body.endDate,
        rentalDays: rentalDays.toString(),
        deliveryOption: body.deliveryOption || "pickup",
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "TN"],
      },
    });

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error: any) {
    console.error("Stripe API Error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Error creating checkout session",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
