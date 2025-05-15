import requests
import json
import time
import uuid
import logging
from datetime import datetime

# Configure logging
log_file = f"performance4_automated.log"
logging.basicConfig(filename=log_file, level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Endpoint URL
url = "https://candy-be-51750986811.asia-southeast2.run.app/chats/ask"  # Replace with the actual endpoint URL

# Static data
name = "Callie"
session_id = str(uuid.uuid4())  # Generate a single session ID
logging.info(f"Using session ID: {session_id}")

# List of questions
questions = [
    "Hi saya mau tanya",
    "Sudah berapa lama astra digital beroperasi?",
    "How does Astra Digital support the customer journey?",
    "Apa saja tahapan dalam perjalanan pelanggan atau customer journey yang disupport?",
    "Seberapa cepat Astra Digital bisa mengimplementasikan solusi ke dalam bisnis?",
    "Berapa biaya untuk implementasi solusi data dari Astra Digital?",
    "What does the Data Strategy Planning & Partnership area cover?",
    "Apa fokus dari Data Governance & Enablement?",
    "Apa saja yang terlibat dalam fokus Data Management?",
    "What does Astra Digital offer under Data Analytics?",
    "What services does Astra Digital offer to boost business performance?",
    "Apakah astra digital pernah mengerjakan project data integration?",
    "Apakah astra digital pernah bekerja sama dengan industri otomotif?",
    "Project apa saja yang Astra Digital kerjakan bersama Astra Motor",
    "Apakah astra digital pernah bekerja sama dengan industri keuangan?",
    "apakah astra digital pernah bekerja di industri beauty?",
    "apakah bisa astra digital bekerja dengan industri beauty?",
    "apakah machine learning bisa diterapkan di industri beauty?",
    "bisakah astra digital menerapkan machine learning di industri beauty?",
    "Apakah astra digital bisa membantu memprediksi customer churn?",
    "Apakah astra digital bisa mengerjakan project reinforcement learning?",
    "Apakah astra digital bisa mengerjakan generative ai menggunakan azure?",
    "Apakah Astra Digital bisa bantu kami membangun data warehouse?",
    "Kalau saya pengen integrasi data dari beberapa sistem, bisa dibantu?",
    "Apa itu SPLASH?"
]

# Function to send a request
def send_request(question, request_id):
    payload = {
        "name": name,
        "message": question,
        "session_id": session_id
    }
    headers = {'Content-Type': 'application/json'}

    start_time = time.time()
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        response.raise_for_status()
        end_time = time.time()
        response_time = end_time - start_time
        response_json = response.json()

        log_message = f"Request {request_id}:\n" \
                      f"  Question: {question}\n" \
                      f"  Response: {response_json}\n" \
                      f"  Response Time: {response_time:.4f} seconds"
        logging.info(log_message)

        return response_time

    except requests.exceptions.RequestException as e:
        error_message = f"Request {request_id} failed: {e}"
        logging.error(error_message)
        return None


# Main function to send sequential requests
def main():
    response_times = []

    for i, question in enumerate(questions):
        response_time = send_request(question, i + 1)
        if response_time is not None:
            response_times.append(response_time)
        time.sleep(0.1)  # Optional: Add a small delay between requests

    # Calculate average response time
    if response_times:
        average_response_time = sum(response_times) / len(response_times)
        summary_message = "\n--- Summary ---\n" \
                          f"Total Requests: {len(questions)}\n" \
                          f"Successful Requests: {len(response_times)}\n" \
                          f"Average Response Time: {average_response_time:.4f} seconds"
        logging.info(summary_message)
        print(f"Results written to log file: {log_file}") # Inform user
    else:
        summary_message = "\n--- Summary ---\nNo successful requests."
        logging.warning(summary_message)
        print(f"No successful requests. See log file: {log_file}")  # Inform user


if __name__ == "__main__":
    main()
