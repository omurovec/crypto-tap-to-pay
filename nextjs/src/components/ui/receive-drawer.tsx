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

export default function ReceiveDrawer() {
  const [inputValue, setInputValue] = useState("");
  const [sendAmount, setSendAmount] = useState<number>();

  const handleSubmission = () => {
    setSendAmount(Number(inputValue));
  };

  return (
    <div className="flex-1">
      <Drawer className="flex-1">
        <DrawerTrigger className="w-full">
          <Button className="w-full">Receive</Button>
        </DrawerTrigger>
        <DrawerContent>
          {sendAmount !== undefined ? (
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
                <Button
                  onClick={() => {
                    setSendAmount(10);
                  }}
                >
                  Receive
                </Button>
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
