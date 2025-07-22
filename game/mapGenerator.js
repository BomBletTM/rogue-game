Game.prototype.generateMap = function () {
  var attempts = 0;
  do {
    this._generateMapOnce();
    attempts++;
    if (attempts > 100) {
      console.warn("Слишком много попыток генерации карты!");
      break;
    }
  } while (!this.isMapConnected());
};

Game.prototype._generateMapOnce = function () {
  this.map = [];
  this.enemies = [];
  this.rooms = [];

  for (var y = 0; y < this.height; y++) {
    var row = [];
    for (var x = 0; x < this.width; x++) {
      row.push("wall");
    }
    this.map.push(row);
  }

  var roomCount = this.getRandomInt(5, 10);

  for (var i = 0; i < roomCount; i++) {
    var maxAttempts = 20;

    while (maxAttempts-- > 0) {
      var w = this.getRandomInt(3, 8);
      var h = this.getRandomInt(3, 8);
      var x = this.getRandomInt(1, this.width - w - 1);
      var y = this.getRandomInt(1, this.height - h - 1);

      if (this.isAreaEmpty(x, y, w, h)) {
        this.createRoom(x, y, w, h);
        if (this.rooms.length > 1) {
          var prev =
            this.rooms[Math.floor(Math.random() * (this.rooms.length - 1))];
          var curr = this.rooms[this.rooms.length - 1];
          this.connectRooms(prev, curr);
        }
        break;
      }
    }
  }

  var hPassages = this.getRandomInt(3, 5);
  var wPassages = this.getRandomInt(3, 5);

  for (var i = 0; i < hPassages; i++) {
    var y = this.getRandomInt(0, this.height - 1);
    for (var x = 0; x < this.width; x++) {
      if (this.map[y][x] === "wall") this.map[y][x] = "floor";
    }
  }

  for (var i = 0; i < wPassages; i++) {
    var x = this.getRandomInt(0, this.width - 1);
    for (var y = 0; y < this.height; y++) {
      if (this.map[y][x] === "wall") this.map[y][x] = "floor";
    }
  }

  var emptyCells = [];
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      if (this.map[y][x] === "floor") {
        emptyCells.push({ x, y });
      }
    }
  }

  emptyCells = this.shuffle(emptyCells);

  for (var i = 0; i < 12; i++) {
    var cell = emptyCells.pop();
    if (!cell) continue;
    this.map[cell.y][cell.x] = i < 2 ? "sword" : "potion";
  }

  var heroCell = emptyCells.pop();
  if (heroCell) {
    this.hero.x = heroCell.x;
    this.hero.y = heroCell.y;
  } else {
    console.warn("Недостаточно места для размещения героя");
  }

  for (var i = 0; i < 10; i++) {
    var cell = emptyCells.pop();
    if (!cell) continue;
    this.enemies.push({ x: cell.x, y: cell.y, health: 100 });
    this.map[cell.y][cell.x] = "enemy";
  }
};

Game.prototype.isAreaEmpty = function (x, y, w, h) {
  for (var i = y; i < y + h; i++) {
    for (var j = x; j < x + w; j++) {
      if (this.map[i][j] !== "wall") {
        return false;
      }
    }
  }
  return true;
};

Game.prototype.createRoom = function (x, y, w, h) {
  for (var i = y; i < y + h; i++) {
    for (var j = x; j < x + w; j++) {
      this.map[i][j] = "floor";
    }
  }

  var centerX = Math.floor(x + w / 2);
  var centerY = Math.floor(y + h / 2);
  this.rooms.push({ x: centerX, y: centerY });
};

Game.prototype.connectRooms = function (roomA, roomB) {
  var x1 = roomA.x;
  var y1 = roomA.y;
  var x2 = roomB.x;
  var y2 = roomB.y;

  if (Math.random() < 0.5) {
    this.digHorizontal(x1, x2, y1);
    this.digVertical(y1, y2, x2);
  } else {
    this.digVertical(y1, y2, x1);
    this.digHorizontal(x1, x2, y2);
  }
};

Game.prototype.digHorizontal = function (x1, x2, y) {
  for (var x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    this.map[y][x] = "floor";
  }
};

Game.prototype.digVertical = function (y1, y2, x) {
  for (var y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    this.map[y][x] = "floor";
  }
};

Game.prototype.shuffle = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
