const redis = require('redis');
const { getRedisHost, getRedisPort } = require('../ZCRMRestClient');

const client = redis.createClient(getRedisPort(), getRedisHost());

client.on('connect', () => {
  console.log('Redis is Connected');
});
client.on('error', err => {
  console.log('Redis Has Error ' + err);
  throw new Error(err);
});

// tslint:disable
const mysql_util = {};
const token = 'oauthtokens';

mysql_util.deleteOAuthTokens = () => {
  return new Promise((resolve, reject) => {
    client.del(token, (err, response) => {
      if (err) {
        throw new Error(err);
      }

      console.log('deleteOAuthTokens response: ', response);
      resolve(response);
    });
  });
};

mysql_util.saveOAuthTokens = configObj => {
  return new Promise((resolve, reject) => {
    const sql = configObj;

    mysql_util.deleteOAuthTokens().then(() => {
      client.set(token, sql, (err, response) => {
        if (err) {
          throw new Error(err);
        }

        console.log('deleteOAuthTokens response: ', response);
        resolve(response);
      });
    });
  });
};

mysql_util.checkTokenExistence = () => {
  return new Promise((resolve, reject) => {
    client.get(token, (err, response) => {
      if (err) {
        reject(false);
      }

      if (response === null) {
        reject(false);
      }

      resolve(true);
    });
  });
};

mysql_util.getOAuthTokens = () => {
  return new Promise((resolve, reject) => {
    client.get(token, (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response === null) {
        reject('Zoho token not found');
      }

      console.log('getOAuthTokens response: ', response, JSON.parse(response));
      const result = [];
      result.push(JSON.parse(response));

      resolve(result);
    });
  });
};

mysql_util.updateOAuthTokens = configObj => {
  return new Promise((resolve, reject) => {
    client.get(token, (err, getResponse) => {
      if (err) {
        throw new Error(err);
      }

      const sql = JSON.parse(getResponse);

      sql.accesstoken = configObj.access_token;
      sql.expirytime = configObj.expires_in;

      client.set(token, JSON.stringify(sql), (err, setResponse) => {
        if (err) {
          throw new Error(err);
        }

        resolve(setResponse);
      });
    });
  });
};

module.exports = mysql_util;
