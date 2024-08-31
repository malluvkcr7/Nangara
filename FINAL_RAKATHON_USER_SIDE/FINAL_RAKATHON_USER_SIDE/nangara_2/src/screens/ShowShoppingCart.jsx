import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import firebase from "firebase/compat";
import 'firebase/compat/firestore';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from '../screens/Profile';
import { FontAwesome, FontAwesome5, MaterialIcons,MaterialCommunityIcons} from '@expo/vector-icons';
// import icon from '../../getImages';
import { LinearGradient } from 'expo-linear-gradient';


const Tab = createBottomTabNavigator();


const screenOptions = {
    tabBarShowLabel: true,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      borderTopWidth: 0.3,
      borderTopColor: "#444",
      height: Platform.OS === "Android" ? 54 : 80,
      backgroundColor: "#000",
    },
  };

const ShowShoppingCart = ({navigation, route}) => {
    const currentUser = route.params.user; // Access currentUser from route params
    console.log('routes in the ShowShoppingCart are: ', route)
    const [items, setItems] = useState([]); // State to hold the fetched data
    const [isClicked, setIsActive] = useState(false);

    const handlePressIn = () => {
        setIsActive(true);
    };

    // Function to fetch data from Firestore
    const getDetails = async () => {
        try {
            console.log('this is for testing the current mail: ',currentUser.email)
            // const docRef = firebase.firestore().collection('users').doc("vrajnandaknangunoori@gmail.com"); // Use email as document ID
            const docRef = firebase.firestore().collection('users').doc(currentUser.email);
            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                console.log('Details data: ', data);
                setItems(data.url); // Set the fetched data to state
            } else {
                console.log('No such document!');
                setItems([]); // Set empty array if no document found
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            setItems([]); // Set empty array in case of erro
        }
    };

    const deleteCartItem=async (deleteItem)=>{
        setItems((prevItems) => {
            const updatedItems = prevItems.filter(item => item !== deleteItem);
            
            const docRef = firebase.firestore().collection('users').doc(currentUser.email);
            docRef.update({
                url: updatedItems // Update the 'url' field with the new array of URLs
            }).then(() => {
                console.log('URLs successfully updated after deleting an item!');
            }).catch(error => {
                console.error('Error updating URLs: ', error);
            });
            
            return updatedItems; // This returns the new state
        });
    }

    const GoBackHome=(navigation)=>{
        // console.log('going back home')
        console.log('clicked on home button')
        navigation.navigate("Main Screen", { route: route})
    }

    useEffect(() => {
        getDetails(); // Fetch data when component mounts
    }, []);

    const totalAmount = 2300
    ; // Example total amount

    console.log('navigation: ', navigation.navigate);

  return (
    <SafeAreaView style={styles.safeAreaView}>
        <ScrollView contentContainerStyle={{minHeight: '100%', height:'auto'}}>
            <View style={styles.mainView}>
                <View style={styles.headerSection}>
                    <TouchableOpacity style={styles.GoBack} onPress={()=>GoBackHome(navigation)}>
                    <MaterialIcons name="arrow-back-ios" size={23} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerTextContainer} >
                        <Text style={styles.headerText}>Shopping Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons
                        name="shopping"
                        size={32}
                        color="#fff"
                        style={styles.chatIcon}
                        />
                    </TouchableOpacity>
                </View>

                {items.length > 0 ? (
                        items.map(item => (
                            <View style={styles.cartContainer} key={item}>
                                <View style={styles.itemContainerImage}>
                                <Image
                                    source={{ uri: item}}
                                    style={styles.imageStyle} // Apply the image style
                                    onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                                />
                                </View>
                                <View style={styles.itemContainer}>
                                    <View style={styles.itemDetailsContainer}>
                                        <Text style={styles.reelValuesBrandName}>
                                            {'BIBA'}
                                            {/* Price: {'$200'} */}
                                        </Text>
                                        <Text style={styles.reelValuesDescription}>
                                            {'Tshirt'}
                                        </Text>
                                        <View style={styles.FlexDisplaySizeQty}>
                                            <View style={styles.FlexDisplayContainer}>
                                                <Text style={styles.quantifier}>Size</Text>
                                                <Text style={styles.quantity}>42</Text>
                                            </View>
                                            <View style={styles.FlexDisplayContainer}>
                                                <Text style={styles.quantifier}>Qty</Text>
                                                <Text style={styles.quantity}>1</Text>
                                            </View>
                                        </View>
                                        <View style={styles.DeliveryDate}>
                                            <Text style={styles.quantifier}>Delivery by</Text>
                                            <Text style={[styles.quantity, ]}>10 May 2024</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <TouchableOpacity style={{height: 600,justifyContent: 'center', alignItems: 'center', opacity: 1}} activeOpacity={0.7}>
                            <Image
                                style={{tintColor: 'white', width: 300, height: 300}}
                                source={{uri: "https://i.postimg.cc/KY64T9dR/mallu-No-Items-Test1.png"}}
                            />
                        </TouchableOpacity>
                )}
            </View>
        </ScrollView>
        <View style={styles.bottomTab}>
            <View style={styles.showTotal}>
                <Text style={styles.totalText}>₹{totalAmount}</Text>
                <Text style={styles.viewDetailsText}>View Details</Text>
            </View>
                <LinearGradient
                    start={{ x: 0, y: 0 }}  // Starting point of the gradient
                    end={{ x: 1, y: 0 }}
                    colors={['#00FF66', '#FF00F5']}
                    style={styles.button}
                >
                    <TouchableOpacity onPress={() => navigation.navigate("ShowPaymentScreen", {currentUser: currentUser, totalAmount: totalAmount})} style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                </LinearGradient>
        </View>
        <StatusBar
            backgroundColor='black'
        />
    </SafeAreaView>
  )
}

export default ShowShoppingCart

const styles = StyleSheet.create({
    safeAreaView:{
        backgroundColor: 'black',
        color:'white',
    },
    mainView:{
        marginTop: '0',
        textAlign: 'left',
        fontSize: 20
    },
    texts:{
        fontSize: 30,
        color:'#10F119',
        marginTop: 0,
        marginLeft: 20,
        marginRight: 20,
    },
    itemContainer: {
        flexDirection: 'column',
        padding: 10,
        borderRadius: 5,
        width: 200,
        height: 300,
        justifyContent: 'space-around',
        alignItems: 'left'
    },
    itemText: {
        fontSize: 18,
        color: '#10F119',
    },
    video: {
        color:'black'
    },
    cartContainer: {
        marginBottom: 10,
        width: 'auto',
        height: 300,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footer: {
        marginBottom: '3',
        backgroundColor: 'pink',
    },
    footerText: {
        color:'white'
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
        color:'white'
    },
    tabNavigator: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    headerSection: {
        marginTop: 0,
        height: 80,
        backgroundColor: '#222222',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlignVertical: 'center'
    },
    paymentButtonText: {
        width: 200,
        textAlign: 'center',
        borderRadius: 5,
        height: 50,
        textAlignVertical: 'center',
        color:'black',
        fontWeight: '500',
        fontSize: 17,
    },
    GoHome: {
        paddingTop: 5,
        color: 'white',
        fontWeight: 'bold',
        borderRadius: 4,
        fontSize: 20,
        marginRight: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    ButtonHome: {
        width: 120,
        height: 40,
        borderRadius: 10,
        fontSize: 20,
        color:'green',
        marginTop: 0,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'green',
        textAlignVertical: 'center',
    },
    reelValues: {
        fontSize: 20,
        color:'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        padding: 0,
        marginTop: 0,
        width: '100%',
        height: '100%', // Specify height for better visibility
    },
    itemContainerImage: {
        flexDirection: 'column',
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        width: 200,
        height: 250,
        justifyContent: 'space-between',
    },
    reelValuesDelete: {
        fontSize: 30,
        color:'white',
        paddingLeft: 4,
        paddingBottom: 15,
        position: 'absolute',
        bottom: 3,
        // padding: 5,
        // paddingBottom: 15,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        // backgroundColor: 'red',
        borderRadius: 10,

    },
    DeleteContainer: {
        backgroundColor: 'red',
        borderRadius: 10,
        height: 50,
        width: 50
    },
    GoBack:{
        paddingLeft:12,
    },
    textsCart: {
        fontSize: 30,
        color:'orange',
        marginTop: 0,
        marginLeft: 20,
        marginRight: 20,
        fontWeight: 'bold',
        paddingRight: 20
    },
    CartIconStyles: {
        width: 160,
        height: 60,
        marginRight: 0,
        flexDirection: 'row',
    },
    itemDetailsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    reelValuesBrandName: {
        fontSize: 25,
        fontWeight: 'bold',
        color:'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    reelValuesDescription: {
        fontSize: 17,
        fontWeight: '300',
        color:'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    FlexDisplaySizeQty: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'auto',
    },
    FlexDisplayContainer: {
        marginRight: 13,
        backgroundColor: '#111111',
        width: '40%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
        borderRadius: 10
    },
    quantifier: {
        color:'white',
        fontSize: 15,
    },
    headerTextContainer:{
        marginRight:18,
    },
    quantity: {
        fontSize: 15,
        fontWeight: '500',
        color:'white'
    },
    DeliveryDate: {
        marginTop: 10,
        width: '100%',
    },
    showTotal: {
        flexDirection: 'column',
    },
    viewDetailsText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500'
    },
    headerText: {
        color:'#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 40,
    },
    button: {
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
    },
    buttonContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatIcon: {
        transform: [{ scaleX: -1 }, { scaleY: 1.2 }, { scaleX: 1.2 }],
        marginRight:20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
}) 