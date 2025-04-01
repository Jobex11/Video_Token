import "./App.css";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import Home from "./components/Home";

const solanaWeb3JsAdapter = new SolanaAdapter();

const projectId = "7ca5531f56b54bc50c5e522b084071bb";

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solanaDevnet, solana, solanaTestnet],
  //solana, solanaTestnet,
  projectId,
  features: {
    analytics: true, // Optional
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
