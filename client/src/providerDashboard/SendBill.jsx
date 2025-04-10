import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  providerBillGeneration,
  providerBillsent,
} from "../services/userservices";
import { toast } from "react-toastify";

export default function SendBill() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [bill, setBill] = useState({
    basicAmount: order?.price || "",
    materialCost: "",
    extraCharges: "",
    description: "",
    totalPrice: 0,
  });

  const handleBillChange = (e) => {
    const { name, value } = e.target;
    const updatedBill = { ...bill, [name]: value };
    updatedBill.totalPrice =
      Number(updatedBill.basicAmount) +
      Number(updatedBill.materialCost) +
      Number(updatedBill.extraCharges);
    setBill(updatedBill);
  };

  const handleSubmitBill = () => {
    providerBillGeneration(order._id, bill)
      .then(() => {
        toast.success("Bill sent successfully");

        providerBillsent(order._id)
          .then(() => {
            navigate(-1); // Redirect back to the previous page
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4">Send Bill</h3>
      <div className="space-y-3">
        <input
          type="number"
          name="basicAmount"
          placeholder="Basic Amount"
          className="input input-bordered w-full"
          value={bill.basicAmount}
          onChange={handleBillChange}
        />
        <input
          type="number"
          name="materialCost"
          placeholder="Material Cost"
          className="input input-bordered w-full"
          value={bill.materialCost}
          onChange={handleBillChange}
        />
        <input
          type="number"
          name="extraCharges"
          placeholder="Other Extra Charges"
          className="input input-bordered w-full"
          value={bill.extraCharges}
          onChange={handleBillChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          value={bill.description}
          onChange={handleBillChange}
        ></textarea>
        <div className="text-xl font-bold text-center">
          Total: ₹ {bill.totalPrice}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={() => navigate(-1)} className="btn btn-outline">
          Cancel
        </button>
        <button onClick={handleSubmitBill} className="btn btn-primary">
          Submit Bill
        </button>
      </div>
    </div>
  );
}
