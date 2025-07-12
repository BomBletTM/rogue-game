$(document).on("keydown", function (e) {
  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    game.herosAttack();
    game.nextMove();
  } else {
    game.handleKey(e.key.toLowerCase());
    game.nextMove();
  }
});
