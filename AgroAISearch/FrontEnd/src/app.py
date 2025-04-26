import os
import requests
import yaml

import streamlit as st

#from llm_chains import load_normal_chain, load_pdf_chat_chain
from langchain.memory import StreamlitChatMessageHistory
from streamlit_mic_recorder import mic_recorder
from utils import save_chat_history_json, get_timestamp, load_chat_history_json
from html_templates import get_bot_template, get_user_template, css

from speech import recognize_speech_from_file
from api_client import ApiClient

config_path = os.path.join(os.path.dirname(__file__), "config.yaml")
with open(config_path, "r") as f:
    config = yaml.safe_load(f)


def clear_input_field():
    if st.session_state.user_question == "":
        st.session_state.user_question = st.session_state.user_input
        st.session_state.user_input = ""

def set_send_input():
    st.session_state.send_input = True
    clear_input_field()

def clear_url_field():
    if st.session_state.user_image_url == "":
        st.session_state.user_image_url = st.session_state.user_url
        st.session_state.user_url = ""

def set_send_url():
    st.session_state.send_url = True
    clear_url_field()


def process_speech():
    print("processing speech")


def toggle_pdf_chat():
    st.session_state.pdf_chat = True

def save_chat_history():
    if st.session_state.history != []:
        if st.session_state.session_key == "new_session":
            st.session_state.new_session_key = get_timestamp() + ".json"
            save_chat_history_json(st.session_state.history, os.listdir(os.path.join(os.path.dirname(__file__), config["chat_history_path"])) + st.session_state.new_session_key)
        else:
            save_chat_history_json(st.session_state.history, os.listdir(os.path.join(os.path.dirname(__file__), config["chat_history_path"])) + st.session_state.session_key)


