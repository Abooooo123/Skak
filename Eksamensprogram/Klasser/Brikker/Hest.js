import Brik from "./Brik.js";

export default class Hest extends Brik {

  constructor(farve, x, y) {
    super(farve, "hest", x, y);

    if (farve === "hvid") {
      this.png= "billeder/hvid hest.png";
    } else {
      this.png = "billeder/sort hest.png";
    }
    
  }

lovligeTræk(bræt) {
  let moves = [];
  let spring = [//hesten rykker 2 i en retning og 1 i den anden
    {dx: 1, dy: -2}, {dx: 2, dy: -1},
    {dx: 2, dy: 1},  {dx: 1, dy: 2},
    {dx: -1, dy: 2}, {dx: -2, dy: 1},
    {dx: -2, dy: -1},{dx: -1, dy: -2}
  ];

  for (let {dx, dy} of spring) {
    let x = this.x + dx;
    let y = this.y + dy;
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      let felt = bræt.felter[y][x];
      if (felt === null || felt.farve !== this.farve) {
        moves.push({ x, y });
      }
    }
  }
  return moves;
}

}
