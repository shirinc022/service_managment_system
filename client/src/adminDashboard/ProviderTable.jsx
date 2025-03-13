import { useEffect, useState } from "react";
import { FaUserCheck, FaTimesCircle, FaFilePdf } from "react-icons/fa";
import { adminGetProviders, adminRejectProvider, adminVerifyProvider } from "../services/userservices";

export default function ProviderTable() {
  const [providers, setProviders] = useState([]);

  useEffect(()=>{
    adminGetProviders().then((res)=>{
        console.log(res.data);
        setProviders(res.data);
        
    }).catch((err)=>{
        console.log(err);
        
    })

  },[])


  

  const handleVerify = (providerId) => {
    adminVerifyProvider(providerId).then((res)=>{
        console.log(res);
        window.location.reload();
        
    }).catch((err)=>{
        console.log(err);
        
    })
  
  };

  const handleReject = (providerId) => {
    adminRejectProvider(providerId).then((res)=>{
        console.log(res);
        window.location.reload();
        
    }).catch((err)=>{
        console.log(err);
        
    })
}



  return (
    <div className="overflow-x-auto p-4 sm:p-6">
      <div className="bg-base-100 shadow-xl rounded-xl p-4">
        <h2 className="text-xl font-bold text-center text-primary mb-4 flex items-center justify-center gap-2">
          <FaUserCheck className="w-6 h-6" /> Provider Details
        </h2>
        <div className="overflow-x-auto">
          <table className="table w-full border border-base-300 rounded-lg">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Provider Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Verification Document</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider, index) => (
                <tr key={provider._id} className="hover:bg-primary/10 border-b border-base-300 ">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-semibold text-base-content">{provider.name}</td>
                  <td className="p-4 text-sm text-gray-500 break-words max-w-[150px]">{provider.email}</td>
                  <td className="p-4 text-sm text-blue-500 cursor-pointer hover:underline" >
                    <a href={provider.document}  target="_blank" rel="noopener noreferrer"><FaFilePdf className="inline-block w-5 h-5 text-red-500" />Document</a>
                  </td>
                  <td>
                     <button  className={`p-4 font-bold badge  ${provider.verification_status === 'Verified' ? 'badge-success' : provider.verification_status === 'Rejected' ? 'badge-error' : 'badge-warning'}`}>{provider.verification_status}</button>
                  </td>
                  <td className="p-1  gap-2">
                    {provider.verification_status === "Pending" && (
                      <>
                        <button className="btn btn-success btn-sm " onClick={() => handleVerify(provider._id)}>Verify</button>
                        <button className="btn btn-error btn-sm" onClick={() => handleReject(provider._id)}>Reject</button>
                      </>
                    )}
                    {provider.verification_status !== "Pending" && (
                      <button className="btn btn-outline btn-error btn-sm" onClick={() => setProviders(providers.filter(p => p._id !== provider._id))}>
                        <FaTimesCircle className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Verification Document</h3>
            <iframe src={selectedDocument} className="w-full h-96"></iframe>
            <button className="btn btn-error mt-4 w-full sm:w-auto" onClick={() => setSelectedDocument(null)}>Close</button>
          </div>
        </div>
      )} */}
    </div>
  );
}
