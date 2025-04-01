import CreateToken from "./CreateToken";
import Navbar from "./Navbar";
//import TokenCreator from "./TokenCreator";
const Home = () => {
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <div className="h-[80px] p-4 flex  items-center bg-gray-200  w-full shadow ">
        <Navbar />
      </div>

      <div className="  p-3 flex-1 flex items-center justify-center">
        <CreateToken />
      </div>
    </div>
  );
};

export default Home;
