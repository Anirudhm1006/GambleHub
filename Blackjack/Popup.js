//Funksjonen starter når siden åpnes

window.onload = function () {

  //Her skal det sjekkes om det finnes en eksisterende verdi for gamble bucks, hvis ikke
  // lager den en ny verdi, som er stilt til 1000.

    if(!sessionStorage.getItem("gambleBucks")){
        if(localStorage.getItem("sessionBalance")){
          sessionStorage.setItem("gambleBucks", localStorage.getItem("sessionBalance"));
        }
        else{
          sessionStorage.setItem("gambleBucks", 1000);
        }
      }

      //Endrer visningen av valutaen på nettsiden etter oppdateringen

      document.getElementsByClassName("MoneyDisplayText")[0].innerHTML = `Balance: ${Math.round(sessionStorage.getItem("gambleBucks"))} GambleBucks`;

      //Lager et pop-up element

    let popup = document.createElement("div"); 
    popup.style.position = "fixed"; 
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#333"; 
    popup.style.width = "400px"; 
    popup.style.height = "250px"; 
    popup.style.padding = "30px"; 
    popup.style.borderRadius = "15px"; 
    popup.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.7)"; // Rød glødende effekt
    popup.style.textAlign = "center";
    popup.style.color = "#fff";
    popup.style.display = "flex"; 
    popup.style.flexDirection = "column";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";
    popup.style.zIndex = "10000"; // Sørger for at popup vises øverst i dokumentet

    // Legger til en overskrift
    let title = document.createElement("h2");
    title.innerText = "Angi et beløp";
    title.style.color = "#ff0000"; 
    title.style.fontSize = "24px"; 
    popup.appendChild(title);

    // Oppretter en input boks for brukeren til å skrive inn beløpet
    let input = document.createElement("input");
    input.name = "bet";
    input.type = "number";
    input.placeholder = "Skriv inn et beløp";
    input.style.padding = "15px"; 
    input.style.marginTop = "15px";
    input.style.width = "80%";
    input.style.border = "none";
    input.style.borderRadius = "8px";
    input.style.fontSize = "18px"; 
    popup.appendChild(input);

    // Oppretter en Send knapp
    var submitBtn = document.createElement("button");
    submitBtn.innerText = "Send";
    submitBtn.setAttribute("id", "SubmitBtn");
    submitBtn.style.marginTop = "15px";
    submitBtn.style.padding = "12px 20px";
    submitBtn.style.border = "none";
    submitBtn.style.borderRadius = "8px";
    submitBtn.style.background = "#ff0000"; 
    submitBtn.style.color = "white";
    submitBtn.style.cursor = "pointer";
    submitBtn.style.fontSize = "18px"; 
    popup.appendChild(submitBtn);

    // Oppretter en  Lukk knapp
    let closeBtn = document.createElement("button");
    closeBtn.innerText = "Lukk";
    closeBtn.style.marginTop = "10px";
    closeBtn.style.padding = "12px 20px";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "8px";
    closeBtn.style.background = "#444";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "18px";
    closeBtn.onclick = function () {
        window.location.href = '../Home/Hovedside.html'; // Fjerner popuppen når brukeren trykker Lukk
    };
    popup.appendChild(closeBtn);

    // Legger popup til i body
    document.body.appendChild(popup);

    // EventListener for send knappen
    document.getElementById("SubmitBtn").addEventListener("click", function () {
        betAmount = Number(document.querySelector("input[name=bet]").value); // Henter verdi fra input
        document.body.removeChild(popup); // Fjerner popupen etter innsending

        // Oppretter og sender en hendelse til Blackjack.js med innsatsbeløpet
        let event = new CustomEvent("betSubmitted", { detail: { amount: betAmount } });
        document.dispatchEvent(event);
    });
};

// Variabel for å lagre beløpet
// Viktig å huske at siden Js er synkron, skal denne linjen kjøres rett etter popup-en og skal
// ikke vent på svar fra hendelseslytteren
let betAmount = 0;
