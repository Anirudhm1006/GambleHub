const results = require('./_results.json');
const Event = require('events');
const express = require('express');
const app = express();
const cors = require('cors');


function removeGlobalDuplicates(array) {
    // Count occurrences of each number
    let count = new Map();
    
    // Flatten the array and count occurrences
    array.flat().forEach(num => {
        count.set(num, (count.get(num) || 0) + 1);
    });

    // Filter out numbers that appear more than once
    let newArray = array.map(row => row.filter(num => count.get(num) === 1));

    return newArray;
}

//console.log(removeGlobalDuplicates(results));


function CalculateSink() {
    let num = Math.floor(Math.random() * 1000);

    if (num < 5) {
        return 0;
    } else if (5 <= num && num <= 10) {
        return 14;
    } else if (11 <= num && num <= 21) {
        return 1;
    } else if (22 <= num && num <= 32) {
        return 13;
    } else if (33 <= num && num <= 43) {
        return 2;
    } else if (44 <= num && num <= 54) {
        return 12;
    } else if (55 <= num && num <= 90) {
        return 3;
    } else if (91 <= num && num <= 128) {
        return 11;
    } else if (129 <= num && num <= 169) {
        return 4;
    } else if (170 <= num && num <= 210) {
        return 10;
    } else if (211 <= num && num <= 261) {
        return 5;
    } else if (262 <= num && num <= 312) {
        return 9;
    } else if (313 <= num && num <= 413) {
        return 6;
    } else if (414 <= num && num <= 514) {
        return 8;
    } else if (515 <= num && num <= 1000) {
        return 7;
    }

    return null; 
}


function XValueCalculate(sink){

    return results[sink][Math.floor(Math.random()*results[sink].length)];

}

function Test(){
    let sink = CalculateSink();
    let path = XValueCalculate(sink);

    console.log(`The ball should land at sink ${sink} when dropped from ${path}`);
}



app.use(cors());
app.use(express.json());

app.post('/sendPath', (req,res)=>{
    console.log("Headers: " + req.headers);
    console.log(req.body);

    let tmpResponse = CalculateSink();
    const response  = {sink:tmpResponse, xValue: XValueCalculate(tmpResponse) };
    res.json({response});

});




app.listen(3001);

