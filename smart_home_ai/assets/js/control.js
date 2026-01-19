/*function setLamp(etat) {
    const room = document.getElementById("room").value;

    fetch(`/api/${room}/led`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ etat: etat })
    })
    .then(res => res.json())
    .then(() => {
        updateLampUI(etat);
    })
    .catch(err => {
        console.error("Erreur lampe:", err);
    });
}


function updateLampUI(etat) {
    const lampStatus = document.getElementById("lamp-status");

    if (etat === "ON") {
        lampStatus.textContent = "ON";
        lampStatus.className = "lamp-on";
    } else {
        lampStatus.textContent = "OFF";
        lampStatus.className = "lamp-off";
    }
}


// ---------- SENSORS (mock temporaire) ----------
function refreshSensors() {
    const room = document.getElementById("room").value;

    fetch(`/api/${room}/status`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("temp").textContent =
                data.temp + " °C";

            document.getElementById("lux").textContent =
                data.lux + " lux";

            document.getElementById("presence").textContent =
                data.presence ? "Présent" : "Absent";

            // 🔥 CORRECTION ICI
            updateLampUI(data.led);

            // optionnel : afficher le mode
            document.getElementById("mode").textContent =
                data.mode;
        })
        .catch(err => console.error(err));
}




function setBrightness(val) {
    document.getElementById("brightness-value").innerText = val + "%";

    fetch("/api/brightness", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ value: val })
    });
}


function updateTemp(value) {
    const t = document.getElementById("temp");
    const d = document.getElementById("temp-desc");

    t.innerText = value + " °C";

    if (value < 18) {
        t.style.color = "#3498db";
        d.innerText = "❄️ Froid";
    } else if (value < 26) {
        t.style.color = "#2ecc71";
        d.innerText = "😊 Confortable";
    } else {
        t.style.color = "#e74c3c";
        d.innerText = "🔥 Chaud";
    }
}

function updatePresence(val) {
    const el = document.getElementById("presence");
    if (val == 1) {
        el.innerHTML = "👤 Présent";
        el.style.color = "#2ecc71";
    } else {
        el.innerHTML = "🚫 Absence";
        el.style.color = "#e74c3c";
    }
}

function refreshStatus() {
    fetch("/api/status")
        .then(res => res.json())
        .then(data => {
            updateLamp(data.lampe);
            updateTemp(data.temp);
            updatePresence(data.presence);
            document.getElementById("lux").innerText = data.lux + " lux";
            document.getElementById("dimmer").value = data.brightness;
            document.getElementById("brightness-value").innerText = data.brightness + "%";
        });
}

setInterval(refreshSensors, 3000);
refreshSensors();

const API = "http://localhost:1880/api/salon";

function led(etat) {
  fetch(API + "/led", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ etat })
  });
}

function mode(mode) {
  fetch(API + "/mode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode })
  });
}

function refresh() {
  fetch(API + "/status")
    .then(r => r.json())
    .then(data => {
      document.getElementById("status").textContent =
        JSON.stringify(data, null, 2);
    });
}

refreshSensors();
setInterval(refreshSensors, 3000);
*/
/// ==========================
// COMMANDE LAMPE
// ==========================
function setLamp(etat) {
    const room = document.getElementById("room").value;

    fetch(`/api/${room}/led`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etat })
    }).catch(err => {
        console.error("Erreur commande lampe :", err);
    });
}

// ==========================
// UI LAMPE
// ==========================
function updateLampUI(etat) {
    const led = document.getElementById("lamp-status");

    if (etat === "ON") {
        led.textContent = "ON";
        led.className = "lamp-on";
    } else {
        led.textContent = "OFF";
        led.className = "lamp-off";
    }
}

// ==========================
// JOUR / NUIT
// ==========================
function updateDayNight(lux) {
    const el = document.getElementById("daynight");

    if (lux < 200) {
        el.innerHTML = "🌙 Nuit";
        el.style.color = "#2c3e50";
    } else {
        el.innerHTML = "☀️ Jour";
        el.style.color = "#f39c12";
    }
}

// ==========================
// LECTURE CAPTEURS
// ==========================
function refreshSensors() {
    const room = document.getElementById("room").value;

    fetch(`/api/${room}/status`)
        .then(res => res.json())
        .then(data => {

            document.getElementById("temp").textContent =
                data.temp + " °C";

            document.getElementById("lux").textContent =
                data.lux + " lux";

            document.getElementById("presence").textContent =
                data.presence ? "Présent" : "Absent";

            updateLampUI(data.led);
            updateDayNight(data.lux);

            // 🔥 AUTO ON SI PRÉSENCE
            /*if (data.presence === 1 && data.led === "OFF") {
                setLamp("ON");
            }*/
        })
        .catch(err => {
            console.error("Erreur capteurs :", err);
        });
}

// ==========================
// HORLOGE
// ==========================
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');

    document.getElementById("clock").innerText =
        `🕒 ${h}:${m}:${s}`;
}

function setBrightness(val) {
    if (isNaN(val)) return;

    const room = document.getElementById("room").value;
    document.getElementById("brightness-value").innerText = val + "%";

    fetch(`/api/${room}/brightness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(val) })
    }).catch(err => console.error(err));
}



function startVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("❌ Commande vocale non supportée par ce navigateur");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.start();

    recognition.onresult = function (event) {
        const command = event.results[0][0].transcript.toLowerCase();
        document.getElementById("voice-result").innerText =
            "🗣️ " + command;

        handleVoiceCommand(command);
    };
}

function handleVoiceCommand(cmd) {
    let room = document.getElementById("room").value;

    // Détection de la pièce
    if (cmd.includes("salon")) room = "salon";
    else if (cmd.includes("chambre")) room = "chambre";
    else if (cmd.includes("cuisine")) room = "cuisine";

    // ON / OFF
    if (cmd.includes("allume")) {
        fetch(`/api/${room}/led`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ etat: "ON" })
        });
    }

    if (cmd.includes("éteins") || cmd.includes("eteins")) {
        fetch(`/api/${room}/led`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ etat: "OFF" })
        });
    }

    // Luminosité vocale
    const match = cmd.match(/(\d{1,3})/);
    if (match) {
        const value = Math.min(100, parseInt(match[1]));

        fetch(`/api/${room}/brightness`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value })
        });
    }
}





setInterval(updateClock, 1000);
updateClock();

// ==========================
// AUTO REFRESH
// ==========================
refreshSensors();
setInterval(refreshSensors, 3000);
