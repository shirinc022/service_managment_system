const cloudinary=require('../config/cloudinaryConfig')
const path = require('path');

const uploadSinglefileToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(filePath).toLowerCase();
    const resourceType = fileExtension === '.pdf' ? 'raw' : 'auto'; // Set resource_type to 'raw' for PDFs, 'auto' for others

    cloudinary.uploader.upload(
      filePath,
      {
        folder: "service management system",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
  });
};

// const uploadSinglefileToCloudinary = (filePath)=>{
//     return new Promise((resolve,reject)=>{
//         cloudinary.uploader.upload(
//             filePath,
//             {folder:"service managment system"},
//             (error,result)=>{
//                 if(error){
//                     return reject(error)
//                 }
//                 resolve(result.secure_url)
//             }
//         )

//     })
// }

const uploadToCloudinary = (filePaths) => {
    return Promise.all(
      filePaths.map((filePath) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            filePath,
            { folder: "service management system" },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result.secure_url);
            }
          );
        });
      })
    );
  };


module.exports = {uploadToCloudinary,uploadSinglefileToCloudinary}