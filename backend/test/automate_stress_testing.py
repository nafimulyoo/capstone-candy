import requests
import json
import random
import time
import uuid
from concurrent.futures import ThreadPoolExecutor

# Endpoint URL
url = "https://candy-be-51750986811.asia-southeast2.run.app/chats/ask"  # Replace with the actual endpoint URL

# Function to generate a random name
def generate_random_name():
    names = ["Alice", "Bob", "Charlie", "David", "Eve", "Rudi", "Budi", "Susi", "Joko", "Tri"]
    return random.choice(names)

# Function to generate a random message about Astra Digital
def generate_random_message():
    messages = [
        "What is Astra Digital's main focus?",
        "Tell me about Astra Digital's products.",
        "How can Astra Digital help my business?",
        "What are the benefits of using Astra Digital?",
        "Can you give me an overview of Astra Digital?",
        "What digital solutions does Astra Digital offer?",
        "How does Astra Digital innovate?",
        "What are Astra Digital's future plans?",
        "How does Astra Digital support its clients?",
        "Tell me about Astra Digital's security measures."
    ]
    return random.choice(messages)

# Function to send a request and measure response time
def send_request(request_id):
    name = generate_random_name()
    message = generate_random_message()
    session_id = str(uuid.uuid4())
    payload = {
        "name": name,
        "message": message,
        "session_id": session_id
    }
    headers = {'Content-Type': 'application/json'}

    start_time = time.time()
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        end_time = time.time()
        response_time = end_time - start_time
        response_json = response.json()

        print(f"Request {request_id}:")
        print(f"  Message: {message}")
        print(f"  Response: {response_json}")
        print(f"  Response Time: {response_time:.4f} seconds")

        return response_time

    except requests.exceptions.RequestException as e:
        print(f"Request {request_id} failed: {e}")
        return None

# Main function to send concurrent requests
def main():
    num_requests = 20
    response_times = []

    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = [executor.submit(send_request, i + 1) for i in range(num_requests)]

        for future in futures:
            response_time = future.result()
            if response_time is not None:
                response_times.append(response_time)

    # Calculate average response time
    if response_times:
        average_response_time = sum(response_times) / len(response_times)
        print("\n--- Summary ---")
        print(f"Total Requests: {num_requests}")
        print(f"Successful Requests: {len(response_times)}")
        print(f"Average Response Time: {average_response_time:.4f} seconds")
    else:
        print("\n--- Summary ---")
        print("No successful requests.")

if __name__ == "__main__":
    main()
