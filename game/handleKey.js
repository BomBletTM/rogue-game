Game.prototype.handleKey = function (key) {
  var newX = this.hero.x;
  var newY = this.hero.y;

  if (key === "w" || key === "ц") newY--;
  else if (key === "a" || key === "ф") newX--;
  else if (key === "s" || key === "ы") newY++;
  else if (key === "d" || key === "в") newX++;

  if (this.isCellFree(newX, newY, true)) {
    this.hero.x = newX;
    this.hero.y = newY;

    var isEnemy = this.enemies.some((e) => e.x === newX && e.y === newY);
    if (!isEnemy) {
      var tile = this.map[newY][newX];

      if (tile === "potion") {
        this.hero.health = Math.min(100, this.hero.health + 10);
        this.map[newY][newX] = "floor";
        this.render();
      } else if (tile === "sword") {
        this.hero.damage += 10;
        this.map[newY][newX] = "floor";
        this.render();
      }
    }
  }
};
