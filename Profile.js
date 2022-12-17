import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
// import { SettingsModal from './Settings';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails } from './User/UserDetails';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from './utils/queries';
import { RecentGames } from './RecentGames'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Pressable,
    TextInput,
    ActivityIndicator,
    Modal,
    SafeAreaView,
    ScrollView,
    Button,
    Image
} from 'react-native';
import {
    faSolid,
    faX,
    faClock,
    faCheck,
    faGift,
    faFlagCheckered,
    faCaretDown,
    faUser,
    faGear,
    faSliders,
    faStar,
    faTrophy
} from '@fortawesome/free-solid-svg-icons'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Profile = (props) => {
    const [userDetailsOpen, setUserDetailsOpen] = useState(false);
    const [recentGamesOpen, setRecentGamesOpen] = useState(false);
    const [leaderBoardsOpen, setLeaderBoardsOpen] = useState(false);
    const [premiumOpen, setPremiumOpen] = useState(false);

    const { data: userByID } = useQuery(GET_USER_BY_ID, {
        variables: { id: props.currentuser }
    });
    // console.log("!!!!")
    // console.log(userByID?.user.games)

    const storeAuthState = async (value) => {
        try {
            await AsyncStorage.setItem('@authState', value)
        } catch (e) {
            console.error(e)
        }
    }
    const storeBearerToken = async (value) => {
        try {
            await AsyncStorage.setItem('@storage_Key', value)
        } catch (e) {
            console.error(e)
        }
    }

    const storeUserID = async (value) => {
        try {
            await AsyncStorage.setItem('@userID', value)
        } catch (e) {
            console.error(e)
        }
    }

    const resetActionAuth = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Auth', params: {} }]
    });

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
        <View style={styles.profileView}>
            {/* Buttons */}
            {props.auth &&
                <>
                <View style={{  }}>
                    <View style={{ marginTop: windowHeight / 26 }}></View>
                    {/* [[[USER DETAILS]]] */}
                    <TouchableOpacity
                        onPress={() => {
                            setUserDetailsOpen(!userDetailsOpen);
                            setRecentGamesOpen(false)
                            setLeaderBoardsOpen(false)
                            setPremiumOpen(false)
                        }}
                    >
                        <View
                            style={{ flexDirection: 'row', margin: 10 }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faSliders}
                                style={{ ...styles.modalFontAwesomeIcons, color: 'white' }}
                                size={30}
                            />
                            <Text style={styles.modalScoringVarText} allowFontScaling={false}>
                                User Details
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {userDetailsOpen ?
                        <View style={{ alignSelf: 'center' }}>
                            <UserDetails currentuser={userByID?.user} nav={props.nav} />
                        </View>
                        :
                        null
                    }
                    <View style={styles.modalDivisionLine}></View>
                    {/* [[[RECENT GAMES]]] */}
                    <TouchableOpacity
                        onPress={() => {
                            setUserDetailsOpen(false);
                            setRecentGamesOpen(!recentGamesOpen)
                            setLeaderBoardsOpen(false)
                            setPremiumOpen(false)
                        }}
                    >
                        <View
                            style={{ flexDirection: 'row', margin: 10 }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faFlagCheckered}
                                style={{ ...styles.modalFontAwesomeIcons, color: 'white' }}
                                size={30}
                            />
                            <Text style={styles.modalScoringVarText} allowFontScaling={false}>
                                Recent Games
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {recentGamesOpen ?
                        <View style={{ marginLeft: 10 }}>
                            {/* <UserDetails currentuser={userByID?.user} /> */}
                            <RecentGames currentuser={userByID?.user._id} />
                        </View>
                        :
                        null
                    }
                    <View style={styles.modalDivisionLine}></View>
                    {/* [[[PREMIUM]]] */}
                    {/* <TouchableOpacity
                        onPress={() => {
                            setUserDetailsOpen(false);
                            setRecentGamesOpen(false)
                            setLeaderBoardsOpen(false)
                            setPremiumOpen(!premiumOpen)
                        }}
                    >
                        <View
                            style={{ flexDirection: 'row', margin: 10 }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faStar}
                                style={{ ...styles.modalFontAwesomeIcons, color: 'white' }}
                                size={30}
                            />
                            <Text style={styles.modalScoringVarText}>
                                Premium
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {premiumOpen ?
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ color: 'white' }}>Premium Box</Text>
                        </View>
                        :
                        null
                    }
                    <View style={styles.modalDivisionLine}></View> */}

                    <TouchableOpacity
                        onPress={() => {
                            storeAuthState('false')
                            storeBearerToken('')
                            storeUserID('')
                            props.nav.dispatch(resetActionAuth)
                        }}
                        style={{ ...styles.modalWordButton, marginTop: 60 }}
                    >
                        <LinearGradient
                            // Button Linear Gradient
                            colors={['#aacc00', '#80b918']}
                            style={styles.modalWordButton}
                        >
                            <Text 
                                style={{...styles.modalWordButtonText, fontSize: windowWidth*0.08, }}
                                allowFontScaling={false}
                            >
                                Logout
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{marginBottom: 200}}></View>
                </>
            }
        </View >
        </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
    },
    scrollView: {
        backgroundColor: 'transparent',
        // borderRadius: 10,
        marginHorizontal: -20,
        alignSelf: "center",
        width: windowWidth - 10,
        height: windowHeight - 100,
        marginTop: 10
    },
    text: {
        fontSize: 42,
    },
    centeredView: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        marginTop: 0
    },
    letters: {
        alignSelf: 'center',
        margin: 10,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#001219'
    },
    modalView: {
        margin: 20,
        // backgroundColor: '#001219',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: 'white',
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: windowWidth - 20,
        height: windowHeight - 80
    },
    settingsModalView: {
        margin: 20,
        // backgroundColor: '#001219',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: 'white',
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: windowWidth - 20,
        height: windowHeight / 3
    },
    profileView: {

        // alignSelf: "center",
        // width: windowWidth - 20,
        // height: windowHeight - 80
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginLeft: 10,
        marginRight: 10
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold'
    },
    modalText: {
        // marginBottom: 15,
        // textAlign: "center",
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        // alignSelf: 'center'
    },
    modalWordButton: {
        // backgroundColor: '#70e000',
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 40,
        alignSelf: 'center',
        margin: 10,
        width: windowWidth - 80,
        flexDirection: 'row'
    },
    modalWordButtonText: {
        color: '#001219',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    modalContentHeader: {
        color: '#4cc9f0',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContent: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    modalFontAwesomeIcons: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: 10
    },
    modalScoringVarText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    modalDivisionLine: {
        borderColor: '#4cc9f0',
        borderBottomWidth: 1,
        width: windowWidth - 80,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    section: {
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 40,
        alignSelf: 'center',
        margin: 10,
        width: windowWidth - 80,
        flexDirection: 'row'
    },
    box: {
        width: '100%',
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },

});