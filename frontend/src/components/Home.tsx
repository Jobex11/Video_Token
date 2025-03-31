import CreateToken from "./CreateToken";
import Navbar from "./Navbar";
//import TokenCreator from "./TokenCreator";
const Home = () => {
  return (
    <div className="w-full h-[100vh]">
      <div>
        <div className="h-[80px] p-3 flex flex-col items-center bg-gray-50 w-full shadow ">
          <Navbar />
        </div>

        <div className="border p-3">
          <CreateToken />
        </div>
      </div>
    </div>
  );
};

export default Home;
