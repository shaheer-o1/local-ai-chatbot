import os
import sqlite3

from flask import flash, Flask, jsonify, redirect, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import login_required
from model import get_response

app = Flask(__name__)
app.secret_key = os.urandom(24)

#default route
@app.route("/")
def index():
    if "history" not in session:
        session["history"] = []
    return render_template("index.html", history = session["history"])

#chat route
@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("input")
    if not user_text:
        return jsonify({"error" : "Bad Request", "message" : "Chat box must not be empty!"}), 400
    if "history" not in session:
        session["history"] = []

    bot_answer = get_response(user_text, session["history"])
    session["history"].append({"user" : user_text, "assistant" : bot_answer})
    session.modified = True

    return jsonify({"response" : bot_answer})

#clearing chat
@app.route("/clear")
def clear():
    session["history"] = []
    return jsonify({"status" : "cleared"})

if __name__ == "__main__":
    app.run(debug=True)