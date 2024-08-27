document.addEventListener("DOMContentLoaded", () => {
    let aisles = [];
    let shoppingList = [];

    // Charger les rayons depuis la base de données
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            aisles = data;
        });

    // Gestion de la barre de recherche
    const searchBar = document.getElementById("search-bar");
    const suggestionsList = document.getElementById("suggestions");

    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        suggestionsList.innerHTML = "";

        if (query.length > 0) {
            aisles.forEach(aisle => {
                aisle.themes.forEach(theme => {
                    const suggestions = theme.products.filter(product => 
                        product.name.toLowerCase().includes(query)
                    );

                    suggestions.forEach(product => {
                        const li = document.createElement("li");
                        li.textContent = `${product.name} - ${theme.theme} (${aisle.aisle})`;
                        li.addEventListener("click", () => {
                            addProductToShoppingList(product, aisle.aisle, theme.theme);
                            searchBar.value = "";
                            suggestionsList.innerHTML = "";
                        });
                        suggestionsList.appendChild(li);
                    });
                });
            });
        }
    });

    // Ajouter un produit à la liste de courses
    function addProductToShoppingList(product, aisle, theme) {
        shoppingList.push({ ...product, aisle, theme });
        updateShoppingList();
        updateMapPointers();
    }

    // Met à jour la liste de courses affichée
    function updateShoppingList() {
        const list = document.getElementById("list");
        list.innerHTML = "";
        shoppingList.forEach((item, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = `${item.name} - ${item.theme} - Rayon: ${item.aisle} - Emplacement: ${item.location}`;

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
        document.querySelectorAll('.pointer').forEach(p => p.remove());

        shoppingList.forEach(item => {
            let pointer = document.createElement("div");
            pointer.classList.add("pointer");

            let position = getPositionFromLocation(item.aisle, item.location);
            pointer.style.left = `${position.x}%`;
            pointer.style.top = `${position.y}%`;
            mapContainer.appendChild(pointer);
        });
    }

    // Simulez des positions pour les emplacements
    function getPositionFromLocation(aisle, location) {
        const positions = {
            "Bio1": { x: 10, y: 20 },
            "Bio2": { x: 15, y: 25 },
            "Bio3": { x: 20, y: 30 },
            "Bio4": { x: 25, y: 35 },
            "Bio5": { x: 30, y: 40 },
            "Bio6": { x: 35, y: 45 },
            "Bio7": { x: 40, y: 50 },
            "Bio8": { x: 45, y: 55 },
            "Bio9": { x: 50, y: 60 },
            "Bio10": { x: 55, y: 65 },
            "Bio11": { x: 60, y: 70 },
            "Bio12": { x: 65, y: 75 }
        };
        return positions[aisle + location] || { x: 50, y: 50 };
    }

    // Bouton pour vider la liste
    const clearListButton = document.getElementById("clear-list");
    clearListButton.addEventListener("click", () => {
        shoppingList = [];
        updateShoppingList();
        updateMapPointers();
    });
});
