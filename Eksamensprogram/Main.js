
import { gemBræt, hentBræt, hentTur, gemTur, hentRokade, gemRokade, hentEnPassant, gemEnPassant } from './Model.js';
import { supabase } from './config.js';
import { tegnBræt } from "./view.js";

import Bonde from "./Klasser/Brikker/Bonde.js";
import Dronning from "./Klasser/Brikker/Dronning.js";
import Hest from "./Klasser/Brikker/Hest.js";
import Konge from "./Klasser/Brikker/Konge.js";
import Løber from "./Klasser/Brikker/Løber.js";
import Tårn from "./Klasser/Brikker/Tårn.js";
import Bræt from "./Klasser/Bræt.js";



let bræt = new Bræt();

let Rækkefølge = [Tårn, Hest, Løber, Dronning, Konge, Løber, Hest, Tårn];

let selectedPiece = null;
let selectedX = null;
let selectedY = null;
let gyldigeTræk = []; //skal bruges til at tjekke om et træk er lovligt, og formentlig også til at highlighte gyldige træk på brættet
let tur = await hentTur();
let rokade = await hentRokade();
let enPassant = await hentEnPassant();





//placerer en given brik på et givent felt
 function placerBrik(brik) {
    bræt.felter[brik.y][brik.x] = brik;
  }

//sætter startopstillingen op
function autoPlacerBonder(y, color) {
  for (let x = 0; x < 8; x++) {
    let bonde = new Bonde(color, x, y);
    placerBrik(bonde);
  }
}
function autoPlacerBrikker(y, color) {
  for (let x = 0; x < 8; x++) {
    let brik = new Rækkefølge[x](color, x, y);
    placerBrik(brik);
  }
}


document.getElementById("reset").addEventListener("click", resetBræt);

async function resetBræt() {
  bræt = new Bræt();
  autoPlacerBrikker(0, "sort");
  autoPlacerBonder(1, "sort");
  autoPlacerBonder(6, "hvid");
  autoPlacerBrikker(7, "hvid");
  await gemBræt(bræt); //sletter alle rækker før den indsætter nye
  await gemTur("hvid"); //sætter turen tilbage til hvid
  tur = "hvid"; //opdaterer den lokale variabel tur

  //en passant og rokade reset
rokade = { rokade_hvid: true, rokade_sort: true };
await gemRokade(rokade);

enPassant = { x: null, y: null };
await gemEnPassant(null, null);
  tegnBræt(bræt, gyldigeTræk, handleClick);
}




function vælgBrik(brik, x, y) {
  selectedPiece = brik;
  selectedX = x;
  selectedY = y;

  //konge og bonde er specielle 
  if (brik.type === "konge") {
    gyldigeTræk = brik.lovligeTræk(bræt, rokade);
  } else if (brik.type === "bonde") {
    gyldigeTræk = brik.lovligeTræk(bræt, enPassant);
  } else {
    gyldigeTræk = brik.lovligeTræk(bræt);
  }

 tegnBræt(bræt, gyldigeTræk, handleClick);
}

async function Træk(x, y) {
  let valgtTræk = gyldigeTræk.find(træk => træk.x === x && træk.y === y);//finder det valgte træk i gyldigeTræk arrayet

  bræt.flytBrik(selectedX, selectedY, x, y);

  //forfremmelse
  if (selectedPiece.type === "bonde") {
  if (y === 0 && selectedPiece.farve === "hvid") {
    Forfremmelse(x, y, "hvid");}

  else if (y === 7 && selectedPiece.farve === "sort"){
    Forfremmelse(x, y, "sort");}

    await EnPassant(x, y);
  } else {
    enPassant = { x: null, y: null };
    await gemEnPassant(null, null);
  }

  if (valgtTræk.rokade === "højre") bræt.flytBrik(7, selectedY, 5, selectedY);
  if (valgtTræk.rokade === "venstre") bræt.flytBrik(0, selectedY, 3, selectedY);

  if (selectedPiece.type === "konge"|| selectedPiece.type === "tårn") {// hvis kongen eller tårnet flytter kan rokade ikke længere bruges
    await Rokade();
  }

  await gemBræt(bræt);
}



async function EnPassant(x, y) {
  if (Math.abs(y - selectedY) === 2) {//hvis bonden flytter 2 felter sæt en passant
    let enPassantY = selectedPiece.farve === "hvid" ? y + 1 : y - 1;
    enPassant = { x: x, y: enPassantY };
    await gemEnPassant(x, enPassantY);
  } else {
    if (enPassant && x === enPassant.x && y === enPassant.y) {
      let slagetBondeY = selectedPiece.farve === "hvid" ? y + 1 : y - 1;
      bræt.felter[slagetBondeY][x] = null;
    }
    enPassant = { x: null, y: null };
    await gemEnPassant(null, null);
  }
}


async function Rokade() {
  if (selectedPiece.farve === "hvid") rokade.rokade_hvid = false;
  else rokade.rokade_sort = false;
  await gemRokade(rokade);
}



