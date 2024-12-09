document.getElementById('generateInvoice').addEventListener('click', () => {
    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const serviceDetails = document.getElementById('serviceDetails').value;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const hoursWorked = parseFloat(document.getElementById('hoursWorked').value);

    if (!clientName || !clientAddress || !serviceDetails || isNaN(hourlyRate) || isNaN(hoursWorked)) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    const total = hourlyRate * hoursWorked;

    const invoiceHTML = `
        <h2>Facture Générée</h2>
        <p><strong>Client :</strong> ${clientName}</p>
        <p><strong>Adresse :</strong> ${clientAddress}</p>
        <p><strong>Prestation :</strong> ${serviceDetails}</p>
        <p><strong>Taux horaire :</strong> ${hourlyRate} €</p>
        <p><strong>Durée :</strong> ${hoursWorked} heures</p>
        <h3><strong>Total :</strong> ${total.toFixed(2)} €</h3>
    `;

    document.getElementById('output').innerHTML = invoiceHTML;
});
