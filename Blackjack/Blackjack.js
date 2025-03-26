//Definierer noen verdier som skal brukes videre.

let player; //Lager spiller-variabelen
let dealer; //Lager dealer-variabelen
const ip = "127.0.0.1"; //Definierer IP-addressen til backend-serveren

//Definierer en event emission funksjon. 
// Dette er nødvendig siden vanlig require("event") kan ikke brukes på nettleseren i motsetning
// til Node.js

class MyEmitter extends EventTarget {
    emit(eventName, detail) {
      this.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
  
    on(eventName, callback) {
      this.addEventListener(eventName, (event) => callback(event.detail));
    }
  }

const emitter = new MyEmitter();

//Definiering av funksjoner


//Denne funksjonen tilsvarer Stand 
// Den er asynkron siden den skal vente på tilbakemelding fra andre funksjoner før den går videre
async function stand(){

  //Definierer noen verdier som skal brukes videre
  const Dealerimage = document.querySelector("#dealer-card2");
  const letters = dealer.cards.map(card=> card.Suit);
  const numbers = dealer.cards.map(card=> card.Number);

  //Viser det kortet til dealeren som tidligere var usynlig til spilleren
  Dealerimage.src = `./images/${numbers[1]}${letters[1].charAt(0)}.png`; 

  //Sjekker om dealeren har mindre enn 17 poeng fra starten
  //Hvis ja, begynnes dealerens tur gjennom en Promise som skal vente på
  //tilbakemelding før den går videre
  if(dealer.points<17){
    await waitForDealer();
  }

  //Koden går kun videre etter dealerens tur er ferdig 


//Sammenligner poengsummene til både spilleren og dealeren for å bestemme vinneren

//Spilleren taper hvis hen får mer enn 21 poeng
if(player.points >21){
      document.getElementById("Result").innerHTML = "You lost";
    }

//Spilleren vinner hvis dealeren får mer enn 21 poeng mens spilleren har under 21 poeng    
else if(dealer.points >21){
  document.getElementById("Result").innerHTML = "You won";

  //Utbetaler gevinsten 
  sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks") + (2*betAmount)));
}

//Spilleren taper hvis dealeren har flere poeng enn spillerens mens den er under 21
else if(dealer.points > player.points && dealer.points <=21){
      document.getElementById("Result").innerHTML = "You lost";
    }
  
//Spilleren vinner hvis hen har flere poeng enn dealeren mens den er under 21
else if(dealer.points < player.points && player.points <=21){
      document.getElementById("Result").innerHTML = "You won";
      //Utbetaler gevinsten
      sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks") + (2*betAmount)));
    }

//Det blir en draw hvis spilleren og dealeren har lik poeng
else if(dealer.points == player.points){
      document.getElementById("Result").innerHTML = "It's a draw";
      sessionStorage.setItem("gambleBucks", sessionStorage.getItem("gambleBucks") + (1*betAmount));
    }
   


  }


