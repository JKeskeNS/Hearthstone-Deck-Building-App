var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CardSchema   = new Schema({
	deckName: String,
    author: String,
	class: String,
	deckList: Array
});

module.exports = mongoose.model('User', UserSchema);