 var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var faker=require('faker');
    // configuration =================

    mongoose.connect('mongodb://localhost/FormData');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // listen (start app with node server.js) ======================================
    app.listen(8081);
    console.log("App listening on port 8081");

    var UserBasicData = mongoose.model('BasicDetails', {
        Name : String,
        Qualification:String,
        age:Number,
        hobby:String,
        Place:String,
        Username:String,
        Password:String
    });

    app.get('/getRandomUser',function(req,res){
        //faker
        console.log('in random user');
        var user = faker.helpers.userCard();
        user.avatar = faker.image.avatar();
       // console.log(user);
        res.json(user);

    });
 app.get('/getAllUsers', function(req, res) {

        // use mongoose to get all todos in the database
        UserBasicData.find(function(err, data) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(data); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/saveUserData', function(req, res) {
        console.log("REQUEST---"+req.body);
        // create a todo, information comes from AJAX request from Angular
        UserBasicData.create({
          //  text : req.body.text,
           // done : false.
           
            Name : req.body.name,
            Qualification:req.body.qual,
            age:req.body.age,
            hobby:req.body.hobby,
            Place:req.body.place
        }, function(err, data) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            UserBasicData.find(function(err, data) {
                if (err)
                    res.send(err)
                res.json(data);
            });
        });

    });
     app.get('/checkUsername', function(req, res) {

        // use mongoose to get all todos in the database
        console.log("user name=="+req.param('userName'));

        UserBasicData.count({Username:req.param('userName')},function(err, data) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            console.log("resulted data---------"+data);
            res.json(data); // return all todos in JSON format
        });
    });


    // delete a todo
    app.delete('/deleteUserData/:userId', function(req, res) {
            UserBasicDataTodo.remove({
            _id : req.params.userId
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            UserBasicData.find(function(err, data) {
                if (err)
                    res.send(err)
                res.json(data);
            });
        });
    });

app.get('*', function(req, res) {
        res.sendfile('public/html/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });