// Existing search functionality
async function searchService() {
    const query = document.getElementById('search-bar').value;
    const location = document.getElementById('location').value;
    const maxPrice = document.getElementById('price').value;

    const response = await fetch(`/api/services?query=${query}&location=${location}&price=${maxPrice}`);
    const services = await response.json();
    displayServices(services);
}

function displayServices(services) {
    const serviceList = document.getElementById('service-list');
    serviceList.innerHTML = '';
    services.forEach(service => {
        const div = document.createElement('div');
        div.className = 'service';
        div.innerHTML = `
            <h4>${service.name}</h4>
            <p>Doctor: ${service.doctorName}</p>
            <p>Cost: ₹${service.price}</p>
            <img src="${service.billImage}" alt="Bill Image">
            <button onclick="upvoteService('${service._id}')">Upvote</button>
            <button onclick="downvoteService('${service._id}')">Downvote</button>
        `;
        serviceList.appendChild(div);
    });
}

async function upvoteService(id) {
    await fetch(`/api/services/${id}/upvote`, { method: 'POST' });
    searchService(); // Refresh the service list
}

async function downvoteService(id) {
    await fetch(`/api/services/${id}/downvote`, { method: 'POST' });
    searchService(); // Refresh the service list
}

// New form submission functionality
document.getElementById('service-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('service-name').value);
    formData.append('doctorName', document.getElementById('doctor-name').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('billImage', document.getElementById('bill-image').files[0]);

    try {
        const response = await fetch('/api/services', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Healthcare service submitted successfully!');
        } else {
            alert('Error submitting the service. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});