import { NextRequest, NextResponse } from "next/server";
import { COINBASE_API_NETWORK_CONFIG, NetworkType } from "@/config/networks";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const network = searchParams.get("network") as any as NetworkType;

  if (!address || !network) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.cdp.coinbase.com/platform/v1/networks/${COINBASE_API_NETWORK_CONFIG[network]}/addresses/${address}/balance_history/usdc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.COINBASE_CLIENT_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
