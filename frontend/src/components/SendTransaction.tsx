import { useState } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const SendTransaction = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSendSol = async () => {
    if (!publicKey) {
      alert("Connect your wallet first!");
      return;
    }

    try {
      const recipientPubKey = new PublicKey(recipientAddress);
      const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      alert(`Transaction successful! Signature: ${signature}`);
      setRecipientAddress("");
      setAmount("");
    } catch (err: any) {
      console.error("Error sending SOL:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Send SOL</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Recipient wallet address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Amount in SOL"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        onClick={handleSendSol}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send SOL
      </button>

      <div className="mt-4">
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default SendTransaction;
