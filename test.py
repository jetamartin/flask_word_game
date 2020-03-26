from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def setUp(self): 
        # self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage_created(self):
        """ Test session variables and HTML displayed """
        with app.test_client() as client: 
            res = client.get('/')
            html = res.get_data(as_text=True)
            self.assertIn('game_board', session)


            self.assertIsNone(session.get('high_score'))
            self.assertIsNone(session.get('play_count'))

            # Make sure key elements of root/home page are present in html
            self.assertEqual(res.status_code, 200)
            self.assertIn('Game Stats:', html )
            self.assertIn('Timer', html )
            self.assertIn('Enter Word', html )

    def test_word_search(self):
        """ Test that words are found (status = 'ok') """
        # import pdb; pdb.set_trace()                  

        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['game_board'] = [  ["G", "O", "D", "C", "T"],      
                                        ["O", "O", "A", "O", "A"],
                                        ["D", "T", "A", "C", "A"],
                                        ["G", "D", "D", "T", "A"],
                                        ["G", "O", "D", "C", "A"], 
                                    ]
            res = client.get('/word_check?word=cat') 
            # import pdb; pdb.set_trace()                  
            self.assertEqual(res.json['result'], 'ok')
            res = client.get('/word_check?word=dog')
            self.assertEqual(res.json['result'], 'ok')
            res = client.get('/word_check?word=goat')
            self.assertEqual(res.json['result'], 'ok')
            res = client.get('/word_check?word=rat')                   
            self.assertEqual(res.json['result'], 'not-on-board')
            res = client.get('/word_check?word=xyz')                   
            self.assertEqual(res.json['result'], 'not-word')

    def test_post_score(self):
        """ That True is returned if final score represents a new high score"""
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['high_score'] = 10
                sess['play_count'] = 5
        res = client.post('/post_score', data={'score' : '11'})
        import pdb; pdb.set_trace()                  

     

