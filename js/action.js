
  // List of icons for the cards
  const icons = ["fa fa-gbp", "fa fa-gbp", "fa fa-umbrella", "fa fa-umbrella", "fa fa-american-sign-language-interpreting", "fa fa-american-sign-language-interpreting", "fa fa-code", "fa fa-code", "fa fa-laptop", "fa fa-laptop", "fa fa-magic", "fa fa-magic", "fa fa-tree", "fa fa-tree", "fa fa-coffee", "fa fa-coffee"];

  // Star Rating
  const starsContainer = document.querySelector("#starRating");

  // Game Timer
  const timerContainer = document.querySelector("#gameTimer");

  // Making game dynamic
  const cardsContainer = document.querySelector(".deck");

  let fullDeck = document.querySelectorAll('.card');
  let playbutton = document.querySelector("#play-again");
  let closeButton = document.querySelector("#close-modal");
  let myModal = document.querySelector("#my-modal");
  let showButton = document.querySelector("#show-modal");
  let flippedCards = [];
  let matchedCards = [];
  let unmatchedCards = [];
  let moves = 0;
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let interval = null;
  let hasUnmatchedCards = false;

  // Start game, shuffle cards
  function init() {
    matchedCards = [];
    flippedCards = [];
    moves = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;

    // Reset the timer to 0
    drawTimer("00", "00", "00");

    cardsContainer.innerHTML = "";
    movesContainer.innerHTML = moves;
    starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;

    myModal.classList.remove("modal-shown");
    myModal.classList.add("modal-closed");

    shuffle(icons);

    for (let i = 0; i < icons.length; i = i + 4) {
      // Make a card row
      let cardRow = document.createElement("div");
      cardRow.classList.add("card-row");

      // Make cards and add to card row
      cardRow.append(makeCard(icons[i]));
      cardRow.append(makeCard(icons[i + 1]));
      cardRow.append(makeCard(icons[i + 2]));
      cardRow.append(makeCard(icons[i + 3]));

      // Add card row to the deck container
      cardsContainer.append(cardRow);
    }

    function makeCard(icon) {
      // Create card element
      const card = document.createElement("div");

      // Add card CSS class and inner HTML markup with icon class
      card.classList.add("card");
      card.innerHTML = `<i class="${icon}"></i>`;

      // Click event, each card
      click(card);

      return card;
    }

    // Click event
    function click(card) {
      //Card click event
      card.addEventListener("click", function() {
        // Don't do anything if the game has unmatched cards currently
        if (hasUnmatchedCards) {
          return;
        }

        const currentCard = this;
        const previousCard = flippedCards[0];

        // Ensure timer is started
        startTimer();

        // Existing flipped card
        if (flippedCards.length === 1) {
          card.classList.add("open", "show", "disable");
          flippedCards.push(this);

          compareCards(currentCard, previousCard);
        } else {
          currentCard.classList.add("open", "show", "disable");
          flippedCards.push(this);
        }
      });
    }
  }

  // Comparing the 2 flipped cards.
  function compareCards(currentCard, previousCard) {
    if (currentCard.innerHTML === previousCard.innerHTML) {
      // Cards match
      currentCard.classList.add("match");
      previousCard.classList.add("match");

      matchedCards.push(currentCard, previousCard);

      flippedCards = [];

      gameOver();
    } else {
      // Tell game we have an "unmatch"
      hasUnmatchedCards = true;

      // Card don't match - add shake animation
      setTimeout(function() {
        currentCard.classList.add("unmatched");
        previousCard.classList.add("unmatched");
      }, 250);

      // Set wait time
      setTimeout(function() {
        currentCard.classList.remove("open", "show", "disable", "unmatched");
        previousCard.classList.remove("open", "show", "disable", "unmatched");
        flippedCards = [];
        unmatchedCards = [];
        hasUnmatchedCards = false;
      }, 1250);
    }

    countMoves();
  }

  // Counting Move Matches
  const movesContainer = document.querySelector(".moves");
  movesContainer.innerHTML = 0;

  function countMoves() {
    moves++;
    movesContainer.innerHTML = moves;

    // Ensure the rating is updated
    rating();
  }

  // Game Over, Winner
  function gameOver() {
    if (matchedCards.length === icons.length) {
      // Ensure timer is stopped
      stopTimer();
      // Setting Final Rating
      finalRating();
      // Setting Final Time
      finalTime();

      setTimeout(function() {
        myModal.classList.remove("modal-closed");
        myModal.classList.add("modal-shown");
      }, 300);
    }
  }

  playbutton.addEventListener("click", function(){
    stopTimer();
    init();
    myModal.classList.remove("modal-shown");
    myModal.classList.add("modal-closed");
  });

  closeButton.addEventListener("click", function(){
    myModal.classList.remove("modal-shown");
    myModal.classList.add("modal-closed");
  });

  function rating() {
    // Star rating between 10 - 20 moves is 2 stars
    if (moves > 10 && moves < 20) {
      starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li>`;

      // Star rating between 21 - 35 moves is 1 star
    } else if (moves > 21 && moves < 35) {
      starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>`;

      // Star rating higher than 36 moves is 0 stars
    } else if (moves >= 36) {
      starsContainer.innerHTML = `<li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li><li><i class="fa fa-star-o"></i></li>`;
    }
  }

  function finalRating() {
    document.getElementById("finalRating").innerHTML = starsContainer.innerHTML;
  }

  // Restart Game
  const restartButton = document.querySelector(".restart");
  restartButton.addEventListener("click", function() {
    stopTimer();
    init();
  });

  // Start First Game
  init();

  // Shuffle function from http://stackoverflow.com/a/2450976

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // Stopwatch function and logic to detrmine increments and next values
  function updateTimer()  {
    let displaySeconds = 0;
    let displayMinutes = 0;
    let displayHours = 0;

    seconds ++;

    if(seconds / 60 === 1){
      seconds = 0;
      minutes ++;

      if(minutes / 60 === 1){
        mintues = 0;
        hours ++;
      }
    }

    // Logic when seconds/minutes/hours are only one digit add 0 leading on the value
    if(seconds < 10){
      displaySeconds = "0" + seconds.toString();
    }else{
      displaySeconds = seconds;
    }

    if(minutes < 10){
      displayMinutes = "0" + minutes.toString();
    }else{
      displayMinutes = minutes;
    }

    if(hours < 10){
      displayHours = "0" + hours.toString();
    }else{
      displayHours = hours;
    }

    drawTimer(displayHours, displayMinutes, displaySeconds);
  }

  function drawTimer(displayHours, displayMinutes, displaySeconds) {
    timerContainer.innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
  }

  function finalTime()  {
    document.getElementById("finalTime").innerHTML = timerContainer.innerHTML;
}

// Starting/Stopping the timer
  function startTimer() {
    if (!interval) {
      interval = window.setInterval(updateTimer, 1000);
    }
  }

  function stopTimer() {
    if (interval) {
      window.clearInterval(interval);
      interval = null;
    }
  }
