/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

var express = require('express');
var app = express();

const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require("fs");

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send('not log in');
        return;
    }

    var query = User.find({});
    query.select("first_name last_name").exec(function(err, users) {
        if (err) {
            console.error('Doing /user/list error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        console.log('Doing /user/list success');
        response.status(200).send(users);
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send('not log in');
        return;
    }

    var id = request.params.id;
    if (!mongoose.isValidObjectId(id)) {
        response.status(400).send('not valid');
        return;
    }

    User.findOne({_id: id}, '-__v -login_name -password', function(err, user) {
        if (err) {
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (!user || user.length <= 0) {
            console.error('Doing /user/:id not found:', id);
            response.status(400).send('not found id: ' + id);
            return;
        }
        console.log('Doing /user/:id success');
        response.status(200).send(user);
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send('not log in');
        return;
    }
    
    var id = request.params.id;
    if (!mongoose.isValidObjectId(id)) {
        response.status(400).send('not valid');
        return;
    }

    Photo.find({user_id: id}, "-__v", function(err, photos) {
        if (err) {
            console.error('Doing /photosOfUser/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (!photos) {
            console.error('Doing /photosOfUser/:id not found:', id);
            response.status(400).send('not found id: ' + id);
            return;
        }
        console.log('Doing /photosOfUser/:id success');
        photos = JSON.parse(JSON.stringify(photos));
        async.each(photos, function(photo, callback0) {
            async.each(photo.comments, function(comment, callback) {
                User.findOne({_id: comment.user_id}, 'first_name last_name', function(err0, user) {
                    if (err0) {
                        console.error('Doing /photosOfUser/:id error:', err0);
                        response.status(400).send(JSON.stringify(err0));
                        callback(err0);
                    } else if (!user || user.length <= 0) {
                        console.error('Doing /photosOfUser/:id not found:', id);
                        response.status(400).send('not found id: ' + comment.user_id);
                        callback('not found id: ' + comment.user_id);
                    } else {
                        comment.user = user;
                        delete comment.user_id;
                        callback();
                    }
                });
            }, function(err1) {
                if (err1) {
                    console.error("async error:", err1);
                    response.status(500).send(JSON.stringify(err1));
                } else {
                    callback0();
                }
            });
        }, function(err2) {
            if (err2) {
                console.error("async error:", err2);
                response.status(500).send(JSON.stringify(err2));
            } else {
                response.status(200).send(photos);
            }
        });
    });
});

app.post('/admin/login', function (request, response) {
    var login_name = request.body.login_name;
    User.findOne({login_name: login_name}, function(err, user) {
        if (err) {
            console.error('Doing /admin/login error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (!user || user.length <= 0) {
            console.error('Doing /admin/login not found:', login_name);
            response.status(400).send('not found id: ' + login_name);
            return;
        }
        if (user.password !== request.body.password) {
            console.log('Doing /admin/login password error:', login_name);
            response.status(400).send('password error: ' + login_name);
            return;
        }
        console.log('Doing /admin/login success');
        request.session.login_name = login_name;
        request.session._id = user._id;
        request.session.first_name = user.first_name;
        response.status(200).send(request.session);
    });
});

app.post('/admin/logout', function (request, response) {
    if (!(request.session.login_name)) {
        console.error('Doing /admin/logout error:');
        response.status(400).send('user is not currently logged in');
        return;
    }
    request.session.destroy(function(err) {
        if (err) {
            console.log('Doing /admin/logout destroy:', err);
        }
    });
    response.status(200).send('logout success');
});

app.post('/user', function (request, response) {
    if (request.body.login_name.length <= 0 || request.body.first_name.length <= 0 || 
        request.body.last_name.length <= 0 || request.body.password.length <= 0) {
        console.error('Doing /user properties not specified');
        response.status(400).send('not specified');
        return;
    }
    User.countDocuments({login_name: request.body.login_name}, function(err, cnt) {
        if (err) {
            console.error('Doing /user error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (cnt > 0) {
            console.error('Doing /user already exist:', cnt);
            response.status(400).send('already exist: ' + request.body.login_name);
            return;
        }
        User.create({
            login_name: request.body.login_name,
            password: request.body.password,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            location: request.body.location,
            description: request.body.description,
            occupation: request.body.occupation,
        }, (err0) => {console.error('Doing /user create error:', err0);});
        response.status(200).send('register success');
    });

});

app.post('/commentsOfPhoto/:photo_id', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send('not log in');
        return;
    }
    if (request.body.comment.length <= 0) {
        console.log('empty comment');
        response.status(400).send('empty comment');
        return;
    }

    let photo_id = request.params.photo_id;
    Photo.findOne({_id: photo_id}, function(err, photo) {
        if (err) {
            console.log('Doing /commentsOfPhoto/:photo_id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (!photo || photo.length <= 0) {
            console.log('Doing /commentsOfPhoto/:photo_id not found:', photo_id);
            response.status(400).send('not found id: ' + photo_id);
            return;
        }
        let new_comment = {
            comment: request.body.comment,
            user_id: request.session._id,
            date_time: new Date().toISOString()
        };
        photo.comments.push(new_comment);
        photo.save();
        console.log('Doing /commentsOfPhoto/:photo_id success');
        response.status(200).send('new comment success');
    });
});

const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

app.post('/photos/new', function (request, response) {
    if (!(request.session.login_name)) {
        response.status(401).send('not log in');
        return;
    }

    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            console.log('Doing /photos/new error:', err);
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes
    
        if (request.file.buffer.size === 0) {
            response.status(400).send('Doint /photos/new no file');
            return;
        }

        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        const timestamp = new Date().valueOf();
        const filename = 'U' +  String(timestamp) + request.file.originalname;
    
        fs.writeFile("./images/" + filename, request.file.buffer, function (err0) {
          // XXX - Once you have the file written into your images directory under the name
          // filename you can create the Photo object in the database
            if (err0) {
                console.log('Doint /photos/new writeFile error:', err0);
                return;
            }
            let new_photo = new Photo({
                file_name: filename,
                date_time: timestamp,
                user_id: request.session._id,
                comments: undefined
            });
            new_photo.save();
            console.log('Doing /photos/new success');
            response.status(200).send('photo uploading success');
        });
    });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
