const deadline = new Date("2024-08-26T21:48:30"); // Set the deadline (example - replace with your actual deadline)

// Sample Data (Replace with your actual data source)
const playersData = [
      { id: 1,  name: "Osama",         position: "Fwd", price: 11, goals: 2, assists: 2,  willPlayNextMatch: true  },
      { id: 2,  name: "Mazen Hany",    position: "Fwd", price: 8,  goals: 0, assists: 0,  willPlayNextMatch: true  },
      { id: 3,  name: "Yousef Magdy",  position: "Mid", price: 14, goals: 1, assists: 0,  willPlayNextMatch: true  },
      { id: 4,  name: "Omar Ibrahim",  position: "Fwd", price: 9,  goals: 0, assists: 0,  willPlayNextMatch: true  },
      { id: 5,  name: "Abd Arhman",    position: "Mid", price: 11, goals: 0, assists: 0,  willPlayNextMatch: true  },
      { id: 6,  name: "Adam",          position: "Mid", price: 12, goals: 0, assists: 0,  willPlayNextMatch: true  },
      { id: 7,  name: "Ahmed Mahmoud", position: "Mid", price: 9,  goals: 0, assists: 0,  willPlayNextMatch: true  },
      { id: 8,  name: "Yousef Ashour", position: "GK",  price: 9,  goals: 0, assists: 0,  willPlayNextMatch: true  },
      { id: 9,  name: "Blal",          position: "Def", price: 6,  goals: 0, assists: 0,  willPlayNextMatch: true  },
      { id: 10, name: "Yehya",         position: "Mid", price: 8,  goals: 0, assists: 0,  willPlayNextMatch: true  },
     // ... more players
    ];

let selectedPlayers = [];
let remainingBudget = 50;

// DOM Elements
const playerTableBody = document.getElementById("player-table-body");
const teamContainer = document.getElementById("team-container");
const remainingBudgetDisplay = document.getElementById("remaining-budget");
const playerSearchInput = document.getElementById("player-search");
const saveTeamButton = document.getElementById("save-team-button");
const deadlineInfo = document.getElementById("deadline-info");
const deadlineTime = document.getElementById("deadline-time");
const welcomeMessage = document.getElementById("welcome-message");
const leaderboardBody = document.getElementById("leaderboard-body");

// Allowed Users (replace with your friends' usernames and passwords)
const allowedUsers = {
  osama: "Easy",
  yousef: "Easy2",
  lenovno: "123456",
  zyad: "Password123"
  // Add more users as needed
};

// --- Start of data loading and persistence logic ---

// Load user data from local storage
let currentUser = localStorage.getItem("currentUser");
let savedTeams = JSON.parse(localStorage.getItem("savedTeams")) || {};
let userScores = JSON.parse(localStorage.getItem("userScores")) || {}; // Load user scores

// Function to save user data to local storage
function saveUserData() {
  localStorage.setItem("currentUser", currentUser);
  localStorage.setItem("savedTeams", JSON.stringify(savedTeams));
  localStorage.setItem("userScores", JSON.stringify(userScores)); // Save user scores
}

// --- End of data loading and persistence logic ---

// Function to check if the deadline has passed
function isDeadlinePassed() {
  const now = new Date();
  return now > deadline;
}

function disableInteractionsIfNeeded() {
  if (isDeadlinePassed()) {
    const selectButtons = document.querySelectorAll(
      "button[onclick^='selectPlayer']"
    );
    selectButtons.forEach((button) => (button.disabled = true));
    saveTeamButton.disabled = true;
    deadlineInfo.textContent = "The Match Is Being Played Now.";
    deadlineInfo.style.color = "red";

    // Check if more than an hour has passed
    const timeSinceDeadline = new Date();
    timeSinceDeadline.setTime(Date.now() - deadline.getTime());
    if (timeSinceDeadline.getHours() > 1) {
      deadlineInfo.textContent = "The Match Has Ended.";
    }
  }
}

// Set up a regular interval to check the deadline
setInterval(disableInteractionsIfNeeded, 10000); // Check every 10 seconds

// Preload Images
function preloadImages(players) {
  players.forEach((player) => {
    const img = new Image();
    img.src = `images/${player.id}.jpg`;

    img.onerror = function () {
      this.onerror = null;
      this.src = "images/unknown.jpg";
    };
  });
}

