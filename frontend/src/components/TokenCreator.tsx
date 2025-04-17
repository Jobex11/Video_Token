import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const TokenCreator = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenMint, setTokenMint] = useState<string | null>(null);
  const handleCreateToken = async () => {
    if (!wallet.publicKey) {
      alert("Wallet not connected");
      return;
    }

    if (!name || !symbol || !decimals || !amount) {
      alert("Please provide name, symbol, decimals, and amount.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create a mint keypair (new token)
      const mintKeypair = Keypair.generate();

      // 2. Create associated token account for the wallet
      const associatedToken = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // 3. Calculate rent-exempt balance for mint account
      const space = 82;
      const lamports = await connection.getMinimumBalanceForRentExemption(
        space
      );

      // 4. Build the transaction
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          Number(decimals),
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer
          associatedToken, // associated token address
          wallet.publicKey, // token account owner
          mintKeypair.publicKey, // token mint
          TOKEN_2022_PROGRAM_ID
        ),

        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey,
          Number(amount) * Math.pow(10, Number(decimals)),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.partialSign(mintKeypair);

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      console.log("Token created successfully!");
      console.log("Mint Address:", mintKeypair.publicKey.toBase58());
    } catch (error) {
      console.error("Error creating token:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Create SPL Token</h1>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Token Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, marginBottom: 8, width: "100%" }}
        />
        <input
          type="text"
          placeholder="Token Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{ padding: 8, marginBottom: 8, width: "100%" }}
        />
        <input
          type="number"
          placeholder="Initial Supply"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ padding: 8, width: "100%" }}
        />
        <input
          type="number"
          placeholder="Initial Supply"
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
          style={{ padding: 8, width: "100%" }}
        />
      </div>

      <WalletMultiButton />
      <br />

      <button
        onClick={handleCreateToken}
        style={{
          padding: "10px 20px",
          marginTop: 16,
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating Token..." : "Create Token"}
      </button>

      {tokenMint && (
        <div style={{ marginTop: 24 }}>
          <h3>✅ Token Created!</h3>
          <p>
            <strong>Mint Address:</strong> {tokenMint}
          </p>
          <a
            href={`https://explorer.solana.com/address/${tokenMint}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
          >
            View on Solana Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default TokenCreator;  
