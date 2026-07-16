# test_model.py
from model import get_response

print("Testing model connection...")
response = get_response("Say hello in one sentence.")
print(f"Response: {response}")