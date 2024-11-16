import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Coinbase } from "@coinbase/coinbase-sdk";

interface CoinbaseContextType {
  coinbase: Coinbase | null;
  isInitialized: boolean;
  error: string | null;
}

const CoinbaseContext = createContext<CoinbaseContextType>({
  coinbase: null,
  isInitialized: false,
  error: null,
});

export function CoinbaseProvider({ children }: { children: ReactNode }) {
  const [coinbase, setCoinbase] = useState<Coinbase | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCoinbase = async () => {
      try {
        const coinbaseInstance = Coinbase.configureFromJson({
          filePath: process.env.NEXT_PUBLIC_COINBASE_API_KEY_PATH,
        });

        setCoinbase(coinbaseInstance);
        setIsInitialized(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize Coinbase SDK"
        );
        console.error("Coinbase initialization error:", err);
      }
    };

    initializeCoinbase();
  }, []);

  return (
    <CoinbaseContext.Provider value={{ coinbase, isInitialized, error }}>
      {children}
    </CoinbaseContext.Provider>
  );
}

export function useCoinbase() {
  const context = useContext(CoinbaseContext);
  if (context === undefined) {
    throw new Error("useCoinbase must be used within a CoinbaseProvider");
  }
  return context;
}
