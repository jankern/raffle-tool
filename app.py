
from flask import Flask
from flask import render_template

#app = Flask(__name__)
app = Flask(__name__, static_url_path='/static')

# @app.route('/raffle')
# @app.route('/bla')
# def home():
#     message = "The Flask Shop"
#     return render_template('index.html', message=message)

@app.route('/')
@app.route('/api/v1/raffle')
@app.route('/api/v1/participant')
@app.route('/api/v1/beneficiary')
def raffles():
    message = "The Flask Shop"
    return render_template('index.html', message=message)

#https://stackoverflow.com/questions/13678397/python-flask-default-route-possible#13678543
@app.route('/', defaults={'path': ''})
def frontend(path):
    return render_template('index.html', message='You want path: %s' % path)

@app.route('/<path:path>')
def catch_all(path): 
    return '404 Ihr Säcke'