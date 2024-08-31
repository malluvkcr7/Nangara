import streamlit as st

def app():
    # Create layout with two columns
    col1, col2 = st.columns([1, 2])  # Adjust column width ratio as needed

    with col1:
        # Display frame7 image at the top left
        st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Frame 7.png', width=200)  # Adjust width as needed

    with col2:
        # Title and subheader next to the image
        st.markdown("<h1 style='color: white;'>H&M</h1>", unsafe_allow_html=True)
        st.markdown("<h3 style='color: grey;'>Fashion Technology Company</h3>", unsafe_allow_html=True)
        # Create a single button with dark grey color
        st.markdown(
            """
            <style>
            .btn-custom {
                background-color: #2e2e2e;
                color: white;
                padding: 10px 10px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                text-align: center;
                display: inline-block;
                cursor: pointer;
            }
            .btn-custom:hover {
                background-color: #4a4a4a;
            }
            </style>
            """, unsafe_allow_html=True
        )
        
        if st.markdown('<h6 class="btn-custom">Edit Profile</h6>', unsafe_allow_html=True):
            pass  # Handle the click event here if needed
        st.write("")
        st.write("")
        st.write("")
        col11,col22,col33 = st.columns(3)
        with col11:
            st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Frame 8.png',use_column_width=True)
        with col22:
            st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Frame 9.png',use_column_width=True)
        with col33:
            st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Frame 10.png',use_column_width=True)
        
        col12,col13,col14 = st.columns(3)
        with col12:
            st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Frame 11.png',use_column_width=True)
        with col13:
            st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Frame 12.png',use_column_width=True)
        with col14:
            st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Frame 13.png',use_column_width=True)
        
        
# This part of the code will not be executed when this file is imported as a module
if __name__ == "__main__":
    app()
