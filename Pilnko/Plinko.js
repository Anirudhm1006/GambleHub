//Definerer noen konstane verdier
const canvas = document.getElementById('plinkoCanvas'); //Spilleplata 
const ip = "127.0.0.1"; //Backend IP addresse
    const ctx = canvas.getContext('2d'); 

    const DECIMAL_MULTIPLIER = 1000000000000000000000000000000000000000000; //Stort tall for økt presisjon

    const WIDTH = 800; //Bredde til canvas
    const HEIGHT = 800; // Høyde til canvas
    const ballRadius = 7; //Radius til ballen
    const obstacleRadius = 4; // Radius til hindringen
    const gravity = pad(0.4); //Tyngekraft
    const horizontalFriction = 0.4; //Vannrett friksjon
    const verticalFriction = 0.8; //Loddrett friksjon
    let balls = []; // Ball arrayet

    const obstacles = []; // Hindring arrayet
    const sinks = []; // Hull arrayet
    let multipliers = [10, 8, 5, 2.5, 2, 1.5, 1, 0.5, 1, 1.5, 2, 2.5, 5, 8, 10]; // Multipliers arrayet

    let betAmount = 0; // Innsatsbeløpet

    //Funksjon for å gjøre om til et heltall
    function pad(n) {
      return n * DECIMAL_MULTIPLIER;
    }

    // Funksjon for å gjøre om til desimal tall
    function unpad(n) {
      return Math.floor(n / DECIMAL_MULTIPLIER);
    }

    //Padding og Unpadding brukes her for å unngå presisjonsfeil når programmet 
    // skal kjøres på ulike maskiner.
    
    //Forskjellige maskiner tolker desimaler annerledes og derfor
    // er det lurt å gjøre om til et helttall før man regner på det



    //Event emitter definisjon siden det er nettleser runtime 
    class MyEmitter extends EventTarget {
      emit(eventName, detail) {
        this.dispatchEvent(new CustomEvent(eventName, { detail }));
      }
    
      on(eventName, callback) {
        this.addEventListener(eventName, (event) => callback(event.detail));
      }
    }
  
  const emitter = new MyEmitter();

    // Lager hindringer
    const rows = 16;
    for (let row = 2; row < rows; row++) {
      const numObstacles = row + 1;// 3
      const y = 0 + row * 35;
      const spacing = 36;
      for (let col = 0; col < numObstacles; col++) {
        const x = WIDTH / 2 - spacing * (row / 2 - col); //Passer på at hindringene er plassert likt
        obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius }); // Legger dem til arrayet
      }
    }

    // Lager hull
    const sinkWidth = 36; //Bredde på hullet
    const NUM_SINKS = 15; // Antall hull
    for (let i = 0; i < NUM_SINKS; i++) {
      const x = WIDTH / 2 + (i - NUM_SINKS/2) * (sinkWidth) + obstacleRadius;
      const y = HEIGHT - 240;
      const width = sinkWidth;
      const height = width;
      sinks.push({ x, y, width, height }); //Legger dem til i arrayet
    }





    //Class objekt for ballen
    class Ball {
      constructor(x, y, radius, color) {
        this.x = x; //Ballens x verdi
        this.y = y; // Ballens y verdi
        this.radius = radius; // Ballens radius
        this.color = color; // Ballens farge
        this.vx = 0; // Ballens horisontal fart
        this.vy = 0; // Ballens vertikal fart
      }

      //Metode for å tegne ballen på canvas
      draw() {
        ctx.beginPath();
        ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
      
      //Endrer egenskapene til ballen hver frame
      update() {
        
        this.vy = this.vy + gravity; //Endrer vertikal farten mtp tyngekraft
        this.x += this.vx; // Endrer horisontal posisjon 
        this.y += this.vy; // Endrer vertikal posisjon

        // Kollisjoner med hindringene
        obstacles.forEach(obstacle => {
          const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
          if (dist < pad(this.radius + obstacle.radius)) {
            // Regner kollisjonsvinkelen
            const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
            // Regner ut farten i alle vektorer ved bruk av fysikk
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = (Math.cos(angle) * speed * horizontalFriction);
            this.vy = Math.sin(angle) * speed * verticalFriction;

            // Justerer overlap hvis det finnes
            const overlap = this.radius + obstacle.radius - unpad(dist);
            this.x += pad(Math.cos(angle) * overlap);
            this.y += pad(Math.sin(angle) * overlap);
          }
        });

        // Kollisjon med hull
        sinks.forEach((sink, index) => {
          if (
            unpad(this.x) > sink.x - sink.width / 2 &&
            unpad(this.x) < sink.x + sink.width / 2 &&
            unpad(this.y) + this.radius > sink.y - sink.height / 2 &&
            unpad(this.y) + this.radius < sink.y - sink.height / 2.5
          ) {
            this.vx = 0; //Nullstiller horisontal fart ved hull kollisjon
            emitter.emit("Collision", {index:index});//Emitter kollisjon hendelsen

            
          }
        });
      }
    }



    //Funksjonen for å tegne hindringene
    function drawObstacles() {
      ctx.fillStyle = 'white';
      obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    }

    //Funksjonen for å tegne hullene
    function drawSinks() {
      ctx.fillStyle = 'green';
      ctx.textAlign = "center";  
      ctx.textBaseline = "middle"; 
      ctx.font = "15px Arial";


      for (let i = 0; i<sinks.length; i++)  {
        const sink = sinks[i];
        ctx.fillRect(sink.x, sink.y - sink.height / 2, sink.width - obstacleRadius * 2, sink.height);


        ctx.fillStyle = "white"; 
        ctx.fillText(`${multipliers[i]}x`, sink.x + sink.width / 2 - obstacleRadius, sink.y); 
        ctx.fillStyle = "green"; 
        
      };
    }

    //Legger til ball i arrayet
    function addBall(x) {
      const newBall = new Ball(pad(x), pad(50), ballRadius, 'red');
      balls.push(newBall);
    }

    //Legger til hendelseslyttere på add-ball knappen
    document.getElementById("add-ball").addEventListener("click", ()=>{

      betAmount = Number(document.querySelector("input[name=bet]").value);//Innsatsbeløpet
      sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks"))-betAmount);//Fjerner innsatsbeløpet fra saldoen

      //Sender POST request til backenden for å hente informasjon
      fetch(`http://${ip}:3001/sendPath`, {
      method: "POST",
      headers: {
       "Content-Type": "application/json",  
      },
      body: JSON.stringify({ message: "Send Path" })
      })
      .then(response => response.json())
      .then(data => {


      const serverMessage = data.response; //Svar fra server

      //Utbetalingen behandles med engang siden vi vet hvor ballen skal
      let money = betAmount*parseFloat(multipliers[serverMessage.sink]); 
      updateMoney(money);
      betAmount=0;//Innsatsbeløpet nullstilles
      
      addBall(serverMessage.xValue); //Tegner ballen på spilleplata med X-verdien fra serveren

      
      //Endrer visning ved kollisjon
      emitter.on("Collision", function(data){


        updateDisplay();
        
      })

      
      
      })
      //Skriver ut evt feilmeldinger
      .catch(error => console.error("Error:", error));
      
      
      
       })

    //Funksjon for å tegne ballene
    function draw() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      drawObstacles();
      drawSinks();
      balls.forEach(ball => {
        ball.draw();
        ball.update();
      });
    }

    //Game Loop. Bruker recursion for å kjøre update() hver frame
    function update() {
      draw();
      requestAnimationFrame(update);//Kjører recursion med mindre nettsiden vil bruke ressurser på noe annet
    }


    

    update(); //Setter i gang game loop

    //Oppdaterer penger
    function updateMoney(AddAmount){
      if(!sessionStorage.getItem("gambleBucks")){
          console.log("Error: Currency not found in SessionStorage.");
      }
      else{
          sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks"))+Number(AddAmount));
      }
  }

  function updateDisplay(){
    document.getElementsByClassName("MoneyDisplayText")[0].innerHTML = `Balance: ${Math.round(sessionStorage.getItem("gambleBucks"))} GambleBucks`;
  }
  