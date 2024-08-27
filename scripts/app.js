document.addEventListener("DOMContentLoaded", () => {
    // Initialise la liste de courses
    let shoppingList = [];

    // Chargement initial des données
    fetch('data/items.json')
        .then(response => response.json())
        .then(data => {
            shoppingList = data;
            updateShoppingList();
            updateMapPointers();
        });

    // Formulaire pour ajouter un article
    const addItemForm = document.getElementById("add-item-form");
    addItemForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("item-name").value;
        const aisle = document.getElementById("item-aisle").value;
        const location = document.getElementById("item-location").value;

        // Ajoute l'article à la liste de courses
        shoppingList.push({ name, aisle, location });
        updateShoppingList();
        updateMapPointers();

        // Réinitialiser le formulaire
        addItemForm.reset();
    });

    // Met à jour la liste de courses affichée
    function updateShoppingList() {
        const list = document.getElementById("list");
        list.innerHTML = "";
        shoppingList.forEach((item, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = `${item.name} - Rayon: ${item.aisle} - Emplacement: ${item.location}`;

            // Bouton de suppression pour chaque article
            let removeButton = document.createElement("button");
            removeButton.textContent = "Supprimer";
            removeButton.addEventListener("click", () => {
                shoppingList.splice(index, 1);
                updateShoppingList();
                updateMapPointers();
            });

            listItem.appendChild(removeButton);
            list.appendChild(listItem);
        });
    }

    // Met à jour les pointeurs sur la carte
    function updateMapPointers() {
        const mapContainer = document.getElementById("map-container");
        // Retire les anciens pointeurs
        document.querySelectorAll('.pointer').forEach(p => p.remove());

        shoppingList.forEach(item => {
            let pointer = document.createElement("div");
            pointer.classList.add("pointer");

            // Exemple simple : placer le pointeur à des positions fixes en fonction du location
            // Idéalement, vous ajusteriez ces valeurs en fonction de la taille de l'image de la carte
            let position = getPositionFromLocation(item.location);

            pointer.style.left = `${position.x}%`;
            pointer.style.top = `${position.y}%`;
            mapContainer.appendChild(pointer);
        });
    }

    // Cette fonction devrait être ajustée pour mapper correctement les emplacements des produits sur la carte
    function getPositionFromLocation(location) {
        // Simuler des positions pour quelques emplacements
        const positions = {
            "A1": { x: 20, y: 30 },
            "B2": { x: 50, y: 50 },
            "C3": { x: 80, y: 70 }
        };
        return positions[location] || { x: 50, y: 50 };
    }

    // Bouton pour vider la liste
    const clearListButton = document.getElementById("clear-list");
    clearListButton.addEventListener("click", () => {
        shoppingList = [];
        updateShoppingList();
        updateMapPointers();
    });
});
