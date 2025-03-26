document.addEventListener("DOMContentLoaded", function () {
    // Sjekker om popup allerede er vist i denne sesjonen
    if (!sessionStorage.getItem("popupShown")) {
        pop_opp_atten_pluss();
    }
});

function pop_opp_atten_pluss() {
    // Oppretter en wrapper div for å pakke in det eksisterende innhold
    let contentWrapper = document.createElement("div");
    contentWrapper.id = "contentWrapper"; // Setter en ID for enklere tilgang

    // Flytter eksisterende innhold i body in i denne wrapperen
    while (document.body.firstChild) {
        contentWrapper.appendChild(document.body.firstChild);
    }

    // Legger wrapperen tilbake i body
    document.body.appendChild(contentWrapper);

    // Legger til en blur effekt for å gjøre bakgrunnen uskarp
    contentWrapper.classList.add("blurred");

    // Oppretter popupp elementet
    let popup = document.createElement("div");
    popup.id = "agePopup";
    popup.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; pointer-events: auto; position: relative; z-index: 10000; width: 400px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);">
            <h1 style="font-size: 26px; color: #333;">Er du 18 eller eldre?</h1>
            <p style="font-size: 16px;">Du kan lese brukervilkårene <a href="brukervilkaar.html" target="_blank" style="color: #007bff;">her</a></p>
            <div style="margin-top: 25px;">
                <button onclick="sjekk_alder(true)" style="padding: 12px 20px; margin-right: 10px; border: none; border-radius: 8px; background: #28a745; color: white; font-size: 18px; cursor: pointer;">Ja, jeg er over 18</button>
                <button onclick="sjekk_alder(false)" style="padding: 12px 20px; border: none; border-radius: 8px; background: #dc3545; color: white; font-size: 18px; cursor: pointer;">Nei, jeg er under 18</button>
            </div>
        </div>
    `;

    // Stiler for å dekke hele skjermen med en mørk gjennomsiktig bakgrunn
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Halvtransparent svart bakgrunn
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = "10000"; // Sørger for at popuppen ligger øverst

    // Legger popupp til body
    document.body.appendChild(popup);
}

function sjekk_alder(er_atten) {
    let popup = document.getElementById("agePopup");
    if (er_atten) {
        popup.remove(); // Fjerner popuppen
        document.getElementById("contentWrapper").classList.remove("blurred"); // Fjerner blur effekten
        sessionStorage.setItem("popupShown", "true"); // Lagrer at popupp er vist så den ikke skal vises igjen
        window.location.href = "./Hovedside.html"; // Sender brukeren til hovedsiden
    } else {
        window.location.href = 'https://cat-bounce.com/'; // Sender brukeren til en familie vennelig side hvis de er under 18
    }
}
