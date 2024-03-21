let deck = [];
let dealerHand = [];
let playerHand = [];
let count = 0;
let dollars = 100;
let bet = 0;
let proceed = true;

// const CARD_MODEL = document.createElement('div');
// CARD_MODEL.classList.add('card');

const IMG_MODEL = document.createElement('img');
IMG_MODEL.classList.add('card');

const DEALER = document.getElementById("dealer");
const PLAYER = document.getElementById("player");
const HIT_BUTTON = document.getElementById("hit-button");
const PASS_BUTTON = document.getElementById("pass-button");
const NEXTHAND_BUTTON = document.getElementById("next-hand-button");

const values = new Map([
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
  ['10', 10],
  ['J', 10],
  ['Q', 10],
  ['K', 10],
  ['A', 11]
]);

class Card {
  constructor(number, suit) {
    this.number = number;
    this.suit = suit;
  }
  getVal() {
    return this.number + this.suit;
  }
}

function createDeck() {
  const suits = ['H', 'S', 'C', 'D'];
  const numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  for (let suit of suits) {
    for (let number of numbers) {
      let newCard = new Card(number, suit);
      deck.push(newCard);
    }
  }
}

function shuffle() {
  if (!proceed) {
    return;
  }
  let current = deck.length-1, random;
  while (current >= 0) {
    random = Math.floor(Math.random() * current);
    [deck[current], deck[random]] = [deck[random], deck[current]];
    current--;
  }
}

function dealCards() {
  if (!proceed) {
    return;
  }
  bet = document.querySelector('#bet');
  document.getElementById("bet").style.display = "none";
  document.getElementById("bet-label").style.display = "none";
  dealerHand = [deck[count++], deck[count++]];
  dealerHand.forEach((item, index) => {
    const newCardModel = IMG_MODEL.cloneNode(true);
    if (index === 1) {
      newCardModel.classList.add('back');
      newCardModel.src =  "cards/back.png";
    }
    else {
      newCardModel.src = "cards/" + item.getVal() + ".png";
    }
    DEALER.append(newCardModel);
  });
  playerHand = [deck[count++], deck[count++]];
  playerHand.forEach((item) => {
    const newCardModel = IMG_MODEL.cloneNode(true);
    newCardModel.src = "cards/" + item.getVal() + ".png";
    PLAYER.append(newCardModel);
  });
  document.getElementById("next-hand-button").style.display = "none";
  document.getElementById("player-header").style.display = 'block';
  document.getElementById("dealer-header").style.display = 'block';
  document.getElementById("hit-button").style.display = 'block';
  document.getElementById("pass-button").style.display = 'block';
}

function calculate(hand) {
  let amount = 0;
  let ace = 0;
  hand.forEach((card) => {
    console.log(card.number);
    if (card.number === 'A') {
      ace++;
    }
    else {
      amount += values.get(card.number);
    }
  });
  while (ace > 0) {
    if (amount + 11 <= 22 - ace) {
      amount += 11;
    }
    else {
      amount += 1;
    }
    ace--;
  }
  return amount;
}

function hitPlayer() {
  const newCard = deck[count++];
  playerHand.push(newCard);
  const newCardModel = IMG_MODEL.cloneNode(true);
  newCardModel.src = "cards/" + newCard.getVal() + ".png";
  PLAYER.append(newCardModel);
  if (calculate(playerHand) > 21) {
    document.getElementById("hit-button").style.display = "none";
    document.getElementById("pass-button").style.display = "none";
    setTimeout(() => { 
      alert("BUST, YOU LOSE");
      document.getElementById("next-hand-button").style.display = "block"; 
      dollars = dollars - bet.value;
      updateBank();
      document.getElementById("bet").style.display = "block";
      document.getElementById("bet-label").style.display = "flex";
    }, 1000);
  }
}

function hitDealer() {
  const flipCard = DEALER.children[1];
  flipCard.classList.remove('back');
  flipCard.src = "cards/" + dealerHand[1].getVal() + ".png";  
  if (calculate(dealerHand) < 17) {
    setTimeout(() => {
      const newCard = deck[count++];
      dealerHand.push(newCard);
      const newCardModel = IMG_MODEL.cloneNode(true);
      newCardModel.src = "cards/" + newCard.getVal() + ".png";
      DEALER.append(newCardModel);
      hitDealer();
    }, 1000);
  } 
  else if (calculate(dealerHand) > 21) {
    setTimeout(() => { 
      alert("DEALER BUST, YOU WIN!"); 
      document.getElementById("next-hand-button").style.display = "block";
      dollars = dollars + parseInt(bet.value);
      updateBank();
      document.getElementById("bet").style.display = "block";
      document.getElementById("bet-label").style.display = "flex";
    }, 1000);
  }
  else {
    getOutcome();
  }
  document.getElementById("hit-button").style.display = "none";
  document.getElementById("pass-button").style.display = "none";
}

function getOutcome() {
  if (calculate(dealerHand) < calculate(playerHand)) {
    setTimeout(() => { 
      alert("YOU WIN!"); 
      document.getElementById("next-hand-button").style.display = "block";
      dollars = dollars + parseInt(bet.value);
      updateBank();
      document.getElementById("bet").style.display = "block";
      document.getElementById("bet-label").style.display = "flex";
    }, 1000);
  }
  else if (calculate(dealerHand) > calculate(playerHand)) {
    setTimeout(() => { 
      alert("YOU LOSE"); 
      document.getElementById("next-hand-button").style.display = "block";
      dollars = dollars - bet.value;
      updateBank();
      document.getElementById("bet").style.display = "block";
      document.getElementById("bet-label").style.display = "flex";
    }, 1000);
  }
  else {
    setTimeout(() => { 
      alert("PUSH"); 
      document.getElementById("next-hand-button").style.display = "block";
      document.getElementById("bet").style.display = "block";
      document.getElementById("bet-label").style.display = "flex";
    }, 1000);
  }
}

function checkBet() {
  if (document.querySelector('#bet').value > dollars) {
    alert("you don't have enough");
    proceed = false;
  }
  else {
    proceed = true;
  }
}

function clearBoard() {
  if (!proceed) {
    return;
  }
  PLAYER.innerHTML = '';
  DEALER.innerHTML = '';
  count = 0;
}

function updateBank() {
  document.getElementById("amount").innerHTML = 'You have: $' + dollars;
}

createDeck();
shuffle();
updateBank();

HIT_BUTTON.addEventListener('click', hitPlayer);
PASS_BUTTON.addEventListener('click', hitDealer);
NEXTHAND_BUTTON.addEventListener('click', clearBoard);
NEXTHAND_BUTTON.addEventListener('click', shuffle);
NEXTHAND_BUTTON.addEventListener('click', dealCards);