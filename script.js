// Przechowywanie danych w localStorage
const damageKey = 'damageData';

// Funkcja do pobierania danych z localStorage
function getDamages() {
    return JSON.parse(localStorage.getItem(damageKey) || '[]');
}

// Funkcja do zapisywania danych w localStorage
function saveDamages(damages) {
    localStorage.setItem(damageKey, JSON.stringify(damages));
}

// Dodawanie uszkodzenia
document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-damage-form');
    if (addForm) {
        addForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const vehicleId = document.getElementById('vehicle-id').value.trim();
            const description = document.getElementById('damage-description').value.trim();
            const date = document.getElementById('damage-date').value;
            const imageFile = document.getElementById('damage-image').files[0];

            if (!vehicleId || !description || !date || !imageFile) {
                alert('Wszystkie pola są wymagane.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const damages = getDamages();
                damages.push({
                    vehicleId: vehicleId,
                    description: description,
                    date: date,
                    image: event.target.result, // Base64 image
                });
                saveDamages(damages);
                alert('Uszkodzenie zostało dodane.');
                e.target.reset();
                displayDamages();
            };
            reader.readAsDataURL(imageFile);
        });
    }

    // Wyświetlanie uszkodzeń w panelu administratora
    function displayDamages(filter = '') {
        const damages = getDamages();
        const adminContainer = document.getElementById('admin-damage-list');
        if (adminContainer) {
            adminContainer.innerHTML = '';
            const filteredDamages = damages.filter(damage =>
                damage.vehicleId.toLowerCase().includes(filter.toLowerCase())
            );

            if (filteredDamages.length > 0) {
                filteredDamages.forEach((damage, index) => {
                    const damageItem = document.createElement('div');
                    damageItem.classList.add('damage-item');
                    damageItem.innerHTML = `
                        <p><strong>Numer Taborowy:</strong> ${damage.vehicleId}</p>
                        <p><strong>Opis:</strong> ${damage.description}</p>
                        <p><strong>Data:</strong> ${damage.date}</p>
                        <img src="${damage.image}" alt="Zdjęcie uszkodzenia" style="max-width: 100%; height: auto; margin-top: 10px;">
                        <button class="delete-damage" data-index="${index}">Usuń</button>
                    `;
                    adminContainer.appendChild(damageItem);
                });

                // Obsługa przycisków usuwania
                document.querySelectorAll('.delete-damage').forEach(button => {
                    button.addEventListener('click', function () {
                        const index = this.getAttribute('data-index');
                        const updatedDamages = damages.filter((_, i) => i != index);
                        saveDamages(updatedDamages);
                        alert('Uszkodzenie zostało usunięte.');
                        displayDamages(filter);
                    });
                });
            } else {
                adminContainer.innerHTML = '<p>Brak uszkodzeń do wyświetlenia.</p>';
            }
        }
    }

    // Wyszukiwanie na stronie głównej
    const searchForm = document.getElementById('search-damage-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const vehicleId = document.getElementById('search-vehicle-id').value.trim();
            displaySearchResults(vehicleId);
        });
    }

    function displaySearchResults(filter = '') {
        const damages = getDamages();
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            const filteredDamages = damages.filter(damage =>
                damage.vehicleId.toLowerCase().includes(filter.toLowerCase())
            );

            if (filteredDamages.length > 0) {
                filteredDamages.forEach(damage => {
                    const resultDiv = document.createElement('div');
                    resultDiv.classList.add('damage-item');
                    resultDiv.innerHTML = `
                        <p><strong>Numer Taborowy:</strong> ${damage.vehicleId}</p>
                        <p><strong>Opis:</strong> ${damage.description}</p>
                        <p><strong>Data:</strong> ${damage.date}</p>
                        <img src="${damage.image}" alt="Zdjęcie uszkodzenia" style="max-width: 100%; height: auto; margin-top: 10px;">
                    `;
                    resultsContainer.appendChild(resultDiv);
                });
            } else {
                resultsContainer.innerHTML = '<p>Brak wyników dla podanego numeru taborowego.</p>';
            }
        }
    }

    // Obsługa wyszukiwania w panelu administratora
    const adminSearchForm = document.getElementById('search-admin-damage-form');
    if (adminSearchForm) {
        adminSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const filter = document.getElementById('search-admin-vehicle-id').value.trim();
            displayDamages(filter);
        });
    }

    // Wyświetlanie wszystkich uszkodzeń na starcie
    displayDamages();
});
