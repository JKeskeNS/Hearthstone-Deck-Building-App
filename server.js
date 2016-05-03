// Setup
var express = require('express');
var bodyParser = require('body-parser');


//Connect Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://JMK:KMJ@ds011331.mlab.com:11331/jkeske_test');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var Deck = require('./public/models/deck');
var Card = require('./public/models/card')
// routes for api
var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/decks')

    .post(function(req, res) {
        
        var deck = new Deck();   
        deck.deckName = req.body.deckName;
        deck.author = req.body.author;
        deck.class = req.body.class;
        deck.deckList = req.body.deckList;  

        deck.save(function(err) {
            if (!err){
                res.json({ message: 'User Created'});
            } else{
            	res.send(err);
            }
        });
    })

    .get(function(req,res){
    	Deck.find(function(err, decks){
    		if(!err){
    			res.json(decks);
    		} else {
    			res.send(err);
    		}
    	});
    });

router.route('/decks/:deck_id')

	.get(function(req,res){
		Deck.findOne({ _id : req.params.deck_id}, function(err,deck) {
			if(!err){
				res.json(deck);
			} else{
                res.status(404).send({message: 'Deck not found'});
				//res.send(err);
			}
		});
	})

	.put(function(req, res) {

        // use our bear model to find the bear we want
    	Deck.findOne({ _id : req.params.deck_id}, function(err, deck) {

            if (!err){
            	deck.deckName = req.body.deckName;
            	deck.author = req.body.author;
                deck.class = req.body.class;
                deck.deckList = req.body.deckList;
            } else {
            	res.send(err);
            }


            // save the bear
            deck.save(function(err) {
                if (!err){
                    res.json({ message: 'User updated'});
                } else{
                	res.send(err);
                }
            });

        });
    })

    .delete(function(req, res) {
        Deck.remove({_id: req.params.deck_id}, function(err, deck) {
            if (!err){
                res.json({ message: 'Successfully deleted user' });
            } else {
            	res.send(err);
            }
        });
    });

router.route('/cards')
    .get(function(req,res){
        Card.find(function(err, cards){
            if(!err){
                res.json(cards);
            } else {
                res.send(err);
            }
        });
    });

// test route
router.get('/', function(req,res) {
	res.json({message: 'Hi'});
});

// Register routes
app.use('/api', router);
app.use(express.static(__dirname + '/public'));


// Start server
app.listen(port);
console.log('Server running on port ' + port);