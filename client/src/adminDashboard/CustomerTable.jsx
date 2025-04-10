import { useEffect, useState } from "react";
import {
  adminGetCustomers,
  adminDeleteCustomer,
} from "../services/userservices";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    adminGetCustomers()
      .then((res) => {
        console.log(res.data);
        setCustomers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (customerId) => {
    adminDeleteCustomer(customerId)
      .then((res) => {
        console.log(res.data.message);
        toast.success(res.data.message);

        setCustomers(
          customers.filter((customer) => customer._id !== customerId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="overflow-x-auto p-6">
      <div className="bg-base-100 shadow-xl rounded-xl p-4 min-w-max">
        <h2 className="text-xl font-bold text-center text-primary mb-4">
          Customer Details
        </h2>
        <table className="table w-full border border-base-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Customer Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={customer._id}
                className="hover:bg-primary/10 border-b border-base-300"
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-semibold text-base-content">
                  {customer.name}
                </td>
                <td className="p-4 text-sm text-gray-500">{customer.email}</td>
                <td className="p-4">
                  <button
                    className="btn btn-error btn-sm flex items-center gap-2"
                    onClick={() => handleDelete(customer._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
