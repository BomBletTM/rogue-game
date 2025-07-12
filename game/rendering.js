Game.prototype.createDOMMap = function () {
  var $field = $(".field");
  $field.empty();
  this.domTiles = [];

  for (var y = 0; y < this.height; y++) {
    var row = [];
    for (var x = 0; x < this.width; x++) {
      var $tile = $('<div class="tile"></div>');
      $tile.css({
        top: y * 25 + "px",
        left: x * 25 + "px",
      });
      $field.append($tile);
      row.push($tile);
    }
    this.domTiles.push(row);
  }
};

Game.prototype.render = function () {
  this.enemies.forEach((enemy) => {
    this.map[enemy.y][enemy.x] = "enemy";
  });
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var $tile = this.domTiles[y][x];
      var tileType = this.map[y][x];

      $tile.attr("class", "tile");

      if (tileType === "wall") $tile.addClass("tileW");
      if (tileType === "sword") $tile.addClass("tileSW");
      if (tileType === "potion") $tile.addClass("tileHP");
      $tile.empty();
      if (!this.hero.isDead) {
        if (x === this.hero.x && y === this.hero.y) {
          $tile.addClass("tileP");

          $('<div class="health"></div>')
            .css("width", this.hero.health + "%")
            .appendTo($tile);
        }
      }
      var enemy = this.enemies.find((e) => e.x === x && e.y === y);
      if (enemy) {
        $tile.addClass("tileE");
        $('<div class="health"></div>')
          .css("width", enemy.health + "%")
          .appendTo($tile);
      }
    }
  }
};

Game.prototype.renderInventory = function () {
  var $inventory = $(".inventory");
  $inventory.empty();

  this.inventory.forEach(function (item) {
    var $item = $('<div class="inv-item"></div>');
    if (item === "potion") {
      $item.addClass("tileHP");
    } else if (item === "sword") {
      $item.addClass("tileSW");
    }
    $inventory.append($item);
  });
};
