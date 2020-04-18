import AWS from "aws-sdk";
import "dotenv/config";
import hexoid from "hexoid";

const toID = hexoid();
const path = require("path");

AWS.config.update({ region: process.env.REGION });

const s3 = new AWS.S3({ signatureVersion: "v4" });
const START_BUCKET = process.env.START_BUCKET;

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

const getParams = (filename) => {
  return {
    Bucket: START_BUCKET,
    Expires: 3600, //time to expire in seconds

    Fields: {
      key: filename,
    },
    conditions: [
      { acl: "private" },
      { success_action_status: "201" },
      ["starts-with", "$key", ""],
      ["content-length-range", 0, 3221225472],
      { "x-amz-algorithm": "AWS4-HMAC-SHA256" },
    ],
  };
};

const generateUploadParams = (filename) => {
  console.log("In generateUploadParams...");
  // validate filename to ensure valid extension
  const videoId = toID(6);

  const params = getParams(filename);

  console.log(`videoId: ${videoId}`);
  console.log(`key: ${filename}`);
  console.log(`params: ${params}`);

  const postData = s3.createPresignedPost(params);
  postData.videoId = videoId;
  console.log(postData);

  return postData;
};

export default generateUploadParams;
