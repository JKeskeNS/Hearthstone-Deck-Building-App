var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DeckSchema   = new Schema({
	deckName: String,
    author: String,
	class: String,
	deckList: Array
});

module.exports = mongoose.model('Deck', DeckSchema);