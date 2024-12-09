const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;
const secretKey = 'votre_clé_secrète'; // Changez ceci par une clé plus sécurisée.

// Configuration middleware
app.use(cors());
app.use(bodyParser.json());

// Initialisation de la base de données SQLite
const db = new sqlite3.Database('./users.db');

// Création de la table utilisateur
db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )`
);

// Route pour s'enregistrer
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    // Hash du mot de passe
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });

        // Insertion dans la base de données
        db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hash],
            (err) => {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        return res.status(400).json({ error: 'Email déjà utilisé.' });
                    }
                    return res.status(500).json({ error: 'Erreur serveur.' });
                }
                res.status(201).json({ message: 'Utilisateur créé avec succès.' });
            }
        );
    });
});

// Route pour se connecter
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        // Vérification du mot de passe
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Erreur serveur.' });

            if (!isMatch) {
                return res.status(401).json({ error: 'Mot de passe incorrect.' });
            }

            // Génération du token
            const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
                expiresIn: '1h',
            });
            res.status(200).json({ token, message: 'Connexion réussie.' });
        });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
