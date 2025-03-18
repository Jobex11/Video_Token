import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TokenCreator from "./TokenCreator";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-red-50 h-[100vh]">
      <div className="text-2xl m-4 font-semibold">Video-Token</div>
      <div>
        <div>
          <WalletMultiButton />
        </div>
        <div>
          <TokenCreator />
        </div>
      </div>
    </div>
  );
};

export default Home;
