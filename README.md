# Fleet_rank
# Leaderboard Application

This project is a leaderboard web application that dynamically displays rankings based on CSV data. The application provides daily, weekly, and monthly leaderboards using Node.js, Express.js, and client-side JavaScript. The leaderboard data is loaded from a CSV file and processed to show the ranking of different fleets based on their performance.

## Project Structure: Please structure your project according to this directory.

```bash
.
├── backup/                  # Backup files (if any)
├── node_modules/            # Node.js modules (auto-generated)
├── public/                  # Public assets (HTML, CSS, JS, and images)
│   ├── bg.jpeg              # Background image for the web pages
│   ├── index.css            # Stylesheet for the main index.html page
│   ├── index.html           # Main HTML file for the leaderboard page
│   ├── main.js              # JavaScript file for handling client-side logic
│   ├── Myteam.css           # Styles for the team page
│   ├── Myteam.html          # HTML file for the team page
│   ├── Myteam.js            # JavaScript for team-related functionality
│   └── i.html               # Additional HTML file
├── index.js                 # Node.js server-side code (Express.js)
├── output.csv               # CSV file containing processed leaderboard data
├── package.json             # Project metadata and dependencies
├── package-lock.json        # Auto-generated lock file for dependencies



Prerequisites
Ensure you have the following installed on your system:

Node.js (v14 or higher)
npm (Node Package Manager)


Clone the Repository:
git clone https://github.com/your-username/leaderboard-app.git
cd leaderboard-app

Install Dependencies:

After navigating to the project folder, install the necessary Node.js dependencies:
npm install

Start the Server:

Run the following command to start the Express server:
node index.js
The server will start on http://localhost:3000.

http://localhost:3000/public/index.html


