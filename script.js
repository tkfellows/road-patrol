// Global variables to hold data and last updated information
let jsonData = null;
let lastUpdated = null;

document.addEventListener('DOMContentLoaded', () => {
    loadJSONData();
    setupDataToPlotSelect();
});

function loadJSONData() {
    fetch('api_response.json')
        .then(response => response.json())
        .then(data => {
            const dateStr = data.current_datetime;
            const options = { timeZone: "America/Toronto", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
            lastUpdated = new Date(dateStr).toLocaleString("en-US", options) || 'unknown';
            jsonData = data;
            updatePageTitleAndHeader(lastUpdated);
            displayResults(jsonData);
            createBarChart(jsonData.results, 'days_since_patrolled');
        })
        .catch(error => console.error('Error:', error));
        
}

function setupDataToPlotSelect() {
    const dataToPlotSelect = document.getElementById('dataToPlot');
    dataToPlotSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        createBarChart(jsonData.results, selectedValue);
    });
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

        // Create a table to display the results using DataTables
        const table = document.createElement('table');
        table.id = "dataTable"; // Add an ID for DataTables to hook into
        table.innerHTML = `
            <thead>
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
            </thead>
            <tbody>
            <!-- Table rows will be populated here -->
            </tbody>
        `;

        // Append the table to the result element
        resultElement.appendChild(table);

        // Populate the table rows
        const tbody = table.querySelector('tbody');
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
            tbody.appendChild(row);
        });

        // Initialize DataTables for the table
        $(document).ready(function () {
            $('#dataTable').DataTable();
        });
    } else {
        // If there are no results or an error occurred, display an appropriate message
        resultElement.textContent = 'No results found or an error occurred while loading data.';
    }
}

let barChartInstance = null; // Global variable to store the chart instance

function createBarChart(data, dataKey) {
    const threshold = 100; // Set the threshold value (change it to your desired value)

    // Filter the data to exclude values above the threshold
    const filteredData = data.filter(result => {
        const value = result[dataKey];
        return value !== null && !isNaN(value) && parseInt(value) <= threshold;
    });

    // Extract the selected data for chart
    const labels = filteredData.map(result => result.name);
    const selectedData = filteredData.map(result => {
        const value = result[dataKey];
        return value !== null && !isNaN(value) ? parseInt(value) : 0; // Convert to integer, handle null or invalid data
    });

    // Get canvas element for the bar chart
    const ctx = document.getElementById('barChart').getContext('2d');

    // Specify the aspect ratio for the chart (e.g., 2 for a 2:1 aspect ratio)
    const chartAspectRatio = 2;

    // Destroy the previous chart instance if it exists
    if (barChartInstance) {
        barChartInstance.destroy();
    }

    // Create the bar chart with the specified aspect ratio
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: dataKey.charAt(0).toUpperCase() + dataKey.slice(1), // Capitalize the label
                data: selectedData,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: chartAspectRatio, // Set the aspect ratio for the chart
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



function updatePageTitleAndHeader(data, lastUpdated) {
    const pageTitle = document.querySelector('title');
    pageTitle.textContent = `TSB Road Patrol - Last Updated: ${lastUpdated}`;

    const header = document.getElementById('pageTitle');
    header.textContent = `TSB Road Patrol - Last Updated: ${lastUpdated}`;
}
