let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true;

let playBtn;

window.onload = () => {
  playBtn = document.getElementById("play-btn");
  playBtn.addEventListener("click", () => {
    reset();
    buildDeck();
    shuffleDeck();
    startGame();
  });
};

function buildDeck() {
  let deckValues = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  let deckTypes = ["C", "D", "H", "S"];

  deck = [];

  for (let i = 0; i < deckTypes.length; i++) {
    for (let j = 0; j < deckValues.length; j++) {
      deck.push(deckValues[j] + "-" + deckTypes[i]);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function startGame() {
  //make the play btn = play again
  playBtn.innerText = "Play Again";
  //hide the game dialogue during the game
  const gameDialogue = document.getElementById("game-dialogue");
  gameDialogue.style.display = "none";

  //reveal visible game elements
  const hiddenElements = document.querySelectorAll(".hidden");

  hiddenElements.forEach((element) => {
    element.classList.toggle("hidden");
  });
  //initialize dealer's hidden card
  const hiddenCard = document.getElementById("dealer-cards");
  let cardImg = document.createElement("img");
  cardImg.src = "./cards/BACK.png";
  cardImg.id = "hidden";

  hiddenCard.append(cardImg);
  hidden = deck.pop();
  initializeCard("dealer", hidden);

  //initialize dealer's hand
  while (dealerSum < 17) {
    draw("dealer");
  }

  //initialize player hand
  for (let i = 0; i < 2; i++) {
    draw("you");
  }

  const hitBtn = document.getElementById("hit-btn");

  hitBtn.addEventListener("click", hit);

  document.getElementById("stay-btn").addEventListener("click", () => {
    win();
  });
}

function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    if (value == "A") {
      return 11;
    }
    return 10;
  }

  return parseInt(value);
}

function checkAce(card) {
  if (card[0] === "A") {
    return 1;
  }
  return 0;
}

function draw(drawer) {
  // name of the drawer of th card
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  initializeCard(drawer, card);

  //check if the card belong to the dealer or the player
  if (drawer === "dealer") {
    document.getElementById("dealer-cards").append(cardImg);
  } else if (drawer === "you") {
    document.getElementById("your-cards").append(cardImg);
  }
}

function initializeCard(player, card) {
  if (player === "dealer") {
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
  } else if (player === "you") {
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    checkBlackJack();
  }
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }

  return playerSum;
}

function checkBlackJack() {
  if (yourSum == 21) {
    canHit = false;
    // call win function for the player
    win();
  }
}

function win() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;

  //reveal hidden card
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  let messege = "";
  if (yourSum > 21) {
    messege = "You Lose!";
  } else if (yourSum == 21) {
    messege = "You Win, BLACKJACK!!!";
  } else if (dealerSum > 21) {
    messege = "You Win!";
  } else if (dealerSum == yourSum) {
    messege = "Tie!";
  } else if (yourSum > dealerSum) {
    messege = "You Win!";
  } else if (yourSum < dealerSum) {
    messege = "You Lose!";
  }
  document.getElementById("dealer-sum").innerText = dealerSum;

  document.getElementById("your-sum").innerText = yourSum;

  document.getElementById("results").innerText = messege;

  const gameDialogue = document.getElementById("game-dialogue");
  gameDialogue.style.display = "block";
  gameDialogue.innerText = "Another round ?";
}

function reset() {
  canHit = true;
  dealerAceCount = 0;
  dealerSum = 0;
  yourAceCount = 0;
  yourSum = 0;

  document.getElementById("dealer-sum").innerText = "";

  document.getElementById("your-sum").innerText = "";

  const dealerCards = document.getElementById("dealer-cards");

  let children = dealerCards.querySelectorAll("*");

  children.forEach((element) => {
    element.remove();
  });

  const yourCards = document.getElementById("your-cards");

  let playerChildren = yourCards.querySelectorAll("*");

  playerChildren.forEach((element) => {
    element.remove();
  });

  const results = document.getElementById("results");
  results.innerText = "";
}

function hit() {
  if (!canHit) {
    return;
  } else if (canHit) {
    draw("you");
  }

  if (reduceAce(yourSum, yourAceCount) > 21) {
    canHit = false;
    //call win for the dealer
    win();
  }
}
