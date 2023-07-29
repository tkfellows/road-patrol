import os
import requests
import json
from datetime import datetime

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

        # Include the current date and time in the JSON response
        current_datetime = datetime.now().isoformat()
        api_response["current_datetime"] = current_datetime

        # Get the absolute path for the output file
        output_file_path = os.path.join(os.getcwd(), "api_response.json")

        # Save the API response to the local file
        with open(output_file_path, "w") as file:
            json.dump(api_response, file, indent=2)

        print(f"API response saved to '{output_file_path}'.")
    else:
        print(f"Failed to make the API request. Status code: {response.status_code}")

if __name__ == "__main__":
    make_api_request()
