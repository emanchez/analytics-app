from flask import Flask, json, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


@app.route("/api/hello", methods=["GET"])
def hello_world():
    response = app.response_class(
        response=json.dumps("Hello, world!"), status=200, mimetype="application/json"
    )
    return response


@app.route("/api/post-event", methods=["POST"])
def retreive():
    print(request.get_json())
    return jsonify(isError=False, message="success", statusCode=200), 200


@app.route("/api/get-merch", methods=["GET"])
def getData():
    try:
        with open("./data/merch.json") as f:
            data = json.load(f)  # Parse JSON file into Python object
            return (
                jsonify(
                    isError=False, message="success", statusCode=200, responseData=data
                ),
                200,
            )  # Return as JSON response
    except Exception as e:
        return jsonify(isError=True, message="failed: " + str(e), statusCode=500), 500
