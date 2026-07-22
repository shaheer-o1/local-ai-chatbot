# test_model.py
from model import get_response

print("Testing model connection...")
q = input("question?\n")
response = get_response(q)
print(f"Response: {response}")