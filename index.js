const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

let leaderboardData = [];

// Helper function to parse dates
function parseDate(dateStr) {
  console.log(`Parsing date: ${dateStr}`);
  return new Date(dateStr);
}

// Helper function to get the latest date
function getLatestDate(data) {
  console.log('Getting the latest date from data...');
  return data
    .map(entry => parseDate(entry['Log.Event Dt']))
    .reduce((latest, current) => (current > latest ? current : latest));
}

// Helper function to filter data by the last X days from the latest date
function filterByDaysFromLatest(data, days) {
  const latestDate = getLatestDate(data);
  console.log(`Filtering data from the latest date: ${latestDate} for the last ${days} days.`);
  
  return data.filter(entry => {
    const entryDate = parseDate(entry['Log.Event Dt']);
    const diffInDays = (latestDate - entryDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= days && diffInDays >= 0;
  });
}

// Helper function to calculate cumulative and average scores for the weekly data
// Helper function to calculate cumulative and average scores for the weekly data
function calculateWeeklyScores(data) {
  const fleetMap = {};

  data.forEach(entry => {
    const fleetName = entry['Fleet Name'];
    const rankingScore = parseFloat(entry['Ranking Score']);

    // Ensure that rankingScore is a valid number
    if (!isNaN(rankingScore)) {
      if (!fleetMap[fleetName]) {
        fleetMap[fleetName] = { totalScore: 0, count: 0 };
      }

      fleetMap[fleetName].totalScore += rankingScore;
      fleetMap[fleetName].count += 1;
    }
  });

  return Object.keys(fleetMap).map(fleetName => {
    const { totalScore, count } = fleetMap[fleetName];
    return {
      fleetName,
      totalScore: totalScore > 0 ? totalScore : null,
      averageScore: count > 0 ? totalScore / count : null
    };
  });
}

// API to get leaderboard for the daily timeframe
app.get('/leaderboard/daily', async (req, res) => {
  console.log('Received request for daily leaderboard');

  if (!leaderboardData || leaderboardData.length === 0) {
    console.error('Leaderboard data not loaded');
    return res.status(500).send('Leaderboard data not loaded.');
  }

  console.log('Filtering leaderboard data for the latest date...');
  
  // Get the latest date
  const latestDate = getLatestDate(leaderboardData);
  console.log(`Latest date is: ${latestDate}`);

  // Filter data for the latest date and sort by rank
  const filteredData = leaderboardData
    .filter(entry => parseDate(entry['Log.Event Dt']).getTime() === latestDate.getTime())
    .sort((a, b) => a['Daily_Rank'] - b['Daily_Rank'])
    .map(entry => ({
      fleetName: entry['Fleet Name'],
      rank: entry['Daily_Rank'],
      rankingScore: entry['Ranking Score'],
      Date: entry['Log.Event Dt']
    }));

  console.log('Filtered daily leaderboard:', JSON.stringify(filteredData, null, 2));
  res.json(filteredData);
});

// API to get leaderboard for the weekly timeframe
// API to get leaderboard for the weekly timeframe
app.get('/leaderboard/weekly', async (req, res) => {
  console.log('Received request for weekly leaderboard');

  if (!leaderboardData || leaderboardData.length === 0) {
    console.error('Leaderboard data not loaded');
    return res.status(500).send('Leaderboard data not loaded.');
  }

  console.log('Filtering leaderboard data for the last 7 days...');
  
  // Filter data for the last 7 days from the latest date
  const weeklyData = filterByDaysFromLatest(leaderboardData, 7);
  console.log(`Filtered weekly data count: ${weeklyData.length}`);

  // Calculate cumulative and average scores for each fleet
  const weeklyScores = calculateWeeklyScores(weeklyData);

  // Sort by average score in descending order (higher average scores rank better)
  const rankedWeeklyData = weeklyScores
  .sort((a, b) => b.averageScore - a.averageScore) // Sort in descending order by average score
  .map((fleet, index) => ({
    rank: index + 1,  // Assign rank based on the position in the sorted array
    fleetName: fleet.fleetName,
    averageScore: fleet.averageScore,
    totalScore: fleet.totalScore,
    dateRange: `Last 7 days from ${getLatestDate(leaderboardData).toISOString().split('T')[0]}`  // Show the date range
  }));
  
  console.log('Filtered weekly leaderboard:', JSON.stringify(rankedWeeklyData, null, 2));

  res.json(rankedWeeklyData);
});


// API to get leaderboard for the monthly timeframe
app.get('/leaderboard/monthly', async (req, res) => {
  console.log('Received request for monthly leaderboard');

  if (!leaderboardData || leaderboardData.length === 0) {
    console.error('Leaderboard data not loaded');
    return res.status(500).send('Leaderboard data not loaded.');
  }

  console.log('Filtering leaderboard data for the last 30 days...');
  
  // Filter data for the last 30 days from the latest date
  const monthlyData = filterByDaysFromLatest(leaderboardData, 30);
  console.log(`Filtered monthly data count: ${monthlyData.length}`);

  // Calculate cumulative and average scores for each fleet
  const monthlyScores = calculateWeeklyScores(monthlyData); // You can reuse the same function for cumulative and average calculations

  // Sort by average score in descending order (higher average scores rank better)
  const rankedMonthlyData = monthlyScores
    .sort((a, b) => b.averageScore - a.averageScore) // Sort by average score in descending order
    .map((fleet, index) => ({
      rank: index + 1,  // Assign rank based on the position in the sorted array
      fleetName: fleet.fleetName,
      averageScore: fleet.averageScore,
      totalScore: fleet.totalScore,
      dateRange: `Last 30 days from ${getLatestDate(leaderboardData).toISOString().split('T')[0]}`  // Show the date range for 30 days
    }));
  
  console.log('Filtered monthly leaderboard:', JSON.stringify(rankedMonthlyData, null, 2));

  res.json(rankedMonthlyData);
});



// Load leaderboard data from the CSV file
function loadLeaderboardData() {
  return new Promise((resolve, reject) => {
    const results = [];

    console.log('Loading leaderboard data from CSV...');
    fs.createReadStream('./output.csv') // ensure the file path is correct
      .pipe(csv())
      .on('data', (data) => {
        console.log('Row:', data);
        results.push(data);
      })
      .on('end', () => {
        console.log('Finished reading CSV file.');
        resolve(results);
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });
}

// Load data before starting the server
loadLeaderboardData().then(data => {
  leaderboardData = data;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error loading leaderboard data:', err.message);
});
const li = document.createElement('li');
li.classList.add('leaderboard-item');
