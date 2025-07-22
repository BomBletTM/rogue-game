Game.prototype.herosAttack = function () {
  this.forEachNeighborCell(this.hero.x, this.hero.y, (ax, ay) => {
    if (this.map[ay][ax] === "enemy") {
      var enemy = this.enemies.find((e) => e.x === ax && e.y === ay);
      if (enemy) {
        enemy.health -= this.hero.damage;
        if (enemy.health <= 0) {
          this.removeEnemy(enemy);
          this.render();
          if (this.enemies.length === 0) {
            setTimeout(() => {
              alert("Вы победили!");
              $(document).off("keydown");
            }, 100);
          }
        }
      }
    }
  });
};

Game.prototype.enemysAttack = function () {
  for (var i = 0; i < this.enemies.length; i++) {
    var enemy = this.enemies[i];

    this.forEachNeighborCell(
      enemy.x,
      enemy.y,
      function (ax, ay) {
        if (ax === this.hero.x && ay === this.hero.y) {
          this.hero.health -= 5;
          if (this.hero.health <= 0) {
            this.map[this.hero.y][this.hero.x] = "floor";
            this.hero.isDead = true;
            this.render();

            setTimeout(function () {
              alert("Вы умерли!");
              $(document).off("keydown");
            }, 100);
          }
        }
      }.bind(this)
    );
  }
};

Game.prototype.removeEnemy = function (enemy) {
  var index = this.enemies.indexOf(enemy);
  if (index !== -1) {
    this.enemies.splice(index, 1);
    this.map[enemy.y][enemy.x] = "floor";
  }
};

Game.prototype.nextMove = function () {
  this.enemysAttack();
  this.enemiesMove();
  this.render();
};
