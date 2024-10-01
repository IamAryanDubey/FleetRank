// Fetch and update leaderboard based on selected timeframe
function updateLeaderboard() {
  const timeframe = document.getElementById('leaderboard-select').value;

  fetch(`http://localhost:3000/leaderboard/${timeframe}`)
    .then(response => response.json())
    .then(data => {
      const leaderboardList = document.getElementById('leaderboard-list');
      leaderboardList.innerHTML = ''; // Clear previous data

      data.forEach((entry) => {
        const li = document.createElement('li');

        // Handle different leaderboard formats (daily vs weekly)
        if (timeframe === 'daily') {
          li.textContent = `Fleet: ${entry.fleetName} - Rank: ${entry.rank} - Date Range: ${entry.Date}`;
        } else if (timeframe === 'weekly') {
          li.textContent = `Fleet: ${entry.fleetName} - Rank: ${entry.rank} - Date Range: ${entry.dateRange}`;
        } else if (timeframe === 'monthly') {
          li.textContent = `Fleet: ${entry.fleetName} - Rank: ${entry.rank} - Date Range: ${entry.dateRange}`;
        }
        leaderboardList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error fetching leaderboard:', error);
    });
}
