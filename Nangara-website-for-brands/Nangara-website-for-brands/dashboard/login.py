import streamlit as st

st.set_page_config(page_title="Nangara - Login", page_icon=":lock:", layout="wide")

def load_credentials():
    credentials = {}
    with open(r'D:\Rakathon\brand_design\login.txt', 'r') as file:
        for line in file:
            if ',' in line:  # Ensure each line contains a comma
                username, password = line.strip().split(',')
                credentials[username] = password
    return credentials

def login_page():
    # CSS for styling
    st.markdown("""
        <style>
        body {background-color: #f0f2f6;}
        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        h1 {color: #440154; text-align: center;}
        .stButton>button {
            background-color: #39568C;
            color: white;
            border-radius: 8px;
            height: 3em;
            width: 10em;
            margin: 10px;
        }
        .stButton>button:hover {
            background-color: #55C667;
            color: white;
        }
        .title {
            color: #FFFFFF;
            font-family: 'Helvetica';
            text-align: center;
            margin-bottom: 20px;
        }
        .stTextInput>div {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        </style>
    """, unsafe_allow_html=True)

    # Container to center content
    with st.container():
        # Display the logo centered using st.image
        st.image(r"D:\Rakathon\dashboard-ecommerce\dashboard\nangara.png", width=300)

        # Display the title below the logo
        st.markdown("<h1 class='title'>Login</h1>", unsafe_allow_html=True)

        # Input fields for username and password
        username = st.text_input("Brand Username")
        password = st.text_input("Password", type="password")

        # Centered Login button
        if st.button("Login"):
            credentials = load_credentials()
            if username in credentials and credentials[username] == password:
                st.success("Logged in successfully!")
                return "success"
            else:
                st.error("Invalid username or password")
                return "failed"

        # Back to Home button aligned to the side
        col1, col2 = st.columns([1, 3])
        with col1:
            if st.button("Back to Home"):
                return "home"

    return None

# This function call is just an example; in practice, this would be called from main.py
login_page()
