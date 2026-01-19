import sqlite3
import datetime

def apprendre_habitudes():
    """Analyse les dernières données pour apprendre les habitudes simples."""
    conn = sqlite3.connect("data/capteurs.db")
    cur = conn.cursor()
    
    cur.execute("SELECT temperature, luminosite, presence, timestamp FROM mesures ORDER BY id DESC LIMIT 5")
    data = cur.fetchall()
    conn.close()

    if not data:
        return "Aucune donnée à analyser"

    moy_temp = sum([d[0] for d in data]) / len(data)
    moy_lux = sum([d[1] for d in data]) / len(data)
    presence_detectee = any([d[2] for d in data])

    action = None
    if presence_detectee and moy_lux < 200:
        action = "allumer_lumiere"
    elif not presence_detectee and moy_lux > 400:
        action = "eteindre_lumiere"
    else:
        action = "rien"

    return {
        "temperature_moy": moy_temp,
        "luminosite_moy": moy_lux,
        "presence": presence_detectee,
        "action": action,
        "heure": datetime.datetime.now().strftime("%H:%M:%S")
    }
