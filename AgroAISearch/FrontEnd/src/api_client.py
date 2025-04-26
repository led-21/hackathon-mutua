import requests
import os
import logging

# Configure logger
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

#API_HOST = 'http://host.docker.internal:5080'
#API_HOST = valor = os.getenv('services__backend__http__0')
API_HOST = 'https://agroaiwebapp--bjqjjxq.gentlefield-5e477047.eastus2.azurecontainerapps.io'

class ApiClient:
    @staticmethod
    def classify_pest_image(image_url):
        """
        Send a request to the API to classify the pest in the image.

        Args:
            image_url (str): The URL of the image to classify.

        Returns:
            The response from the API if all OK or None otherwise.
        """
        try: 
            response = requests.post(f"{API_HOST}/classify_pest", params={"url": image_url}, verify=True) 
            response.raise_for_status() 
            return response.json()
        # Raise an exception for HTTP error responsesreturn response.json() 
        except requests.exceptions.RequestException as e: 
            logger.error(f"Error classifying pest image: {e}") 
            return None
    
    @staticmethod
    def classify_pest_file(file_name, file_contents, file_type):
        """
        Send a request to the API to classify the pest in the file.

        Args:
            file_name (str): The name of the file.
            file_contents (bytes): The contents of the file.
            file_type (str): The type of the file.

        Returns:
            The response from the API if all OK or None otherwise.
        """
        files = {'file': (file_name, file_contents, file_type)}
        response = requests.post(f"{API_HOST}/classify_pest_file", files=files, verify=True)
        return response.json() if response.status_code == 200 else None
    
    @staticmethod
    def get_question_answer(question):
        """
        Send a request to the API to get the answer to the question.

        Args:
            question (str): The question to ask.
        
        Returns:
            The response from the API if all OK or None otherwise.
        """
        response = requests.get(f'{API_HOST}/question/', params= {'question': question}, verify=True)
        return response.json() if response.status_code == 200 else None
    
    @staticmethod
    def get_registered_products(pest_name):
        """
        Send a request to the API to get the registered products for a pest.

        Args:
            pest_name (str): The name of the pest.
        
        Returns:
            The response from the API if all OK or None otherwise.
        """
        response = requests.get(f'{API_HOST}/get_registered_products', params= {'pest': pest_name}, verify=True)
        return response.json() if response.status_code == 200 else None

    @staticmethod
    def health_check():
        """
        Send a request to the API to check its health.
        
        Returns:
            The response from the API if all OK or None otherwise.
        """
        response = requests.get(f'{API_HOST}/health', verify= True)
        return response.json() if response.status_code == 200 else None
    
    @staticmethod
    def transcribe_audio_file(file_name, file_contents, file_type):
        """
        Send a request to the API to transcribe the audio file.

        Args:
            file_name (str): The name of the file.
            file_contents (bytes): The contents of the file.
            file_type (str): The type of the file.
        
        Returns:
            The response from the API if all OK or None otherwise
        """
        files = {'file': (file_name, file_contents, file_type)}
        response = requests.post(f"{API_HOST}/speech_to_text", files=files, verify=True)
        return response.json() if response.status_code == 200 else None
