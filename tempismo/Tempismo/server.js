const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Percorso del file JSON per i punteggi
const scoresPath = path.join(__dirname, 'scores.json');

// Inizializza il file dei punteggi se non esiste
if (!fs.existsSync(scoresPath)) {
    fs.writeFileSync(scoresPath, JSON.stringify([], null, 2));
}

// Ottieni i punteggi
app.get('/api/scores', (req, res) => {
    const scores = JSON.parse(fs.readFileSync(scoresPath));
    res.json(scores);
});

// Salva un nuovo punteggio
app.post('/api/scores', (req, res) => {
    const { name, score } = req.body;
    const scores = JSON.parse(fs.readFileSync(scoresPath));
    
    scores.push({ name, score, timestamp: Date.now() });
    scores.sort((a, b) => a.score - b.score); // Ordina per tempo di reazione (più basso è meglio)
    
    if (scores.length > 10) {
        scores.pop(); // Mantieni solo i top 10 punteggi
    }
    
    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});