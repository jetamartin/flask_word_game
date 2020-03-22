$(function() {
  
  let scoreCount = $('#score-count');

  score = 0;

  $("#word-form").on("submit", handleSubmit.bind(this));
  
  // function incrementScore(word) {
  //   console.log('increaseScore function');
  //   score+= word.length;
  //   console.log('Score = ', score);
  // }

  async function postScore ( score ) {
    let response = await axios.post("http://127.0.0.1:5000/post_score", 
    { "score": score } );
    // console.log(`High Score = ${high_score}, Score = ${score}`)
    console.log(response.data.newHighScore);
    // if (response.data.newHighScore) {
    //   score = high_score
    // }
    //   this.showMessage(`New record: ${this.score}`, "ok");
    // } else {
    //   this.showMessage(`Final score: ${this.score}`, "ok");
    // }
    // console.log(highscore);
  }

  async function handleSubmit(evt) { 
    let wordInput = $("#word-input")
    console.log("handleSubmit function")
    evt.preventDefault();
    let word = wordInput.val();
    wordInput.val('');
    
    results = await axios.get("http://127.0.0.1:5000/word_check", 
    { params: 
      { word: word } 
    } )
    console.log(results); 
    result_code = results.data.result;
    
    if (result_code == 'ok') {
      result_msg = $('#results-msg').text(result_code)
      score+= word.length;
      scoreCount.text(score);
      
    }
    else if (result_code == 'not-on-board') {
      $('#results-msg').text(`Sorry '${word}' is not on the game board`)
    }
    else {
      result_msg = $('#results-msg').text(result_code)
    }
  }

    function startTimer(duration, display) {
      var timer = duration, minutes, seconds;
      let x = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);
  
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
  
          display.text(minutes + ":" + seconds);
  
          if (--timer < 0) {
              $('#timer-expired').toggle();
              $('#timer').toggle();
              $("#word-form :input").prop("disabled", true);
              clearInterval(x);
              console.log("score count", score);
              postScore(score);
              return;
          }
      }, 1000);
  }
  

let sixtySeconds = 60,
    display = $('#timer');
startTimer(sixtySeconds, display);
   

})