  //Lager en Promise som skal begynne dealerens tur og vent på tilbakemeldig før den skal kjøres videre
 function waitForDealer() {
    return new Promise((resolve) => {
        emitter.on('dealerHitComplete', resolve);
        emitter.emit('dealerHit'); // Start dealer's turn
    });
}  

//Lager en Restart funksjon
function restartGame() {

  


  //Nullstiller verdiene til spilleren og dealeren
  player = null;
  dealer = null;

  //Refresher siden
  location.reload();

}



//Programering av selve spillelogikken



//Venter på brukeren for å sende et innsatsbeløp gjennom popup-en
document.addEventListener("betSubmitted", function (event){

  // Lagrer innsatsbeløpet som ble sendt fra Popup.js filen
  const betAmount = Number(event.detail.amount);

  //Fjerner summen fra saldoen
  sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks") - betAmount));

//Sender en POST request til backend-en for å sette igang spillet
fetch(`http://${ip}:3000/startGame`, {
method: "POST",
headers: {
 "Content-Type": "application/json",  
},
body: JSON.stringify({ message: "Start the game" })
})
.then(response => response.json())
.then(data => {

//Henter verdier for spilleren og dealeren fra informasjonen sendt fra backend-en
const serverMessage = data.result; 
player = serverMessage.player;
dealer = serverMessage.dealer;



//Velger kortene som tilhører spilleren
const Playerimage = document.querySelector("#player-card1");
const Playerimage2 = document.querySelector("#player-card2");

//Bestemmer hvilke kort den har blitt tildelt
const letters = player.cards.map(card => card.Suit);
const numbers = player.cards.map(card => card.Number);

//Endrer bilde på kortene til de aktuelle kortene
Playerimage.src = `./images/${numbers[0]}${letters[0].charAt(0)}.png`;
Playerimage2.src = `./images/${numbers[1]}${letters[1].charAt(0)}.png`;

//Akkuratt det samme for dealeren
const Dealerimage = document.querySelector("#dealer-card1");

const _letters = dealer.cards.map(card => card.Suit);
const _numbers = dealer.cards.map(card => card.Number);


//Viser kun ett av kortene til dealeren på spilleflaten
Dealerimage.src = `./images/${_numbers[0]}${_letters[0].charAt(0)}.png`;

//Setter poengsummen til spilleren 
document.getElementById("points").innerHTML = player.points;

//Sjekker om spilleren hat fått 21 poeng
//Hvis ja, går spillet videre med en gang uten å vente på input fra spilleren
if(player.points ==21){
    stand();
}










})
//Skriver ut evt. feilmeldinger
.catch(error => console.error("Error:", error));



 })


//Legger til en hendelseneslyttere på Hit knappen
 document.getElementById("Hit").addEventListener("click", ()=>{

    //Sender en POST request til backend for å hente et nytt kort som skal deles til spilleren
    fetch(`http://${ip}:3000/hit`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",  
    },
    body: JSON.stringify({ message: "Hit" })
    })
    .then(response => response.json())
    .then(data => {
    
    //Henter og lagrer informasjon sendt fra backend-serveren
    const serverMessage = data.result;
    player = serverMessage.player;
    
    const playerCards = serverMessage.player.cards.flat(); //Oppdaterer spillerens kortstokk med det nye kortet

    //Kartlegger kort informasjon på nytt
    const letters = playerCards.map(card=>card.Suit);
    const numbers = playerCards.map(card => card.Number);

    
    //Lager et img element som skal ha et bilde som tilsvarer det nye kortet spilleren fikk
    let img = document.createElement('img');
    let div = document.querySelector(".player");
    img.src = `./images/${numbers[numbers.length-1]}${letters[letters.length-1].charAt(0)}.png`
    img.classList.add("card"); //Legger til en class for stilien

    div.appendChild(img); //Legger til bildet/kortet på spilleflaten
    
    //Oppdaterer spillerens poengsum
    document.getElementById("points").innerHTML = player.points;

    
   //Sjekker om spillerens poengsum er over 21
   if(player.points>21){
    
    //Iterer gjennom kortstokken og sjekker om spilleren har en Ace
    //Hvis ja, endrer den poengsummen slik at Ace tilsvarer en verdi på 1 istedenfor 11
    for(let i=0;i<numbers.length;i++){
      if(numbers[i][0] == "A"){
        player.points -= 10;
        document.getElementById("points").innerHTML = player.points;
        return null; //Stopper funksjonen slik at den ikke går videre herfra
      }
    }

    //Hvis den ikke finner en Ace, skal den slutte hånden til spilleren.
    stand();
   }

   //Skal stå hvis spillerens poengsum er lik 21

   else if(player.points==21){
    stand();
   }
    
    


    
    
    })
    //Skriver ut evt feilmeldinger
    .catch(error => console.error("Error:", error));
    
    
    
     })


//Legger til en hendelseslytter på Stand knappen. Stand funksjonen skal kjøres ved trykk
document.getElementById("Stand").addEventListener("click", stand);

//Legger til en hendelseslytter på dealerHit hendelsen som skal sette i gang 
// hånden til dealeren
emitter.on('dealerHit',()=>{
    //Sender en POST request til backend-en for å hente kortene til dealeren
    fetch(`http://${ip}:3000/hitDealer`, {
      method: "POST",
      headers: {
       "Content-Type": "application/json",  // Ensures Express can parse the request
      },
      body: JSON.stringify({ message: "Hit" })
      })
      .then(response => response.json())
      .then(data => {

      //Lagrer informasjonen sendt fra backend-en  
      const serverMessage = data.result;
      dealer = serverMessage.dealer;

      //Kartlegger kortene til dealeren 
      const letters = dealer.cards.flat().map(card=>card.Suit);
      const numbers = dealer.cards.flat().map(card => card.Number);
      
      //Lager og viser bildet til det nye kortet til dealeren
      let img = document.createElement('img');
      let div = document.querySelector(".dealer");
      img.src = `./images/${numbers[numbers.length-1]}${letters[letters.length-1].charAt(0)}.png`
      img.classList.add("card");
      div.appendChild(img);
      
        })
        
    
        
        
        
        //Skriver ut evt feilmeldinger
        .catch(error => console.error("Error:", error));
        
        
    //Passer på dealeren fortsetter å "hitte" fram til poengsummen er over eller lik 17
    // Har en timeout siden Js er synkron og vil fortsette med denne funksjonen før poengsummen 
    // til dealeren har oppdatert    
    setTimeout(()=>{
      if(dealer.points < 17){
        emitter.emit('dealerHit');
      }
      else{
        emitter.emit('dealerHitComplete')
      }
    },500);





})

//Legger til en hendeleslyttere på Restart knappen
document.getElementById("Restart").addEventListener("click", restartGame);

    




 









     