import { NextResponse } from "next/server";

export const runtime = "nodejs";

const inventory = new Map<string, { sku: string; name: string; units: number; reserved: number }>([
  ["SKU-WFL-BATTER-10KG", { sku: "SKU-WFL-BATTER-10KG", name: "Premium Belgian Waffle Mix (10kg)", units: 48, reserved: 12 }],
  ["SKU-WFL-CHOCO-5KG", { sku: "SKU-WFL-CHOCO-5KG", name: "Belgian Chocolate Topping (5kg)", units: 30, reserved: 4 }],
]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sku = url.searchParams.get("sku") || "SKU-WFL-BATTER-10KG";

  const item = inventory.get(sku);
  if (!item) {
    return NextResponse.json({ error: "SKU not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, item, environment: "MOCK Sandbox" });
}

export async function PATCH(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Unauthorized: Missing Bearer token in Authorization header.",
        code: "AUTH_REQUIRED",
      },
      { status: 401 }
    );
  }

  try {
    const rawText = await req.text();
    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Bad Request", message: "Request body cannot be empty." },
        { status: 400 }
      );
    }

    const body = JSON.parse(rawText) as { sku?: string; adjustment?: number; reason?: string };
    if (!body.sku || typeof body.adjustment !== "number") {
      return NextResponse.json(
        { error: "Unprocessable Entity", message: "sku and adjustment (number) are required." },
        { status: 422 }
      );
    }

    const item = inventory.get(body.sku);
    if (!item) {
      return NextResponse.json(
        { error: "Not Found", message: `SKU '${body.sku}' not found.` },
        { status: 404 }
      );
    }

    item.units = Math.max(0, item.units + body.adjustment);
    return NextResponse.json({
      success: true,
      message: `Stock for ${body.sku} adjusted by ${body.adjustment}.`,
      item,
      environment: "MOCK Sandbox",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Bad Request", message: String(error) },
      { status: 400 }
    );
  }
}