def main():
    # Store initial states of widgets
    if "session_key" not in st.session_state:
        st.session_state.session_key = "new_session"
    
    if "send_input" not in st.session_state:
        st.session_state.send_input = False
    
    if "send_url" not in st.session_state:
        st.session_state.send_url = False
    
    if "user_question" not in st.session_state:
        st.session_state.user_question = ""
       
    if "new_session_key" not in st.session_state:
        st.session_state.new_session_key = None
    
    if "session_index_tracker" not in st.session_state:
        st.session_state.session_index_tracker = "new_session"
    
    if "user_input_caption" not in st.session_state:
        st.session_state.user_input_caption = "Type your message here."
    
    if "user_image_url" not in st.session_state:
        st.session_state.user_image_url = ""


    st.title("AI Search for Agricultural Planning and Control in Brazil")
    st.write(css, unsafe_allow_html=True)
    
    st.sidebar.title("Chat Sessions")
    chat_sessions = ["new_session"] + os.listdir(os.path.join(os.path.dirname(__file__), config["chat_history_path"]))
   
    if st.session_state.session_key == "new_session" and st.session_state.new_session_key != None:
        st.session_state.session_index_tracker = st.session_state.new_session_key
        st.session_state.new_session_key = None


    index = chat_sessions.index(st.session_state.session_index_tracker)
    st.sidebar.selectbox("Select a chat session", chat_sessions, key="session_key", index=index)

    if st.session_state.session_key != "new_session":
        st.session_state.history = load_chat_history_json(os.listdir(os.path.join(os.path.dirname(__file__), config["chat_history_path"])) + st.session_state.session_key)
    else:
        st.session_state.history = []

    chat_history = StreamlitChatMessageHistory(key="history")
    
    placeholder = st.empty()
    placeholder.text_area(st.session_state.user_input_caption, key="user_input", on_change= set_send_input)

    url_toggle_column, send_button_column = st.columns(2)
    with url_toggle_column:
        url_toggle= st.toggle("Text is a URL of an image", value= False, key= "url_toggle")
    
    with send_button_column:
        send_button = st.button("Send", key= "send_button", on_click= clear_input_field)

    if url_toggle:
        placeholder.text_area("Type the URL of the image file here.", key="user_url", on_change= set_send_url)

    # Placeholder for images, tables, etc.
    info_placeholder = st.empty()

    # Placeholder for the chat history.
    chat_container = st.container()
    
    speech = st.sidebar.audio_input("Record a question with your microphone.", key="speech", on_change= process_speech)
    uploaded_audio = st.sidebar.file_uploader("Upload an audio file with your questions.", type= ["wav", "mp3"])
    uploaded_image = st.sidebar.file_uploader("Upload an image file with a pest to identify.", type= ["jpg", "jpeg", "png"])

 
    # If there is a uploaded audio file, transcribe it and send it to the endpoint
    # to process the question.
    if uploaded_audio:
        transcribed_audio = ApiClient.transcribe_audio_file(uploaded_audio.name, uploaded_audio.getvalue(), uploaded_audio.type)
        if transcribed_audio is not None:
            # Calls the endpoint to process the question        
            response = ApiClient.get_question_answer(transcribed_audio['text'])
            if response is not None:
                chat_history.add_user_message(transcribed_audio['text'])
                chat_history.add_ai_message(response['result'])
                chat_history.add_ai_message(response['observation'])         


    # If there is a voice recording, transcribe it and send it to the endpoint
    # to process the question.
    if speech:
        transcribed_audio = ApiClient.transcribe_audio_file(speech.name, speech.getvalue(), speech.type)
        if transcribed_audio is not None:
            # Calls the endpoint to process the question
            response = ApiClient.get_question_answer(transcribed_audio['text'])
            if response is not None:
                chat_history.add_user_message(transcribed_audio['text'])
                chat_history.add_ai_message(response['result'])
                chat_history.add_ai_message(response['observation'])
        
    
    if uploaded_image:
        with st.spinner("Processing image..."):
            container = info_placeholder.container()
            container.image(uploaded_image, caption="Image uploaded by the user.", width= 600)

            pest = ApiClient.classify_pest_file(uploaded_image.name, uploaded_image.read(), uploaded_image.type)
            if pest is not None:
                pest_name_db = pest['pestClassification'].split("(")[0].lower().strip()
                pest_name_db = pest_name_db.replace(" ", "-")

                # Get registered products for this pest.
                products = ApiClient.get_registered_products(pest_name_db)
                if products is not None:
                    container.dataframe(products, height= 400, width= 800)

                chat_history.add_user_message("The image uploaded by the user.")
                chat_history.add_ai_message(pest['pestClassification'])
                chat_history.add_ai_message(pest['result'])
                chat_history.add_ai_message(pest['observation'])

        

    if send_button or st.session_state.send_input or st.session_state.send_url:
        # If the URL toggle is "off", the user input is a text question.
        # The question is sent to the endpoint to process the question.
        if st.session_state.user_question != "":
            response = ApiClient.get_question_answer(st.session_state.user_question)
            if response is not None:
                chat_history.add_user_message(st.session_state.user_question)
                chat_history.add_ai_message(response['result'])
                chat_history.add_ai_message(response['observation'])

            st.session_state.user_question = ""
        
        # If the URL toggle is "on", the user input is a URL of an image file.
        # The URL is sent to the endpoint to process the image.
        if st.session_state.user_image_url != "":        
            container = info_placeholder.container()
            container.image(st.session_state.user_image_url, caption="Image URL indicated by the user.", width= 600)
            pest = ApiClient.classify_pest_image(st.session_state.user_image_url)
            if pest is not None:
                pest_name_db = pest['pestClassification'].split("(")[0].lower().strip()
                pest_name_db = pest_name_db.replace(" ", "-")
                
                # Get registered products for this pest.
                products = ApiClient.get_registered_products(pest_name_db)
                if products is not None:
                    container.dataframe(products, height= 400, width= 800)

                chat_history.add_user_message(f"The user indicated the URL: {st.session_state.user_image_url}")
                chat_history.add_ai_message(pest['pestClassification'])
                chat_history.add_ai_message(pest['result'])
                chat_history.add_ai_message(pest['observation'])

            st.session_state.user_image_url = ""
                

        st.session_state.send_input = False

    if chat_history.messages != []:
        with chat_container:
            st.write("Chat History:")
            for message in chat_history.messages:
                if message.type == "human":
                    st.write(get_user_template(message.content), unsafe_allow_html=True)
                else:
                    st.write(get_bot_template(message.content), unsafe_allow_html=True)

    #save_chat_history()

if __name__ == "__main__":
    main()