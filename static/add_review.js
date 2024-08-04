document.addEventListener('DOMContentLoaded', () => {
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (token && placeId) {
        populatePlaceDetails(placeId);

        document.getElementById('review-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const reviewText = document.getElementById('review').value;
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
                    alert('Review submitted successfully!');
                    document.getElementById('review-form').reset();
                } else {
                    const errorData = await response.json();
                    alert('Failed to submit review: ' + errorData.msg);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

function checkAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login page if not authenticated
    }
    return token;
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

async function populatePlaceDetails(placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
            method: 'GET'
        });

        if (response.ok) {
            const place = await response.json();
            document.getElementById('place').value = `${place.city_name}, ${place.country_name}`;
        } else {
            console.error('Failed to fetch place details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
