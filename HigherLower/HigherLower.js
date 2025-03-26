
//Definierer noen verdier som skal brukes videre
const slider = document.getElementById("slider"); //Slider
const valueDisplay = document.getElementById("valueDisplay"); //Verdien til tallet fra slideren
const radioButtons = document.querySelectorAll("input[name='valg']"); //Høyere og Lavere knapper
const ProbDisplay = document.getElementById("ProbDisplay"); //Sannsynlighetsverdien


//Definering av funksjoner

//Returnerer et tilfeldig tall
function randomTall(){
    return Math.floor(Math.random()*100);
}

//Refresher siden
function restart(){
    location.reload();
}

//Regner ut sannsynligheten
function ProbabilityCalculator(n,HL){

    if(HL == "Higher"){
        return 100-n;
    }

    else if(HL == "Lower"){
        return n;
    }

}

//Regner ut multiplier ved bruk av en logaritmisk funksjon
function MultiplierCalculator(Percentage){
    return 6.8101-(1.2655*Math.log(Number(Percentage))).toFixed(2);
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

//SpilleLogikken


//Legger til en hendelseslyttere på slideren og hører etter input
slider.addEventListener("input", function() {

    //Endrer verdien til visningen til slideren sin verdi
    valueDisplay.textContent = this.value;


    //Sjekker om noen av de radio knappene har blitt valgt
    if(document.querySelector('input[name="valg"]:checked')){
     
    //Definierer knappen som ble valgt    
    let selectedRadioButton = document.querySelector('input[name="valg"]:checked');

    //Sjekker om det er "høyere" eller "venstre" knappen som er valgt

    if(selectedRadioButton.id == "higher"){
        //Viser sannsynligheten
        ProbDisplay.innerHTML = `${ProbabilityCalculator(valueDisplay.textContent,"Higher")}%`;

    }

    else if(selectedRadioButton.id == "lower"){
        //Viser sannsynligheten
        ProbDisplay.innerHTML = `${ProbabilityCalculator(valueDisplay.textContent,"Lower")}%`;

    }
    }

    else{
        return null;
    }

    



});


//Lager en Observer som observerer sannsynlighetstallet
const observer = new MutationObserver(() => {
    //Lager en variable som konverter stringen til sannsynlighetstallet til en int
    var numb = ProbDisplay.innerHTML.match(/\d/g);
    numb = numb.join("");

    //Endrer verdien til multiplier basert på sannsynlighetstallet
    document.getElementById("MultiDisplay").innerHTML = `${MultiplierCalculator(numb).toFixed(2)}x`;
});

//Observer verdien til sannsynlighet for å kunne endre multiplier
observer.observe(ProbDisplay, { childList: true, subtree: true });


//Legger til hendelseslytter til alle radio knappene
for(let i=0; i<radioButtons.length;i++){
    radioButtons[i].addEventListener("click", function(){

        //Sjekker om en annen knapp har blitt valgt og endrer sannsynlighetstallet basert på
        //det nye valget


        if(radioButtons[i].id == "higher"){

            ProbDisplay.innerHTML = `${ProbabilityCalculator(valueDisplay.textContent,"Higher")}%`;

        }

        else if(radioButtons[i].id == "lower"){

            ProbDisplay.innerHTML = `${ProbabilityCalculator(valueDisplay.textContent,"Lower")}%`;

        }
    })
}

//Legger til en hendeleseslytter på submit/start knappen
document.getElementById("radioForm").addEventListener("submit", function(e) {
    e.preventDefault();//Siden refresher ikke
    
    //Definerer valgte knapp (H eller L) i tillegg til innsatsbeløpet
    const selectedOption = document.querySelector('input[name="valg"]:checked');
    const betAmount = document.querySelector('input[name="bet"]').value;
   
    //Genererer til et tilfeldig tall
    let tall = randomTall();
    let title = document.getElementById("title");


    //Sjekker om en av de knappene har faktisk blitt valgt
    if (selectedOption) {


        //Lagrer den valgte knappen i sessionStorae for å gjøre det tilgjengelig etterpå
        sessionStorage.setItem("selectedOption", selectedOption.value);
        
        //Fjerner elementer fra containeren for å lage plass til resultatet
        document.getElementById("Spill-conteinerg").removeChild(document.getElementById("formDiv"));

        title.innerHTML = "Tallet er....."; //Mellomtidstekst for dramatisk effekt


        //Lager en liten delay før resultatet er vist. Igjen, for dramatisk effekt.
        setTimeout(()=>{

            //Bestemmer kravene for seier/tap

            if(selectedOption.value == "Høyere"){
                if(valueDisplay.textContent <tall){
                    title.innerHTML = `Du vant!!! Tallet var ${tall}`;

                    //Beregninger utbetalingen

                    //Lagrer tallet som sto på multiplieren og gjør den om til en int
                    let numb = document.getElementById("MultiDisplay").innerHTML.match(/\d/g);
                    numb = numb.join("");


                    //Oppdaterer penger etter å ha delt numb med 100 for å få det oppringlige tallet
                    //Selvfølgelig visste jeg at vi skulle dele med 100. Selvfølgelig glemte jeg ikke grunnleggende matematikk. :)
                    updateMoney(betAmount*parseFloat(numb/100));
    
                }

                //Setter krav for tap og fjerner innsatsbeløpet fra saldoen
                else if(valueDisplay.textContent>tall){
                    title.innerHTML = `Du tapte:// Tallet var ${tall}`;
                    let money = (-1)*betAmount;
                    updateMoney(money);
    
                }
    
                }
            
    
    
            //Akkurat det samme for "Lavere"
            
            else if(selectedOption.value == "Lavere"){
    
                if(valueDisplay.textContent <tall){
                    title.innerHTML = `Du tapte:// Tallet var ${tall}`;
                    let money = (-1)*betAmount;
                    updateMoney(money);
    
                }
    
                else if(valueDisplay.textContent>tall){
                    title.innerHTML = `Du vant!!! Tallet var ${tall}`;
                    
                    var numb = document.getElementById("MultiDisplay").innerHTML.match(/\d/g);
                    numb = numb.join("");

                    
                    updateMoney(betAmount*parseFloat(numb/100));
    
                }
    
            }

        },1500)

        //Legger til en Restart knapp

        let button = document.createElement("button");
        button.addEventListener("click", restart);
        button.innerHTML = "Spille på nytt"
        document.getElementById("Spill-conteinerg").appendChild(button);

        
            
            

        
            
    
    

    }
        
        //Edge Case
    else {
        alert("Velg et alternativ før du sender inn!");
    }
});













