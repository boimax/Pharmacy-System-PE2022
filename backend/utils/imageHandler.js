const { S3,UpdateObjectCommand } =require("@aws-sdk/client-s3");
const config = require("../config")
const { PutObjectCommand,DeleteObjectCommand,GetObjectCommand } = require("@aws-sdk/client-s3");
// const {} = require("@aws-sdk/client-s3");

var domain = config.s3Endpoint;
var bucket_name = config.s3BucketName;
const s3Client = new S3({
    endpoint: `https://${domain}`,
    region: "us-east-1",
    credentials: {
      accessKeyId: config.s3Key,
      secretAccessKey: config.s3Secret
    }
});
// Specifies a path within your Space and the file to upload.

const uploadImage = async (imageData,imageName) => {
  bucketParams = {
    Bucket: bucket_name,
    Key: imageName,
    Body: imageData,
    ContentType:'image/jpeg',
    ACL: 'public-read'
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log(
      "Successfully uploaded object: " +
        bucketParams.Bucket +
        "/" +
        bucketParams.Key
    );
    return data.$metadata.httpStatusCode;
  } catch (err) {
    console.log("Error", err);
  }
};

const getImage = async (imageName) => {
  bucketParams = {
    Bucket: bucket_name,
    Key: imageName,
    ContentType:'image/jpeg',
  };

  try {
    // s3Client.getObject(bucketParams).creat
    const response = await s3Client.send(new GetObjectCommand(bucketParams));
    console.log(
      "Successfully get object: " +
        bucketParams.Bucket +
        "/" +
        bucketParams.Key
    );
    const data = response.Body.read();
    // console.log(data)
    // fileStream.on("data",(chunk)=>{console.log(chunk)});
    // fileStream.
    return {"status":response.$metadata.httpStatusCode,"content":data};
  } catch (err) {
    console.log("Error", err);
  }
};

const deleteImage = async (imageName) => {
  bucketParams = {
    Bucket: bucket_name,
    Key: imageName,
    ContentType:'image/jpeg',
  };

  try {
    const response = await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log(
      "Successfully delete object: " +
        bucketParams.Bucket +
        "/" +
        bucketParams.Key
    );
    // console.log(response);
    return response.$metadata.httpStatusCode;
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = {s3Client,uploadImage,deleteImage,getImage}
// Uploads the specified file to the chosen path.
