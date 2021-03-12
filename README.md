# Get Random Image

The `Get Random Image` project is an AWS serverless application that fetches a random image using [Unsplash random image API](https://unsplash.com/documentation#get-a-random-photo) and returns a binary representation of the image instead of a JSON object.

[Here](https://alena-khineika.medium.com/serve-images-with-aws-lambda-ffd01abae845) you can learn from my experience on how to configure a Lambda function that returns a jpeg image accessible via static URL provided by Amazon API Gateway.

## Install

Clone the project to your host machine.

```
> git clone git@github.com:alenakhineika/get-random-image.git .
```

You can write Lambda functions directly in the AWS code editor but if your function depends on external modules or going to significantly grow in size, you should precompile code together with dependencies on your local machine and upload it as a `.zip` file to AWS Lambda.

```
> npm i
> zip -r code.zip node_modules/ index.js package.json
```

## Run locally

In the project root directory create the `.env` file from the `.env.example` file and set all required environment variables:

- UNSPLASH_ACCESS_KEY - You can find [YOUR_ACCESS_KEY](https://unsplash.com/documentation#authorization) in the unsplash account settings.
- NODE_ENV - Use `development` or nothing on your local machine and use `production` on AWS.

Call the Lambda handler:

```
> node -e 'require("./index.js").handler()'
```

## Run with AWS Lambda

You have to complete the following stages in order to serve images with Lambda:
- Create a new Lambda function.
- Write the Lambda handler in the virtual editor or on your local machine and deploy code to AWS.
- Add environment variables to the Lambda configuration settings.
- Change the amount of time that Lambda allows a function to run before stopping it. The default is 3 seconds, make it 20 seconds to give the function enough time to download the image and format the response.
- Create Amazon REST API Gateway.
- Add a new resource and the GET method to API.
- Bind the method to the Lambda function.
- Change the method response to `'image/jpeg'`.
- Add `*/*` binary media types to your API settings.
- Use AWS Shell to set the `'contentHandling'` property of the `'IntegrationResponse'` resource to `'CONVERT_TO_BINARY'`.
- Deploy REST API.
