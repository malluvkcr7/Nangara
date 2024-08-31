import streamlit as st

# Set page configuration at the very beginning of the script
st.set_page_config(page_title="Nangara", page_icon=":sparkles:", layout="wide")

def home_page():
    # CSS for styling the page, header,and buttons
    st.markdown("""
        <style>
        body {background-color: #f0f2f6;}
        h1 {color: #440154; font-family: 'Helvetica'; text-align: center;}
        
        /* Header Styling */
        .header {
            background-color: #440154;
            padding: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .header a {
            color: white;
            text-decoration: none;
            font-size: 18px;
            padding: 8px 16px;
            transition: background-color 0.3s, color 0.3s;
            border-radius: 5px;
        }
        .header a:hover {
            background-color: #55C667;
            color: white;
        }

        /* Button Styling */
        .stButton>button {
            background-color: #39568C;
            color: white;
            border-radius: 8px;
            height: 3em;
            width: 10em;
            margin: 30px auto;
            display: block;
        }
        .stButton>button:hover {
            background-color: #55C667;
            color: white;
        }
        .button-container {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 20px;
        }
        </style>
    """, unsafe_allow_html=True)

    # Header navigation links
    st.markdown("""
        <div class="header">
            <a href="#">About Us</a>
            <a href="#">Our Accomplishments</a>
            <a href="#">People</a>
            <a href="#">Why Join Us</a>
        </div>
    """, unsafe_allow_html=True)

    # Display the logo using st.image
    st.image(r"D:\Rakathon\dashboard-ecommerce\dashboard\nangara.png", caption="Welcome to Nangara!! The best dashboard for brands to manage their sales and performance.", use_column_width=True)

    # Buttons for login and sign up, adjusted lower on the page
    st.markdown('<div class="button-container">', unsafe_allow_html=True)
    if st.button("Login"):
        return "login"
    if st.button("Sign Up"):
        return "signup"
    st.markdown('</div>', unsafe_allow_html=True)

    # Default return value if no button is clicked
    return None

# Call the home page function
home_page()
