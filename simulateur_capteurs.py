import time
import random
import paho.mqtt.client as mqtt

# --- Configuration du broker MQTT ---
BROKER = "localhost"
PORT = 1884

# --- Topics par pièce ---
PIECES = {
    "salon": {
        "temp":  "home/salon/temp",
        "lux":   "home/salon/lux",
        "pres":  "home/salon/presence",
        "lampe": "home/salon/lampe"     # commande lampe
    },
    "chambre": {
        "temp":  "home/chambre/temp",
        "lux":   "home/chambre/lux",
        "pres":  "home/chambre/presence"
    },
    "cuisine": {
        "temp":  "home/cuisine/temp",
        "lux":   "home/cuisine/lux",
        "pres":  "home/cuisine/presence"
    }
}

# État الحقيقي de la lampe (synchronisé avec Node-RED)
lampe_salon = "OFF"

# --- Connexion au broker MQTT ---
client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connecté au broker MQTT !")
        client.subscribe(PIECES["salon"]["lampe"])   # On écoute les commandes manuelles
    else:
        print("❌ Échec de connexion. Code:", rc)

def on_message(client, userdata, msg):
    """ Node-RED contrôle la lampe → MAJ de l’état local """
    global lampe_salon
    if msg.topic == PIECES["salon"]["lampe"]:
        lampe_salon = msg.payload.decode()
        print(f"💡 Mise à jour MANUELLE depuis Node-RED → LAMPE = {lampe_salon}")

client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER, PORT, 60)
client.loop_start()

# --- Simulation des capteurs ---
try:
    while True:
        print("\n📡 --- MISE À JOUR DES CAPTEURS ---")

        for piece, topics in PIECES.items():

            # Température
            temp = round(random.uniform(18, 30), 1)
            client.publish(topics["temp"], temp)

            # Luminosité
            lux = random.randint(50, 500)
            client.publish(topics["lux"], lux)

            # Présence
            presence = random.choice([0, 1])
            client.publish(topics["pres"], presence)

            # ----------------------------------------------------------
            # ⚡ AUTOMATISATION INTELLIGENTE DE LA LAMPE DU SALON
            # ----------------------------------------------------------
            if piece == "salon":

                # 🔵 Cas 1 : Présence + faible lumière → allumer
                if presence == 1 and lux < 200 and lampe_salon != "ON":
                    lampe_salon = "ON"
                    client.publish(topics["lampe"], "ON")
                    print("💡 AUTO → Présence + faible lumière → LAMPE ON")

                # 🔴 Cas 2 : Absence → éteindre
                if presence == 0 and lampe_salon != "OFF":
                    lampe_salon = "OFF"
                    client.publish(topics["lampe"], "OFF")
                    print("💡 AUTO → Absence → LAMPE OFF")

            print(f"🏠 {piece.upper()} → 🌡 {temp}°C | 💡 {lux} lux | 🚶 {presence}")

        time.sleep(3)

except KeyboardInterrupt:
    print("\n🛑 Simulation arrêtée.")
    client.loop_stop()
    client.disconnect()
