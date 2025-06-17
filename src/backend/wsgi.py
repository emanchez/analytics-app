from flask import Flask, json, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
import uuid
from collections import defaultdict

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


def validate_and_normalize_event(data):
    """Validate and normalize incoming event data"""

    # Required fields for all events
    required_fields = ["sessionId", "eventType", "timestamp"]

    # Check required fields
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

    # Normalize the event data
    normalized_event = {
        "sessionId": data["sessionId"],
        "eventType": data["eventType"],
        "timestamp": data["timestamp"],
        "received_at": datetime.now().isoformat(),
        "eventId": str(uuid.uuid4()),
        "elementId": data.get("elementId"),
        "elementTag": data.get("elementTag"),
        "url": data.get("url"),
        "userAgent": data.get("userAgent"),
    }

    # Add event-specific fields based on event type
    if data["eventType"] == "click":
        normalized_event.update(
            {
                "action": data.get("action"),
                "productId": data.get("productId"),
                "productName": data.get("productName"),
                "productPrice": data.get("productPrice"),
                "clickX": data.get("clickX"),
                "clickY": data.get("clickY"),
            }
        )

    elif data["eventType"] == "conversion":
        # Validate required conversion fields
        if "total" not in data:
            raise ValueError("Conversion events require 'total' field")

        normalized_event.update(
            {
                "action": data.get("action", "checkout_completed"),
                "total": data["total"],
                "itemCount": data.get("itemCount", 0),
                "promoCodeUsed": data.get("promoCodeUsed"),
                "itemsDetail": data.get("itemsDetail", []),
                "paymentMethod": data.get("paymentMethod"),
                "shippingMethod": data.get("shippingMethod"),
            }
        )

    elif data["eventType"] == "page_view":
        normalized_event.update(
            {
                "path": data.get("path"),
                "referrer": data.get("referrer"),
                "title": data.get("title"),
                "loadTime": data.get("loadTime"),
                "viewport": data.get("viewport"),
            }
        )

    elif data["eventType"] == "form_submit":
        normalized_event.update(
            {
                "formId": data.get("formId"),
                "formName": data.get("formName"),
                "action": data.get("action"),
                "fieldCount": data.get("fieldCount"),
                "isValid": data.get("isValid", True),
                "errors": data.get("errors", []),
            }
        )

    elif data["eventType"] == "navigation":
        normalized_event.update(
            {
                "action": data.get("action"),  # "navigate", "back", "forward"
                "fromPath": data.get("fromPath"),
                "toPath": data.get("toPath"),
                "navigationType": data.get(
                    "navigationType"
                ),  # "click", "direct", "reload"
            }
        )

    # Remove None values to keep data clean
    return {k: v for k, v in normalized_event.items() if v is not None}


def store_session_metadata(session_id, event_data):
    """Store or update session metadata"""
    session_dir = f"./data/sessions/{session_id}"
    metadata_file = f"{session_dir}/metadata.json"

    os.makedirs(session_dir, exist_ok=True)

    # Load existing metadata or create new
    if os.path.exists(metadata_file):
        with open(metadata_file, "r") as f:
            metadata = json.load(f)
    else:
        metadata = {
            "sessionId": session_id,
            "startTime": event_data["timestamp"],
            "eventCount": 0,
            "userAgent": event_data.get("userAgent"),
            "firstUrl": event_data.get("url"),
        }

    # Update metadata
    metadata["lastActivity"] = event_data["received_at"]
    metadata["eventCount"] += 1
    metadata["lastUrl"] = event_data.get("url")

    # Write updated metadata
    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)


def store_product_analytics(event_data):
    """Store product-specific analytics"""
    if not (event_data.get("productId") and event_data.get("productName")):
        return

    product_id = event_data["productId"]
    products_dir = "./data/products"
    product_file = f"{products_dir}/{product_id}.json"

    os.makedirs(products_dir, exist_ok=True)

    # Load existing product data or create new
    if os.path.exists(product_file):
        with open(product_file, "r") as f:
            product_data = json.load(f)
    else:
        product_data = {
            "id": product_id,
            "name": event_data["productName"],
            "price": event_data.get("productPrice"),
            "analytics": {
                "views": 0,
                "clicks": 0,
                "addToCarts": 0,
                "purchases": 0,
                "firstSeen": event_data["received_at"],
            },
        }

    # Update analytics based on event type and action
    if event_data["eventType"] == "click":
        action = event_data.get("action", "")
        if "view" in action:
            product_data["analytics"]["views"] += 1
        elif "add_to_cart" in action:
            product_data["analytics"]["addToCarts"] += 1
        else:
            product_data["analytics"]["clicks"] += 1

    elif event_data["eventType"] == "conversion":
        # Count purchases from conversion events
        items = event_data.get("itemsDetail", [])
        for item in items:
            if item.get("id") == product_id:
                product_data["analytics"]["purchases"] += item.get("quantity", 1)

    product_data["analytics"]["lastSeen"] = event_data["received_at"]

    # Write updated product data
    with open(product_file, "w") as f:
        json.dump(product_data, f, indent=2)


