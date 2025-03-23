import React from 'react'

function PaymentFailed() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 text-base-content">
    <div className="bg-base-100 shadow-lg rounded-xl p-8 text-center w-96">
      <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
      <h2 className="text-2xl font-bold">Payment Failed!</h2>
      <p className="text-lg mt-2">Oops! Something went wrong.</p>
      <p className="text-sm text-gray-500 mt-1">Please try again or contact support.</p>

      <button
        
        className="btn btn-error mt-4 w-full"
      >
        Try Again
      </button>
    </div>
  </div>
  )
}

export default PaymentFailed
