import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";

const SendTransaction = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const connection = new Connection(clusterApiUrl("devnet"));

  const handleSend = async () => {
    if (!connected) {
      alert("Please connect your wallet.");
      return;
    }

    if (!recipient || !amount) {
      alert("Please enter a valid recipient address and amount.");
      return;
    }

    try {
      const recipientPubKey = new PublicKey(recipient);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: recipientPubKey,
          lamports: Number(amount) * 1e9,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey!;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "finalized");

      alert(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Check the console for details.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">Send SOL</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 w-full rounded mb-2"
      />
      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full rounded mb-2"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={!connected}
      >
        Send SOL
      </button>
    </div>
  );
};

export default SendTransaction;