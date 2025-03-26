const canvas = document.getElementById('plinkoCanvas');
const ip = "127.0.0.1";
    const ctx = canvas.getContext('2d'); // createCircle, createRectangle, createTriangle, createLine

    const DECIMAL_MULTIPLIER = 1000000000000000000000000000000000000000000;

    const WIDTH = 800;
    const HEIGHT = 800;
    const ballRadius = 7;
    const obstacleRadius = 4;
    const gravity = pad(0.4);
    const horizontalFriction = 0.4;
    const verticalFriction = 0.8;
    let balls = [];

    const obstacles = [];
    const sinks = [];
    let multipliers = [10, 8, 5, 2.5, 2, 1.5, 1, 0.5, 1, 1.5, 2, 2.5, 5, 8, 10];

    let betAmount = 0;

    function pad(n) {
      return n * DECIMAL_MULTIPLIER;
    }

    function unpad(n) {
      return Math.floor(n / DECIMAL_MULTIPLIER);
    }


    class MyEmitter extends EventTarget {
      emit(eventName, detail) {
        this.dispatchEvent(new CustomEvent(eventName, { detail }));
      }
    
      on(eventName, callback) {
        this.addEventListener(eventName, (event) => callback(event.detail));
      }
    }
  
  const emitter = new MyEmitter();

    // Create obstacles in a pyramid shape
    const rows = 16;
    for (let row = 2; row < rows; row++) {
      const numObstacles = row + 1;// 3
      const y = 0 + row * 35;
      const spacing = 36;
      for (let col = 0; col < numObstacles; col++) {
        const x = WIDTH / 2 - spacing * (row / 2 - col);
        obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius });
      }
    }

    // Create sinks at the bottom as rectangles
    const sinkWidth = 36;
    const NUM_SINKS = 15;
    for (let i = 0; i < NUM_SINKS; i++) {
      const x = WIDTH / 2 + (i - NUM_SINKS/2) * (sinkWidth) + obstacleRadius;
      const y = HEIGHT - 240;
      const width = sinkWidth;
      const height = width;
      sinks.push({ x, y, width, height });
    }






    class Ball {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
      
      update() {
        // change the velocity, change the positions
        this.vy = this.vy + gravity;
        this.x += this.vx; // x = x1 + v
        this.y += this.vy;

        // Collision with obstacles
        obstacles.forEach(obstacle => {
          const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
          if (dist < pad(this.radius + obstacle.radius)) {
            // Calculate collision angle
            const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
            // Reflect velocity
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = (Math.cos(angle) * speed * horizontalFriction);
            this.vy = Math.sin(angle) * speed * verticalFriction;

            // Adjust position to prevent sticking
            const overlap = this.radius + obstacle.radius - unpad(dist);
            this.x += pad(Math.cos(angle) * overlap);
            this.y += pad(Math.sin(angle) * overlap);
          }
        });

        // Collision with sinks
        sinks.forEach((sink, index) => {
          if (
            unpad(this.x) > sink.x - sink.width / 2 &&
            unpad(this.x) < sink.x + sink.width / 2 &&
            unpad(this.y) + this.radius > sink.y - sink.height / 2 &&
            unpad(this.y) + this.radius < sink.y - sink.height / 2.5
          ) {
            this.vx = 0;
            emitter.emit("Collision", {index:index});

            
          }
        });
      }
    }




    function drawObstacles() {
      ctx.fillStyle = 'white';
      obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    }

    function drawSinks() {
      ctx.fillStyle = 'green';
      ctx.textAlign = "center";  // Center text horizontally
      ctx.textBaseline = "middle"; // Center text vertically
      ctx.font = "15px Arial"; // Set font size and type


      for (let i = 0; i<sinks.length; i++)  {
        const sink = sinks[i];
        ctx.fillRect(sink.x, sink.y - sink.height / 2, sink.width - obstacleRadius * 2, sink.height);


        ctx.fillStyle = "white"; // Set text color
        ctx.fillText(`${multipliers[i]}x`, sink.x + sink.width / 2 - obstacleRadius, sink.y); // Position text
        ctx.fillStyle = "green"; // Reset fill color for next sink
        
      };
    }

    function addBall(x) {
      const newBall = new Ball(pad(x), pad(50), ballRadius, 'red');
      balls.push(newBall);
    }

    document.getElementById("add-ball").addEventListener("click", ()=>{
      betAmount = Number(document.querySelector("input[name=bet]").value);
      sessionStorage.setItem("gambleBucks", Number(sessionStorage.getItem("gambleBucks"))-betAmount);

      fetch(`http://${ip}:3001/sendPath`, {
      method: "POST",
      headers: {
       "Content-Type": "application/json",  
      },
      body: JSON.stringify({ message: "Send Path" })
      })
      .then(response => response.json())
      .then(data => {
      console.log("Server response: ", data);
      const serverMessage = data.response; 
      let money = betAmount*parseFloat(multipliers[serverMessage.sink]);
      updateMoney(money);
      betAmount=0;
      
      addBall(serverMessage.xValue);

      

      emitter.on("Collision", function(data){


        updateDisplay();
        
      })

      
      
      })
      .catch(error => console.error("Error:", error));
      
      
      
       })

    function draw() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      drawObstacles();
      drawSinks();
      balls.forEach(ball => {
        ball.draw();
        ball.update();
      });
    }

    function update() {
      draw();
      requestAnimationFrame(update);
    }


    document.getElementById("PlinkoForm").addEventListener("submit", function(e){
      e.preventDefault();
      
      let totalBalls = document.querySelector("input[name=balls]").value;
      console.log(totalBalls);
      betAmount += document.querySelector("input[name=bet]").value;
      if(betAmount > sessionStorage.getItem("gambleBucks")){
          alert("Du er blakk mann hva faen");
          return null;
      }
      

      for (let i = 0; i < totalBalls; i++) {
        setTimeout(function() {
          addBall(401);
        }, i * 100); // 100ms delay between balls
      }

  
  })

    update();

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
  