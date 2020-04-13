import AWS from "aws-sdk";
import "dotenv/config";
import uuidv4 from "uuid/v4";
const path = require("path");

const s3 = new AWS.S3();
const START_BUCKET = process.env.START_BUCKET;

AWS.config.update({ region: "us-east-1" });

const contentType = (filename) => {
  let contentType;
  switch (path.extname(filename)) {
    case ".mkv":
      contentType = "video/x-matroska";
      break;
    case ".mp4":
      contentType = "video/mp4";
      break;
    case ".mov":
      contentType = "video/quicktime";
      break;
    default:
      contentType = "video/mp4";
  }
  return contentType;
};

const getParams = (filename, key) => {
  return {
    Bucket: START_BUCKET,
    Key: key,
    ContentType: contentType(filename),
    Expires: 3600,
  };
};

const generateUploadParams = (filename) => {
  console.log("In generateUploadParams...");
  // validate filename to ensure valid extension
  const newVideoId = uuidv4();
  const key = `${newVideoId}/${filename}`;
  const params = getParams(filename, key);

  console.log(`newVideoId: ${newVideoId}`);
  console.log(`key: ${key}`);
  console.log(`params: ${params}`);

  const uploadUrl = s3.getSignedUrl("putObject", params);

  console.log(uploadUrl);

  return {
    url: uploadUrl,
    videoId: newVideoId,
    key: key,
  };
};

export default generateUploadParams;
