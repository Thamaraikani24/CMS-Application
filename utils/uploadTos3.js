const {
    PutObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const s3 = require("../config/s3Config");

// Upload Image to AWS S3
const uploadToS3 = async (file, folder) => {

    const key = `${folder}/${Date.now()}-${file.originalname}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        })
    );

    return key;
};

// Delete Image from AWS S3
const deleteFromS3 = async (key) => {

    await s3.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        })
    );

};

module.exports = {
    uploadToS3,
    deleteFromS3,
};