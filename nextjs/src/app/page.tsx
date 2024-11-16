import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import ReceiveDrawer from "@/components/ui/receive-drawer";

import { WalletTest } from "@/components/WalletTest";

export default function Home() {
  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <p>Balance</p>
        <h1>0.00</h1>
      </div>

      {/* History */}
      <div></div>

      <WalletTest />

      {/* CTAs */}
      <div className="fixed inset-x-0 bottom-0 flex w-full gap-2 p-2">
        <div className="flex-1">
          <Drawer>
            {/* Pay modal */}
            <DrawerTrigger className="w-full">
              <Button className="w-full">Pay</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Receive modal */}
        <ReceiveDrawer />
      </div>
    </div>
  );
}
