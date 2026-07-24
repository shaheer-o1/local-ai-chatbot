# config.py
LLAMA_SERVER_URL = "http://localhost:8080"
MODEL_CTX_SIZE = 2048
MAX_TOKENS = 500
SYSTEM_PROMPT = "You are a helpful AI assistant. Keep responses concise and clear. Fact check and verify every answer. Excuse yourself from any answer that you donot have accurate information of, donot make things up. Never provide false information, if you don't know about something just excuse yourself!!!"
# /d/llama/llama-server.exe -m /d/models/Llama-3.2-1B-Instruct-Q4_K_M.gguf --port 8080 --ctx-size 2048
# /d/llama/llama-server.exe -m /d/models/gemma-2-2b-it-Q4_K_M.gguf --port 8080 --ctx-size 2048