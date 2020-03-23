class BoggleGame {
  constructor (gameDuration = 60) {
    this.gameDuration = gameDuration;

    this.score = 0;
    this.wordAlreadyMatched = new Set(); 

    this.scoreCount = $('#score-count');
    $("#word-form").on("submit", this.handleSubmit.bind(this));
       
  }

  async postScore( score ) {
    let response = await axios.post("http://127.0.0.1:5000/post_score", 
    { "score": score } );

    if (response.data.newHighScore) {
      this.showMessage(`New record: ${this.score}`, ".text-primary");
    } else {
      this.showMessage(`Final score: ${this.score}`, ".text-primary");
    }
  }

  showMessage(msg, msgType) {
    $('.results-msg')
      .text(msg)
      .removeClass()
      .addClass(`results-msg ${msgType}`);
  }

  showMatchedWord(word) {
    $("ul").append(`<li>${word}</li>`);
  }
  

  async handleSubmit(evt) { 
    let msg, msgType;
    let wordInput = $("#word-input")
    evt.preventDefault();
    let word = wordInput.val();
    
    let results = await axios.get("http://127.0.0.1:5000/word_check", 
    { params: 
      { word: word } 
    } )
    let result_code = results.data.result;
    
    if (result_code == 'ok') {
      msgType = ".text-success";
      msg = `Congrats! '${word}' matched`;
      this.score+= word.length;
      this.scoreCount.text(this.score);
      this.showMessage(msg, msgType);
      this.showMatchedWord(word);

    } else if (result_code == 'not-on-board') {
      const msg = `Sorry '${word}' is not on the game board. Try again`;
      const msgType = ".text-danger";
      this.showMessage(msg, msgType);
    } else {
      const msg = `Sorry '${word}' is not a word. Try again`;
      const msgType = ".text-danger";
      this.showMessage(msg, msgType);
    }
    wordInput.val('').focus();
  }

  async startTimer(duration, display) {
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
            this.postScore(this.score);
            return;
        }
    }, 1000);
  }
}
 
  // Start the timer
  // const display = $('#timer');
  // this.startTimer(60, display);
  // startTimer(gameDuration, display = $('#timer'))
