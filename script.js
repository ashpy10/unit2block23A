// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2501-PUPPIES";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const state = {
  allPlayers: [],
  singlePlayer: {},
}

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log(data);

    const players = data.data.players;
    state.allPlayers = players;
    renderAllPlayers(players);
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const res = await fetch(`${API_URL}/${playerID}`)
    console.log(res)
    const data = await res.json()
    console.log(data.results)
    renderSinglePlayer(data.data.player)

  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    const newPlayer = await response.json();
    fetchAllPlayers();
    return newPlayer;

  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/${playerID}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchAllPlayers();
    } else {
      console.error('Failed to remove player #${playerID}');
    }

  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const main = document.querySelector('main');
  main.innerHTML = '';

  if (playerList.length === 0) {
    main.innerHTML = '<p>No players were found. Try again.</p>';
    return;
  }

  playerList.forEach(player => {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';

    playerCard.innerHTML = `
    <h2>${player.name}</h2>
    <p>ID: ${player.id}</p>
    <img src="${player.imageUrl}" alt="${player.name}">
    <button class="details-button" data-id="${player.id}">See details</button>
    <button class="remove-button" data-id="${player.id}">Remove from roster</button>
    `;

    main.appendChild(playerCard);
  });

  main.querySelectorAll('.details-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const playerId = event.target.dataset.id;
      const player = await fetchSinglePlayer(playerId);
      renderSinglePlayer(player);
    });
  });

  main.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const playerId = event.target.dataset.id;
      await removePlayer(playerId);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
  });
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const main = document.querySelector('main');
  main.innerHTML = ''; // Clear existing content

  const playerCard = document.createElement('div');
  playerCard.className = 'player-card';

  playerCard.innerHTML = `
    <h2>${player.name}</h2>
    <p>ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <img src="${player.imageUrl}" alt="${player.name}">
    <p>Team: ${player.team ? player.team.name : 'Unassigned'}</p>
    <button id="back-button">Back to all players</button>
  `;

  main.appendChild(playerCard);

  // Add event listener for the back button
  document.getElementById('back-button').addEventListener('click', async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  const formContainer = document.getElementById('new-player-form-container');
  formContainer.innerHTML = `
    <form id="new-player-form">
      <input type="text" name="name" placeholder="Player Name" required>
      <input type="text" name="breed" placeholder="Breed" required>
      <input type="url" name="imageUrl" placeholder="Image URL" required>
      <input type="text" name="team" placeholder="Team Name">
      <button type="submit">Add Player</button>
    </form>
  `;

  const form = document.getElementById('new-player-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const newPlayer = {
      name: formData.get('name'),
      breed: formData.get('breed'),
      imageUrl: formData.get('imageUrl'),
      team: formData.get('team') ? { name: formData.get('team') } : null,
    };
    await addNewPlayer(newPlayer);
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    form.reset();
  });
  const fetchSinglePlayer = async (playerId) => {
    try {
      const response = await fetch(`${API_URL}/${playerId}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
  };  
};


/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  await fetchAllPlayers(); 
  renderNewPlayerForm();
  renderNewPlayerForm(); 
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
