import streamlit as st
import webbrowser
import threading

def open_browser():
    """Open the Streamlit app in a web browser."""
    webbrowser.open("https://9f46041d51c39a595c.gradio.live/")

def app():
    """Run the Streamlit app and open it in a browser."""
    # Start the Streamlit app in a separate thread
    threading.Thread(target=open_browser).start()
    

if __name__ == "__main__":
    app()
