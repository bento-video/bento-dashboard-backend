<div align="center">
  <img src="https://i.imgur.com/LL7X6Ro.png?2">
</div>

<h1 align="center">Bento Dashboard Server</h2>

## Deployment

Bento Dashboard Server connects Bento Dashboard with the pipeline deployed to AWS. Bento Dashboard is built in React with an Express backend that can be run locally for individual use, or deployed to Amazon EC2 for organizational use.

To install and deploy the dashboard, first ensure you have installed [Bento's pipeline](https://github.com/bento-video/bento/blob/master/docs/pipeline-deployment-guide.md) - you will require some of the resources from the pipeline installation in the following steps.

The [deployment guide](https://github.com/bento-video/bento/blob/master/docs/dashboard-deployment-guide.md) (steps one through four) includes a walkthrough to containerize the Express app for easy deployment on EC2 or any other cloud computing platform. Steps five onwards details how to deploy React files on EC2.
