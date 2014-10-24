//var bestCoinCost = 0;
//var bestCoin;
var items = this.getItems ();

var cells_value = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var cells_n_coins = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var cells_density = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var cells_biggest_coin = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var cells_max_value = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var crystall = [];
var gold = [];
var silver = [];

var bestCoinValue = 0;
var bestCoin = null;
var bestCoinJump = null; // This variable should be the most valuable coin in most density cell

// Return index of cell (from 0 to 8)
function getCellId (givenPos) {
    var row = Math.ceil (3 - (givenPos.y / 23));
    var column = Math.ceil (givenPos.x / 38);
    var cellId = ((row - 1) * 3) + column;
    return cellId - 1;
}

// Analysis of all coins around. 
for (var i=0; i < items.length; i++) {
	coin = items[i];
	
	// Recognize it value and sort by it.
	switch (coin.bountyGold) {
		case 5:
			crystall.push (coin);
			break;
		case 4: 
			gold.push (coin);
			break;
		case 3:
			silver.push (coin);
			break;
		default:
			break;
	}
	
	// assign coin value to one of the cells in the playground grid
	var coinCell = getCellId (coin.pos);
	cells_value[coinCell] += coin.bountyGold;
	cells_n_coins[coinCell] ++;
	// In each cell find most valuable coin. 
	if (coin.bountyGold > cells_max_value[coinCell]) {
		cells_biggest_coin[coinCell] = coin;
		cells_max_value[coinCell] = coin.bountyGold;
	}
	
	// Choose the most valuable coin around the hero.
	// Formula is 2^coinValue / distance.  
	var dist = this.pos.distance (coin.pos); //this.pos.distance (items[i].pos);
	var coinValue = Math.pow (2, coin.bountyGold) / dist;	
	coin.value = coinValue;
	if (coinValue > bestCoinValue) {
		bestCoinValue = coinValue;
		bestCoin = coin;
	}

} 
   
// Select target fo jump
var valCellId = 0;
var valCellValue = 0;
for (var j=0; j < 9; j++) {
    if (cells_value[j] > valCellValue) {
        valCellValue = cells_value[j];
        valCellId = j;
    }
}

if (this.getCooldown ("jump") === 0) {
	var target = cells_biggest_coin[valCellId];
	if (target) {
		this.say ("Jump pum bum");
		this.jumpTo (target);
	}
}

else if (bestCoin !== null) {
	this.say ("Move toward to coin with " + Math.round (bestCoin.value * 100) + " value");
	this.move (bestCoin.pos);
}
