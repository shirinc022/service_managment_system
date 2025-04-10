import React, { useEffect, useState } from "react";
import { getBill, makePaymentOnStripe } from "../services/userservices";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHED_KEY_STRIPE);

function BillConfirmationPage() {
  const { orderId } = useParams();
  console.log(orderId);

  const [billDetails, setBillDetails] = useState({
    basicAmount: 0,
    materialCost: 0,
    extraCharges: 0,
    description: "",
    totalPrice: 0,
  });
  useEffect(() => {
    getBill(orderId)
      .then((res) => {
        console.log(res.data.bill);
        setBillDetails(res.data.bill);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const makePayment = async () => {
    const body = {
      orderId,
      billId: billDetails._id,
      amount: billDetails.totalPrice,
    };
    const response = await makePaymentOnStripe(body);
    console.log(response.data.sessionId, "stripe");

    const session = response.data.sessionId;
    const stripe = await stripePromise;

    if (stripe) {
      const result = await stripe.redirectToCheckout({
        sessionId: session,
      });

      if (result.error) {
        console.log(result.error);
      }
    } else {
      console.log("stripe failed to load");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 dark:bg-base-800 flex items-center justify-center">
      <div className="bg-white dark:bg-base-900 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-primary mb-4">
          Payment Confirmation
        </h2>

        {/* Bill Details Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-primary mb-3">
            Bill Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Basic Amount</span>
              <span>₹ {billDetails.basicAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Material Cost</span>
              <span>₹ {billDetails.materialCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Extra Charges</span>
              <span>₹ {billDetails.extraCharges}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Description</span>
              <span>{billDetails.description}</span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-green-500">
              <span>Total Price</span>
              <span>₹ {billDetails.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Status and Confirmation */}
        <div className="text-lg text-center mb-6">
          <p>Your total payment amount is:</p>
          <div className="text-xl font-semibold text-green-500">
            ₹ {billDetails.totalPrice}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button className="btn btn-primary" onClick={makePayment}>
            {" "}
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillConfirmationPage;
