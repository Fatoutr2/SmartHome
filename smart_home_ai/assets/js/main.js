async function chargerCapteurs() {
  try {
    const response = await fetch('/capteurs');
    const data = await response.json();
    const container = document.getElementById('capteurs');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = '<p class="text-center text-muted">Aucune donnée de capteur disponible.</p>';
      return;
    }

    data.forEach(c => {
      const div = document.createElement('div');
      div.className = 'col-md-4';
      div.innerHTML = `
        <div class="capteur-card h-100">
          <div class="nom">${c.nom}</div>
          <div class="valeur">${c.valeur} ${c.unite}</div>
          <small class="text-muted">${c.timestamp}</small>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Erreur chargement capteurs:', error);
  }
}

chargerCapteurs();
setInterval(chargerCapteurs, 5000);
