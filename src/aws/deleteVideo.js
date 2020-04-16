import AWS from "aws-sdk";
import "dotenv/config";
import deleteVersion from "./deleteVersion";

AWS.config.update({ region: process.env.REGION });
const VIDEOS_TABLE = process.env.VIDEOS_TABLE;
const JOBS_TABLE = process.env.JOBS_TABLE;
const JOBS_INDEX = process.env.JOBS_INDEX;
const START_BUCKET = process.env.START_BUCKET;

const ddb = new AWS.DynamoDB();
const s3 = new AWS.S3();

const deleteVideo = async (videoId) => {
  //   a. get list of jobIds, and filename from Jobs with videoId = id
  // b. for each jobId, deleteVersion
  // c. delete video from start bucket where key = job.filename
  // d. delete record from videos table where id = videoId

  const getJobsParams = {
    TableName: JOBS_TABLE,
    IndexName: JOBS_INDEX,
    KeyConditionExpression: "videoId = :vid",
    ExpressionAttributeValues: {
      ":vid": {
        S: videoId,
      },
    },
  };

  const deleteVideoParams = {
    TableName: VIDEOS_TABLE,
    Key: {
      id: {
        S: videoId,
      },
    },
    ReturnValues: "ALL_OLD",
  };

  console.log("Getting versions with params:", getJobsParams);

  const versions = await ddb
    .query(getJobsParams)
    .promise()
    .then((data) => {
      console.log("from jobs table:", data.Items);
      return data.Items.map((item) => {
        return {
          jobId: item.id.N,
          filename: item.filename.S,
        };
      });
    })
    .catch((err) => console.log(err));

  for (const version of versions) {
    await deleteVersion(version.jobId)
      .then((_) => console.log("Deleted version", version.jobId))
      .catch((err) => console.log(err));
  }

  const videoData = await ddb
    .deleteItem(deleteVideoParams)
    .promise()
    .then((data) => {
      console.log("Video record deleted, received", JSON.stringify(data));
      return {
        filename: data.Attributes.filename.S,
      };
    });

  const deleteObjParams = {
    Bucket: START_BUCKET,
    Key: videoData.filename,
  };

  await s3
    .deleteObject(deleteObjParams)
    .promise()
    .then((res) =>
      console.log(`Deleted from bucket ${JSON.stringify(deleteObjParams)}`)
    )
    .catch((err) => console.log(err));
};

export default deleteVideo;
