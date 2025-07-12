Game.prototype.forEachNeighborCell = function (x, y, callback) {
  this.cellsAround.forEach(({ dx, dy }) => {
    var nx = x + dx;
    var ny = y + dy;
    if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
      callback(nx, ny);
    }
  });
};

Game.prototype.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
