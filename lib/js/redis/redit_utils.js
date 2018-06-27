var redis_util = {};
var mysql = require('redis');

var redis = require("redis"),
client = redis.createClient(6379, '127.0.0.1');

client.on('connect', () => {
  console.log('connected');
});

client.on("error", (err) => {
  console.log("Error " + err);
	throw new Error(err);
});

redis_util.saveOAuthTokens = (config_obj) => {
	return new Promise((resolve, reject) => {
		
		const sql = config_obj;
		
		redis_util.deleteOAuthTokens().then(() => {
			client.set("oauthtokens", sql, function(err, response) {
				if(err) {
					throw new Error(err);
				}

				resolve(response);
			});
		});
	});
};

redis_util.getOAuthTokens = () => {
	return new Promise((resolve, reject) => {
		client.get('oauthtokens', function(err, response) {
			if (err) {
				throw new Error(err);
			}
		  console.log(response);
			resolve(response);
		});
	});
};

redis_util.updateOAuthTokens = (config_obj) => {
	// TODO might need to get data before the update
	const sql = config_obj;

	return new Promise((resolve, reject) => {
		
		client.set("oauthtokens", sql, function(err, response) {
			if(err) {
				throw new Error(err);
			}

			resolve(response);
		});
	});
};

redis_util.deleteOAuthTokens = () => {
	return new Promise((resolve, reject) => {
		
		client.del('oauthtokens', function(err, response) {
			if(err) {
				throw new Error(err);
			}

	    resolve(response);
		});
	});
};

module.exports = redis_util;
