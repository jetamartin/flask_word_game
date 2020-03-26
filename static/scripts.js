class BoggleGame {
  constructor (gameDuration = 60) {
    this.gameDuration = gameDuration;

    this.score = 0;
    this.wordAlreadyMatched = new Set(); 
    this.display =  $('#timer');

    this.scoreCount = $('#score-count');
    $("#word-form").on("submit", this.handleSubmit.bind(this));

    this.times = this.gameDuration, this.minutes, this.seconds;
   
    this.timer = setInterval(this.timIt.bind(this, this.gameDuration), 1000);
             
  }

  async postScore( ) {
    let response = await axios.post("http://127.0.0.1:5000/post_score", 
    { "score": this.score } );

    if (response.data.newHighScore) {
      this.showMessage(`Congrats!!! New record: ${this.score}`, "text-info");
    } else {
      this.showMessage(`Final score: ${this.score}`, "text-info");
    }
  }

  showMessage(msg, msgType) {
    $('.results-msg')
      .text(msg)
      .removeClass()
      .addClass(`results-msg ${msgType}`);
  }

  duplicateWord(word) {

  }

  showMatchedWord(word) {
    $("ul").append(`<li>${word}</li>`);
  }
  

  async handleSubmit(evt) { 
    let msg, msgType;
    let wordInput = $("#word-input")
    evt.preventDefault();
    let word = wordInput.val().toLowerCase();

    if (!word) return;

    if (this.wordAlreadyMatched.has(word)) {
      this.showMessage(`Sorry You alread matched ${word}. Try another word.`, "text-danger");
      return;
    }
    
    let results = await axios.get("http://127.0.0.1:5000/word_check", 
    { params: 
      { word: word } 
    } )
    let result_code = results.data.result;
    
    if (result_code == 'ok') {
      msgType = "text-info";
      msg = `Congrats! The score for '${word}' was added to your game score.`;
      this.score+= word.length;
      this.scoreCount.text(this.score);
      this.showMessage(msg, msgType);
      this.wordAlreadyMatched.add(word);
      this.showMatchedWord(word);

    } else if (result_code == 'not-on-board') {
      const msg = `Sorry, '${word}' is not on the game board. Try again.`;
      const msgType = "text-danger";
      this.showMessage(msg, msgType);

    } else {
      const msg = `Sorry, '${word}' is not a word. Try again`;
      const msgType = "text-danger";
      this.showMessage(msg, msgType);
    }
    wordInput.val('').focus();
  }


  async timIt (duration) {
    this.minutes = parseInt(this.times / 60, 10);
    this.seconds = parseInt(this.times % 60, 10);

    this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

    this.display.text(this.minutes + ":" + this.seconds);
      if (--this.times < 0) {
        $('#timer-expired').toggle();
        $('#timer').toggle();
        $("#word-form :input").prop("disabled", true);
        clearInterval(this.timer);
        await this.postScore();
        return;
    }
    
  }
}

