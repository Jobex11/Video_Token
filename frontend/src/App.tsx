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
  CloverWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import styles for the wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";
import Home from "./components/Home";
function App() {
  const network = clusterApiUrl("mainnet-beta");

  // Set up wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CloverWalletAdapter(),
    ],
    []
  );

  return (
    <>
      <div>
        <ConnectionProvider endpoint={network}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <div>
                <Home />
              </div>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </>
  );
}

export default App;

/*
import "./App.css";

import Home from "./components/Home";
function App() {
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
*/

/*
import "./App.css";
import { createAppKit, useAppKitProvider } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import Home from "./components/Home";


const solanaWeb3JsAdapter = new SolanaAdapter();

const projectId = "7ca5531f56b54bc50c5e522b084071bb";

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solanaDevnet, solana, solanaTestnet],

  projectId,
  features: {
    analytics: true,
  },
});

function App() {
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;

*/
