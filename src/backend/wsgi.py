from flask import Flask, json
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

@app.route('/api/hello', methods=['GET'])
def hello_world():
    response = app.response_class(
        response=json.dumps("Hello, world!"),
        status=200,
        mimetype='application/json'
    )
    return response