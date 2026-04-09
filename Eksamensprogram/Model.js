



import { supabase } from './config.js';

// Gemmer hele brættets nuværende tilstand
export async function gemBræt(bræt) {
  // Saml alle brikker fra 2D-arrayet
  let brikker = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let brik = bræt.felter[y][x];
      if (brik !== null) {
        brikker.push({
          type: brik.type,
          farve: brik.farve,
          x: brik.x, 
          y: brik.y
        });
      }
    }
  }

  // Slet alle gamle positioner
  await supabase
    .from('Position')
    .delete()
    .gte('x', 0); // sletter alle rækker (sletter alt med x >= 0 (hvilket er alle rækker))

  // Indsætter de nye positioner
  let { error } = await supabase
    .from('Position')
    .insert(brikker);

  if (error) {
    console.error("Fejl ved gemning:", error);
  } else {
    console.log("Bræt gemt i Supabase!");
  }
  console.log("Gemmer brikker:", brikker);
}


// Henter brættet fra Supabase
export async function hentBræt() {
  let { data, error } = await supabase
    .from('Position')
    .select('*');

  if (error) {
    console.error("Bræt:", error);
    return null;
  }
  return data;
}


//tur kode
export async function hentTur() {
  let { data, error } = await supabase
    .from('Spil')
    .select('tur')
    .single();

  if (error) {
    console.error("Fejl ved hentning af tur:", error);
    return null;
  }
  return data.tur;
}


export async function gemTur(farve) {
  let { error } = await supabase
    .from('Spil')
    .update({ tur: farve })
    .eq('id', 1); // opdaterer rækken med id 1
    //id skal ændres hvis der skal være flere spil

  if (error) {
    console.error("Fejl ved gemning af tur:", error);
  }
}


//rokade kode
export async function hentRokade() {
  let { data, error } = await supabase
    .from('Spil')
    .select('rokade_hvid, rokade_sort')
    .single();

  if (error) {
    console.error("Fejl ved hentning af rokade:", error);
    return null;
  }
  return data;
}

export async function gemRokade(rokade) {
  let { error } = await supabase
    .from('Spil')
    .update(rokade)
    .eq('id', 1);

  if (error) {
    console.error("Fejl ved gemning af rokade:", error);
  }
}

//en passant kode
export async function gemEnPassant(x, y) {
  let { error } = await supabase
    .from('Spil')
    .update({ passant_x: x, passant_y: y })
    .eq('id', 1);

  if (error) console.error("Fejl ved gemning af en passant:", error);
}

export async function hentEnPassant() {
  let { data, error } = await supabase
    .from('Spil')
    .select('passant_x, passant_y')
    .single();

  if (error) {
    console.error("Fejl ved hentning af en passant:", error);
    return null;
  }
  return { x: data.passant_x, y: data.passant_y };
}