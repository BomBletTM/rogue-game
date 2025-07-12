function Game() {
  this.width = 40;
  this.height = 24;
  this.map = [];
  this.hero = { x: 0, y: 0, health: 100, damage: 30 };
  this.inventory = [];
  this.enemies = [];
  this.cellsAround = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
  ];
}

Game.prototype.init = function () {
  this.generateMap();
  this.createDOMMap();
  this.render();
  this.hero.isDead = false;
};
