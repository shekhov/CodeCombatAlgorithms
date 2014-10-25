// This is code for Munchkins
// Though all mun. have the same code, I want to have several strategies inside this group
// 1. Gold collectors. Because munchkins are very fast, it is important to use them just in the beggining of the battle. Left corner - move({x:9, y:74}) -> move ({x:13, y:65}); Right Corner - move ({x:76, y:11}); -> move({x:65, y:12}); Then return to the base and listen new coins appear (? will they? )
// 2. Defenders. This type of army should stay near the towers and protect them. So two armies should be created for this purpose. {x:40, y:76}; {x:73; y:41}; As soon as enemy appears in 25m range from the tower, attack them, and after they died return to origin position.
// 3. Attackers. Four armies. Two moves by border field, two through the middle point. Before army will move to attack it suppose to be formed. Form point is {x:61, y:64}; This strategy suppose to work for all units.

// First I need to find way to give the muchkin know in what army he is.
  
// This code is shared across all your Munchkins.
// You can use this.buildIndex to have Munchkins do different things.
// Munchkins are weak but cheap, fast melee units.
var home_position = {x:69, y:69};
var enemy_base_position = {x:13, y:13};

var enemy_left_tower = {x:8, y:38};
var enemy_right_tower = {x:41, y:5};

var home_left_tower = {x:41, y:75};
var home_right_tower = {x:76, y:41};

var left_first_coin = {x:9, y:74};
var left_second_coin = {x:13, y:65};

var right_first_coin = {x:69, y:18};
var right_second_coin = {x:71, y:6};

var COIN_COLLECTOR_LEFT = 0;
var COIN_COLLECTOR_RIGHT = 1;
var ATTACKER = 2;


if (!this.strategy) this.strategy = this.buildIndex;

this.load_collector_strategy = function (first_target, second_target, final_target) {
	this.say ("I am a coin collector");
	
	if (!this.firstCollected) this.firstCollected=0; 
	if (!this.secondCollected) this.secondCollected=0;
	if (!this.strategyDone) this.strategyDone=0;
	
	var move_target = final_target;
	if (this.firstCollected === 0) {
		// read current position
		if (this.pos.distance (first_target) > 2) {
			move_target = first_target;
		}
		else {
			move_target = second_target;
			this.firstCollected = 1;
		}
	}
	else if (this.secondCollected === 0) {
		if (this.pos.distance (second_target) > 2) {
			move_target = second_target;
		}
		else {
			move_target = final_target;
			this.secondCollected = 1;
		}             
	}
	else if (this.strategyDone === 0) {
		if (this.pos.distance (final_target) < 2) {
			this.strategy = ATTACKER;
			this.strategyDone = 1;
			this.say ("I am a doctor..");
		}
	}
	this.move (move_target);	
};

switch (this.strategy) {
    case COIN_COLLECTOR_LEFT: 
		this.load_collector_strategy (left_first_coin, left_second_coin, left_second_coin);
        break;
	case COIN_COLLECTOR_RIGHT:
		this.load_collector_strategy (right_first_coin, right_second_coin, right_second_coin);
		break;
    default:

        var enemy = this.getNearestEnemy();
        if (enemy && enemy.type !== 'burl') {
            this.attack(enemy);
        }
        else {
            this.move({x: 10, y: 10});
        }
        break;
}
