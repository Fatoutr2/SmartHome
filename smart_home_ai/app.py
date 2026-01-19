import subprocess
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, send_from_directory
from flask_mysqldb import MySQL
import MySQLdb.cursors
import hashlib
import requests

app = Flask(__name__, static_folder="assets", static_url_path="/assets")
app.secret_key = "smart_home_secret_key"

# ================= MYSQL =================
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'smart_home'
mysql = MySQL(app)

# ================= NODE-RED =================
NODE_RED_BASE = "http://localhost:1880/api"

# ================= STATIC =================
@app.route('/assets/<path:filename>')
def assets(filename):
    return send_from_directory('assets', filename)

# ================= AUTH =================
@app.route('/')
def dashboard():
    if 'user' in session:
        return redirect(url_for('control'))
    return render_template('dashboard.html')

@app.route('/control')
def control():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('control.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login_handler():
    email = request.form['email']
    password = hashlib.sha256(request.form['password'].encode()).hexdigest()

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
    user = cursor.fetchone()
    cursor.close()

    if not user:
        return "❌ Identifiants incorrects"

    session['user'] = user
    return redirect(url_for('control'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ================= LED CONTROL =================
@app.route("/api/<room>/led", methods=["POST"])
def set_led(room):
    etat = request.json.get("etat")

    if etat not in ["ON", "OFF"]:
        return jsonify({"error": "Etat invalide"}), 400

    requests.post(
        f"{NODE_RED_BASE}/{room}/led",
        json={"etat": etat},
        timeout=2
    )

    return jsonify({"room": room, "etat": etat})


@app.route("/api/<room>/brightness", methods=["POST"])
def set_brightness(room):
    value = request.json.get("value")

    if value is None:
        return jsonify({"error": "value manquant"}), 400

    try:
        value = int(value)
        value = max(0, min(100, value))
    except:
        return jsonify({"error": "value invalide"}), 400

    requests.post(
        f"{NODE_RED_BASE}/{room}/brightness",
        json={"value": value},
        timeout=2
    )

    return jsonify({"room": room, "brightness": value})


# ================= STATUS (LIVE) =================
@app.route("/api/<room>/status")
def room_status(room):
    r = requests.get(f"http://localhost:1880/api/{room}/status")
    return jsonify(r.json())

# ================= VOICE =================
@app.route('/api/voice', methods=['POST'])
def voice_command():
    cmd = request.json.get("commande", "").lower()

    piece = next((p for p in ["salon", "chambre", "cuisine"] if p in cmd), None)
    if not piece:
        return jsonify({"reponse": "Quelle pièce ? salon, chambre ou cuisine"})

    if "allume" in cmd:
        etat = "ON"
    elif "éteins" in cmd or "eteins" in cmd:
        etat = "OFF"
    else:
        return jsonify({"reponse": "Commande non reconnue"})

    requests.post(f"{NODE_RED_BASE}/{piece}/led", json={"etat": etat})
    return jsonify({"reponse": f"Lumière {etat.lower()} dans le {piece}"})

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True)
