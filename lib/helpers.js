/*


    Helpers for various tasks


*/


// Dependencies
const crypto = require('crypto');
const config = require('./config');


// Container for all the helpers
let helpers = {};


helpers.hash = function(str) {

    if(typeof(str) == 'string' && str.length > 0) {

        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;

    } else {

        return false;

    }

};


// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(jsonStr) {

    try {
        let obj = JSON.parse(jsonStr);
        return obj;
    } catch(e) {
        return {};

    }

}


// Export the module
module.exports = helpers;