function Player() {
  const player = { name: "", mark: "", points: 0, active: false }
  
  return {
    getEntries: () => Object.entries(player),
    setValue: (key, value) => player[key] = value,
    getValue: (key) => player[key],
    clearPoints: () => player.points = 0,
    addPoint: () => player.points++,
    losePoint: () => player.points--,
    isActive: () => player.active,
    toggleActive: () => player.active = !player.active,
  }
};

function State() {
  const players = [];
  const defaultMarks = ["x","o"];
  function setPlayerDefaults() {
    defaultMarks.forEach((mark) => {
      const player = Player();
      player.setValue("name",`player${mark}`);
      player.setValue("mark",`${mark.toUpperCase()}`);
      players.push(player);
    });
  };
  
  return {
    getPlayers: () => players,
    initDefaultState: () => {
      setPlayerDefaults();
    }
  }
};

function Elements() {
  const LabelInputPair = (inputName) => {
    const pair = document.createElement("div");
    pair.classList.add(`${inputName}-input-label-pair`, "input-label-pair");
    const label = document.createElement("label");
    label.classList.add(`${inputName}-label`);
    label.innerText = `${inputName}`;
    const input = document.createElement("input");
    input.classList.add(`${inputName}-input`, "player-input");
    input.name = `${inputName}`;
    pair.append(label, input);
    return pair;
  }

  const PlayerInputCard = (player) => {
    const card = document.createElement("div");
    card.classList.add("player-input-card");
    for (let i = 0; i < player.getEntries().length; i++) {
      const entry = player.getEntries()[i];
      if (typeof entry[1] === "string") card.append(LabelInputPair(entry[0]));
    }
    return card;
  }

  const PlayerDisplayCard = (player) => {
    const card = document.createElement("div");
    card.classList.add("player-display-card");
    for (let i = 0; i < player.getEntries().length; i++) {
      const entry = player.getEntries()[i];
      if (typeof entry[1] !== "boolean") {
        const display = document.createElement("p");
        display.classList.add(`${entry[0]}-display`);
        display.innerText = `${entry[1]}`;
        card.append(display);
      }
    }
    return card;
  }

  const SetupButton = (text) => {
    const button = document.createElement("button");
    button.id = `${text.replace(" ","-")}-button`;
    button.classList.add("setup-button");
    button.innerText = text;
    return button;
  }

  return {
    PlayerInputCard,
    PlayerDisplayCard,
    SetupButton
  }
};

(() => {
  const state = State();
  const elem = Elements();
  state.initDefaultState();

  const players = state.getPlayers();
    const playersDisplay = document.getElementById("players");
  players.forEach(player => playersDisplay.append(elem.PlayerInputCard(player)));

  const startGameButton = elem.SetupButton("start game");
  startGameButton.addEventListener("click", () => {
    playersDisplay.innerHTML = "";
    players.forEach(player => playersDisplay.append(elem.PlayerDisplayCard(player)));
  })
  document.getElementById("setup").append(startGameButton);

})();