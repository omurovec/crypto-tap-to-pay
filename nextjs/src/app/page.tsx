"use client";
import Image from "next/image";
import Link from "next/link";
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
import { formatUsdc } from "@/utils/formatUsdc";
import { AnimatedNumber } from "@/components/ui/home/animated-number";
import { useWalletAddress } from "@/hooks/dynamic/useWalletAddress";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { DEFAULT_NETWORK } from "@/config/networks";
import { useSmartWalletAddress } from "@/hooks/useSmartWalletAddress";
import { useDeploySmartWallet } from "@/hooks/useDeploySmartWallet";
import logo from "@/assets/logo.jpg";
import { useEffect, useMemo, useState } from "react";
import {
  useDynamicContext,
  useSwitchNetwork,
} from "@dynamic-labs/sdk-react-core";
import { baseSepolia } from "viem/chains";

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const switchNetwork = useSwitchNetwork();
  const eoaAddress = useWalletAddress();
  const { primaryWallet } = useDynamicContext();
  const {
    smartWalletAddress,
    isLoading: isSmartWalletAddressLoading,
    error: smartWalletAddressError,
  } = useSmartWalletAddress({
    eoaAddress: eoaAddress as `0x${string}`,
    network: DEFAULT_NETWORK,
  });
  const {
    balance: walletBalance,
    isLoading: isWalletBalanceLoading,
    error: walletBalanceError,
  } = useWalletBalance({
    walletAddress: smartWalletAddress as `0x${string}`,
    network: DEFAULT_NETWORK,
  });
  const {
    deploySmartWallet,
    isLoading: deployIsLoading,
    error: deployError,
  } = useDeploySmartWallet({
    network: DEFAULT_NETWORK,
  });
  const [deployingSmartWallet, setDeployingSmartWallet] = useState(false);

  const usdcBalance = formatUsdc(BigInt(walletBalance));

  const copyToClipboard = () => {
    navigator.clipboard.writeText(smartWalletAddress || "");
  };

  const needsSmartContractWallet = useMemo(() => {
    return (
      !isSmartWalletAddressLoading &&
      smartWalletAddress === "0x0000000000000000000000000000000000000000"
    );
  }, [isSmartWalletAddressLoading, smartWalletAddress]);

  useEffect(() => {
    if (
      !isSmartWalletAddressLoading &&
      smartWalletAddress === "0x0000000000000000000000000000000000000000" &&
      !deployingSmartWallet
    ) {
      setDeployingSmartWallet(true);
      console.log(eoaAddress);
      primaryWallet?.getWalletClient().then((walletClient) => {
        deploySmartWallet(
          eoaAddress as `0x${string}`,
          BigInt(100n * 10n ** 6n),
          walletClient,
        )
          .then((res) => {
            console.log("Deployed smart wallet", res);
            setDeployingSmartWallet(false);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  }, [needsSmartContractWallet]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center content center mt-40">
        <Image
          src={logo}
          width={100}
          height={100}
          alt="Over the Ether logo"
          className="rounded-3xl mb-4"
        />
        <h1 className="text-4xl font-bold text-left tracking-tighter">
          Over the Ether
        </h1>
        <p className="mt-2 mb-6 text-muted-foreground font-semibold text-slate-500">
          Welcome 👋
        </p>
        <DynamicWidget />
      </div>
    );
  }

  if (isSmartWalletAddressLoading) {
    return (
      <div className="flex flex-col items-center content center mt-40">
        <Image
          src={logo}
          width={100}
          height={100}
          alt="Over the Ether logo"
          className="rounded-3xl mb-4"
        />
        <h1 className="text-4xl font-bold text-left tracking-tighter">
          Over the Ether
        </h1>
        <p className="mt-2 mb-6 text-muted-foreground font-semibold text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  if (smartWalletAddressError) {
    return (
      <div className="flex flex-col items-center content center mt-40">
        <Image
          src={logo}
          width={100}
          height={100}
          alt="Over the Ether logo"
          className="rounded-3xl mb-4"
        />
        <h1 className="text-4xl font-bold text-left tracking-tighter">
          Over the Ether
        </h1>
        <p className="mt-2 mb-6 text-muted-foreground font-semibold text-slate-500">
          Error loading smart wallet address
        </p>
      </div>
    );
  }

  if (deployingSmartWallet) {
    return (
      <div className="flex flex-col items-center content center mt-40">
        <Image
          src={logo}
          width={100}
          height={100}
          alt="Over the Ether logo"
          className="rounded-3xl mb-4"
        />
        <h1 className="text-4xl font-bold text-left tracking-tighter">
          Over the Ether
        </h1>
        <p className="mt-2 mb-6 text-muted-foreground font-semibold text-slate-500">
          Deploying smart wallet...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex mx-auto flex-col items-center mt-36">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          <div className="flex flex-col w-fit mx-auto">
            <span className="text-muted-foreground text-sm text-left uppercase text-slate-500 font-semibold self-start">
              Balance
            </span>
            <h1 className="text-6xl font-bold text-left tracking-tighter">
              $<AnimatedNumber value={usdcBalance.whole} />.
              <span className="text-slate-300">
                <AnimatedNumber value={usdcBalance.decimal} />
              </span>
            </h1>
            <p
              className="mt-4 text-muted-foreground font-semibold text-slate-500"
              onClick={copyToClipboard}
            >
              {smartWalletAddress
                ? smartWalletAddress?.slice(0, 6) +
                  "..." +
                  smartWalletAddress?.slice(-4)
                : "No Smart Wallet"}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex w-full gap-2 p-2 mt-12">
        {/* Pay modal */}
        <PayDrawer />

        {/* Receive modal */}
        <ReceiveDrawer />
      </div>

      {/* History */}
      <div></div>
    </div>
  );
}
