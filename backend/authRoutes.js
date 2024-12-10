const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const secretKey = 'votre_clé_secrète'; // Remplacez par une clé plus sécurisée
const db = new sqlite3.Database('./users.db');

// Route GET pour la connexion
router.get('/login', (req, res) => {
    console.log('Route /auth/login atteinte');
    const { email, password } = req.query;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe.' });

            if (!isMatch) {
                return res.status(401).json({ error: 'Mot de passe incorrect.' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                secretKey,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ token, message: 'Connexion réussie.' });
        });
    });
});

module.exports = router;
