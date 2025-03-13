import { useEffect, useState } from "react";
import { adminGetCustomers } from "../services/userservices";

export default function CustomerTable() {
    const [customers,setCustomers]=useState([])

    useEffect(()=>{
        
            adminGetCustomers().then((res)=>{
                console.log(res.data);
                setCustomers(res.data)
                
            }).catch((err)=>{
                console.log(err);
                
            })
        

},[])


    // const customers = [
    //   { id: 1, name: "John Doe", email: "john@example.com" },
    //   { id: 2, name: "Jane Smith", email: "jane@example.com" },
    //   { id: 3, name: "Alice Johnson", email: "alice@example.com" },
    // ];
  
    return (
      <div className="overflow-x-auto p-6">
        <div className="bg-base-100 shadow-xl rounded-xl p-4">
          <h2 className="text-xl font-bold text-center text-primary mb-4">Customer Details</h2>
          <table className="table w-full border border-base-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Customer Name</th>
                <th className="p-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer._id} className="hover:bg-primary/10 border-b border-base-300">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-semibold text-base-content">{customer.name}</td>
                  <td className="p-4 text-sm text-gray-500">{customer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  