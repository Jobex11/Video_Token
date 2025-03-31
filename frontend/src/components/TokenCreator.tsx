import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const TokenCreator = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [launchLater, setLaunchLater] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    supply: "",
    launchDate: "",
  });
  const [transactionDetails, setTransactionDetails] = useState<{
    contractAddress: string;
    symbol: string;
    name: string;
    txHash: string;
  } | null>(null);

  const toggleModal = () => setIsOpen(!isOpen);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createToken = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("11111111111111111111111111111111"), // Dummy Address
          lamports: 1000,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      const fakeContractAddress = "FakeTokenAddress123";

      setTransactionDetails({
        contractAddress: fakeContractAddress,
        symbol: formData.symbol,
        name: formData.name,
        txHash: signature,
      });

      toggleModal();
    } catch (error) {
      console.error("Transaction Failed:", error);
      alert("Transaction failed! Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Create Video Token
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Video Token</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium">Symbol</label>
              <input
                type="text"
                name="symbol"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Token Name</label>
              <input
                type="text"
                name="name"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Initial Supply
              </label>
              <input
                type="number"
                name="supply"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
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
                  onChange={handleChange}
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
                onClick={createToken}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {launchLater ? "Schedule Launch" : "Launch Now"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default TokenCreator;

/*

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const connection = new Connection(clusterApiUrl("devnet"));

const TokenCreator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [launchLater, setLaunchLater] = useState(false);

  const { publicKey, sendTransaction, connected } = useWallet();

  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    supply: "",
    file: null as File | null,
    launchDate: "",
  });

  const [transactionDetails, setTransactionDetails] = useState<{
    contractAddress: string;
    symbol: string;
    name: string;
    txHash: string;
  } | null>(null);

  const toggleModal = () => setIsOpen(!isOpen);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const createToken = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("11111111111111111111111111111111"),
          lamports: 1000,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      const fakeContractAddress = "FakeTokenAddress123";

      setTransactionDetails({
        contractAddress: fakeContractAddress,
        symbol: formData.symbol,
        name: formData.name,
        txHash: signature,
      });

      toggleModal();
    } catch (error) {
      console.error("Transaction Failed:", error);
      alert("Transaction failed! Check console for details.");
    }
  };

  return (
    <div>
      <div className="text-xl">
        Hey Welcome to DevMode! Create a token at ease
      </div>
      <div className="my-2 cursor-pointers">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
          onClick={toggleModal}
        >
          Create Token
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Video Token</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium">Symbol</label>
              <input
                type="text"
                name="symbol"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Token Name</label>
              <input
                type="text"
                name="name"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Initial Supply
              </label>
              <input
                type="number"
                name="supply"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Upload File (GIF, Image, Video)
              </label>
              <input
                type="file"
                accept="image/*, video/*, .gif"
                name="file"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
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
                  onChange={handleChange}
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
                onClick={createToken}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {launchLater ? "Schedule Launch" : "Launch Now"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default TokenCreator;

*/

/*

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

const SOLANA_RPC_URL = "https://api.devnet.solana.com"; 
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

const TokenCreator = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [launchLater, setLaunchLater] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    supply: "",
    launchDate: "",
  });
  const [transactionDetails, setTransactionDetails] = useState<{
    contractAddress: string;
    symbol: string;
    name: string;
    txHash: string;
  } | null>(null);

  const toggleModal = () => setIsOpen(!isOpen);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createToken = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("11111111111111111111111111111111"), // Dummy Address
          lamports: 1000, })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      const fakeContractAddress = "FakeTokenAddress123";

      setTransactionDetails({
        contractAddress: fakeContractAddress,
        symbol: formData.symbol,
        name: formData.name,
        txHash: signature,
      });

      toggleModal();
    } catch (error) {
      console.error("Transaction Failed:", error);
      alert("Transaction failed! Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Create Video Token
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Video Token</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium">Symbol</label>
              <input
                type="text"
                name="symbol"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Token Name</label>
              <input
                type="text"
                name="name"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Initial Supply
              </label>
              <input
                type="number"
                name="supply"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
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
                  onChange={handleChange}
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
                onClick={createToken}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {launchLater ? "Schedule Launch" : "Launch Now"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default TokenCreator;

*/

/*

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const SOLANA_RPC_URL = "https://api.devnet.solana.com";
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

const TokenCreator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [launchLater, setLaunchLater] = useState(false);

  const { publicKey, sendTransaction, connected } = useWallet();

  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    supply: "",
    file: null as File | null,
    launchDate: "",
  });

  const [transactionDetails, setTransactionDetails] = useState<{
    contractAddress: string;
    symbol: string;
    name: string;
    txHash: string;
  } | null>(null);

  const toggleModal = () => setIsOpen(!isOpen);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const createToken = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("11111111111111111111111111111111"), // Dummy Address
          lamports: 1000,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      const fakeContractAddress = "FakeTokenAddress123";

      setTransactionDetails({
        contractAddress: fakeContractAddress,
        symbol: formData.symbol,
        name: formData.name,
        txHash: signature,
      });

      toggleModal();
    } catch (error) {
      console.error("Transaction Failed:", error);
      alert("Transaction failed! Check console for details.");
    }
  };

  return (
    <div>
      <div className="text-xl">
        Hey Welcome to DevMode! Create a token at ease
      </div>
      <div className="my-2 cursor-pointers">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
          onClick={toggleModal}
        >
          Create Token
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Video Token</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium">Symbol</label>
              <input
                type="text"
                name="symbol"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Token Name</label>
              <input
                type="text"
                name="name"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Initial Supply
              </label>
              <input
                type="number"
                name="supply"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">
                Upload File (GIF, Image, Video)
              </label>
              <input
                type="file"
                accept="image/*, video/*, .gif"
                name="file"
                className="w-full border px-3 py-2 rounded-md"
                onChange={handleChange}
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
                  onChange={handleChange}
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
                onClick={createToken}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {launchLater ? "Schedule Launch" : "Launch Now"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default TokenCreator;

*/