// Function to load and display players in the table
function loadPlayers(players) {
  playerTableBody.innerHTML = "";
  players.filter((player) => player.willPlayNextMatch).forEach((player) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><img src="images/${player.id}.jpg" alt="${player.name}" width="50" height="50" onerror="this.src='images/unknown.jpg'"></td>
        <td>${player.name}</td>
        <td>${player.position}</td>
        <td>${player.price}</td>
        <td>${player.goals}</td>
        <td>${player.assists}</td>
        <td><button onclick="selectPlayer(${player.id})">Select</button></td>`;
    playerTableBody.appendChild(row);
  });
}

// Function to handle player selection
function selectPlayer(playerId) {
  // Check login status first
  if (!currentUser) {
    alert("Please log in to select players.");
    return; // Prevent selection
  }

  if (isDeadlinePassed()) {
    alert("You cannot change your lineup. The match has started!");
    return;
  }

  const player = playersData.find((player) => player.id === playerId);

  if (!player) {
    console.error("Player not found!");
    return;
  }

  const playerIndex = selectedPlayers.findIndex((p) => p.id === playerId);

  if (playerIndex === -1) {
    if (selectedPlayers.length < 5 && remainingBudget >= player.price) {
      selectedPlayers.push(player);
      remainingBudget -= player.price;
    } else if (selectedPlayers.length >= 5) {
      alert("You can only select 5 players.");
      return;
    } else {
      alert("Not enough budget!");
      return;
    }
  } else {
    selectedPlayers.splice(playerIndex, 1);
    remainingBudget += player.price;
  }

  updateTeamDisplay();
}

function updateTeamDisplay() {
  teamContainer.innerHTML = "";

  // Load the saved team if the user is logged in
  if (currentUser && savedTeams[currentUser]) {
    selectedPlayers = savedTeams[currentUser];
    remainingBudget =
      50 -
      selectedPlayers.reduce((total, player) => total + player.price, 0);
  }

  selectedPlayers.forEach((player, index) => {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player-card");

    const img = document.createElement("img");
    img.src = `images/${player.id}.jpg`;
    img.alt = player.name;
    img.height = "50";

    img.onerror = function () {
      this.onerror = null;
      this.src = "images/unknown.png";
    };

    playerDiv.appendChild(img);

    const playerInfo = document.createElement("span");
    playerInfo.innerHTML = `${player.name} (${player.position})`;
    playerInfo.addEventListener("click", () => selectPlayer(player.id));
    playerDiv.appendChild(playerInfo);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-player";
    removeButton.textContent = "Remove";
    removeButton.onclick = () => selectPlayer(player.id);
    playerDiv.appendChild(removeButton);

    teamContainer.appendChild(playerDiv);
  });

  remainingBudgetDisplay.textContent = remainingBudget;
}

// Function to handle saving the team
function saveTeam() {
  if (!currentUser) {
    // User must be logged in
    alert("Please log in to save your team.");
    return;
  }

  if (isDeadlinePassed()) {
    alert("You cannot change your lineup. The match has started!");
    return;
  }

  if (selectedPlayers.length === 5) {
    savedTeams[currentUser] = [...selectedPlayers];
    alert(`Team saved for ${currentUser}!`);

    localStorage.setItem("savedTeams", JSON.stringify(savedTeams));
    updateLeaderboard(); // Update leaderboard after saving team
  } else {
    alert("Please select a full team of 5 players.");
  }
}

playerSearchInput.addEventListener("input", () => {
  const searchTerm = playerSearchInput.value.toLowerCase();
  const filteredPlayers = playersData.filter((player) =>
    player.name.toLowerCase().includes(searchTerm)
  );
  loadPlayers(filteredPlayers);
});

saveTeamButton.addEventListener("click", saveTeam);

// Update the deadline display
function updateDeadlineDisplay() {
  deadlineTime.textContent = deadline.toLocaleString();
  disableInteractionsIfNeeded();
}

const updateLeaderboardButton = document.getElementById("updateLeaderboardButton");

updateLeaderboardButton.addEventListener("click", updateLeaderboard);

// Function to update player stats (call after each match)
function updatePlayerStats(playerId, goals, assists) {
  const player = playersData.find((p) => p.id === playerId);
  if (player) {
    player.goals += goals;
    player.assists += assists;
    loadPlayers(playersData); // Refresh the player table
    updateLeaderboard(); // Update the leaderboard after updating stats
    updateScores(playerId, goals, assists); // Update user scores based on player stats
  }
}

// Function to handle login
function login() {
  const username = prompt("Enter your username:");
  const password = prompt("Enter your password:");

  if (allowedUsers[username] === password) {
    alert(`Welcome, ${username}!`);
    currentUser = username;
    welcomeMessage.textContent = `Welcome, ${username}!`;
    saveUserData(); // Save the logged-in user to local storage
    updateTeamDisplay(); // Load the saved team for the user (if any)
    updateLeaderboard(); // Update the leaderboard after login
  } else {
    alert("Invalid username or password. Please try again.");
  }
}

// Function to calculate a user's total points
function calculateUserPoints(username) {
  const userTeam = savedTeams[username];
  if (userTeam) {
    return userTeam.reduce((totalPoints, player) => {
      const updatedPlayer = playersData.find((p) => p.id === player.id);
      if (updatedPlayer) {
        return totalPoints + updatedPlayer.goals * 3 + updatedPlayer.assists * 2;
      }
      return totalPoints;
    }, 0);
  }
  return 0;
}

function updateLeaderboard() {
  leaderboardBody.innerHTML = "";

  const userScores = Object.keys(savedTeams).map((username) => ({
    username,
    points: calculateUserPoints(username),
  }));

  userScores.sort((a, b) => b.points - a.points);

  userScores.forEach((userScore, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${userScore.username}</td>
        <td>${userScore.points}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

// Function to update user scores based on player stats
function updateScores(playerId, goals, assists) {
  Object.keys(savedTeams).forEach((username) => {
    const userTeam = savedTeams[username];
    if (userTeam && userTeam.some((player) => player.id === playerId)) {
      if (!userScores[username]) {
        userScores[username] = 0;
      }
      userScores[username] += goals * 3 + assists * 2;
    }
  });
  saveUserData(); // Save user scores to local storage
}

// Example usage:
// updatePlayerStats(1, 2, 1); // Osama scored 2 goals and 1 assist
// updatePlayerStats(3, 1, 0); // Yousef scored 1 goal

// Initial setup
loadPlayers(playersData);
preloadImages(playersData);
updateDeadlineDisplay();
updateLeaderboard(); // Load the leaderboard initially