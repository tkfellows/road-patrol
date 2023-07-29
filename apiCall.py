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

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        api_response = response.json()

        # Save the API response to a local file named "api_response.json"
        with open("api_response.json", "w") as file:
            json.dump(api_response, file, indent=2)

        print("API response saved to 'api_response.json'.")
    else:
        print(f"Failed to make the API request. Status code: {response.status_code}")

if __name__ == "__main__":
    make_api_request()
