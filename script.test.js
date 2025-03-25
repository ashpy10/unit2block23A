const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

// TODO: Tests for `fetchSinglePlayer`
describe("fetchSinglePlayer", () => {
  const mockPlayer = { id: 1, name: "Fido" };

  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPlayer),
      })
    );
  });

  test("returns a player object with id and name", async () => {
    const player = await fetchSinglePlayer(1);
    expect(player).toEqual(mockPlayer);
  });
});


// TODO: Tests for `addNewPlayer`
describe("addNewPlayer", () => {
  const newPlayer = { name: "Buddy", breed: "Golden Retriever" };

  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(newPlayer),
      })
    );
  });

  test("adds a new player and returns the player object", async () => {
    const addedPlayer = await addNewPlayer(newPlayer);
    expect(addedPlayer).toEqual(newPlayer);
  });
});


// (Optional) TODO: Tests for `removePlayer`
describe("removePlayer", () => {
  beforeAll(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  test("removes a player without throwing an error", async () => {
    await expect(removePlayer(1)).resolves.not.toThrow();
  });
});

