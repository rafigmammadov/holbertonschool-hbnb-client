// add_review.js
document.addEventListener('DOMContentLoaded', () => {
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (token) {
        document.getElementById('review-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const reviewText = document.getElementById('review').value;

            try {
                const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ review: reviewText })
                });

                if (response.ok) {
                    alert('Review submitted successfully!');
                    document.getElementById('review-form').reset();
                } else {
                    alert('Failed to submit review');
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
        window.location.href = 'index.html';
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
}
