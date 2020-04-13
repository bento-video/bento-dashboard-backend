import AWS from "aws-sdk";
import uuidv4 from "uuid/v4";
import "dotenv/config";
import bytes from "bytes";

const fs = require("fs");
const { extname } = require("path");
const dim = require("get-video-dimensions");

const ddb = new AWS.DynamoDB();
const UPLOAD_BUCKET = process.env.START_BUCKET;

const writeVideoToDB = (name, version, size, resW, resH) => {
  /*   const size = bytes(sizeInBytes, { decimalPlaces: 1, unitSeparator: ' ' })
    const extension = extname(name);
    const version = uuid.v4();
    const wh = getResolution(data, extension);
    console.log("wh variable: ", wh); */
  //const res = `${wh[0]}x${wh[1]}`;
  const resolution = `${resW}x${resH}`;

  const params = {
    TableName: "BentoVideos",
    Item: {
      name: { S: name },
      version: { S: version },
      status: { S: "original" },
      size: { S: size },
      resolution: { S: resolution },
      versions: { S: "1" },
    },
  };

  ddb.putItem(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
};

const getResolution = async (params) => {
  const tmpPath = `/tmp/video${params.ext}`;
  fs.writeFileSync(tmpPath, params.data);

  dim(tmpPath, params, (resW, resH, db) => {
    db.writer(db.name, db.version, db.size, resW, resH);
  });

  //console.log("yeay: ", resolution);
};

const initDbWrite = (name, byteSize, data) => {
  const size = bytes(byteSize, { decimalPlaces: 1, unitSeparator: " " });
  const ext = extname(name);
  const version = uuidv4();
  const writer = writeVideoToDB;
  const params = { name, size, data, ext, version, writer }; //dbinfo in dim function, db in callback on line 17
  getResolution(params);
};

const videoUpload = (video, callback) => {
  const { name, data, size } = video;
  const objectParams = { Bucket: UPLOAD_BUCKET, Key: name, Body: data };
  const uploadPromise = new AWS.S3().putObject(objectParams).promise();

  uploadPromise
    .then((data) => {
      console.log(`Successfully uploaded ${name} to ${UPLOAD_BUCKET} bucket`);
    })
    .then(() => {
      // here, after video is uploaded to s3, we will add it to the db.
      // after that completes successfully, we should try to add something like a pop-up,
      // that will notify user that video has completed and they can refresh home to see.
      initDbWrite(name, size, data);
      callback();
    })
    .catch((err) => {
      console.log("failed to upload video to s3");
      console.log("ERROR: ", err);
    });
};

export default videoUpload;
