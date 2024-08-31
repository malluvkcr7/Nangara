import os
from dotenv import load_dotenv
from groq import Groq
import streamlit as st

# Load environment variables
load_dotenv()

# Initialize the Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def app():
    st.title("Suggestion Bot")
    st.write("Ask suggestions for your brands based on Your Stats")

    # Initialize session state for chat history and clear action
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
    
    if "clear_chat" not in st.session_state:
        st.session_state.clear_chat = False

    # Option to clear the chat history
    if st.button("Clear Chat"):
        st.session_state.clear_chat = True

    # Reset chat history if clear_chat flag is True
    if st.session_state.clear_chat:
        st.session_state.chat_history = []
        st.session_state.clear_chat = False  # Reset the flag

    # Text input box for user input
    user_input = st.text_input("Ask me anything...")

    # If the user provides input
    if user_input:
        # Append the user's message to the chat history
        st.session_state.chat_history.append({
            "role": "user",
            "content": user_input,
        })

        # Generate a response from the model
        chat_completion = client.chat.completions.create(
            messages=st.session_state.chat_history,
            model="llama3-8b-8192",
        )

        # Get the model's response
        model_response = chat_completion.choices[0].message.content

        # Append the model's response to the chat history
        st.session_state.chat_history.append({
            "role": "assistant",
            "content": model_response,
        })

    # Display the chat history
    for message in st.session_state.chat_history:
        if message["role"] == "user":
            st.markdown(f"**You:** {message['content']}")
        else:
            st.markdown(f"**Bot:** {message['content']}")

# Execute the app function
if __name__ == "__main__":
    app()
