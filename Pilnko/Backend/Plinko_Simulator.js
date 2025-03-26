const canvas = document.getElementById('plinkoCanvas');
    const ctx = canvas.getContext('2d'); // createCircle, createRectangle, createTriangle, createLine

    const DECIMAL_MULTIPLIER = 10000;

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
    let fallensinkArray = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],


    ]
    let fallenSink;

    function pad(n) {
      return n * DECIMAL_MULTIPLIER;
    }

    function unpad(n) {
      return Math.floor(n / DECIMAL_MULTIPLIER);
    }

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
        this.initialX = x;
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
            unpad(this.y) + this.radius < sink.y - sink.height / 4

          ) {
            /*this.vx = 0;
            this.vy = 0;*/

            /*
            console.log(index);
            console.log(unpad(this.initialX));*/

            fallensinkArray[index].push((this.initialX / DECIMAL_MULTIPLIER).toFixed(4));

           
            
            
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
      for (let i = 0; i<sinks.length; i++)  {
        const sink = sinks[i];
        ctx.fillRect(sink.x, sink.y - sink.height / 2, sink.width - obstacleRadius * 2, sink.height);
      };
    }

    function addBall(x) {
      const newBall = new Ball(pad(x), pad(50), ballRadius, 'red');
      balls.push(newBall);
    }

    document.getElementById('add-ball').addEventListener('click', ()=>{
      addBall(408);
    });

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
      let betAmount = document.querySelector("input[name=bet]").value;
      if(betAmount > sessionStorage.getItem("gambleBucks")){
          alert("Du er blakk mann hva faen");
          return null;
      }
      

      for (let i = 0; i < totalBalls; i++) {
        setTimeout(function() {
          addBall(422);
          
        }, i * 100); // 100ms delay between balls
      }

  
  })

    update();


    function saveJSON(data, filename = "./results.json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }


    

function Simulate(){
    for(let i= 364; i<436;i+=0.1){
        setTimeout(function() {
            addBall(i);
            
          },200);
    }


    setTimeout(function(){
        console.log(fallensinkArray);
        saveJSON(fallensinkArray);

        

    },30000);

   

}

Simulate();
          



