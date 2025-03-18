import { useState, useEffect } from "react";
import {
  Connection,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createMint,
} from "@solana/spl-token";

const RPC_URL = "https://api.devnet.solana.com"; // Use Devnet for testing
const connection = new Connection(RPC_URL, "confirmed");

const TokenCreator = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("solana" in window) {
      const provider = (window as any).solana;
      if (provider.isPhantom) {
        setWallet(provider);
      }
    }
  }, []);

  const connectWallet = async () => {
    if (!wallet) return alert("Phantom Wallet not found!");
    await wallet.connect();
  };

  const createToken = async () => {
    if (!wallet || !wallet.publicKey) return alert("Connect Wallet First!");
    if (!name || !symbol || !supply) return alert("Fill in all fields!");

    setLoading(true);
    setError(null);

    try {
      const payer = wallet.publicKey;
      const mintAuthority = payer;
      const freezeAuthority = payer;

      // Create new token mint
      const mint = Keypair.generate();
      const transaction = new Transaction();

      const mintInstruction = await createMint(
        connection,
        payer,
        mint.publicKey,
        mintAuthority,
        9
      );

      transaction.add(mintInstruction);
      await sendAndConfirmTransaction(connection, transaction, [mint]);

      setMintAddress(mint.publicKey.toBase58());
    } catch (err) {
      setError("Failed to create token.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Create Video Token</h1>

      {!wallet ? (
        <button onClick={connectWallet} className="p-2 bg-blue-600 rounded">
          Connect Phantom
        </button>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <input
            type="text"
            placeholder="Token Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <input
            type="text"
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <input
            type="number"
            placeholder="Supply"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />

          <button
            onClick={createToken}
            disabled={loading}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            {loading ? "Creating..." : "Create Token"}
          </button>

          {mintAddress && (
            <p className="mt-4 text-green-400">Mint Address: {mintAddress}</p>
          )}
          {error && <p className="mt-3 text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default TokenCreator;
