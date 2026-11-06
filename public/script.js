
/
// ===================================
// LOAD ALL TEAMS
// ===================================
function loadTeams() {
    fetch("/api/teams")
        .then(response => response.json())
        .then(teams => {
            const teamDiv = document.getElementById("teams");
            teamDiv.innerHTML = "";

            // Dashboard
            document.getElementById("teamCount").textContent = teams.length;

            const totalWins = teams.reduce((sum, team) => sum + team.wins, 0);
            const totalLosses = teams.reduce((sum, team) => sum + team.losses, 0);

            document.getElementById("totalWins").textContent = totalWins;
            document.getElementById("totalLosses").textContent = totalLosses;

            // Update standings and dropdowns
            updateStandings(teams);
            loadTeamDropdowns(teams);

            teams.forEach(team => {
                teamDiv.innerHTML += `
                    <div>
                        <h3>${team.teamName}</h3>
                        <p>City: ${team.city}</p>
                        <p>Coach: ${team.coach}</p>
                        <p>Captain: ${team.captain}</p>
                        <p>Points: ${team.points}</p>

                        <button onclick="editTeam('${team._id}')">Edit Team</button>
                        <button onclick="deleteTeam('${team._id}')">Delete Team</button>
                    </div>
                `;
            });
        })
        .catch(error => console.log("Team Error:", error));
}


// ===================================
// ADD TEAM
// ===================================
document.getElementById("teamForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const newTeam = {
        teamName: document.getElementById("teamName").value,
        city: document.getElementById("city").value,
        coach: document.getElementById("coach").value,
        captain: document.getElementById("captain").value
    };

    fetch("/api/teams/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("teamForm").reset();
        loadTeams();
    })
    .catch(error => alert(error.message));
});


// ===================================
// DELETE TEAM
// ===================================
function deleteTeam(id) {
    if (!confirm("Are you sure you want to delete this team?")) return;

    fetch(`/api/teams/delete/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadTeams();
        loadPlayers();
    })
    .catch(error => alert(error.message));
}


// ===================================
// EDIT TEAM
// ===================================
function editTeam(id) {
    const teamName = prompt("Enter new team name:");
    if (!teamName) return;

    fetch(`/api/teams/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadTeams();
    })
    .catch(error => alert(error.message));
}


// ===================================
// LOAD ALL PLAYERS
// ===================================
function loadPlayers() {
    fetch("/api/players")
        .then(response => response.json())
        .then(players => {
            const playerDiv = document.getElementById("players");
            playerDiv.innerHTML = "";

            document.getElementById("playerCount").textContent = players.length;

            players.forEach(player => {
                playerDiv.innerHTML += `
                    <div>
                        <h3>${player.playerName}</h3>
                        <p>Age: ${player.age}</p>
                        <p>Role: ${player.role}</p>
                        <p>Team: ${player.team ? player.team.teamName : "No team"}</p>

                        <button onclick="editPlayer('${player._id}')">Edit Player</button>
                        <button onclick="deletePlayer('${player._id}')">Delete Player</button>
                    </div>
                `;
            });
        })
        .catch(error => console.log("Player Error:", error));
}


// ===================================
// ADD PLAYER
// ===================================
document.getElementById("playerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const newPlayer = {
        playerName: document.getElementById("playerName").value,
        age: Number(document.getElementById("age").value),
        role: document.getElementById("role").value,
        team: document.getElementById("teamId").value
    };

    fetch("/api/players/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlayer)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("playerForm").reset();
        loadPlayers();
    })
    .catch(error => alert(error.message));
});


// ===================================
// DELETE PLAYER
// ===================================
function deletePlayer(id) {
    if (!confirm("Are you sure you want to delete this player?")) return;

    fetch(`/api/players/delete/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadPlayers();
    })
    .catch(error => alert(error.message));
}


// ===================================
// EDIT PLAYER
// ===================================
function editPlayer(id) {
    const playerName = prompt("Enter new player name:");
    if (!playerName) return;

    const age = prompt("Enter new age:");
    if (!age || isNaN(age) || Number(age) <= 0) {
        alert("Please enter a valid age.");
        return;
    }

    const role = prompt("Enter new player role:");
    if (!role) return;

    fetch(`/api/players/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playerName,
            age: Number(age),
            role
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadPlayers();
    })
    .catch(error => alert(error.message));
}


