document.addEventListener('DOMContentLoaded', loadJSONData);

function loadJSONData() {
    fetch('api_response.json')
        .then(response => response.json())
        .then(data => {
            const dateStr = data.current_datetime;
            const lastUpdated = new Date(dateStr).toLocaleString() || 'N/A';
            updatePageTitleAndHeader(data, lastUpdated);
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const resultElement = document.getElementById('apiResponse');

    // Clear the existing content before displaying new results
    resultElement.innerHTML = '';

    if (data.status === "OK" && data.results && data.results.length > 0) {
        const results = data.results;

        // Sort the results array first by "days_since_patrolled" in descending order
        // Then, sort by "patrolled_datetime" in ascending order
        results.sort((a, b) => {
            const daysDiff = parseInt(a.days_since_patrolled) - parseInt(b.days_since_patrolled);
            if (daysDiff !== 0) {
                return daysDiff;
            }
            return new Date(b.patrolled_datetime) - new Date(a.patrolled_datetime);
        });

        // Create a table to display the results
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Class Number</th>
                <th>Class Name</th>
                <th>Ownership</th>
                <th>Patrolled Date/Time</th>
                <th>Days Since Patrolled</th>
                <th>Name</th>
                <th>Type</th>
            </tr>
        `;

        // Iterate through the sorted results and create rows for the table
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.id}</td>
                <td>${result.class_number}</td>
                <td>${result.class_name}</td>
                <td>${result.ownership}</td>
                <td>${result.patrolled_datetime}</td>
                <td>${result.days_since_patrolled}</td>
                <td>${result.name}</td>
                <td>${result.type}</td>
            `;
            table.appendChild(row);
        });

        // Append the table to the result element
        resultElement.appendChild(table);
    } else {
        // If there are no results or an error occurred, display an appropriate message
        resultElement.textContent = 'No results found or an error occurred while loading data.';
    }
}

function updatePageTitleAndHeader(data, lastUpdated) {
    const pageTitle = document.querySelector('title');
    pageTitle.textContent = `TSB Road Patrol - Last Updated: ${lastUpdated}`;

    const header = document.getElementById('pageTitle');
    header.textContent = `TSB Road Patrol - Last Updated: ${lastUpdated}`;
}
