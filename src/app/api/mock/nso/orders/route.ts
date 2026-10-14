import { NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory mock orders store
interface MockOrderItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

interface MockOrder {
  id: string;
  cartId: string;
  franchiseId: string;
  items: MockOrderItem[];
  subtotal: number;
  discount: number;
  taxableAmount: number;
  tax: number;
  total: number;
  status: "CONFIRMED" | "DISPATCHED" | "CANCELLED";
  createdAt: string;
}

const mockOrders = new Map<string, MockOrder>([
  [
    "ORD-2026-8841",
    {
      id: "ORD-2026-8841",
      cartId: "CRT-7749",
      franchiseId: "FR-HYD-04",
      items: [{ id: "WFL-01", name: "Nutella Waffle", qty: 2, unitPrice: 199.99 }],
      subtotal: 399.98,
      discount: 50.0,
      taxableAmount: 349.98,
      tax: 17.5,
      total: 367.48,
      status: "CONFIRMED",
      createdAt: "2026-03-24T09:30:00Z",
    },
  ],
]);

export async function POST(req: Request) {
  try {
    const rawText = await req.text();
    if (!rawText.trim()) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Missing required field 'cartId' or 'items'. Payload cannot be empty.",
          code: "INVALID_REQUEST_BODY",
        },
        { status: 400 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Malformed JSON payload syntax.",
          code: "MALFORMED_JSON",
        },
        { status: 400 }
      );
    }

    const { cartId, franchiseId, items } = body as {
      cartId?: string;
      franchiseId?: string;
      items?: Array<{ id: string; name?: string; qty: unknown; unitPrice?: number }>;
    };

    if (!cartId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Missing required field 'cartId' or 'items'. Payload cannot be empty.",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 }
      );
    }

    // Check item quantity types
    for (const item of items) {
      if (typeof item.qty !== "number" || item.qty <= 0) {
        return NextResponse.json(
          {
            error: "Unprocessable Entity",
            message: "Unprocessable Entity: 'qty' must be a strictly positive integer.",
            code: "VALIDATION_FAILED",
            field: "items[].qty",
          },
          { status: 422 }
        );
      }
    }

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = items.reduce(
      (sum, it) => sum + (typeof it.unitPrice === "number" ? it.unitPrice : 199.99) * (it.qty as number),
      0
    );
    const discount = 0;
    const taxable = subtotal - discount;
    const tax = Math.round(taxable * 0.05 * 100) / 100;
    const total = Math.round((taxable + tax) * 100) / 100;

    const newOrder: MockOrder = {
      id: orderId,
      cartId,
      franchiseId: franchiseId || "FR-DEFAULT-01",
      items: items.map((it) => ({
        id: it.id,
        name: it.name || "Belgian Waffle Item",
        qty: it.qty as number,
        unitPrice: typeof it.unitPrice === "number" ? it.unitPrice : 199.99,
      })),
      subtotal,
      discount,
      taxableAmount: taxable,
      tax,
      total,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    mockOrders.set(orderId, newOrder);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed and sent to supply chain queue.",
        orderId,
        order: newOrder,
        environment: "MOCK Sandbox",
      },
      {
        status: 201,
        headers: {
          Location: `/api/mock/nso/orders?id=${orderId}`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({
      orders: Array.from(mockOrders.values()),
      total: mockOrders.size,
      environment: "MOCK Sandbox",
    });
  }

  const order = mockOrders.get(id);
  if (!order) {
    return NextResponse.json(
      {
        error: "Not Found",
        message: `Order '${id}' not found in system records.`,
        code: "ORDER_NOT_FOUND",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    order,
    environment: "MOCK Sandbox",
  });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Bad Request", message: "Order id is required for cancellation." },
      { status: 400 }
    );
  }

  const order = mockOrders.get(id);
  if (!order) {
    return NextResponse.json(
      { error: "Not Found", message: `Order '${id}' not found.` },
      { status: 404 }
    );
  }

  order.status = "CANCELLED";
  return NextResponse.json({
    success: true,
    message: `Order ${id} has been cancelled successfully.`,
    order,
    environment: "MOCK Sandbox",
  });
}
