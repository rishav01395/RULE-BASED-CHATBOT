from flask import Flask, render_template, request, jsonify
from chatbot import RuleBasedChatbot


app = Flask(__name__)

chatbot = RuleBasedChatbot()


@app.route("/")
def home():
    """Render the chatbot interface."""
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    """Process user message and return chatbot response."""

    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({
                "success": False,
                "response": "Please enter a message."
            }), 400

        user_message = data["message"].strip()

        if not user_message:
            return jsonify({
                "success": False,
                "response": "Please type something."
            }), 400

        bot_response = chatbot.get_response(user_message)

        return jsonify({
            "success": True,
            "response": bot_response
        })

    except Exception as error:
        print(f"Error: {error}")

        return jsonify({
            "success": False,
            "response": "Something went wrong. Please try again."
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )