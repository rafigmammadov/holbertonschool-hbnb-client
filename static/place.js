document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token');
    const placeId = getPlaceIdFromURL();

    if (token) {
        document.getElementById('add-review').style.display = 'block';
    } else {
        document.getElementById('add-review').style.display = 'none';
    }

    fetchPlaceDetails(token, placeId);

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!token) {
                alert('You must be logged in to add a review.');
                return;
            }

            const reviewText = document.getElementById('review-text').value;
            const rating = document.getElementById('review-rating').value;

            try {
                const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ review: reviewText, rating })
                });

                if (response.ok) {
                    alert('Review added successfully!');
                    document.getElementById('review-text').value = '';
                    document.getElementById('review-rating').value = '1 star';
                    fetchPlaceDetails(token, placeId); // Refresh reviews
                } else {
                    const errorData = await response.json();
                    alert('Failed to add review: ' + errorData.msg);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            console.error('Failed to fetch place details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPlaceDetails(place) {
    document.querySelector('.name-place').textContent = `${place.city_name}, ${place.country_name}`;
    document.querySelector('.place-image').src = place.image_url || 'images/placeholder.jpg'; // Make sure `image_url` exists
    document.getElementById('host-name').textContent = place.host_name;
    document.getElementById('price-per-night').textContent = `$${place.price_per_night}`;
    document.getElementById('location').textContent = `${place.city_name}, ${place.country_name}`;
    document.getElementById('description').textContent = place.description;
    document.getElementById('amenities').textContent = place.amenities.join(', '); // Assuming `amenities` is an array

    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    place.reviews.forEach(review => {
        const reviewElement = document.createElement('li');
        reviewElement.className = 'review-card';
        reviewElement.innerHTML = `
            <div>
                <h3>${review.user_name}</h3>
                <p>${review.comment}</p>
                <p>Rating: ${review.rating}</p>
            </div>
        `;
        reviewList.appendChild(reviewElement);
    });
}

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
