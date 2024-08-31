import os
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Load environment variables
load_dotenv()

# Retrieve the API key from the environment
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("API key is missing. Please set the GROQ_API_KEY environment variable.")
logging.debug(f"GROQ_API_KEY: {api_key}")

# Initialize the Groq client with the API key
client = Groq(api_key=api_key)

# Create a Flask app
app = Flask(__name__)

# Initialize CORS
CORS(app, resources={r"/": {"origins": "*"}})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_input = data.get('message')
        
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
        
        logging.debug(f"Received message: {user_input}")

        # Create chat completion
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": user_input,
                }
            ],
            model="llama3-8b-8192",
        )
        
        logging.debug(f"Groq API response: {response}")

        # Get the AI's response
        ai_response = response.choices[0].message.content
        logging.debug(f"Chat response: {ai_response}")

        return jsonify({"response": ai_response})

    except Exception as e:
        logging.error(f"Error: {e}", exc_info=True)
        return jsonify({"error": "Failed to get response from chatbot"}), 500

if __name__ == '__main__':
    app.run(debug=True)
