import { useMemo } from "react";
import "./App.css";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import Home from "./components/Home";

function App() {
  const network = clusterApiUrl("devnet");

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div>
            <Home />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
