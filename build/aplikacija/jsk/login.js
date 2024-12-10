/*document.addEventListener("DOMContentLoaded", function () {
    const forma = document.querySelector("form");
    const poruka = document.getElementById("poruka"); 

    forma.addEventListener("submit", async function (event) {
        event.preventDefault();

        const korime = document.querySelector("[name='korime']").value;
        const lozinka = document.querySelector("[name='lozinka']").value;

        if (!korime || !lozinka) {
            poruka.textContent = "Molimo popunite sva polja.";
            poruka.style.color = "red";
            return;
        }

        try {
            const response = await fetch("/aplikacijaLP/:korime/prijava", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ korime, lozinka })
            });

            if (response.ok) {
                window.location.href = "/";
            } else {
                const data = await response.json();
                poruka.textContent = data.greska || "Došlo je do greške pri prijavi.";
                poruka.style.color = "red";
            }
        } catch (err) {
            poruka.textContent = "Došlo je do greške pri komunikaciji sa serverom.";
            poruka.style.color = "red";
        }
    });
});*/
