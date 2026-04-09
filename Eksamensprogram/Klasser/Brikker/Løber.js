import Brik from "./Brik.js";

export default class Løber extends Brik {

  constructor(farve, x, y) {
    super(farve, "løber", x, y);

    if (farve === "hvid") {
      this.png= "billeder/hvid løber.png";
    } else {
      this.png = "billeder/sort løber.png";
    }
    
  }

lovligeTræk(bræt) {
  let moves = [];
  // Fire diagonale retninger
  let retninger = [{dx: 1, dy: -1}, {dx: 1, dy: 1}, {dx: -1, dy: -1}, {dx: -1, dy: 1}];

  for (let {dx, dy} of retninger) {
    let x = this.x + dx;
    let y = this.y + dy;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      let felt = bræt.felter[y][x];
      if (felt === null) {
        moves.push({ x, y });
      } else {
        if (felt.farve !== this.farve) moves.push({ x, y }); // slå
        break;
      }
      x += dx;
      y += dy;
    }
  }
  return moves;
}


}
