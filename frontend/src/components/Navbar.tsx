import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
const Navbar = () => {
  return (
    <div className="flex justify-between w-full">
      <div>
        <WalletMultiButton />
      </div>
      <div className="text-2xl font-semibold text-amber-700">VideoToken</div>
    </div>
  );
};

export default Navbar;
