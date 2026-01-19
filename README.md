# 🏠 Smart Home ESP32 – MQTT – Node-RED – Web App

Projet de maison intelligente basé sur **ESP32**, **MQTT**, **Node-RED** et une **application web**.
Il permet de contrôler des LEDs (ON/OFF + luminosité), et de visualiser des capteurs
(température, luminosité, présence).

---

## 🚀 Fonctionnalités

- 🔌 Contrôle des LEDs (Salon / Chambre / Cuisine)
- 🎚️ Réglage de la luminosité (PWM)
- 🌡️ Température (DHT22)
- 💡 Luminosité (LDR)
- 🚶 Détection de présence (PIR)
- 🌐 Application Web (HTTP → MQTT)
- 🧠 Node-RED comme passerelle API
- 📡 Communication MQTT

---

## 🧱 Architecture

[ Web App ]
|
HTTP
|
[ Node-RED ]
|
MQTT
|
[ ESP32 ]

---

## 🛠️ Technologies

- ESP32 (MicroPython)
- MQTT (Mosquitto)
- Node-RED
- HTML / CSS / JavaScript
- OLED SSD1306
- PWM

---

## 📁 Structure du projet

```text
smart-home-esp32/
├── smart_home_ai/
├── .gitignore
└── README.md
