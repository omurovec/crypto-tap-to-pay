import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", {
      encryptedLength: body.encryptedData?.length,
      ivLength: body.iv?.length,
      authTagLength: body.authTag?.length,
    });

    const { encryptedData, iv, authTag } = body;

    if (!encryptedData || !iv || !authTag) {
      return NextResponse.json(
        { error: "Missing encryption parameters" },
        { status: 400 }
      );
    }

    // Decrypt the private key
    const privateKey = decrypt(encryptedData, iv, authTag);
    console.log("Successfully decrypted private key");

    return NextResponse.json(
      {
        success: true,
        message: "Wallet imported successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wallet import error:", error);
    return NextResponse.json(
      {
        error: "Failed to import wallet",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
