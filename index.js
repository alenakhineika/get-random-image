'use strict';

const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const SOURCE_ENDPOINT = 'https://api.unsplash.com/photos/random?client_id=';
const SOURCE_URL = `${SOURCE_ENDPOINT}${process.env.UNSPLASH_ACCESS_KEY}`;

const run = () => {
  return new Promise(async (resolve, reject) => {
    console.log('Lambda called');

    let imageData = {};
    console.log(`Fetch image json from ${SOURCE_ENDPOINT}UNSPLASH_ACCESS_KEY`);

    try {
      imageData = await axios
        .get(SOURCE_URL, { responseType: 'arraybuffer' })
        .then((response) => JSON.parse(Buffer.from(response.data, 'binary').toString()));
      console.log('Image json successfully fetched');
    } catch (error) {
      console.error('Error fetching image json', error);
      return reject(error);
    }

    if (!imageData.urls || !imageData.urls.small) {
      const error = 'Small image url is missing in unsplash json';
      console.error(error);
      return reject(new Error(error));
    }

    let imageBase64 = '';
    console.log(`Fetch a small image from ${imageData.urls.small}`);

    try {
      imageBase64 = await axios
        .get(imageData.urls.small, { responseType: 'arraybuffer' })
        .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
      console.log('A small image successfully fetched');
    } catch (error) {
      console.error('Error fetching a small image', error);
      return reject(error);
    }

    const response = {
      statusCode: 200,
      body: imageBase64,
      isBase64Encoded: true
    };
    console.log(`Response: ${JSON.stringify(response, null, 2)}`);

    return resolve(response);
  });
};

module.exports.handler = run;
