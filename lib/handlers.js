
/*

    These are the request handlers

*/


// Dependencies
const helpers = require('./helpers');
const _data = require('./data');





// Define the handlers
let handlers = {};


// 
handlers.users = function(data, callback) {

    let acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {

        handlers._users[data.method](data, callback);


    } else {

        // Else send back HTTP status code for method not allowed
        callback(405);

    }


};

// Container for the users submethods
handlers._users = {};

// Users post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
    // Check that all the required data fields are filled out

    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement) {

        // Make sure that the user doesn't already exist 
        _data.read('users', phone, function(err, data) {

            if (err) {

                // Hash the password
                let hashedPassword = helpers.hash(password);

                if(hashedPassword) {

                    let userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone, 
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    };

                    // Store user - Persist that user to disk
                    _data.create('users', phone, userObject, function(err){

                        if (!err) {

                            callback(200);

                        } else {

                            console.log(err);
                            callback(500, {'Error' : 'Could not create the new user'});
                        }

                    });

                } else {

                    callback(500, {'Error' : 'Could not hash the users password'});


                }

            } else {

                // User allready exists
                callback(400, {'Error' : 'A user with that phone number already exist'});

            }

        })

    } else {

        callback(400, {'Error' : 'Missing required field'});

    }

}

// Users get
handlers._users.get = function(data, callback) {

    callback(200);
}

// Users put
handlers._users.put = function(data, callback) {
}

// Users delete
handlers._users.delete = function(data, callback) {
}



handlers.sample = function(data, callback) {
    // Callback a http status code and a payload object

    callback(406, {'name' : 'sample handler'})
};

handlers.ping = function(data, callback) {
    // Callback a http status code and a payload object

    callback(200)
};

handlers.notFound = function(data, callback) {

  callback(404);

};


// Export all the handlers
module.exports = handlers;
