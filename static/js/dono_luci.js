(function () {

    let canvas = null;
    let ctx = null;
    let stelle = [];
    let attivo = false;

    function preparaCanvas() {

        canvas = document.createElement("canvas");
        canvas.id = "dono-luci-canvas";

        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "30000";

        document.body.appendChild(canvas);

        ctx = canvas.getContext("2d");

        ridimensionaCanvas();

        window.addEventListener("resize", ridimensionaCanvas);
    }

    function ridimensionaCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function elementiOro() {

        return Array.from(
            document.querySelectorAll(
                ".dono-titolo-oro, .dono-firma-oro, .dono-conservala-oro"
            )
        );
    }

    function nuovaStella() {

        const elementi = elementiOro();

        if (!elementi.length) {
            return;
        }

        const elemento = elementi[
            Math.floor(Math.random() * elementi.length)
        ];

        const r = elemento.getBoundingClientRect();

        const x = r.left + Math.random() * r.width;
        const y = r.top + Math.random() * r.height;

        stelle.push({
            x: x,
            y: y,
            vita: 0,
            durata: 42,
            rotazione: Math.random() * Math.PI
        });
    }

    function disegnaStella(stella) {

        const progresso = stella.vita / stella.durata;

        let intensita = 0;

        if (progresso < 0.5) {
            intensita = progresso * 2;
        } else {
            intensita = (1 - progresso) * 2;
        }

        const raggio = 5 + intensita * 12;

        ctx.save();

        ctx.translate(stella.x, stella.y);
        ctx.rotate(stella.rotazione + progresso * 1.2);

        ctx.globalAlpha = intensita;

        ctx.strokeStyle = "rgba(255, 245, 190, 0.95)";
        ctx.lineWidth = 1.2;

        ctx.shadowColor = "rgba(223, 177, 91, 0.95)";
        ctx.shadowBlur = 18 * intensita;

        ctx.beginPath();
        ctx.moveTo(-raggio, 0);
        ctx.lineTo(raggio, 0);
        ctx.moveTo(0, -raggio);
        ctx.lineTo(0, raggio);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 248, 210, 1)";
        ctx.arc(0, 0, 2.2 + intensita * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function anima() {

        if (!attivo) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stelle.forEach(function (stella) {
            stella.vita += 1;
            disegnaStella(stella);
        });

        stelle = stelle.filter(function (stella) {
            return stella.vita < stella.durata;
        });

        if (Math.random() < 0.035) {
            nuovaStella();
        }

        requestAnimationFrame(anima);
    }

    window.avviaLuciDono = function () {

        if (attivo) {
            return;
        }

        attivo = true;

        if (!canvas) {
            preparaCanvas();
        }

        anima();
    };

})();