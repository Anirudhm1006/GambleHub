
//Definerer noen konstante verdier
const totalBoxes = 16; //Antall bokser
let totalBombs;//Antall bomber
let betAmount;//Innsatsbløpet
let boxes;
let safeBoxes=0;
let money=0;//Utbetalingspenger
const container = document.getElementById("Spill-conteinerg");
const bodyEl = document.querySelector("body");



//Legger til en hendelseslyttere på input feltet der antall bomber skal skrives
document.getElementById("bombCount").addEventListener("input", function(){

    //Leser av verdien skrevet 
    const bombValue = this.value;

    //Edge case hvis man velger mer enn 15 bomber
    if(bombValue>15){
        document.getElementById("Multiplier").innerHTML = "Du kan kun velge opptil 15 bomber";
    }
    else{
        //Viser multiplier
        document.getElementById("Multiplier").innerHTML = `${MultiplierCalculator(bombValue)}x`

    }
    
})

//Legger til hendelseslytter på start/submit knappen
document.getElementById("MinesForm").addEventListener("submit", function(e){
    e.preventDefault();//Passer på at siden ikke refresher

    //Leser av verdiene til antall bomber og innsatsbeløpet
    totalBombs = document.querySelector("input[name=bombs]").value;
    betAmount = document.querySelector("input[name=bet]").value;

    sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks") - betAmount)); //Fjerner innsatsbeløpet fra saldoen

    //Edge case hvis brukeren prøver å vedde mer enn hen har
    if(betAmount > sessionStorage.getItem("gambleBucks")){
        alert("Du er blakk mann hva faen");
        return null;
    }

    //Starter spillet
    Start();

})

function Start(){
    createBoxes(totalBoxes);//Oppdaterer spilleplata med 16 blokker
    pickRandom(totalBoxes, totalBombs);//Plasserer bomber
    listen(boxes);//Hører etter click på blokkene

}

//Lager blokkene
function createBoxes(x){
    
    //Fjerner alt fra spilleplata og endrer stilen 
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "20px";

    //Lager en div til blokkene som er i grid form
    let MinesDiv = document.createElement("div");
    MinesDiv.style.display = "grid";
    MinesDiv.style.gridTemplateColumns = `repeat(${Math.sqrt(x)}, 1fr)`;
    MinesDiv.style.gridGap = "30px";


    //Itrerer gjennom diven og legger til bilder til alt
    for(let i =0; i<x;i++){
        let img = document.createElement('img');
        img.classList.add("box");
        img.src = "./images/chest.png";
        MinesDiv.appendChild(img);
    }

    //Putter diven i spilleplata
    container.appendChild(MinesDiv);

    //Lager og setter inn en Cashout knapp
    let buttonEl = document.createElement("button");
    buttonEl.innerHTML = "Cashout";
    buttonEl.setAttribute("id", "CashoutBtn");
    container.appendChild(buttonEl);

    //Legger til en hendelseslytter på knappen for å cashe out
    buttonEl.addEventListener("click", Cashout);
}


//Lager bomber
function pickRandom(totalBoxes,totalBombs){

    //Lager et array med alle blokkene
    boxes = document.getElementsByClassName("box");
    let addedBombs = 0;
    
    //Legger til bomber fram til det finnes like mange bomber som spilleren ønsker
    while(addedBombs!=totalBombs){

        let tmp = Math.floor(Math.random()*totalBoxes);

        //Sjekker om blokken allerede har en bombe, hvis ikke får den en bombe
        if(!boxes[tmp].classList.contains("bomb")){
            boxes[tmp].classList.add("bomb");
            addedBombs++;
        }

    }
    
}

//Legger til hendelseslytter på alle blokkene
function listen(array){
    for(let i=0;i<array.length;i++){
        array[i].addEventListener("click", checkForBomb);
    }
}

//Sjekker om det er en vanlig blokk eller en bombe
function checkForBomb(e){
    MouseClick();//lyd effekten

    const button = e.target;//Definerer blokken som ble trykket på

    //Sjekker om det er en bombe
    if(button.classList.contains("bomb")){
        button.src = "./images/Bomb.jpg"//Endrer bilde til bombe
        const sound2 = new Audio("./Music/bomb.mp3")
        sound2.play();//bombe lyd effekt

         money = (-1)*betAmount;//Utbetalingsmengde

         //Går gjennom alle andre blokkene og endrer bildet basert på om det er bombe eller ikke
         for(let i=0; i<boxes.length;i++){
            if(boxes[i].classList.contains("bomb")){
                boxes[i].src = "./images/Bomb.jpg"

            }
            else{
                boxes[i].src= "./images/diamond.jpg";

            }
         }
        

       
        
    }

    //Hvis det ikke er bombe
    else{
        button.src= "./images/diamond.jpg";//Endrer bildet til diamant
        safeBoxes++;

        betAmount = betAmount*MultiplierCalculator(totalBombs);//Utbetalingsmengden

        money = betAmount;

        
    }

    
}

//Lyd effekt
function MouseClick(){
    const clickSound = new Audio("./Music/mouse.mp3");
 

document.addEventListener("click", function(event) {
  
 
  clickSound.play();
  setTimeout(() => {
    clickSound.pause();
    clickSound.currentTime = 1,2; // Nullstill lyden for neste avspilling
  }, 250);
});
}

//Funksjonen for å beregne multiplier
function MultiplierCalculator(bombs){
    return (1+(1/(totalBoxes-bombs))).toFixed(2);
}

//Cashout funksjonen
function Cashout(){
    updateMoney(money);
    location.reload();//refresher siden
}

//Oppdaterer pengene

function updateMoney(AddAmount){
    if(!sessionStorage.getItem("gambleBucks")){
        console.log("Error: Currency not found in SessionStorage.");
    }
    else{
        sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks"))+Number(AddAmount));

    }
}
