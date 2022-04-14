// session id
var ulid = "";

// start screen
document.querySelectorAll('.modal-button').forEach(function(el) {
  el.addEventListener('click', function() {
    var target = document.querySelector(el.getAttribute('data-target'));

    target.classList.add('is-active');
    target.querySelector('.modal-trigger-close').addEventListener('click', function() {
      target.classList.remove('is-active');
    });
  });
});

function setScoreboard() {
  // get results from /scoreboard?ulid=${ulid}
  fetch(`/score?ulid=${ulid}`).then(
    response => response.json()
  ).then(data => {

    $("#scoreTotal").text(data.total);
    $("#scoreFinal").text(data.total);
    $("#scoreBeef").text(data.beef);
    $("#scoreChicken").text(data.chicken);
    $("#scoreFish").text(data.fish);
    $("#scoreVeggie").text(data.veg);
  })
}

function gameEnd() {
  console.log('Game over');

  // get results from /scoreboard?ulid=${ulid}
  setScoreboard();

  $("#gameOver").click();

  $("#gameOver").on('click', function(e) {
    e.preventDefault();
    isPaused = true;
  });
};

// starting the game
function setup() {
  // e.preventDefault();
  // isPaused = false;

  // get the data
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  fetch('/session').then(
    response => response.json()
  ).then(data => {
    console.log(data);
    displayMorsels(data);
    setScoreboard();
  })

  // game timer
  var timeLeft = 30;
  var isPaused = false;
  var textLeft = document.getElementById('gameTime');
  var progressLeft = document.getElementById("progressBar");
  var timerId = setInterval(gameCountdown, 1000);
  function gameCountdown() {
    if (timeLeft == -1 || isPaused == true) {
      // if (timeLeft == -1) {
      clearTimeout(timerId);
      gameEnd();
    } else {
      textLeft.innerHTML = timeLeft;
      progressLeft.setAttribute("value", timeLeft);
      timeLeft--;
      setScoreboard();
    }
  }

  gameCountdown();
  console.log('Game has started!');
};

// render the data
// https://w3collective.com/fetch-display-api-data-javascript/
function displayMorsels(data) {
  ulid = data.id

  data.menu.forEach(function(morsel) {
    const morselName = morsel.demand;
    const morselTime = morsel.offset;

    setTimeout(function() {
      console.log(morselName + " demand! for " + morselTime + " milliseconds.");

      $("#currentDemand").text(morselName);
      heading.innerHTML = morselName;
      whiskerStage.appendChild(heading);
      $("whiskerStage").removeClass();
      $("whiskerStage").addClass("demand-${morselName}");

      // remove correct class from all buttons
      $("nav > .button.correct").removeClass('correct');

      // set class to correct on button
      $(`nav > .button.${morselName}`).addClass('correct');

    }, morselTime);
  });
}

// food is chosen
$("nav > .button").on('click', function(i, e) {
  food = $(this).attr('id');

  if ($(this).hasClass('correct')) {
    fetch(`/tally?ulid=${ulid}&food=${food}&correct=true`).then(
      response => console.log(response)
    );
  } else {
    fetch(`/tally?ulid=${ulid}&food=${food}&correct=false`).then(
      response => console.log(response)
    );
  }
});

$(document).ready(function() {

  // open start screen on load
  $("#gameInit").click();

  $("#gameStart").on('click', function() {
    setup()
  });

  $("#gameRestart").on('click', function() {
    setup()
  });

  // blinking
  setInterval(function() {
    console.log('> blink <');
    $("#hiSlats > .slats-head").addClass("slats-blink");
    $("#hiSlats > .slats-head").removeClass("slats-resting");

    setTimeout(function() {
      $("#hiSlats > .slats-head").addClass("slats-resting");
      $("#hiSlats > .slats-head").removeClass("slats-blink");
    }, 500);
  }, 3000);
});
