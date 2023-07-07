const cloudinary = require("cloudinary")

cloudinary.config(
    {
        cloud_name:"netexpress",
        api_key:"795895564746669",
        api_secret:"QVR99rHhNstqhomScUWVAn5x2dE"
    }
)


const cloudinaryUploadImg = async (fileToUploads) =>{
    return new Promise(
        (resolve) =>{
            cloudinary.uploader.upload(fileToUploads,(result)=>{
                resolve(
                    {
                        "url":result.secure_url
                    },
                    {
                        resource_type:"auto" 
                    }
                )
            })
        }
    )
}

module.exports = cloudinaryUploadImg