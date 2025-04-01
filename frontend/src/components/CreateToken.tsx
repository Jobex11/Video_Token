import { useState } from "react";

const CreateToken = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [launchLater, setLaunchLater] = useState(false);

  /*
  const [formData, setFormData] = useState({
    symbol: "",
    supply: "",
    file: null as File | null,
    launchDate: "",
  });
  */

  const [transactionDetails, setTransactionDetails] = useState<{
    contractAddress: string;
    symbol: string;
    name: string;
    txHash: string;
  } | null>(null);

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
              <label className="block text-sm font-medium">Symbol</label>
              <input
                type="text"
                name="symbol"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Token Name</label>
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
                className="w-full border px-3 py-2 rounded-md"
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
              <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
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

export default CreateToken;
