var restify = require('restify');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var Recipe = require('./app/models/recipe');
var uuid = require('uuid');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3config.json');

var s3Bucket = new AWS.S3( { params: {Bucket: 'monsterchef' } } );

var db = mongoose.connect('mongodb://monsterchef:monsterchef@ds139725.mlab.com:39725/monsterchef');
var db = mongoose.connection;

var port = process.env.PORT || 3000;
var server = restify.createServer();

db.once('open', function() {
  console.log("conn db");
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port, function () {
    console.log("Server started @ 3000");
});

server.use(function(req,res,next){
  res.setHeader('content-type','application/json')

 next()
});

server.get("/api/recipes", function (req, res, next) {
    Recipe.find(function (err, recipes) {
        res.end(JSON.stringify(recipes));
    });
    return next();
});

server.post("/api/recipe", function (req, res, next) {
    saveImage(req).then(function(imageUrl) {
        var newRecipe = Recipe({
            name: req.params.name,
            timeInMinutes: req.params.timeInMinutes,
            portions: req.params.portions,
            ingredients: req.params.ingredients,
            preparation: req.params.preparation,
            url: imageUrl
        });

        newRecipe.save(function (err, recipe) {
            if (err) console.log(err);

            res.end(JSON.stringify(recipe))
        });
    });

    return next();
});

function saveImage(req) {
    var buffer = new Buffer(req.params.photo, 'base64')
    var data = {
        Key: uuid.v1() + '.jpg',
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };

    return s3Bucket.putObject(data).promise().then(function() {
        return 'https://s3-sa-east-1.amazonaws.com/monsterchef/' + data.Key;
    })
    .catch(function() {
        return '';
    });
}
