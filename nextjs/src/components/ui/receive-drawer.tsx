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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { receiveTone, sendTone } from "@/utils/ggwave";
import Image from "next/image";
import HoldNearReader from "@/public/hold_reader.gif";
import SuccessImg from "@/public/success.gif";
import { DEFAULT_NETWORK } from "@/config/networks";
import { useClaimFunds } from "@/hooks/merchant/useClaimFunds";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const convertTypedArray = (src: any, type: any) => {
  var buffer = new ArrayBuffer(src.byteLength);
  var baseView = new src.constructor(buffer).set(src);
  return new type(buffer);
};

// Decode Base64 to hex string
function decodeBase64ToHex(base64: any) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytesToHex(bytes);
}

// Helper function to convert a byte array to a hex string
function bytesToHex(bytes: any) {
  return (
    "0x" +
    Array.from(bytes)
      .map((byte: any) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function ReceiveDrawer() {
  const [inputValue, setInputValue] = useState("");
  const [sendAmount, setSendAmount] = useState<number>();
  const [received, setReceived] = useState(false);
  const { claimFunds } = useClaimFunds({
    network: DEFAULT_NETWORK,
  });
  const { primaryWallet } = useDynamicContext();

  const handleSubmission = async () => {
    setSendAmount(Number(inputValue));

    // wait for payer
    receiveTone((openTone) => {
      if (openTone == "o") {
        // send the amount
        sendTone(inputValue).then(() => {
          // wait for signature
          receiveTone((res) => {
            try {
              let [address, signature] = res.split(" ").map(decodeBase64ToHex);
              console.log(address, signature);
              if (address && signature) {
                console.log("claimFundsParams", {
                  signature,
                  amount: BigInt(inputValue) * BigInt(10) ** BigInt(6),
                  smartWalletAddress: address,
                });

                // TODO: Send transaction
                claimFunds(
                  primaryWallet,
                  signature,
                  BigInt(inputValue) * BigInt(10) ** BigInt(6),
                  address
                );
                setReceived(true);
              }
            } catch (e) {
              console.error(e);
            }
          });
        });
      }
    });
  };

  return (
    <div className="flex-1">
      <Drawer>
        <DrawerTrigger className="w-full h-14 text-lg bg-slate-600 rounded-2xl text-white font-semibold">
          Receive
        </DrawerTrigger>
        <DrawerContent>
          {received ? (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-bold mb-8">
                  Received
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
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button
                    className="w-full h-14 text-lg rounded-2xl"
                    onClick={() => {
                      setInputValue("");
                      setSendAmount(undefined);
                    }}
                  >
                    Done
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          ) : sendAmount !== undefined ? (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-bold mb-8">
                  Requesting
                </DrawerTitle>
                <DrawerDescription className="flex items-center justify-center p-8 pb-2">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden bg-slate-100">
                    <Image
                      src={HoldNearReader}
                      alt="Loading animation"
                      fill
                      className="object-cover"
                    />
                  </div>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button
                    variant="ghost"
                    className="w-full h-14 text-lg rounded-2xl"
                    onClick={() => {
                      setInputValue("");
                      setSendAmount(undefined);
                    }}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          ) : (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-bold mb-8">
                  Select amount
                </DrawerTitle>
                <DrawerDescription>
                  <Input
                    type="number"
                    placeholder="Enter amount in USD"
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-14 text-lg rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                  />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={handleSubmission}
                    className="flex-1 h-14 text-lg rounded-2xl"
                  >
                    Receive
                  </Button>
                  <DrawerClose className="flex-1">
                    <Button
                      onClick={() => {
                        setInputValue("");
                        setSendAmount(undefined);
                      }}
                      variant="ghost"
                      className="w-full h-14 text-lg rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
