# Setup config
from flask import Flask, request, render_template, redirect, flash, session
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
  if (session['game_board']):
    game_board = session['game_board']
  else:
   game_board = boggle_game.make_board()
  return render_template('game_board.html', game_board = game_board)

@app.route('/word_guess')
def word_submit():
  return render_template('')
