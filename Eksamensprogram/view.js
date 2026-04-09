



export function tegnBræt(bræt, gyldigeTræk, handleClick) {
    
let boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {

      let square = document.createElement("div");
      square.classList.add("square");

      square.dataset.x = x;
      square.dataset.y = y;

      if ((x + y) % 2 === 0) {
        square.classList.add("light");
      } else {
        square.classList.add("dark");
      }

      let erGyldig = gyldigeTræk.some(træk => træk.x === x && træk.y === y);
     if (erGyldig) {
  if ((x + y) % 2 === 0) {
    square.style.backgroundColor = "rgba(0, 200, 0, 0.5)"; // lyst felt
  } else {
    square.style.backgroundColor = "rgba(0, 150, 0, 0.5)"; // mørkt felt
  }
}
      let brik = bræt.felter[y][x];
      if (brik !== null) {
        // laver et img element og sætter dets src til brikkens png sti, og tilføjer det til feltet
        let img = document.createElement("img");
        img.src = brik.png;
        square.appendChild(img);

      } 
      square.addEventListener("click", handleClick);
      boardDiv.appendChild(square);
 

    }
  }
}