@app.route("/api/post-event", methods=["POST"])
def store_event():
    try:
        raw_data = request.get_json()
        print(
            f"Received event: {raw_data.get('eventType')} - {raw_data.get('action', 'no action')}"
        )

        # Validate and normalize the event
        event_data = validate_and_normalize_event(raw_data)

        session_id = event_data["sessionId"]
        event_id = event_data["eventId"]

        # Create directory structure
        os.makedirs(f"./data/sessions/{session_id}/events", exist_ok=True)

        # Store normalized event
        with open(f"./data/sessions/{session_id}/events/{event_id}.json", "w") as f:
            json.dump(event_data, f, indent=2)

        # Update session metadata
        store_session_metadata(session_id, event_data)

        # Store product analytics
        store_product_analytics(event_data)

        # Handle specific event types for additional storage
        if event_data["eventType"] == "conversion":
            os.makedirs("./data/conversions", exist_ok=True)
            conversion_id = str(uuid.uuid4())
            with open(f"./data/conversions/{conversion_id}.json", "w") as f:
                json.dump(event_data, f, indent=2)

        elif event_data["eventType"] == "page_view":
            os.makedirs("./data/page_views", exist_ok=True)
            page_view_id = str(uuid.uuid4())
            with open(f"./data/page_views/{page_view_id}.json", "w") as f:
                json.dump(event_data, f, indent=2)

        return (
            jsonify(isError=False, message="Event stored successfully", statusCode=200),
            200,
        )

    except ValueError as e:
        print(f"Validation error: {e}")
        return (
            jsonify(
                isError=True, message=f"Validation error: {str(e)}", statusCode=400
            ),
            400,
        )
    except Exception as e:
        print(f"Storage error: {e}")
        return (
            jsonify(
                isError=True, message=f"Failed to store event: {str(e)}", statusCode=500
            ),
            500,
        )


# Analytics endpoints
@app.route("/api/analytics/conversions", methods=["GET"])
def get_conversions():
    try:
        conversions = []
        conversions_dir = "./data/conversions"

        if os.path.exists(conversions_dir):
            for filename in os.listdir(conversions_dir):
                if filename.endswith(".json"):
                    with open(os.path.join(conversions_dir, filename), "r") as f:
                        conversions.append(json.load(f))

        return jsonify(isError=False, data=conversions, statusCode=200), 200
    except Exception as e:
        return jsonify(isError=True, message=str(e), statusCode=500), 500


@app.route("/api/analytics/sessions", methods=["GET"])
def get_sessions():
    try:
        sessions = []
        sessions_dir = "./data/sessions"

        if os.path.exists(sessions_dir):
            for session_folder in os.listdir(sessions_dir):
                metadata_file = f"{sessions_dir}/{session_folder}/metadata.json"
                if os.path.exists(metadata_file):
                    with open(metadata_file, "r") as f:
                        sessions.append(json.load(f))

        return jsonify(isError=False, data=sessions, statusCode=200), 200
    except Exception as e:
        return jsonify(isError=True, message=str(e), statusCode=500), 500


@app.route("/api/analytics/products", methods=["GET"])
def get_product_analytics():
    try:
        products = []
        products_dir = "./data/products"

        if os.path.exists(products_dir):
            for filename in os.listdir(products_dir):
                if filename.endswith(".json"):
                    with open(os.path.join(products_dir, filename), "r") as f:
                        products.append(json.load(f))

        return jsonify(isError=False, data=products, statusCode=200), 200
    except Exception as e:
        return jsonify(isError=True, message=str(e), statusCode=500), 500


@app.route("/api/analytics/dashboard", methods=["GET"])
def get_dashboard_data():
    try:
        # Get summary analytics
        dashboard_data = {
            "totalSessions": 0,
            "totalEvents": 0,
            "totalConversions": 0,
            "totalRevenue": 0,
            "topProducts": [],
            "recentActivity": [],
        }

        # Count sessions
        sessions_dir = "./data/sessions"
        if os.path.exists(sessions_dir):
            dashboard_data["totalSessions"] = len(
                [
                    d
                    for d in os.listdir(sessions_dir)
                    if os.path.isdir(os.path.join(sessions_dir, d))
                ]
            )

        # Count conversions and calculate revenue
        conversions_dir = "./data/conversions"
        if os.path.exists(conversions_dir):
            for filename in os.listdir(conversions_dir):
                if filename.endswith(".json"):
                    with open(os.path.join(conversions_dir, filename), "r") as f:
                        conversion = json.load(f)
                        dashboard_data["totalConversions"] += 1
                        dashboard_data["totalRevenue"] += conversion.get("total", 0)

        # Get top products
        products_dir = "./data/products"
        if os.path.exists(products_dir):
            products = []
            for filename in os.listdir(products_dir):
                if filename.endswith(".json"):
                    with open(os.path.join(products_dir, filename), "r") as f:
                        product = json.load(f)
                        products.append(product)

            # Sort by total interactions (views + clicks + addToCarts)
            products.sort(
                key=lambda p: p["analytics"]["views"]
                + p["analytics"]["clicks"]
                + p["analytics"]["addToCarts"],
                reverse=True,
            )
            dashboard_data["topProducts"] = products[:5]

        return jsonify(isError=False, data=dashboard_data, statusCode=200), 200
    except Exception as e:
        return jsonify(isError=True, message=str(e), statusCode=500), 500


@app.route("/api/hello", methods=["GET"])
def hello_world():
    response = app.response_class(
        response=json.dumps("Hello, world!"), status=200, mimetype="application/json"
    )
    return response


@app.route("/api/get-merch", methods=["GET"])
def getData():
    try:
        with open("./data/merch.json") as f:
            data = json.load(f)
            return (
                jsonify(
                    isError=False, message="success", statusCode=200, responseData=data
                ),
                200,
            )
    except Exception as e:
        return jsonify(isError=True, message="failed: " + str(e), statusCode=500), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
