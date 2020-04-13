import AWS from "aws-sdk";
import "dotenv/config";

AWS.config.update({ region: process.env.REGION });
const VIDEOS_TABLE = process.env.VIDEOS_TABLE;
const ddb = new AWS.DynamoDB();

const getVideo = async (id) => {
  const params = {
    TableName: VIDEOS_TABLE,
    Key: {
      id: {
        S: id,
      },
    },
  };

  console.log(`Attempting to retrive video from ${VIDEOS_TABLE} with id ${id}`);

  return await ddb
    .getItem(params)
    .promise()
    .then((data) => {
      return {
        id: data.Item.id.S,
        filename: data.Item.filename.S,
        format: data.Item.format.S,
        size: data.Item.size.S,
        resolution: data.Item.resolution.S,
        versions: data.Item.versions.N,
      };
    })
    .catch((err) => {
      console.log("Error", err);
    });
};

export default getVideo;
