# Get Random Image

The `Get Random Image` project is an AWS serverless application that fetches random images using [Unsplash random image API](https://unsplash.com/documentation#get-a-random-photo) and returns a `base64` string instead of a JSON response object.

## Install

Clone the project to your host machine.

```
> git clone git@github.com:alenakhineika/get-random-image.git .
```

You can create lambda functions directly on the AWS console but if your function depends on external modules, you should precompile code together with dependencies and upload it as a zip file to AWS Lambda.

```
> npm i
> zip -r code.zip node_modules/ index.js package.json
```

## Run locally

In the project root directory create the `.env` file from the `.env.example` file and set all required values:

- UNSPLASH_ACCESS_KEY - You can find [YOUR_ACCESS_KEY](https://unsplash.com/documentation#authorization) in user settings.
- NODE_ENV - Use `development` or nothing for the local setup and use `production` for AWS Labmbda.

Call the lambda handler.

```
> node -e 'require("./index.js").handler()'
```

## Run with AWS Lambda

AWS will call `handler` automatically after you configure the lambda function:
- Create a lambda function.
- Add environment variables to the `Environment variables` Lambda Configuration section.
- Upload `code.zip` directly to the lambda function or to Amazon S3 if a zip file size is bigger than 10 MB. Note, that the total unzipped size of the function and all layers can't exceed the unzipped deployment package size limit of 250 MB.
- Change the amount of time that Lambda allows a function to run before stopping it. The default is 3 seconds, make it 20 seconds to make sure there is enough time to create a canvas and write to a database.
- Configure Amazon API Gateway.
