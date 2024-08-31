import streamlit as st

def app():
    
    # Display title at the top
    st.title("Welcome H&M")

    # Add a subtitle or introductory text (optional)
    st.subheader("Get started with your brand's tasks below!")
    st.write("")
    st.write("")
    st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Group 33243.png',width=700)
    st.write("")
    st.write("")
    st.write("")
    st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Trending-1.png',width=550)
    st.write("")
    st.write("")
    st.write("")
    st.write("")
    col11,col22 = st.columns([1,1])
    with col11:
        st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Trending-3.png',use_column_width=True)
    with col22:
        st.image(r'D:\Rakathon\dashboard-ecommerce\dashboard\Trending-4.png',use_column_width=True)

    
# This part of the code will not be executed when this file is imported as a module
if __name__ == "__main__":
    app()
