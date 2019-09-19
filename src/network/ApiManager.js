// src/network/ApiManager.js

var request = require('request');
var OAuth = require('oauth');

const ApiManager = {
    getYahooWeather: (lat, lon, callback) => {
        var header = {
            "X-Yahoo-App-Id": "axGk0w3c"
        };

        var request = new OAuth.OAuth(
            null,
            null,
            'dj0yJmk9bWZHeGEyUVFTU2lsJmQ9WVdrOVlYaEhhekIzTTJNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWZm',
            '297a45dc89537f99787c92723a8bd17b6f4a186c',
            '1.0',
            null,
            'HMAC-SHA1',
            null,
            header
        );

        request.get(
            `https://weather-ydn-yql.media.yahoo.com/forecastrss?lat=${lat}&lon=${lon}&format=json&u=c`,
            null,
            null,
            function (error, response, body) {
                if (error) {
                    console.log(error);
                    return
                }

                callback(response.statusCode, JSON.parse(response));
            }
        );
    },
}

export default ApiManager;
