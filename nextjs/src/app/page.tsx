"use client";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
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
import { Input } from "@/components/ui/Input";
import ReceiveDrawer from "@/components/ui/receive-drawer";
import PayDrawer from "@/components/ui/pay-drawer";
import {
  useIsLoggedIn,
  DynamicContextProvider,
  DynamicWidget,
  useEmbeddedReveal,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const { initExportProcess } = useEmbeddedReveal();

  const copyToClipboard = () => {
    navigator.clipboard.writeText("0x124..568");
  };

  return isLoggedIn ? (
    <div className="w-full">
      {/* Header */}
      <div className="flex w-full flex-col items-center mt-36">
        <p className="text-muted-foreground text-sm">Current balance</p>
        <h1 className="text-6xl font-bold mt-2">$100.00</h1>
        <p className="mt-4 text-muted-foreground" onClick={copyToClipboard}>
          0x124..568
        </p>
      </div>

      {/* History */}
      <div></div>

      {/* CTAs */}
      <div className="fixed inset-x-0 bottom-0 flex w-full gap-2 p-2">
        {/* Pay modal */}
        <PayDrawer />

        {/* Receive modal */}
        <ReceiveDrawer />
      </div>
    </div>
  ) : (
    <DynamicWidget />
  );
}
