import requests
import json

def make_api_request():
    url = 'https://rover.camera/api/v2/roads/coverage'
    headers = {'Content-Type': 'application/json'}
    data = {
        "api_key": "zCRcdK6ZYWL3zu5H73YHgfXf"
        # "days_since_patrolled_max": "2",
        # "class_number": "3"
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()  # Check for any request errors
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

def save_response_to_file(response_data):
    if response_data:
        with open('api_response.json', 'w') as file:
            json.dump(response_data, file, indent=2)

if __name__ == "__main__":
    api_response = make_api_request()
    if api_response:
        save_response_to_file(api_response)
        print("API response saved to 'api_response.json'")
