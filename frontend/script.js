document.getElementById('generatePdf').addEventListener('click', function () {
    // Récupération des données du formulaire
    const sellerName = document.getElementById('sellerName').value;
    const sellerAddress = document.getElementById('sellerAddress').value;
    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = parseFloat(document.getElementById('unitPrice').value);
    const vatRate = parseFloat(document.getElementById('vatRate').value);

    // Validation des champs
    if (!sellerName || !sellerAddress || !clientName || !clientAddress || !invoiceDate || !dueDate || !itemDescription || isNaN(quantity) || isNaN(unitPrice) || isNaN(vatRate)) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Calculs
    const totalHT = unitPrice * quantity;
    const vatAmount = (totalHT * vatRate) / 100;
    const totalTTC = totalHT + vatAmount;

    // Génération du PDF avec jsPDF
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(20);
    doc.text('Facture', 105, 10, { align: 'center' });

    // Informations du vendeur
    doc.setFontSize(12);
    doc.text('Informations du Vendeur :', 10, 20);
    doc.text(`Nom : ${sellerName}`, 10, 30);
    doc.text(`Adresse :`, 10, 40);
    doc.text(`${sellerAddress}`, 10, 45);

    // Informations du client
    doc.text('Informations du Client :', 10, 60);
    doc.text(`Nom : ${clientName}`, 10, 70);
    doc.text(`Adresse :`, 10, 80);
    doc.text(`${clientAddress}`, 10, 85);

    // Détails de la facture
    doc.text('Détails de la Facture :', 10, 100);
    doc.text(`Date de la facture : ${invoiceDate}`, 10, 110);
    doc.text(`Date d'échéance : ${dueDate}`, 10, 120);
    doc.text(`Description : ${itemDescription}`, 10, 130);
    doc.text(`Quantité : ${quantity}`, 10, 140);
    doc.text(`Prix unitaire HT : ${unitPrice.toFixed(2)} €`, 10, 150);
    doc.text(`Total HT : ${totalHT.toFixed(2)} €`, 10, 160);
    doc.text(`TVA (${vatRate}%) : ${vatAmount.toFixed(2)} €`, 10, 170);
    doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`, 10, 180);

    // Sauvegarde du fichier PDF
    const fileName = `Facture_${clientName}_${invoiceDate}.pdf`;
    doc.save(fileName);
});

// Ouverture de la modal au chargement de la page
window.onload = function () {
    const token = localStorage.getItem('authToken');
    if (!token) {
        document.getElementById('authModal').style.display = 'flex';
    } else {
        document.getElementById('logoutButton').style.display = 'block';
    }
};

// Fermeture de la modal
document.getElementById('closeModal').onclick = function () {
    document.getElementById('authModal').style.display = 'none';
};

// Gestion du bouton "Se connecter"
document.getElementById('loginButton').onclick = function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        // Simulation d'une vérification côté serveur
        const token = `token_${email}_${new Date().getTime()}`;
        localStorage.setItem('authToken', token);
        alert('Connexion réussie !');
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
    } else {
        alert('Veuillez remplir tous les champs.');
    }
};

// Gestion du bouton "Créer un compte"
document.getElementById('registerButton').onclick = function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        // Simulation d'enregistrement
        alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        document.getElementById('authModal').style.display = 'none';
    } else {
        alert('Veuillez remplir tous les champs.');
    }
};

// Gestion du bouton "Déconnexion"
document.getElementById('logoutButton').onclick = function () {
    localStorage.removeItem('authToken');
    alert('Déconnecté avec succès.');
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('authModal').style.display = 'flex';
};

const apiBaseUrl = 'http://localhost:3000';

// Création d'un compte
document.getElementById('registerButton').onclick = async function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        try {
            const response = await fetch(`${apiBaseUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
        }
    } else {
        alert('Veuillez remplir tous les champs.');
    }
};

// Connexion
document.getElementById('loginButton').onclick = async function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
        try {
            const response = await fetch(`${apiBaseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('authToken', result.token);
                alert(result.message);
                document.getElementById('authModal').style.display = 'none';
                document.getElementById('logoutButton').style.display = 'block';
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
        }
    } else {
        alert('Veuillez remplir tous les champs.');
    }
};

// Référence au bouton et à la modal de connexion
const authButton = document.getElementById('authButton');
const authModal = document.getElementById('authModal');

// Gestion de l'ouverture de la modal
authButton.onclick = function () {
    authModal.style.display = 'flex';
};


// Références aux modals et boutons
const registerModal = document.getElementById('registerModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');

// Ouverture de la modal "Créer un compte"
document.getElementById('registerButton').onclick = function () {
    document.getElementById('authModal').style.display = 'none';
    registerModal.style.display = 'flex';
};

// Fermeture de la modal "Créer un compte"
closeRegisterModal.onclick = function () {
    registerModal.style.display = 'none';
    document.getElementById('authModal').style.display = 'flex';
};

// Gestion du bouton "Créer un compte" dans la modal de création
document.getElementById('submitRegisterButton').onclick = async function () {
    const firstName = document.getElementById('societyName').value;
    const lastName = document.getElementById('siretNumber').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (firstName && lastName && email && password) {
        try {
            const response = await fetch(`${apiBaseUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                registerModal.style.display = 'none';
                document.getElementById('authModal').style.display = 'flex';
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
        }
    } else {
        alert('Veuillez remplir tous les champs.');
    }
};

app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur.' });

        db.run(
            'INSERT INTO users (societyName, siretNumber, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hash],
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

