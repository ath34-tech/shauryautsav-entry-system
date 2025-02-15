"use client";
import { Payment, columns } from "./columns";
import DataTable  from "./data-table";
// import { formDataArray } from "./formschema";  // Import the data array from another file
import UserForm from "./formschema";
import axios from "axios";
import { useEffect ,useState} from "react";


export default function DemoPage() {
  const [formOpen,setFormOpen]=useState(false);
 
  
  return (
    <div className="container mx-auto py-10">
       {formOpen?
      <UserForm setOpenStatus={setFormOpen} />: 
      <DataTable setOpenStatus={setFormOpen}/>
       } 
    </div>
  );
}
