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
      const videos = data.Items.map((item) => {
        return {
          id: item.id.S,
          filename: item.filename.S,
          format: item.format.S,
          size: item.size.N,
          resolution: item.resolution.S,
          versions: item.versions.N,
          duration: item.duration.N,
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
