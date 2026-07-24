# model.py
import requests
from config import LLAMA_SERVER_URL, MAX_TOKENS, SYSTEM_PROMPT

def get_response(user_message, conversation_history = None):
    
    if conversation_history == None:
        conversation_history = []
    
    # Build messages list with system prompt, history and new message
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add conversation history so model remembers context
    for entry in conversation_history:
        messages.append({"role": "user", "content": entry["user"]})
        messages.append({"role": "assistant", "content": entry["assistant"]})
    
    # Add the new user message
    messages.append({"role": "user", "content": user_message})
    
    # Send request to llama.cpp server
    response = requests.post(
        f"{LLAMA_SERVER_URL}/v1/chat/completions",
        json = {
            "messages": messages,
            "max_tokens": MAX_TOKENS,
            "temperature": 0.0,
            "stream": False
        }
    )
    
    # Extract and return the text response
    return response.json()["choices"][0]["message"]["content"]