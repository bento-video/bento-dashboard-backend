import AWS from "aws-sdk";
import "dotenv/config";

const lambda = new AWS.Lambda({ region: process.env.REGION });
const executor = process.env.EXECUTOR_LAMBDA;

const startVersionJob = async (id, filename, resolution) => {
  console.log(`in startVersionJob`);
  const payload = {
    "body-json": {
      key: filename,
      videoId: id,
      res: resolution,
    },
  };

  console.log("executor payload", JSON.stringify(payload));

  const invokeParams = {
    FunctionName: executor,
    InvocationType: "Event",
    LogType: "None",
    Payload: JSON.stringify(payload),
  };

  await lambda
    .invoke(invokeParams)
    .promise()
    .catch((err) => err);
};

export default startVersionJob;
