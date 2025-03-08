const cloudinary=require('../config/cloudinaryConfig')

const uploadSinglefileToCloudinary = (filePath)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload(
            filePath,
            {folder:"service managment system"},
            (error,result)=>{
                if(error){
                    return reject(error)
                }
                resolve(result.secure_url)
            }
        )

    })
}

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