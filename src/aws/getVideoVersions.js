import AWS from "aws-sdk";
import "dotenv/config";

AWS.config.update({ region: process.env.REGION });
const VIDEOS_TABLE = process.env.VIDEOS_TABLE;
const JOBS_TABLE = process.env.JOBS_TABLE;
const JOBS_INDEX = process.env.JOBS_INDEX;
const ddb = new AWS.DynamoDB();

const getVideoVersions = async (id) => {
  console.log("In getVideoVersions");

  const getVideoParams = {
    TableName: VIDEOS_TABLE,
    Key: {
      id: {
        S: id,
      },
    },
  };

  const getVersionsParams = {
    TableName: JOBS_TABLE,
    IndexName: JOBS_INDEX,
    KeyConditionExpression: "videoId = :vid",
    ExpressionAttributeValues: {
      ":vid": {
        S: id,
      },
    },
  };

  console.log(`Attempting to retrive video from ${VIDEOS_TABLE} with id ${id}`);

  const videoData = await ddb
    .getItem(getVideoParams)
    .promise()
    .then((data) => {
      return {
        id: data.Item.id.S,
        filename: data.Item.filename.S,
        format: data.Item.format.S,
        size: data.Item.size.N,
        resolution: data.Item.resolution.S,
      };
    })
    .catch((err) => {
      console.log("Error", err);
    });

  console.log("from videos table:", videoData);

  const versionData = await ddb
    .query(getVersionsParams)
    .promise()
    .then((data) => {
      console.log("from jobs table:", data.Items);
      return data.Items.map((item) => {
        return {
          id: item.id.N,
          videoId: item.videoId.S,
          versionUrl: item.versionUrl.S,
          resolution: item.resolution.S,
          status: item.status.S,
        };
      });
    })
    .catch((err) => console.log(err));

  videoData.versions = versionData;
  return videoData;
};

export default getVideoVersions;
