// app/api/furniture/route.ts
import { connectToDatabase } from "@/lib/database";
import Furniture from "@/lib/database/models/furniture.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { furniture, userId } = body;

    if (!furniture || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newFurniture = await Furniture.create({
      ...furniture,
      provider: userId,
    });

    return NextResponse.json(
      { message: "Furniture created successfully", furniture: newFurniture },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in furniture creation:", error);
    return NextResponse.json(
      { message: "Error creating furniture" },
      { status: 500 }
    );
  }
}