async function handleClick(event) {
  let square = event.currentTarget;
  let x = Number(square.dataset.x);
  let y = Number(square.dataset.y);
  let brik = bræt.felter[y][x];

  if (selectedPiece === null) {
    if (brik !== null && brik.farve === tur) {
      vælgBrik(brik, x, y);
      return; 
    }
  } else {
    let erGyldig = gyldigeTræk.some(træk => træk.x === x && træk.y === y);

    if (erGyldig) {
      await Træk(x, y);

      let status = SkakStatus(bræt, tur === "hvid" ? "sort" : "hvid");
      if (status === "skak") {
        alert(tur === "hvid" ? "Sort er i skak" : "Hvid er i skak");
      } else if (status === "skakmat") {
        alert(tur === "hvid" ? "Hvid vinder" : "Sort vinder");
        await resetBræt();
        return; // forhindrer at turen skifter efter reset
      }

      tur = tur === "hvid" ? "sort" : "hvid";
      await gemTur(tur);
      tegnBræt(bræt, gyldigeTræk, handleClick);
    }

  selectedPiece = null;
  selectedX = null;
  selectedY = null;
  gyldigeTræk = [];
  }
}







function Forfremmelse(x, y, farve) {
  let valg = prompt("Vælg brik til forfremmelse:\ndronning\ntårn\nløber\nhest");
  
  // tjek at valget er gyldigt
  let gyldigeValg = ["dronning", "tårn", "løber", "hest"];
  if (!gyldigeValg.includes(valg)) {
     valg = "dronning"; // ugyldige valg giver dronnng
  }

  let Klasse = brikKlasser[valg];
  let nyBrik = new Klasse(farve, x, y);
  bræt.felter[y][x] = nyBrik;
}


const brikKlasser = {
  "bonde": Bonde,
  "dronning": Dronning,
  "hest": Hest,
  "konge": Konge,
  "løber": Løber,
  "tårn": Tårn
};


async function opdaterBræt() {
  let data = await hentBræt();
  
  if (data && data.length > 0) {
    for (let række of data) {

      let Klasse = brikKlasser[række.type];
      let brik = new Klasse(række.farve, række.x, række.y);
      placerBrik(brik);
    }
  } else {

    autoPlacerBrikker(0, "sort");
    autoPlacerBonder(1, "sort");
    autoPlacerBonder(6, "hvid");
    autoPlacerBrikker(7, "hvid");
    await gemBræt(bræt);
  }
  tegnBræt(bræt, gyldigeTræk, handleClick);
}


function SkakTrusler(bræt, farve) {
  let kongeX; 
  let kongeY;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let brik = bræt.felter[y][x];
      if (brik && brik.type === "konge" && brik.farve === farve) {
        kongeX = x;
        kongeY = y;
      }
    }
  }


  let trusler = [];
  let modstander = farve === "hvid" ? "sort" : "hvid";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let brik = bræt.felter[y][x];
      if (brik && brik.farve === modstander) {
        let træk;
        if (brik.type === "bonde") {
          let retning = brik.farve === "hvid" ? -1 : 1;
          træk = [{x: brik.x-1, y: brik.y+retning}, {x: brik.x+1, y: brik.y+retning}];
        } else {
          træk = brik.lovligeTræk(bræt);
        }
        let kanNåKonge = træk.some(t => t.x === kongeX && t.y === kongeY);
        if (kanNåKonge) {
          trusler.push(brik);
        }
      }
    }
  }

  return trusler;
}


function SkakStatus(bræt, farve) {
  let trusler = SkakTrusler(bræt, farve);

  if (trusler.length === 0) return "sikker";

  // Tjek om noget træk kan fjerne alle trusler
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let brik = bræt.felter[y][x];
      if (brik && brik.farve === farve) {
        let træk;
        if (brik.type === "konge") {
          træk = brik.lovligeTræk(bræt, rokade);
        } else if (brik.type === "bonde") {
          træk = brik.lovligeTræk(bræt, enPassant);
        } else {
          træk = brik.lovligeTræk(bræt);
        }

        for (let t of træk) {
          // Prøv trækket midlertidigt
          let gemt = bræt.felter[t.y][t.x];
          bræt.felter[t.y][t.x] = brik;
          bræt.felter[y][x] = null;
          brik.x = t.x;
          brik.y = t.y;

          // Tjek om der stadig er trusler efter trækket
          let stadigTrusler = SkakTrusler(bræt, farve);

          // Fortryd trækket
          bræt.felter[y][x] = brik;
          bræt.felter[t.y][t.x] = gemt;
          brik.x = x;
          brik.y = y;

          if (stadigTrusler.length === 0) return "skak"; 
        }
      }
    }
  }

  return "skakmat";
}



 opdaterBræt();//er kun relevant når man reloader siden

supabase
  .channel('position')//opretter en forbindelse til Supabase realtime
  .on(// lytter efter ændringer i databasen
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'Position'
    },
    (payload) => {
      const række = payload.new;

      if (!række) return;

      let Klasse = brikKlasser[række.type];
      let brik = new Klasse(række.farve, række.x, række.y);

      placerBrik(brik);

      selectedPiece = null;
      selectedX = null;
      selectedY = null;
      gyldigeTræk = [];

      tegnBræt(bræt, gyldigeTræk, handleClick);
    }
  )
  .subscribe()//  starter lytningen






