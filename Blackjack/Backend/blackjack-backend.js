
//Definierer konstante verdier som blant annet pakker og biblioteker for å bruke i koden.
const { start } = require("repl");
const variables = require("./variables.js");//Her hentes det en del funskjoner fra variables.js som skal brukes her
const express = require('express');
const app = express();
const cors = require('cors');
const { spawn } = require('child_process');
let player1;
let dealer;

let childProcess = null;

//Lager kortstokken ved å bruke en funskjon definert i variables.js
//Referer til denne filen hvis du ønsker en forklaring på hvordan funksjonen fungerer
var deck = variables.CreateDeck(); 

//Funksjonen setter i gang spillet
function startGame(){

    variables.shuffleDeck(deck);//Blander kortstokken


    //Deler ut kort til spilleren

    let dealtCards = variables.dealCards(deck);
    player1 = new variables.Player(dealtCards, dealtCards.map(card => card.Weight));

    //Deler ut kort til dealeren

    let dealtCards2 = variables.dealCards(deck);
    dealer = new variables.Player(dealtCards2, dealtCards2.map(card => card.Weight));


    //Returner to objekter. Nemlig, spilleren og dealeren.
    return {player: player1,dealer:dealer};
    



}


//Funksjonen gir et kort til spilleren hvis hen ønsker det.
function hit(){
    player1.cards.push(variables.dealCardsHit(deck)); //Henter et kort fra stokken og legger til den til arrayet.
    var _newWeights = player1.cards[player1.cards.length-1].flat().map(card => card.Weight);//Lager oversikt over verdiene av kortene
    player1.updatePoints(_newWeights); //Regner på nytt poengsummen av kortenes verdier.
    player1.cards.flat();

    return {player:player1};//Returner spilleren objektet



}

//Funksjonen gir et kort til dealeren
function hitDealer(){
    dealer.cards.push(variables.dealCardsHit(deck)); //Henter et kort fra stokken og legger til den til arrayet.
    var _newWeights = dealer.cards[dealer.cards.length-1].flat().map(card => card.Weight);//Lager oversikt over verdiene av kortene
    dealer.updatePoints(_newWeights); //Regner på nytt poengsummen av kortenes verdier.
    dealer.cards.flat();

    return {dealer:dealer};//Returner dealeren objekter



}


//Innstillingen av serveren

//Serveren bruker CORS 
app.use(cors());

app.use(express.json());

//Defininer funksjonen som skal settes i gang når server får en POST request på /startGame
app.post('/startGame', (req,res)=>{

    //Logger requesten
    console.log("Headers: " + req.headers);
    console.log(req.body);

    //Sender spiller og dealer objektet som svar
    const result  = startGame();
    res.json({result});

});

//Defininer funksjonen som skal settes i gang når server får en POST request på /hit
app.post('/hit', (req,res)=>{

    //Logger requesten
    console.log("Headers: " + req.headers);
    console.log(req.body);

    //Sender et nytt kort som resultat
    const result  = hit();
    res.json({result});

});

//Defininer funksjonen som skal settes i gang når server får en POST request på /hitDealer
app.post('/hitDealer', (req,res)=>{
    //Logger requesten
    console.log("Headers: " + req.headers);
    console.log(req.body);

    //Sender et nytt kort som resultat
    const result  = hitDealer();
    res.json({result});

});


//Serveren kjøres på port 3000
app.listen(3000);
















