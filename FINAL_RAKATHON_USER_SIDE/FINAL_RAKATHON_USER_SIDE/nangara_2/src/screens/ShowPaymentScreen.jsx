import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
// import { ShadowBox, NeomorphBox } from 'react-native-neomorph-shadows';
// import { Ionicons } from '@expo/vector-icons';

const paymentOptions = {
  recommended: [
    { label: 'Cash on Delivery (CASH/UPI)', icon: 'cash-outline' },
    { label: 'Rakuten Pay', icon: 'wallet-outline' }
  ],
  online: [
    { label: 'UPI (Pay via any App)', icon: 'qr-code-outline' },
    { label: 'Credit/Debit Card', icon: 'card-outline' },
    { label: 'Wallets', icon: 'wallet-outline' },
    { label: 'Pay Later', icon: 'time-outline' },
    { label: 'EMI', icon: 'business-outline' },
    { label: 'Net Banking', icon: 'globe-outline' }
  ]
};

const ShowPaymentScreen = ({ navigation, route }) => {
  const totalAmount = route.params.totalAmount;
  const currentUser = route.params.currentUser;

  const [selectedOption, setSelectedOption] = useState('');
  const [expandedOption, setExpandedOption] = useState(null);
  const [animations] = useState(paymentOptions.online.map(() => new Animated.Value(0)));
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handlePress = () => {
    if (selectedOption) {
      setMessage('Successful payment using ' + selectedOption.label);
    } else {
      setMessage('Select an option');
    }

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(prevState => prevState === option ? '' : option);
  };

  const handleExpandToggle = (index) => {
    if (expandedOption === index) {
      setExpandedOption(null);
      Animated.timing(animations[index], {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true
      }).start();
    } else {
      setExpandedOption(index);
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true
      }).start();
    }
  };

  const getArrowRotate = (index) => {
    return animations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    });
  };

  const GoBackCart = () => {
    navigation.navigate("ShowShoppingCart", { currentUser: currentUser });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, minHeight: '100%', height:'auto'}}>
        <View style={styles.container}>
          <View style={styles.headerBar}>
            <TouchableOpacity style={styles.GoBack} onPress={GoBackCart}>
            <MaterialIcons name="arrow-back-ios" size={23} color={"#fff"} />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 25, marginLeft: 30, fontWeight: 'bold',marginRight:20 }}>Payment Options</Text>
            <Ionicons name="card-outline" size={24} color="black" style={styles.icon} />
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>RECOMMENDED PAYMENT OPTIONS</Text>
            {paymentOptions.recommended.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.option, selectedOption === option && styles.selectedOption]}
                onPress={() => handleOptionSelect(option)}
              >
                <Ionicons name={option.icon} size={24} color="black" style={{ marginRight: 10 }} />
                <Text style={styles.optionText}>{option.label}</Text>
                {selectedOption === option && <Ionicons name="radio-button-on" size={24} color="green" />}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>ONLINE PAYMENT OPTIONS</Text>
            {paymentOptions.online.map((option, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => { handleOptionSelect(option); handleExpandToggle(index) }}
                >
                  <Ionicons name={option.icon} size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={styles.optionText}>{option.label}</Text>
                  <Animated.View style={{ transform: [{ rotate: getArrowRotate(index) }] }}>
                    <Ionicons name="chevron-down" size={24} color="black" />
                  </Animated.View>
                </TouchableOpacity>
                {expandedOption === index && (
                  <View style={styles.offerContainer}>
                    <Text style={styles.offerText}>Exclusive Offers for {option.label}</Text>
                    <Text style={styles.offerText}>Discount of 20% with credit card</Text>
                    <Text style={styles.offerText}>Discount of 30% with debit card</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomTab}>
        <View style={styles.showTotal}>
          <Text style={styles.totalText}>₹{totalAmount}</Text>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </View>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#00FF66', '#FF00F5']}
          style={styles.button}
        >
          <TouchableOpacity style={styles.buttonContent} onPress={handlePress}>
            <Text style={styles.buttonText}>Pay Now</Text>
          </TouchableOpacity>
        </LinearGradient>
        {showMessage && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: '#222222'
  },
  section: {
    // marginBottom: 16,
    // marginTop: 50,
    width: '100%',
    // backgroundColor: '#222222'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    // backgroundColor: '#222222',
    height: 65,
    textAlignVertical: 'center',
    // marginBottom: 8,
    color: 'white',
    marginLeft:30,
    marginRight:30,
    // margin: 10
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: 75,
  },
  selectedOption: {
    backgroundColor: '#d0ffd0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  offerContainer: {
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  offerText: {
    fontSize: 14,
    color: 'black',
    paddingLeft: 20,
    paddingBottom: 10,
  },
  safeAreaView: {
    flex: 1,
    // margin:5,
    backgroundColor: 'black',
    color: 'white',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 30,
    backgroundColor: 'black',
    height: 60,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#000000',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  viewDetailsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  button: {
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  messageContainer: {
    width: '70%',
    position: 'absolute',
    left: '15%',
    bottom: '700%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  showTotal: {
    padding: 5,
    justifyContent: 'center',
  },
  GoBack:{
    paddingLeft:12,
  },
  icon: {
    color:'white',
    width: 30,
    height: 30,
    marginRight: 10,
    marginTop: 5
  }
});

export default ShowPaymentScreen;
