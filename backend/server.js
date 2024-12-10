const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const authRoutes = require('./authRoutes'); // Assurez-vous que le fichier est dans le même dossier.

const app = express();
const port = 60000;
const secretKey = '123456789'; // Changez ceci par une clé plus sécurisée.

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Initialisation de la base de données SQLite
const db = new sqlite3.Database('./users.db');
db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        password TEXT
    )`
);

// Routes
app.use('/auth', authRoutes);

// Route d'accueil
app.get('/', (req, res) => {
    res.send('Bienvenue sur votre serveur Node.js !');
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send('Page non trouvée.');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
