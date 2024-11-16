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
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { receiveTone, sendTone } from "@/utils/ggwave";

const convertTypedArray = (src, type) => {
  var buffer = new ArrayBuffer(src.byteLength);
  var baseView = new src.constructor(buffer).set(src);
  return new type(buffer);
};

// Decode Base64 to hex string
function decodeBase64ToHex(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytesToHex(bytes);
}

// Helper function to convert a byte array to a hex string
function bytesToHex(bytes) {
  return (
    "0x" +
    Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function ReceiveDrawer() {
  const [inputValue, setInputValue] = useState("");
  const [sendAmount, setSendAmount] = useState<number>();
  const [received, setReceived] = useState(false);

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
                // TODO: Send transaction
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
      <Drawer className="flex-1">
        <DrawerTrigger className="w-full">
          <Button className="w-full h-14 bg-slate-500 text-lg rounded-2xl">
            Receive
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          {received ? (
            <>
              <DrawerHeader>
                <DrawerTitle>Received</DrawerTitle>
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
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button
                    className="w-full"
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
                <DrawerTitle>Requesting</DrawerTitle>
                <DrawerDescription className="flex items-center justify-center p-8 pb-2">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button
                    variant="ghost"
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
                <DrawerTitle>Select amount</DrawerTitle>
                <DrawerDescription>
                  <Input
                    type="number"
                    placeholder="USD"
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button onClick={handleSubmission}>Receive</Button>
                <DrawerClose>
                  <Button
                    onClick={() => {
                      setInputValue("");
                      setSendAmount(undefined);
                    }}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
