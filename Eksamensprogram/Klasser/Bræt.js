


export default class Bræt {
// 2d array hvis position hænger sammen med supabase
// laver ikke bræt i supabase men gemmer felt som position 

  constructor() {
    this.felter = [];


//laver et 2d array til at repræsentere brættet, hvor hver position starter som null (tomt felt)
for (let i = 0; i < 8; i++) {
  this.felter[i] = [];
  for (let j = 0; j < 8; j++) {
    this.felter[i][j] = null;
  }
}

  }



  flytBrik(x1, y1, x2, y2) {
    let brik = this.felter[y1][x1];
    this.felter[y1][x1] = null;
    this.felter[y2][x2] = brik;
    brik.x = x2; // opdaterer brik-objektets koordinater så de matcher array-positionen
    brik.y = y2; // dette fiksede mit problem med at x og y ikke virkede i senere funktioner
  }

}




