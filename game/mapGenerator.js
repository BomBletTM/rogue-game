Game.prototype.isMapConnected = function () {
  const visited = Array.from({ length: this.height }, () =>
    Array(this.width).fill(false)
  );

  const queue = [];
  queue.push({ x: this.hero.x, y: this.hero.y });
  visited[this.hero.y][this.hero.x] = true;

  const dirs = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const current = queue.shift();
    for (const dir of dirs) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;

      if (
        nx >= 0 &&
        nx < this.width &&
        ny >= 0 &&
        ny < this.height &&
        !visited[ny][nx] &&
        this.map[ny][nx] === "floor"
      ) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      if (this.map[y][x] === "floor" && !visited[y][x]) {
        return false;
      }
    }
  }

  return true;
};

Game.prototype._generateMapOnce = function () {
  this.map = [];
  this.enemies = [];
  this.rooms = [];

  for (let y = 0; y < this.height; y++) {
    const row = [];
    for (let x = 0; x < this.width; x++) {
      row.push("wall");
    }
    this.map.push(row);
  }

  const roomCount = this.getRandomInt(5, 10);

  for (let i = 0; i < roomCount; i++) {
    let maxAttempts = 20;

    while (maxAttempts-- > 0) {
      const w = this.getRandomInt(3, 8);
      const h = this.getRandomInt(3, 8);
      const x = this.getRandomInt(1, this.width - w - 1);
      const y = this.getRandomInt(1, this.height - h - 1);

      if (this.isAreaEmpty(x, y, w, h)) {
        this.createRoom(x, y, w, h);
        if (this.rooms.length > 1) {
          const prev =
            this.rooms[Math.floor(Math.random() * (this.rooms.length - 1))];
          const curr = this.rooms[this.rooms.length - 1];
          this.connectRooms(prev, curr);
        }
        break;
      }
    }
  }

  const hPassages = this.getRandomInt(3, 5);
  const vPassages = this.getRandomInt(3, 5);

  for (let i = 0; i < hPassages; i++) {
    const y = this.getRandomInt(0, this.height - 1);
    for (let x = 0; x < this.width; x++) {
      if (this.map[y][x] === "wall") this.map[y][x] = "floor";
    }
  }

  for (let i = 0; i < vPassages; i++) {
    const x = this.getRandomInt(0, this.width - 1);
    for (let y = 0; y < this.height; y++) {
      if (this.map[y][x] === "wall") this.map[y][x] = "floor";
    }
  }

  let emptyCells = [];
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      if (this.map[y][x] === "floor") {
        emptyCells.push({ x, y });
      }
    }
  }

  emptyCells = this.shuffle(emptyCells);

  for (let i = 0; i < 12; i++) {
    const cell = emptyCells.pop();
    if (!cell) continue;
    this.map[cell.y][cell.x] = i < 2 ? "sword" : "potion";
  }

  const heroCell = emptyCells.pop();
  if (heroCell) {
    this.hero.x = heroCell.x;
    this.hero.y = heroCell.y;
  } else {
    console.warn("Недостаточно места для размещения героя");
  }

  for (let i = 0; i < 10; i++) {
    const cell = emptyCells.pop();
    if (!cell) continue;
    this.enemies.push({ x: cell.x, y: cell.y, health: 100 });
    this.map[cell.y][cell.x] = "enemy";
  }
};

Game.prototype.generateMap = function () {
  let attempts = 0;
  do {
    this._generateMapOnce();
    attempts++;
    if (attempts > 100) {
      console.warn("Слишком много попыток генерации карты!");
      break;
    }
  } while (!this.isMapConnected());
};

Game.prototype.createRoom = function (x, y, w, h) {
  for (let i = y; i < y + h; i++) {
    for (let j = x; j < x + w; j++) {
      this.map[i][j] = "floor";
    }
  }

  const centerX = Math.floor(x + w / 2);
  const centerY = Math.floor(y + h / 2);
  this.rooms.push({ x: centerX, y: centerY });
};

Game.prototype.isAreaEmpty = function (x, y, w, h) {
  for (let i = y; i < y + h; i++) {
    for (let j = x; j < x + w; j++) {
      if (this.map[i][j] !== "wall") {
        return false;
      }
    }
  }
  return true;
};

Game.prototype.connectRooms = function (roomA, roomB) {
  const x1 = roomA.x;
  const y1 = roomA.y;
  const x2 = roomB.x;
  const y2 = roomB.y;

  if (Math.random() < 0.5) {
    this.digHorizontal(x1, x2, y1);
    this.digVertical(y1, y2, x2);
  } else {
    this.digVertical(y1, y2, x1);
    this.digHorizontal(x1, x2, y2);
  }
};

Game.prototype.digHorizontal = function (x1, x2, y) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    this.map[y][x] = "floor";
  }
};

Game.prototype.digVertical = function (y1, y2, x) {
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    this.map[y][x] = "floor";
  }
};

Game.prototype.shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
