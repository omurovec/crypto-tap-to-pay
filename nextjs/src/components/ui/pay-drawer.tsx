"use client";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import factory from "ggwave";
import { createClaimSignature } from "@/utils/createSignature";
import { privateKeyToAccount } from "viem/accounts";
import { sendTone, receiveTone } from "@/utils/ggwave";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const DECIMALS = 6n;
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const convertTypedArray = (src, type) => {
  var buffer = new ArrayBuffer(src.byteLength);
  var baseView = new src.constructor(buffer).set(src);
  return new type(buffer);
};

// Helper function to convert a hex string to a byte array
function hexToBytes(hex) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Encode hex string to Base64
function encodeHexToBase64(hex) {
  const bytes = hexToBytes(hex);
  return btoa(String.fromCharCode(...bytes));
}

export default function PayDrawer() {
  const [sent, setSent] = useState(false);
  const { primaryWallet } = useDynamicContext();

  const initPayment = async () => {
    await sendTone("o");

    receiveTone(async (response) => {
      try {
        let sendAmount = BigInt(response) * 10n ** DECIMALS;
        console.log(sendAmount);
        const signature = await createClaimSignature({
          primaryWallet,
          amount: sendAmount,
          nonce: 0n, // TODO: Replace with proper nonce
        });

        console.log("Sending signature...", signature);
        const address = primaryWallet.address;

        await sendTone(
          encodeHexToBase64(address) + " " + encodeHexToBase64(signature),
        );
        setTimeout(() => setSent(true), 10000);
      } catch (e) {
        console.warn(e);
      }
    });
  };

  return (
    <div className="flex-1">
      <Drawer>
        {/* Pay modal */}
        <DrawerTrigger className="w-full">
          <Button onClick={initPayment} className="w-full h-14">
            Pay
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            {sent ? (
              <>
                <DrawerTitle>Sent</DrawerTitle>
                <DrawerDescription className="flex items-center justify-center p-8 pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="56"
                    height="56"
                    fill="lightgreen"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                  </svg>
                </DrawerDescription>
              </>
            ) : (
              <>
                <DrawerTitle>Sending</DrawerTitle>
                <DrawerDescription className="flex items-center justify-center p-8 pb-2">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant={sent ? undefined : "ghost"} className="w-full">
                {sent ? "Done" : "Cancel"}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
