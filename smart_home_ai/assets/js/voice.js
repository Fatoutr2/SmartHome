function startVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Navigateur non compatible");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.start();

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        document.getElementById("voice-result").innerText = "🗣️ " + text;

        fetch("/api/voice", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ commande: text })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("voice-result").innerText += "\n🤖 " + data.reponse;
        });
    };
}
