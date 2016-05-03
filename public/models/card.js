var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CardSchema   = new Schema({
	card: {}
});

module.exports = mongoose.model('Card', CardSchema);