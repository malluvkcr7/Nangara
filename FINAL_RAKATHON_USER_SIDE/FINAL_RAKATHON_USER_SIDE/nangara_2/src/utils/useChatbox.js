import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Define the base URL based on the environment
const BASE_URL = 'http://10.0.2.2:5000'; // For Android Emulator
// const BASE_URL = 'http://localhost:5000'; // For iOS Simulator
// const BASE_URL = 'http://192.168.x.x:5000'; // For Physical Device

const sendMessageToChatbot = async (message) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat`, { message });
    return response.data.response;
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
};

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to the chat
    const updatedMessages = [
      ...messages,
      { role: 'user', content: message },
    ];
    setMessages(updatedMessages);

    try {
      const botResponse = await sendMessageToChatbot(message);

      // Add bot response to the chat
      setMessages([
        ...updatedMessages,
        { role: 'bot', content: botResponse },
      ]);
    //   console.log('the messages: ', messages)
      {messages.map((msg, index)=>{console.log('the message in the useChatBox.js is: ', msg); return true})}
      setMessage('');
      setError('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get a response from the chatbot.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '120%', height:'auto'}}>
            <View style={styles.chatContainer}>
                <Text style={styles.chatTitle}>Fashion Advisor</Text>
                <ScrollView style={styles.chatBox}>
                {messages.map((msg, index) => (
                    <View
                    key={index}
                    style={[
                        styles.chatMessage,
                        msg.role === 'user' ? styles.userMessage : styles.botMessage,
                    ]}
                    >
                    <View
                        style={[
                        styles.chatBubble,
                        msg.role === 'user' ? styles.userBubble : styles.botBubble,
                        ]}
                    >
                        <Text style={{ color: 'white' , backgroundColor: msg.role==="bot"? 'black': '#2f2f2f', width: msg.role=="bot"?'100%':'auto'}}>
                        {msg.content}
                        </Text>
                    </View>
                    </View>
                ))}
                {error && <Text style={styles.chatError}>{error}</Text>}
                </ScrollView>
                <View style={styles.chatInputContainer}>
                    <TextInput
                        style={styles.chatInput}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={styles.chatSendButton} onPress={handleSendMessage}>
                        <Text style={styles.chatSendButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  chatContainer: {
    maxWidth: 700,
    // marginVertical: 20,
    // marginHorizontal: 'auto',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    overflow: 'hidden',
  },
  chatTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  chatBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  chatMessage: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  chatBubble: {
    maxWidth: '70%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 16,
    lineHeight: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userBubble: {
    backgroundColor: '#2f2f2f',
    color: 'white',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#000000',
    color: '#333',
    alignSelf: 'flex-start',
  },
  chatError: {
    color: 'red',
    marginTop: 10,
  },
  chatInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 70,
  },
  chatInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    fontSize: 16,
    color: 'white'
  },
  chatSendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#000000',
    marginLeft: 10,
  },
  chatSendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatScreen;
