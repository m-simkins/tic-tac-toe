function Player() {
  const player = { name: "", mark: "", points: 0, active: false }
  return {
    setName: (newName) => player.name = newName,
    getName: () => player.name,
    setMark: (newMark) => player.mark = newMark,
    getMark: () => player.mark,
    clearPoints: () => player.points = 0,
    addPoint: () => player.points++,
    losePoint: () => player.points--,
    getPoints: () => player.points,
    isActive: () => player.active,
    toggleActive: () => player.active = !player.active,
    getInputKeys: () => {
      const strings = [];
      for (const [key, value] of Object.entries(player)) {        
        if (typeof value === "string") strings.push(key);
      };
      return strings;
    },
    getDisplayKeys: () => {
      const keys = [];
      for (const [key, value] of Object.entries(player)) {
        if (typeof value === "string" || typeof value === "number") keys.push(key);
      }
      return keys;
    }
  }
};

function State() {
  const players = [];
  const defaultMarks = ["X","O"];
  function setPlayerDefaults() {
    defaultMarks.forEach((mark) => {
      const player = Player();
      player.setName(`player ${mark}`);
      player.setMark(mark);
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
    const label = document.createElement("label");
    label.classList.add(`${inputName}-label`);
    label.innerText = `${inputName}`;
    const input = document.createElement("input");
    input.classList.add(`${inputName}-input`, "player-info-input");
    input.name = `${inputName}`;
    return { label, input };
  }

  const PlayerInfoInputCard = (inputKeys, playerIndex) => {
    const card = document.createElement("div");
    card.classList.add("player-info-input-card");
    card.id = `${playerIndex}-info-input-card`;
    for (let i = 0; i < inputKeys.length; i++) {
      const key = inputKeys[i];
      const pair = LabelInputPair(key);
      pair.label.htmlFor = `${playerIndex}-${inputKeys[i]}-input`;      
      pair.input.id = `${playerIndex}-${inputKeys[i]}-input`;
      switch (key) {
        case "name":
          pair.input.maxLength = 10;
          break;
        case "mark":
          pair.input.maxLength = 1;
          break;
        default:
          break;
      }
      card.append(pair.label, pair.input);
    }
    return card;
  }

  const PlayerInfoDisplayCard = (player) => {
    const card = document.createElement("div");
    card.classList.add("player-info-display-card");
    for (let i = 0; i < player.getDisplayKeys().length; i++) {
      const display = document.createElement("p");
      const key = player.getDisplayKeys()[i];
      display.classList.add(`${key}-display`);
      switch (key) {
        case "name":
          display.innerText = player.getName();
          break;
        case "mark":
          display.innerText = player.getMark();
          break;
        case "points":
          display.innerText = player.getPoints();
          break;
        default:
          break;
      };
      card.append(display);
    }
    return card;
  }

  return {
    PlayerInfoInputCard,
    PlayerInfoDisplayCard
  }
}

(() => {
  const state = State();
  state.initDefaultState();
  
  const elements = Elements();

  const players = state.getPlayers();
  for (let i = 0; i < players.length; i++) {
    const card = elements.PlayerInfoInputCard(players[i].getInputKeys(), i);
    card.id = `${i}-info-input-card`;
    document.getElementById("players").append(card);
  };

})();