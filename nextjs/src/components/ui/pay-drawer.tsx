"use client";
import { useState } from "react";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import factory from "ggwave";
import { createClaimSignature } from "@/utils/createSignature";
import { privateKeyToAccount } from "viem/accounts";
import { sendTone, receiveTone } from "@/utils/ggwave";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import HoldNearReader from "@/public/hold_reader.gif";
import { DEFAULT_NETWORK } from "@/config/networks";
import SuccessImg from "@/public/success.gif";
import { useNonce } from "@/hooks/merchant/useNonce";

const DECIMALS = BigInt(6);

// Helper function to convert a hex string to a byte array
function hexToBytes(hex: any) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Encode hex string to Base64
function encodeHexToBase64(hex: any) {
  const bytes = hexToBytes(hex);
  return btoa(String.fromCharCode(...bytes));
}

export default function PayDrawer({
  smartWalletAddress,
}: {
  smartWalletAddress: string | undefined;
}) {
  const [sent, setSent] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { isLoading, nonce, error } = useNonce({
    network: DEFAULT_NETWORK,
    smartWalletAddress: smartWalletAddress as `0x${string}`,
  });

  const initPayment = async () => {
    await sendTone("o");
    console.log({ smartWalletAddress, nonce, isLoading, error });

    receiveTone(async (response) => {
      try {
        let sendAmount = BigInt(response) * BigInt(10) ** DECIMALS;
        console.log(sendAmount);
        console.log({
          primaryWallet,
          amount: sendAmount,
          nonce,
        });
        const signature = await createClaimSignature({
          primaryWallet,
          smartWalletAddress: smartWalletAddress as `0x${string}`,
          amount: sendAmount,
          nonce: nonce!,
        });

        console.log("Sending signature...", signature);

        const address = smartWalletAddress;
        await sendTone(
          encodeHexToBase64(address) + " " + encodeHexToBase64(signature)
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
        <DrawerTrigger
          className="w-full h-14 text-lg rounded-2xl bg-black text-white font-semibold"
          onClick={initPayment}
        >
          Pay
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            {sent ? (
              <>
                <DrawerTitle className="text-2xl font-bold mb-8">
                  Sent
                </DrawerTitle>
                <DrawerDescription className="flex items-center justify-center pb-2">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden bg-slate-100">
                    <Image
                      src={SuccessImg}
                      alt="Success animation"
                      fill
                      className="object-cover"
                    />
                  </div>
                </DrawerDescription>
              </>
            ) : (
              <>
                <DrawerTitle className="text-2xl font-bold mb-8">
                  Ready to Pay
                </DrawerTitle>
                <DrawerDescription className="flex items-center justify-center pb-2">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden bg-slate-100">
                    <Image
                      src={HoldNearReader}
                      alt="Loading animation"
                      fill
                      className="object-cover"
                    />
                  </div>
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button
                variant={sent ? undefined : "ghost"}
                className="w-full h-14 text-lg rounded-2xl"
              >
                {sent ? "Done" : "Cancel"}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
