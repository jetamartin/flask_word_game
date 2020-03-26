# Setup config
from flask import Flask, request, render_template, redirect, flash, session, jsonify
# from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mySecretKeyWord'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
# debug = DebugToolbarExtension(app)
####################################################
from boggle import Boggle
boggle_game = Boggle()


@app.route('/')
def root():
  """ Display the Game Board """
  game_board = boggle_game.make_board()
  session['game_board'] = game_board
  high_score = session.get("high_score", 0)
  play_count = session.get("play_count", 0)
  # import pdb; pdb.set_trace()
  return render_template('game_board.html', game_board = game_board, 
  high_score = high_score, play_count = play_count)

@app.route('/word_check')
def word_submit():
  """ Check if word submitted is valid word and on game board """
 
  game_board = session['game_board']
  word_value = request.args['word']
  word_check = boggle_game.check_valid_word(game_board, word_value)
  # import pdb; pdb.set_trace()
  check_results = {'result' : word_check}
  return jsonify(check_results)

@app.route('/post_score', methods = ['POST'])
def record_score():
  """ Once game is over register score and notify client if new high score """
  score = request.json["score"]
  high_score = session.get("high_score", 0)
  play_count = session.get("play_count", 0)

  session['play_count'] = play_count + 1
  session['high_score'] = max(score, high_score)

  return jsonify(newHighScore = score > high_score)