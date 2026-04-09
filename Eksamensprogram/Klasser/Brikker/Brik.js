

//brik logik er inspireret af https://github.com/ahmad-kashkoush/Chess-Game/blob/main/src/JS/Game.js

//constructor
//overordnet brik logik
//de forskellige brikker bevægelses metoder 

// default gør at jeg kan importere klassen uden at bruge {} og uden at skulle bruge det samme navn
export default class Brik {

  constructor(farve, type, x, y) {
    this.farve = farve;
    this.type = type;
    this.y = y;
    this.x = x;
  }

}