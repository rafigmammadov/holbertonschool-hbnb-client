document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const countryFilter = document.getElementById('country-filter');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }

    countryFilter.addEventListener('change', (event) => {
        filterPlacesByCountry(event.target.value);
    });
    
    fetchCountries(); // Fetch and populate the country filter
});

async function fetchPlaces(token) {
    try {
        const response = await fetch('http://127.0.0.1:5000/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchCountries() {
    try {
        const response = await fetch('http://127.0.0.1:5000/countries', {
            method: 'GET'
        });

        if (response.ok) {
            const countries = await response.json();
            populateCountryFilter(countries);
        } else {
            console.error('Failed to fetch countries');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateCountryFilter(countries) {
    const countryFilter = document.getElementById('country-filter');
    countryFilter.innerHTML = '<option value="all">Select Country</option>'; // Reset options

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code; // Use country code as value
        option.textContent = country.name;
        countryFilter.appendChild(option);
    });
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeElement = document.createElement('li');
        placeElement.className = 'place';
        placeElement.innerHTML = `
            <h2>${place.city_name}, ${place.country_name}</h2>
            <p>${place.description}</p>
            <p>Price per night: $${place.price_per_night}</p>
            <a href="place.html?id=${place.id}">View Details</a>
        `;
        placesList.appendChild(placeElement);
    });
}

function filterPlacesByCountry(selectedCountry) {
    const places = document.querySelectorAll('.place');
    places.forEach(place => {
        const countryName = place.querySelector('h2').textContent.split(', ')[1];
        if (selectedCountry === 'all' || countryName === selectedCountry) {
            place.style.display = 'list-item'; // Show the item
        } else {
            place.style.display = 'none'; // Hide the item
        }
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
