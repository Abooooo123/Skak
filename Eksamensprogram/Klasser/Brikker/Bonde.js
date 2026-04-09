
import Brik from "./Brik.js";

export default class Bonde extends Brik {

  constructor(farve, x, y) {
    super(farve, "bonde", x, y); //typen er altid det samme

    if (farve === "hvid") {//vælger billede ud fra valgte farve
      this.png= "billeder/hvid bonde.png";
    } else {
      this.png = "billeder/sort bonde.png";
    }
 
  }


lovligeTræk(bræt, enPassant) {
  let moves = [];
  let retning = this.farve === "hvid" ? -1 : 1;

  if (bræt.felter[this.y + retning]?.[this.x] === null) {
    moves.push({ x: this.x, y: this.y + retning });
    
// Dobbelt træk fra startposition
    let startRække = this.farve === "hvid" ? 6 : 1;
    if (this.y === startRække && bræt.felter[this.y + retning * 2]?.[this.x] === null) {
      moves.push({ x: this.x, y: this.y + retning * 2 });
    }
  }

  //diagonal slag
  for (let dx of [-1, 1]) {
    let felt = bræt.felter[this.y + retning]?.[this.x + dx];
    if (felt !== null && felt !== undefined && felt.farve !== this.farve) {
      moves.push({ x: this.x + dx, y: this.y + retning });
    }

    // En passant
    if (enPassant && enPassant.x !== null && this.x + dx === enPassant.x && this.y + retning === enPassant.y) {
      moves.push({ x: this.x + dx, y: this.y + retning, enPassant: true });
    }
  }

  return moves;
}


}


