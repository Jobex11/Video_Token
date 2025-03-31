import { useState } from "react";

import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";
const CreateToken = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { address } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  //SEND SOL TRANSACTION

  const sendSol = async () => {
    if (!address) {
      alert("Connect your wallet first!");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(address), // Sender's address
          toPubkey: new PublicKey(recipient), // Recipient's address
          lamports: Number(amount) * LAMPORTS_PER_SOL, // Convert SOL to lamports
        })
      );

      transaction.feePayer = new PublicKey(address);
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;

      const signature = await walletProvider.signAndSendTransaction(
        transaction
      );

      alert(`Transaction successful! Tx Signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed! Check console for details.");
    }
  };

  return (
    <div>
      <div className="p-4 border border-gray-300 rounded-md">
        <h2 className="text-lg font-bold mb-2">Send Test SOL</h2>
        <input
          type="text"
          placeholder="Recipient Wallet Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border p-2 w-full mb-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full mb-2 rounded-md"
        />
        <button
          onClick={sendSol}
          className="bg-blue-600 text-white rounded-xl p-2 w-full"
        >
          Send SOL
        </button>
      </div>
    </div>
  );
};

export default CreateToken;
