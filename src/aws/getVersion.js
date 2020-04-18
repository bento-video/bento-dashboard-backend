import AWS from "aws-sdk";
import "dotenv/config";

AWS.config.update({ region: process.env.REGION });
const JOBS_TABLE = process.env.JOBS_TABLE;
const ddb = new AWS.DynamoDB();

const getVersion = async (versionId) => {
  console.log("In getVersion");

  const getVersionParams = {
    TableName: JOBS_TABLE,
    Key: {
      id: {
        N: versionId,
      },
    },
  };

  console.log(
    `Attempting to retrive version from ${JOBS_TABLE} with id ${versionId}`
  );

  const versionData = await ddb
    .getItem(getVersionParams)
    .promise()
    .then((data) => {
      return {
        id: data.Item.id.N,
        videoId: data.Item.videoId.S,
        versionUrl: data.Item.versionUrl ? data.Item.versionUrl.S : "",
        resolution: data.Item.resolution.S,
        status: data.Item.status.S,
        filename: data.Item.filename.S,
        outputType: data.Item.outputType.S,
      };
    })
    .catch((err) => {
      console.log("Error", err);
    });

  console.log(`Sending back version: ${JSON.stringify(versionData)}`);
  return versionData;
};

export default getVersion;
