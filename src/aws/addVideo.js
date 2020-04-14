import AWS from "aws-sdk";
import "dotenv/config";

AWS.config.update({ region: process.env.REGION });
const lambda = new AWS.Lambda({
  region: process.env.REGION,
});

const recordUpload = process.env.RECORD_UPLOAD_LAMBDA;

const addVideo = async (id, filename) => {
  console.log(`In addVideo with id: ${id} filename: ${filename}`);

  const payload = { id, filename };
  const invokeParams = {
    FunctionName: recordUpload,
    InvocationType: "RequestResponse",
    LogType: "None",
    Payload: JSON.stringify(payload),
  };

  console.log(`invoking lambda with params ${JSON.stringify(invokeParams)}`);

  const response = await lambda
    .invoke(invokeParams)
    .promise()
    .catch((err) => err);

  return response.Payload ? JSON.parse(response.Payload) : { error: err };
};

export default addVideo;
