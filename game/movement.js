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
        this.inventory.push("potion");
        this.renderInventory();
        this.render();
      } else if (tile === "sword") {
        this.hero.damage += 10;
        this.inventory.push("sword");
        this.renderInventory();
        this.map[newY][newX] = "floor";
        this.render();
      }
    }
  }
};

Game.prototype.enemiesMove = function () {
  for (var i = 0; i < this.enemies.length; i++) {
    var enemy = this.enemies[i];

    var directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];

    var isHeroNear = false;
    for (var j = 0; j < this.cellsAround.length; j++) {
      var cell = this.cellsAround[j];
      var ax = enemy.x + cell.dx;
      var ay = enemy.y + cell.dy;
      if (ax === this.hero.x && ay === this.hero.y) {
        isHeroNear = true;
        break;
      }
    }

    if (isHeroNear) {
      var decision = Math.random();
      if (decision < 0.5) {
        continue;
      } else {
        var currentDist =
          Math.abs(enemy.x - this.hero.x) + Math.abs(enemy.y - this.hero.y);

        var possibleMoves = [];
        for (var k = 0; k < directions.length; k++) {
          var dir = directions[k];
          var newX = enemy.x + dir.dx;
          var newY = enemy.y + dir.dy;

          var newDist =
            Math.abs(newX - this.hero.x) + Math.abs(newY - this.hero.y);

          if (this.isCellFree(newX, newY, false) && newDist > currentDist) {
            possibleMoves.push(dir);
          }
        }

        if (possibleMoves.length > 0) {
          var move =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          enemy.x += move.dx;
          enemy.y += move.dy;
        }

        continue;
      }
    }

    var shuffled = directions.sort(() => Math.random() - 0.5);
    for (var k = 0; k < shuffled.length; k++) {
      var dir = shuffled[k];
      var newX = enemy.x + dir.dx;
      var newY = enemy.y + dir.dy;

      var isOccupied = false;
      for (var m = 0; m < this.enemies.length; m++) {
        var e = this.enemies[m];
        if (e !== enemy && e.x === newX && e.y === newY) {
          isOccupied = true;
          break;
        }
      }

      var isHero = this.hero.x === newX && this.hero.y === newY;

      if (this.isCellFree(newX, newY, false) && !isHero) {
        var tile = this.map[newY][newX];
        if (tile !== "potion" && tile !== "sword" && !isOccupied) {
          enemy.x = newX;
          enemy.y = newY;
          break;
        }
      }
    }
  }
};

Game.prototype.isCellFree = function (x, y, ignoreEnemies = false) {
  if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
  if (this.map[y][x] === "wall") return false;

  if (!ignoreEnemies) {
    if (this.enemies.some((e) => e.x === x && e.y === y)) return false;
  }

  return true;
};
