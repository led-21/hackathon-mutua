import os
import io
import azure.cognitiveservices.speech as sdk
from dotenv import load_dotenv

load_dotenv()
subscription_key = os.getenv('AZURE_SPEECH_KEY')
region = os.getenv('AZURE_SPEECH_REGION')


def recognize_speech_from_file(audio_file_path):
    speech_config = sdk.SpeechConfig(subscription= subscription_key, region= region)
    speech_config.speech_recognition_language= "pt-BR"

    audio_config = sdk.audio.AudioConfig(filename= audio_file_path)

    speech_recognizer = sdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    result = speech_recognizer.recognize_once()

    if result.reason == sdk.ResultReason.RecognizedSpeech:
        return result.text
    elif result.reason == sdk.ResultReason.NoMatch:
        return "No speech could be recognized"
    elif result.reason == sdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        return f"Speech Recognition canceled: {cancellation_details.reason}. Error details: {cancellation_details.error_details}"

    return "Unknown error occurred"