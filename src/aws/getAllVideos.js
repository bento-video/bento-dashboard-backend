import AWS from "aws-sdk";
import "dotenv/config";

AWS.config.update({ region: process.env.REGION });
const VIDEOS_TABLE = process.env.VIDEOS_TABLE;
const ddb = new AWS.DynamoDB();

const getAllVideos = async () => {
  const params = {
    TableName: VIDEOS_TABLE,
  };

  console.log(`Attempting to scan ${VIDEOS_TABLE} table for records`);

  return await ddb
    .scan(params)
    .promise()
    .then((data) => {
      console.log(data.Items);
      const videos = data.Items.map((e) => {
        return {
          id: e.id.S,
          filename: e.filename.S,
          format: e.format.S,
          size: e.size.S,
          resolution: e.resolution.S,
          versions: e.versions.N,
        };
      });
      console.log("Received from Videos: ", videos);
      return videos;
    })
    .catch((err) => {
      console.log("Error", err);
    });
};

export default getAllVideos;
