import { useState } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const CreateToken = () => {
  const wallet = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [launchLater, setLaunchLater] = useState(false);

  const { connection } = useConnection();
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  //const [tokenMint, setTokenMint] = useState<string | null>(null);

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

  /*
  const [formData, setFormData] = useState({
    symbol: "",
    supply: "",
    file: null as File | null,
    launchDate: "",
  });
  */

  /*
  const [transactionDetails, setTransactionDetails] = useState<{
    contractAddress: string;
    symbol: string;
    name: string;
    txHash: string;
  } | null>(null);

  */

  const toggleModal = () => setIsOpen(!isOpen);

  /*
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  */

  return (
    <div>
      <div className="text-xl m-2">Launchpad</div>
      <div className="m-2s">
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white p-3 font-semibold rounded-xl cursor-pointer"
        >
          Create Token
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Video Token</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Token Symbol (Thicker)
              </label>
              <input
                type="text"
                name="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Token Name</label>
              <input
                type="text"
                name="name"
                className="w-full border px-3 py-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Descriptiion</label>
              <input
                type="text"
                name="name"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Initial Supply
              </label>
              <input
                type="number"
                name="supply"
                placeholder="enter amount to mint"
                className="w-full border px-3 py-2 rounded-md"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Token Decimal</label>
              <input
                type="number"
                name="supply"
                placeholder="default value is  9"
                className="w-full border px-3 py-2 rounded-md"
                value={decimals}
                onChange={(e) => setDecimals(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Upload File (Video)
              </label>
              <h2 className="text-red-700  text-xs my-1">
                Note: Video is shortened to 1 minute clip
              </h2>
              <input
                type="file"
                accept="image/*, video/*, .gif"
                name="file"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                id="launchLater"
                className="mr-2"
                checked={launchLater}
                onChange={() => setLaunchLater(!launchLater)}
              />
              <label htmlFor="launchLater" className="text-sm font-medium">
                Launch Later
              </label>
            </div>

            {launchLater && (
              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Launch Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="launchDate"
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                style={{
                  cursor: loading ? "not-allowed" : "Launching ...",
                }}
                onClick={handleCreateToken}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {/*
   {launchLater ? "Schedule Launch" : "Launch Now"}
*/}
                {loading ? "Launching ..." : "Launch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*
{transactionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Token Created Successfully
            </h2>
            <p>
              <strong>Contract Address:</strong>{" "}
              {transactionDetails.contractAddress}
            </p>
            <p>
              <strong>Name:</strong> {transactionDetails.name}
            </p>
            <p>
              <strong>Symbol:</strong> {transactionDetails.symbol}
            </p>
            <p>
              <strong>Transaction Hash:</strong> {transactionDetails.txHash}
            </p>

            <button
              onClick={() => setTransactionDetails(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
*/}
    </div>
  );
};

export default CreateToken;
