import DemoPage from "./payments/page";
import QRpage from "./QRPage/page";
// import {ProfileForm} from "./payments/formschema"
import AnotherComponent from "./payments/Anotherfile";
import Image from 'next/image';
import * as ietko from "@/app/images/ietko.png";
import * as shaorostav from "@/app/images/shaorostav.png";
import Link from "next/link";

export default function Home() {
  return (
    
   <div className=" flex flex-col min-h-screen">
   {/* <!-- Header --> */}
  
   {/* <!-- Main Content --> */}
   <div className="absolute inset-0 bg-[url('./images/hero_image.jpg')] bg-fixed bg-cover bg-center bg-no-repeat">
   
  
   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
   <header>
   <div className="bg-gray-800 flex justify-between items-center p-4">
   <Image src={ietko} alt="IET logo" width={52} height={52} />
   <Link href="/QRPage" 
  className="mt-4 text-white hover:text-gray-300 underline font-semibold transition duration-300 ease-in-out"
  >
          Go to QR Scan
      </Link>
   <Image src={shaorostav} alt="shaorostav logo" width={150} height={60} />
      
   </div>

   </header>
   <DemoPage/>
   <AnotherComponent/>
   </div></div>
   {/* <DemoPage/> */}
  
   {/* <!-- Footer --> */}


   </div>
  );
}
