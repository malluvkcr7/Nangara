import streamlit as st
from streamlit_option_menu import option_menu
import home
import login
import home1
import dashboard
import account
import trending
import create
import chatbot
import similar_product
import genn

# Function to render the sticky header
def render_header():
    st.markdown("""
        <style>
        body {background-color: #f0f2f6;}
        
        /* Header Styling */
        .header {
            background-color: #440154;
            padding: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
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

# Function to run the main application logic using sidebar option menu
def run_main_app():
    render_header()  # Render the sticky header

    with st.sidebar:
        app = option_menu(
            menu_title='Welcome!',
            options=['Home', 'Trending', 'Dashboard', 'Create', 'Profile', 'Helper Bot', 'Product Recommender', 'Design Product using Gen-Ai'],
            icons=['house-fill', 'trophy-fill', 'bar-chart-fill', 'plus-circle-fill', 'person-circle', 'chat-fill', 'lightbulb-fill', 'lightbulb'],
            menu_icon='chat-text-fill',
            default_index=0,
            key="unique_option_menu_key",
            styles={
                "container": {"padding": "5!important", "background-color": '#1c1c1c'},
                "icon": {"color": "white", "font-size": "23px"},
                "nav-link": {
                    "color": "white",
                    "font-size": "20px",
                    "text-align": "left",
                    "margin": "0px",
                    "--hover-color": "#4a4a4a"
                },
                "nav-link-selected": {"background-color": "#02ab21"},
            }
        )

        # Add a logout button to the sidebar
        if st.sidebar.button("Logout"):
            st.session_state["logged_in"] = False
            st.session_state["page"] = "home"

    # Match the selected app with the correct function and run it
    if app == "Home":
        home1.app()
    elif app == "Profile":
        account.app()
    elif app == "Dashboard":
        dashboard.app()
    elif app == "Trending":
        trending.app()
    elif app == 'Helper Bot':
        chatbot.app()
    elif app == 'Create':
        create.app()
    elif app == 'Product Recommender':
        similar_product.app()
    elif app == 'Design Product using Gen-Ai':
        genn.app()

# Start the application
if "page" not in st.session_state:
    st.session_state["page"] = "home"
    st.session_state["logged_in"] = False

# Main flow control
if st.session_state["page"] == "home":
    if st.session_state["logged_in"]:
        home1.app()
    else:
        next_action = home.home_page()
        if next_action == "login":
            st.session_state["page"] = "login"
        elif next_action == "signup":
            st.write("Signup Page Placeholder")

elif st.session_state["page"] == "login":
    login_result = login.login_page()
    if login_result == "success":
        st.session_state["logged_in"] = True
        st.session_state["page"] = "main"
    elif login_result == "home":
        st.session_state["page"] = "home"

if st.session_state["page"] == "main" and st.session_state["logged_in"]:
    run_main_app()
elif st.session_state["page"] == "login":
    st.session_state["page"] = "login"
