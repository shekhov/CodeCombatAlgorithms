// The next script will be based on changing direction, where direction (vector) will be changing by all coins around

var minDistance = 15; // m, at this point we are starting to look
var maxValue = 5; // Game based value of coins
var weightCoef = minDistance / maxValue; // important value in calculating Weight of coin

// This is the starting point.
if (!this.V) { this.V = {x: 0, y:minDistance}; } // Create global variable, so it can be access from any point
// All coins around
var items = this.getItems();

function minimizeVector (V0) {
	// Summ of the absolute vector coordinates
	var sumV = Math.abs(V0.x) + Math.abs(V0.y);
	var vx = V0.x * minDistance / sumV;
	var vy = V0.y * minDistance / sumV;
	return ({x:vx, y:vy});
}

function applyCoinToVector (pos0, V0, coin) {
	var value = coin.bountyGold;
	var distance = pos0.distance (coin.pos); 
	var weight = value * weightCoef / distance;
	
	// What vector from pos of hero to coin (full vector)
	var Vfx = coin.pos.x - pos0.x; 
	var Vfy = coin.pos.y - pos0.y;
	var Vf = minimizeVector ({x:Vfx, y:Vfy});

	// Final new vector
	var Vnx = V0.x + Vf.x * weight;
	var Vny = V0.y + Vf.y * weight;
	
	return (minimizeVector({x:Vnx, y:Vny})); // Return new vector
} 

// Return the point on the field, based on new vector
function getNewTargetPos (pos0, V0) {
	return ({x: pos0.x + V0.x, y: pos0.y + V0.y});
}

for (var i=0; i < items.length; i++) {
	coin = items[i];
	this.V = applyCoinToVector (this.pos, this.V, coin);
}


var target = getNewTargetPos (this.pos, this.V);
if (target) this.move(target);
