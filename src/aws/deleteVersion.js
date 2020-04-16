import AWS from "aws-sdk";
import "dotenv/config";

AWS.config.update({ region: process.env.REGION });
const VIDEOS_TABLE = process.env.VIDEOS_TABLE;
const JOBS_TABLE = process.env.JOBS_TABLE;
const END_BUCKET = process.env.END_BUCKET;

const ddb = new AWS.DynamoDB();
const s3 = new AWS.S3();

const deleteVersion = async (versionId) => {
  console.log("in deleteVersion");

  const deleteJobParams = {
    TableName: JOBS_TABLE,
    Key: {
      id: {
        N: versionId,
      },
    },
  };

  const getJobParams = {
    ...deleteJobParams,
    ProjectionExpression: "videoId, outputKey",
  };

  console.log(`getJobParams: ${JSON.stringify(getJobParams)}`);

  const jobData = await ddb
    .getItem(getJobParams)
    .promise()
    .then((data) => {
      console.log("From Jobs table:", JSON.stringify(data));
      return {
        videoId: data.Item.videoId.S,
        outputKey: data.Item.outputKey.S,
      };
    })
    .catch((err) => console.log(err));

  console.log("Received:", jobData);

  const deleteObjParams = {
    Bucket: END_BUCKET,
    Key: jobData.outputKey,
  };

  await s3
    .deleteObject(deleteObjParams)
    .promise()
    .then((res) => console.log(`${jobData.outputKey} deleted from end bucket`))
    .catch((err) => console.log(err));

  await ddb
    .deleteItem(deleteJobParams)
    .promise()
    .catch((err) => console.log(err));

  const updateParams = {
    Key: {
      id: {
        S: jobData.videoId,
      },
    },
    TableName: VIDEOS_TABLE,
    UpdateExpression: "SET versions = versions - :val",
    ExpressionAttributeValues: {
      ":val": {
        N: "1",
      },
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log(
    `Attempting to decrement version counter for video ${jobData.videoId}`
  );

  await ddb.updateItem(updateParams).promise();
};

export default deleteVersion;
