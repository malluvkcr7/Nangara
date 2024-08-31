import streamlit as st
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize the Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def generate_caption(description, tags, category, target_audience):
    # Define the prompt for the chatbot
    prompt = (f"Create a single, impressive caption for a post with the following details:\n"
              f"Description: {description}\n"
              f"Tags: {tags}\n"
              f"Category: {category}\n"
              f"Target Audience: {target_audience}\n\n"
              "The caption should be of medium length, engaging, and tailored to appeal to the target audience. "
              "It should highlight the key aspects of the post, and be captivating enough to attract user interest. "
              "Please provide only one high-quality caption.")

    # Call the Groq API to get the caption
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192",
    )

    # Get the model's response
    caption = chat_completion.choices[0].message.content.strip()
    return caption

def app():
    st.title("Create New Post")
    st.write("")

    # File uploader for selecting a picture
    st.subheader("Select a Picture")
    uploaded_file = st.file_uploader("Choose a file", type=["jpg", "jpeg", "png"])

    # Check if the uploaded file exists
    if uploaded_file is not None:
        # Display the uploaded image
        st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
    else:
        st.write("Please upload a picture.")

    st.write("")
    st.write("")

    # Text area for adding a description
    st.subheader("Add Description")
    description = st.text_area("Description", placeholder="Enter description here...")

    st.write("")
    st.write("")

    # Text area for adding tags
    st.subheader("Tags")
    tags = st.text_input("Tags", placeholder="Enter tags separated by commas...")

    st.write("")
    st.write("")

    # Text area for adding category
    st.subheader("Category")
    category = st.text_input("Category", placeholder="Enter category here...")

    st.write("")
    st.write("")

    # Text area for adding target audience
    st.subheader("Target Audience")
    target_audience = st.text_area("Target Audience", placeholder="Enter target audience here...")

    st.write("")
    st.write("")

    # Button to generate caption
    if st.button("Create Caption"):
        # Generate caption if all fields are filled
        if description and tags and category and target_audience:
            caption = generate_caption(description, tags, category, target_audience)
            st.text_area("Generated Caption", value=caption, height=100)
        else:
            st.error("Please fill in all fields before generating a caption.")

    st.write("")
    st.write("")

    # Button to publish
    if st.button("Publish"):
        # Check if the necessary fields are filled
        if uploaded_file and description and tags and category and target_audience:
            # Placeholder for the publish action
            # Here you would typically save the data to a database or file
            st.success("Uploaded successfully!")
        else:
            st.error("Please fill in all fields and upload an image.")

# This part of the code will not be executed when this file is imported as a module
if __name__ == "__main__":
    app()
