import Brik from "./Brik.js";

export default class Konge extends Brik {

  constructor(farve, x, y) {
    super(farve, "konge", x, y);

    if (farve === "hvid") {
      this.png= "billeder/hvid konge.png";
    } else {
      this.png = "billeder/sort konge.png";
    }
    
  }

lovligeTræk(bræt,rokade) {
  let moves = [];
  let retninger = [
    {dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0},
    {dx: 1, dy: -1}, {dx: 1, dy: 1}, {dx: -1, dy: -1}, {dx: -1, dy: 1}
  ];

  for (let {dx, dy} of retninger) {
    let nx = this.x + dx;
    let ny = this.y + dy;
    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      let felt = bræt.felter[ny][nx];
      if (felt === null || felt.farve !== this.farve) {
        moves.push({ x: nx, y: ny });
      }
    }
  }

  //rokade logik
  let rokadeNøgle = this.farve === "hvid" ? "rokade_hvid" : "rokade_sort";
  let kongeRække = this.farve === "hvid" ? 7 : 0;

  if (rokade && rokade[rokadeNøgle]) {//skal dobbelt tjekke at tårn og konge passer
    if (
      bræt.felter[kongeRække][5] === null &&
      bræt.felter[kongeRække][6] === null &&
      bræt.felter[kongeRække][7]?.type === "tårn"
    ) {
      moves.push({ x: 6, y: kongeRække, rokade: "højre" });
    }
    if (
      bræt.felter[kongeRække][3] === null &&
      bræt.felter[kongeRække][2] === null &&
      bræt.felter[kongeRække][1] === null &&
      bræt.felter[kongeRække][0]?.type === "tårn"
    ) {
      moves.push({ x: 2, y: kongeRække, rokade: "venstre" });
    }
  }

  return moves;
}


}
