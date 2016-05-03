var myApp = angular.module('myApp', ['ui.router', 'ngSanitize']);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.deckList = [];

	//  Set the current deck list to an array with 30 empty indicies to represent each card in the deck
	$scope.clearDeck = function(){
    	for(var i = 0;i<30;i++){
    		$scope.deckList[i] = '';
    	};
    };
    $scope.clearDeck();

    var setCardList = function() {
    	$http.get('/api/cards').success(function (response) {
    		$scope.cardList = response;
    	});
    };
    setCardList();
    
    // Refresh the current deck list as well as the main decks list in the database with an HTTP GET call
    var refresh = function() {
        $http.get('/api/decks').success(function (response) {
            console.log('I got the data I requested');
            $scope.decksList = response;
            $scope.deck = '';
        });
    };
    refresh(); 

    // Use HTTP DELETE call to remove deck from database
    $scope.removeDeck = function(deckID){
        $http.delete('/api/decks/' + deckID,$scope.deck);
        refresh();
    };
    
    // Clear the $scope.deck info
    $scope.clearDeckInfo = function(){
        $scope.deck = '';
    };

    // Use HTTP GET to get deck with specified ID to edit deck info and deck list
    $scope.editDeck = function(deckID){
        $http.get('/api/decks/'+deckID).success(function (response) {
            $scope.deck = response;
            $scope.deckList = $scope.deck.deckList;
        });
    };

    // Use HTTP PUT call to update deck after desired changes are made
    $scope.updateDeck = function(){
        if (typeof $scope.deck._id === 'undefined'){
            console.log('Error: No deck defined to update');
            $scope.deck = '';
        } else if(typeof $scope.deck.deckName === 'undefined' || typeof $scope.deck.author === 'undefined' || typeof $scope.deck.class === 'undefined'){
            console.log('Error: Can not update with empty field');
            $scope.deck = '';
        } else if(($scope.deck.deckName.replace(/\s/g, '').length) === 0 || ($scope.deck.author.replace(/\s/g, '').length) === 0 || ($scope.deck.class.replace(/\s/g, '').length) === 0) {
            console.log('Error: Data can not begin with spaces');
            $scope.deck = '';
        } else{
            $http.put('/api/decks/' + $scope.deck._id, $scope.deck).success(function(response) {
            }); 
        }
    };
    
    // HTTP POST call to add new deck to the database
    $scope.addDeck = function(){
        if(typeof $scope.deck.deckName === 'undefined' || typeof $scope.deck.author === 'undefined' || typeof $scope.deck.class === 'undefined'){
            console.log('Error: Need data to add deck'); 
            $scope.deck = '';
        } else if((($scope.deck.deckName.replace(/\s/g, '').length) === 0) || (($scope.deck.author.replace(/\s/g, '').length) === 0) || (($scope.deck.class.replace(/\s/g, '').length) === 0)){
            console.log('Error: Data can not start with a space');
            $scope.deck = '';
        } else{
        	$scope.deck.deckList = $scope.deckList;
            $http.post('/api/decks', $scope.deck).success(function (response) {
            console.log(response);
            });
        }
    }

    // either add or update deck based on state of $scope
    $scope.saveDeck = function(){
    	if(typeof $scope.deck._id === 'undefined'){
    		this.addDeck();

    	} else {
    		this.updateDeck();
    	};
    	$scope.clearDeckInfo();
        refresh();
    }

    // Removed selected card from client side decklist
    $scope.removeFromDeck = function(card) {
    	var numCards = 0;
    	if(typeof card !== 'undefined'){
			for(var i = 0;i<30;i++) {
    			if(typeof $scope.deckList[i] !== 'undefined' && $scope.deckList[i] !== null) {
    				if($scope.deckList[i].name === card.name && numCards !== 1) {
    					numCards++
    					delete $scope.deckList[i];
    				 };
    			};
    		};
    	};	
    }


    // Add selected card to client side decklist
    $scope.addToDeck = function(card){
    	var numCards = 0;
    	var emptyCell;

    	for(var i = 0;i < 30;i++){
    		if(typeof $scope.deckList[i] === 'undefined' || $scope.deckList[i] === null || $scope.deckList[i] === ''){
    			emptyCell = i;
    		};
    	};

    	for(var i = 0;i < $scope.deckList.length;i++){
    		if($scope.deckList[i] === card){
    			numCards++;
    		};
    	};
    	if(card.card.type === 'HERO'){
    		console.log('Can not add hero to deck');
    	} else if(numCards === 2 || (card.card.rarity === 'LEGENDARY' && numCards === 1)){
    		console.log('Can only have 1 of each legendary or 2 of each non-legendary card');
    	} else if(typeof emptyCell === 'undefined'){
    		console.log('Deck is full');
    		console.log(emptyCell);
    	} else {
    		$scope.deckList[emptyCell] = card.card;
    		console.log(card.card.name + ' added to deck slot ' + emptyCell);
    	};
	};
}]);


// UiRouter Routing
myApp.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'AppCtrl'
			});

	$urlRouterProvider.otherwise('home');

}]);