// ===================================
// LOAD TEAM DROPDOWNS
// ===================================
function loadTeamDropdowns(teams) {
    const team1 = document.getElementById("team1Id");
    const team2 = document.getElementById("team2Id");
    const winner = document.getElementById("winnerId");
    const playerTeam = document.getElementById("teamId");

    team1.innerHTML = '<option value="">Select First Team</option>';
    team2.innerHTML = '<option value="">Select Second Team</option>';
    winner.innerHTML = '<option value="">Select Winner</option>';
    playerTeam.innerHTML = '<option value="">Select Team</option>';

    teams.forEach(team => {
        const option = `<option value="${team._id}">${team.teamName}</option>`;

        team1.innerHTML += option;
        team2.innerHTML += option;
        winner.innerHTML += option;
        playerTeam.innerHTML += option;
    });
}


// ===================================
// RECORD MATCH RESULT
// ===================================
document.getElementById("matchFormData").addEventListener("submit", function(event) {
    event.preventDefault();

    const team1Id = document.getElementById("team1Id").value;
    const team2Id = document.getElementById("team2Id").value;
    const winnerId = document.getElementById("winnerId").value;

    if (team1Id === team2Id) {
        alert("Please select two different teams.");
        return;
    }

    if (winnerId !== team1Id && winnerId !== team2Id) {
        alert("Winner must be one of the two teams.");
        return;
    }

    fetch("/api/teams/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team1Id, team2Id, winnerId })
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not save match.");
        }

        return data;
    })
    .then(data => {
        alert(data.message);
        document.getElementById("matchFormData").reset();
        loadTeams();
    })
    .catch(error => alert("Error: " + error.message));
});


// ===================================
// SEARCH TEAMS
// ===================================
function searchTeams() {
    const searchValue = document.getElementById("teamSearch").value.toLowerCase();

    document.querySelectorAll("#teams > div").forEach(card => {
        const teamName = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = teamName.includes(searchValue) ? "block" : "none";
    });
}


// ===================================
// SEARCH PLAYERS
// ===================================
function searchPlayers() {
    const searchValue = document.getElementById("playerSearch").value.toLowerCase();

    document.querySelectorAll("#players > div").forEach(card => {
        const playerName = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = playerName.includes(searchValue) ? "block" : "none";
    });
}


// ===================================
// SORT TEAMS BY POINTS
// ===================================
function sortTeams() {
    const teamDiv = document.getElementById("teams");
    const teams = Array.from(teamDiv.children);

    teams.sort((a, b) => {
        const pointsA = Number(a.querySelector("p:last-of-type").textContent.replace("Points: ", ""));
        const pointsB = Number(b.querySelector("p:last-of-type").textContent.replace("Points: ", ""));
        return pointsB - pointsA;
    });

    teams.forEach(team => teamDiv.appendChild(team));
}


// ===================================
// SORT PLAYERS BY AGE
// ===================================
function sortPlayers() {
    const playerDiv = document.getElementById("players");
    const players = Array.from(playerDiv.children);

    players.sort((a, b) => {
        const ageA = Number(a.querySelector("p").textContent.replace("Age: ", ""));
        const ageB = Number(b.querySelector("p").textContent.replace("Age: ", ""));
        return ageA - ageB;
    });

    players.forEach(player => playerDiv.appendChild(player));
}


// ===================================
// UPDATE LEAGUE STANDINGS
// ===================================
function updateStandings(teams) {
    const table = document.getElementById("standingsTable");
    table.innerHTML = "";

    const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

    sortedTeams.forEach(team => {
        table.innerHTML += `
            <tr>
                <td>${team.teamName}</td>
                <td>${team.matchesPlayed}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${team.points}</td>
            </tr>
        `;
    });
}


// ===================================
// LOAD DATA WHEN WEBSITE OPENS
// ===================================
loadTeams();
loadPlayers();
