'use strict';

const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const run = () => {
  return new Promise(async (resolve) => {
    console.log('Lambda called');
    console.log('Fetch json with image data from https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY');

    let imageData = {};

    try {
      imageData = await axios.get(
        process.env.SOURCE_IMAGE,
        { responseType: 'arraybuffer' }
      ).then((response) => JSON.parse(Buffer.from(response.data, 'binary').toString()));
    } catch (error) {
      console.error('Error fetching data from unsplash', error);
      return resolve(false);
    }

    if (!imageData.urls || !imageData.urls.small) {
      console.error('Small image url is missing in unsplash json');
      return resolve(false);
    }

    console.log(`Fetch image from ${imageData.urls.small}`);
    
    const imageBase64 = await axios.get(
      imageData.urls.small,
      { responseType: 'arraybuffer' }
    ).then((response) => Buffer.from(response.data, 'binary').toString('base64'));
    console.log('Image successfully fetched');

    const response = {
      statusCode: 200,
      body: imageBase64,
      isBase64Encoded: true
    };

    return resolve(response);
  });
};

module.exports.handler = run;
