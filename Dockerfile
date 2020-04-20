#pull official base image
FROM node:13.12.0-alpine

#set working directory, tells Docker the folder that it should be performing the following commands in
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV PORT 3001
ENV VIDEOS_TABLE BentoVideos
ENV JOBS_TABLE BentoJobs
ENV JOBS_INDEX VideoId
ENV START_BUCKET 
ENV END_BUCKET 
ENV RECORD_UPLOAD_LAMBDA 
ENV EXECUTOR_LAMBDA 
ENV REGION us-east-1
ENV AWS_ACCESS_KEY_ID 
ENV AWS_SECRET_ACCESS_KEY 

#install app dependencies (package.json & package.lock)
COPY package*.json /usr/src/app/
# COPY package.json /usr/src/app/package.json
RUN npm install

#add app
COPY . ./

# Run the specified command within the container.
CMD [ "npm", "start" ]

#(Tells Docker to open port 3001 on the container when it is running)
EXPOSE 3001