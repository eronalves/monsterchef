var restify = require('restify');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var Recipe = require('./app/models/recipe');

var db = mongoose.connect('mongodb://monsterchef:monsterchef@ds161225.mlab.com:61225/monsterchef');
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
    var newRecipe = Recipe({
        name: req.params.name,
        timeInMinutes: req.params.timeInMinutes,
        portions: req.params.portions,
        ingredients: req.params.ingredients,
        preparation: req.params.preparation,
        photo: req.params.photo
    });

    newRecipe.save(function (err, recipe) {
        if (err) return handleError(err);

        res.end(JSON.stringify(recipe))    
    });

    return next();
});