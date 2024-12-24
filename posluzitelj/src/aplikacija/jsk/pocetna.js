document.addEventListener("DOMContentLoaded", () => {
    const statusEl = document.getElementById("status");
    const gumbZahtjev = document.getElementById("posaljiZahtjev");

    if (statusEl.textContent.trim() === "0") {
        gumbZahtjev.style.display = "block";
    }

    gumbZahtjev.addEventListener("click", async () => {
        try {
            const odgovor = await fetch("/aplikacijaLP/zahtjev", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ poruka: "Zahtjev za korištenje servisa" }),
            });

            if (odgovor.ok) {
                const json = await odgovor.json();
                gumbZahtjev.style.display = "none";
            } else {
                const greska = await odgovor.json();
                alert(greska.poruka || "Došlo je do greške.");
            }
        } catch (error) {
            console.error("Greška prilikom slanja zahtjeva:", error);
            alert("Greška prilikom komunikacije sa serverom.");
        }
    });
});
