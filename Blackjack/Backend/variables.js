const { start } = require("repl");


//Lager verdier for kortene som skal spilles
var suits = ["Spades", "Clubs", "Diamonds", "Hearts"];
var number = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
var weight =0

//En funksjon som skal lage kortstokken. 
function CreateDeck(){

    var deck = new Array(); // Definierer kortstokken som et array

    //Går gjennom alle mulige kombinasjoner for kortene og setter dem i arrayet.
    for(let i=0; i<suits.length;i++){
        let _suit = suits[i];
        for(let j=0; j<number.length;j++){
           
            let _number = number[j];
            if(number[j] === "J"||number[j] === "Q"||number[j] === "K"){
                var _weight = parseInt(10);
                
            }
            else if(number[j] === "A"){
                var _weight = 11;
                
            }
            else{
                var _weight = parseInt(number[j]);
               
            }

            let card = {Suit: _suit, Number: _number, Weight: _weight};
            deck.push(card);

        }
    }

    return deck; //Returnerer kortstokken

}

//Blander kortene ved å endre posisjonene til to av de kortene om gangen. Kjøres 1000 ganger.
function shuffleDeck(deck)
{
    
    for (var i = 0; i < 1000; i++)
    {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

//Lager en klasse for spilleren
class Player{

    //Inneholder ulike objekter som tilhører spilleren
    constructor(cards,weights){
        this.cards = cards; //Har informasjon om kortene
        this.weights = weights;//Har informasjon om verdien til kortene
        this.points = this.calculateTotalPoints(this.weights);//Regner ut summen av verdiene
    }

    //Oppdaterer poeng etter å ha blitt gitt flere kort
    updatePoints(_newWeights){
        this.points = 0;
        this.weights.push(_newWeights);


        for(let i=0; i<this.weights.length;i++){
            this.points += parseInt(this.weights[i]);


        }

        
        
    }


    //Funksjonen som beregner summen av verdiene nevnt ovenfor
    calculateTotalPoints(array){
        let _totalPoints = 0;
        for(let i=0; i<array.length;i++){
            _totalPoints += parseInt(array[i]);


        }
        return _totalPoints;
    }
}


//Deler kort til spilleren
function dealCards(array){
    let dealtCards = [];
    randnum1 = Math.floor(Math.random()*array.length);
    randnum2 = Math.floor(Math.random()*array.length);
    dealtCards.push(array[randnum1]);
    dealtCards.push(array[randnum2]);
    return dealtCards;

}

//Deler kort til dealeren
function dealCardsHit(array){
    let dealtCards = [];
    randnum1 = Math.floor(Math.random()*array.length);
    dealtCards.push(array[randnum1]);
    return dealtCards;

}



//Eksporterer funksjonene for bruk i andre filer
module.exports = {CreateDeck: CreateDeck, shuffleDeck: shuffleDeck, dealCards: dealCards, 
                  Player:Player, dealCardsHit:dealCardsHit

};





