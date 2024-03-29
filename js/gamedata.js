(() => {
  "use strict";

  let firstclick = {},
    secondclick = {},
    difficulty = "medium",
    numStars = 3,
    pairs = 6,
    gameStarted,
    matches,
    moves,
    time,
    twoStar,
    oneStar;

  class Card {
    constructor(card, num) {
      let cardID = card.id + "-" + num;
      this.id = "#" + card.id + "-" + num;
      this.image = card.image;
      this.name = card.name;
      this.html = `<div class="card" id="${cardID}">
        <div class="card-back">
          <img src="images/${this.image}" class="card-images" >
        </div>
        <div class="card-front">
          <img src="images/card_back.png" class="card-images" >
        </div>
      </div>`;
    }
  }

  const setdifficulty = difficulty => {
    $("#startModal").hide();
    pairs = gamemode[difficulty].pairs;
    twoStar = gamemode[difficulty].twoStar;
    oneStar = gamemode[difficulty].oneStar;
    $("#game-board").removeClass("easy medium hard");
    $("#game-board").addClass(gamemode[difficulty].class);
  };

  // set size of card table based on difficulty
  const trimArray = array => {
    let newArray = array.slice();
    // trim array as needed
    while (newArray.length > pairs) {
      let randomIndex = Math.floor(Math.random() * newArray.length);
      newArray.splice(randomIndex, 1);
    }
    return newArray;
  };

  const makeCardArray = (data, difficulty) => {
    let array = [];

    // Get the correct sized array for difficulty
    let trimmedData = trimArray(data, difficulty);

    // Add two of each card to the array
    trimmedData.forEach(function(card) {
      array.push(new Card(card, 1));
      array.push(new Card(card, 2));
    });

    return array;
  };

  const shuffle = array => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      // Choose an element randomly
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Switching current component and random component
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const displayCards = cardArray => {
    cardArray.forEach(function(card) {
      // Add cards to game board
      $("#game-board").append(card.html);

      // Add click listeners
      $(card.id).click(function() {
        // Start time on first click
        if (!gameStarted) {
          // start time!
          gameTimer();
          gameStarted = true;
        }

        // Check for match when clicked
        checkMatch(card);
      });
    });
  };

  const checkMatch = card => {
    if (!firstclick.name) {
      firstclick = card;
      $(card.id).addClass("flipped");
      return;

      // For second card, check if its a match
    } else if (!secondclick.name && firstclick.id !== card.id) {
      secondclick = card;
      $(card.id).addClass("flipped");

      // Update move counter
      moves++;
      $("#moves").text(moves);

      checkStars();
    } else return;

    if (firstclick.name === secondclick.name) {
      foundMatch();
    } else {
      hideCards();
    }
  };

  const foundMatch = () => {
    matches++;
    if (matches === pairs) {
      gameOver();
    }

    // Unbind click functions and reset click objects
    $(firstclick.id).unbind("click");
    $(secondclick.id).unbind("click");
    // reset clicked objects
    firstclick = {};
    secondclick = {};
  };

  const hideCards = () => {
    //hide cards
    setTimeout(function() {
      $(firstclick.id).removeClass("flipped");
      $(secondclick.id).removeClass("flipped");
      // reset clicked objects
      firstclick = {};
      secondclick = {};
    }, 600);
  };

  const gameOver = () => {
    clearInterval(time);

    // Pause before win modal
    setTimeout(function() {
      $("#winModal").show();
    }, 500);
  };

  const checkStars = () => {
    let currentStars;
    if (moves >= oneStar) {
      currentStars = 1;
    } else if (moves >= twoStar) {
      currentStars = 2;
    } else currentStars = 3;
    if (numStars !== currentStars) {
      displayStars(currentStars);
    }
  };

  const gameTimer = () => {
    let startTime = new Date().getTime();

    // Updating the time every second
    time = setInterval(function() {
      var now = new Date().getTime();

      // time between now and start
      var elapsed = now - startTime;

      //  minutes and seconds Calculator
      let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      // Add starting 0 if seconds < 15
      if (seconds < 15) {
        seconds = "0" + seconds;
      }

      let currentTime = minutes + ":" + seconds;

      // Update clock on game screen
      $(".clock").text(currentTime);
    }, 750);
  };

  // Add stars to game screen
  const displayStars = num => {
    const starImage = '<img src="images/star.png">';
    $(".stars").empty();
    for (let i = 0; i < num; i++) {
      $(".stars").append(starImage);
    }
  };

  // Open start modal on startup
  $(window).on("load", function() {
    $("#startModal").show();
  });

  $("#openModal").click(function() {
    $("#winModal").show();
  });

  // Close modals when click outside modal
  $("#winModal #close-win, #overlay").click(function() {
    $("#winModal").hide();
  });

  $("#startModal #close-start, #overlay").click(function() {
    $("#startModal").hide();
  });

  $(".modal").click(function() {
    $(".modal").hide();
  });

  $(".modal-content").click(function(event) {
    event.stopPropagation();
  });

  // difficulty modals
  $("#easy-difficulty").click(function() {
    gameStart(cardData, "easy");
  });

  $("#medium-difficulty").click(function() {
    gameStart(cardData, "medium");
  });

  $("#hard-difficulty").click(function() {
    gameStart(cardData, "hard");
  });

  // plays a new game
  $("#restart-win").click(function() {
    $("#winModal").hide();
    $("#startModal").show();
  });

  const gameStart = (card, difficulty) => {
    // reset game variables
    gameStarted = false;
    moves = 0;
    matches = 0;
    setdifficulty(difficulty);

    // reset HTML
    $("#game-board").empty();
    $(".clock").text("0:00");
    $("#moves").text("0");
    $("#winModal").hide();

    // Get cards and start the game!
    let cardArray = makeCardArray(cardData, difficulty);

    shuffle(cardArray);
    displayCards(cardArray);
    displayStars(3);
  };
})();
