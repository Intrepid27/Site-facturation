document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#dynamic-table tbody");
    const addRowButton = document.getElementById("add-row");
    const subtotalInput = document.getElementById("subtotal");
    const tvaRateSelect = document.getElementById("tva-rate");
    const tvaAmountInput = document.getElementById("tva-amount");
    const grandTotalInput = document.getElementById("grand-total");
    const generateFactureButton = document.getElementById("generate-facture-number");
    const factureNumberInput = document.getElementById("facture-number");

    function createRow() {
        const row = document.createElement("tr");

        // Description
        const descriptionCell = document.createElement("td");
        const descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.placeholder = "Description";
        descriptionCell.appendChild(descriptionInput);
        row.appendChild(descriptionCell);

        // Prix
        const priceCell = document.createElement("td");
        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.min = "0";
        priceInput.value = "0";
        priceInput.addEventListener("focus", function () {
            if (priceInput.value === "0") {
                priceInput.value = "";
            }
        });
        priceInput.addEventListener("blur", function () {
            if (priceInput.value === "") {
                priceInput.value = "0";
            }
        });
        priceCell.appendChild(priceInput);
        row.appendChild(priceCell);

        // Quantité
        const quantityCell = document.createElement("td");
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.value = "1";
        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);

        // Total
        const totalCell = document.createElement("td");
        const totalInput = document.createElement("input");
        totalInput.type = "number";
        totalInput.value = "0";
        totalInput.readOnly = true;
        totalCell.appendChild(totalInput);
        row.appendChild(totalCell);

        // Bouton Supprimer
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "<span style='font-size: 16px;'>🗑️</span>";
        deleteButton.title = "Supprimer cette ligne";
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("click", function () {
            row.remove();
            updateTotals();
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        // Mettre à jour le total lorsque le prix ou la quantité change
        function updateRowTotal() {
            const price = parseFloat(priceInput.value) || 0;
            const quantity = parseInt(quantityInput.value) || 0;
            totalInput.value = (price * quantity).toFixed(2);
            updateTotals();
        }

        priceInput.addEventListener("input", updateRowTotal);
        quantityInput.addEventListener("input", updateRowTotal);

        tableBody.appendChild(row);
        updateTotals();
    }

    function updateTotals() {
        let subtotal = 0;

        // Calculer le sous-total
        Array.from(tableBody.querySelectorAll("tr")).forEach(row => {
            const totalInput = row.querySelector("td:nth-child(4) input");
            subtotal += parseFloat(totalInput.value) || 0;
        });

        subtotalInput.value = subtotal.toFixed(2);

        // Calculer la TVA et le total général
        const tvaRate = parseFloat(tvaRateSelect.value) || 0;
        const tvaAmount = subtotal * tvaRate;
        const grandTotal = subtotal + tvaAmount;

        tvaAmountInput.value = tvaAmount.toFixed(2);
        grandTotalInput.value = grandTotal.toFixed(2);
    }

    function generateFactureNumber() {
        const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6 chiffres aléatoires
        factureNumberInput.value = `F-${randomNumber}`;
    }

    // Ajouter une ligne au clic sur le bouton "Ajouter"
    addRowButton.addEventListener("click", createRow);

    // Générer un numéro de facture au clic sur le bouton "Générer numéro"
    generateFactureButton.addEventListener("click", generateFactureNumber);

    // Mettre à jour les totaux lorsque le taux de TVA change
    tvaRateSelect.addEventListener("change", updateTotals);

    // Créer une ligne initiale
    createRow();
});
