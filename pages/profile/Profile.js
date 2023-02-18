import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
// import { SettingsModal from './Settings';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetails } from './UserDetails';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import { RecentGames } from '../game/RecentGames';
import { Styling, HeightRatio, WidthRatio } from '../../Styling';
import { Navbar } from '../../components/Navbar';

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
    Image, RefreshControl
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
import { MainStateContext } from '../../App';

import { SecureStorage } from './SecureStorage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
}

export const ProfileScreen = ({ navigation }) => {
    // const [userID, setUserID] = useState('');
    // const [authState, setAuthState] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);

    const [userDetailsOpen, setUserDetailsOpen] = useState(true);
    const [recentGamesOpen, setRecentGamesOpen] = useState(false);
    const [leaderBoardsOpen, setLeaderBoardsOpen] = useState(false);
    const [premiumOpen, setPremiumOpen] = useState(false);

    const { mainState, setMainState } = useContext(MainStateContext);
    const [displaySetUpCosmicKeyModal, setDisplaySetUpCosmicKeyModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [expand_0, setExpand_0] = useState(false)


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    const authState = useRef(false);
    const userID = useRef(null);

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });



    const resetActionAuth = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Auth', params: {} }]
    });

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result && authState) {
            return;
        } else if (!result && authState.current) {
            setDisplaySetUpCosmicKeyModal(true)
        }
    }


    useEffect(() => {
        getSelectedColor();
        setLoading(true)

        refetch();
        setTimeout(() => {
            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;
            getValueFor('cosmicKey')
            setTimeout(() => {
                setLoading(false)
                console.log(userByID)
            }, 500)
        }, 500)

    }, [])

    const getSelectedColor = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('selectedColor')
          if (jsonValue != null) {
            let color = JSON.parse(jsonValue)
            setSelectedColor(color)
          }
        } catch (e) {
          console.error(e)
        }
      }
    
      const DisplayGradient = (props) => {
        return (
          <>
            <Image source={props.image} style={{ ...Styling.background, opacity: 0.4 }} />
            <LinearGradient
              colors={props.gradient}
              style={{ ...Styling.background, opacity: 0.5 }}
            />
          </>
        )
    }

    useEffect(() => {
        getSelectedColor();
      }, [selectedColor])

    return (
        <>
            <View style={{...Styling.container, backgroundColor: 'black',}}>
                <Navbar nav={navigation} auth={authState} position={'relative'} from={'profile'} />
                {selectedColor && selectedColor.gradient && selectedColor.image ?
                    <DisplayGradient gradient={selectedColor.gradient} image={selectedColor.image} />
                    :
                    <>
                        <Image source={require('../../assets/dalle_7.png')} style={{ ...Styling.background, opacity: 0.4 }} />
                        <LinearGradient
                            colors={['#0b132b', '#3a506b']}
                            style={{ ...Styling.background, opacity: 0.5 }}
                        />
                    </>
                }
                {!loading ?
                    <View>
                        <Image
                        source={require('../../assets/profile.png')}
                        style={{
                            height: HeightRatio(200),
                            width: HeightRatio(400),
                            alignSelf: 'center',
                            position: 'absolute',
                            top: HeightRatio(-20)
                        }}
                        />

                        <SafeAreaView style={Styling.profileContainer}>
                            <ScrollView
                                style={Styling.profileScrollView}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                            >
                                <View style={{ marginTop: HeightRatio(100) }}>
                                    {/* Buttons */}
                                    {mainState.current.authState &&
                                        <>
                                            <View style={{}}>
                                                <View style={{ marginTop: windowHeight / 24 }}></View>
                                                {/* [[[USER DETAILS]]] */}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setUserDetailsOpen(!userDetailsOpen);
                                                        setRecentGamesOpen(false)
                                                        setLeaderBoardsOpen(false)
                                                        setPremiumOpen(false)
                                                    }}
                                                    style={{
                                                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                                        padding: HeightRatio(20),
                                                        borderRadius: HeightRatio(20),
                                                        borderWidth: 2, 
                                                        borderColor: 'white',
                                                        margin: HeightRatio(10) 
                                                    }}
                                                >
                                                    <View
                                                        style={{ 
                                                            flexDirection: 'row', 
                                                            alignSelf: 'center'
                                                        }}
                                                    >
                                                        
                                                        <Text style={Styling.modalScoringVarText} allowFontScaling={false}>
                                                            User Details
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {userDetailsOpen ?
                                                    <View style={{ alignSelf: 'center' }}>
                                                        <UserDetails nav={navigation} />
                                                    </View>
                                                    :
                                                    null
                                                }
                                                {/* <View style={Styling.profileDivisionLine}></View> */}
                                                {/* [[[RECENT GAMES]]] */}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setUserDetailsOpen(false);
                                                        setRecentGamesOpen(!recentGamesOpen)
                                                        setLeaderBoardsOpen(false)
                                                        setPremiumOpen(false)
                                                    }}
                                                    style={{
                                                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                                        padding: HeightRatio(20),
                                                        borderRadius: HeightRatio(20),
                                                        borderWidth: 2, 
                                                        borderColor: 'white',
                                                        margin: HeightRatio(10)  
                                                    }}
                                                >
                                                    <View
                                                        style={{ flexDirection: 'row', alignSelf: 'center' }}
                                                    >
                                                       
                                                        <Text style={Styling.modalScoringVarText} allowFontScaling={false}>
                                                            Recent Games
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>


                                                {recentGamesOpen ?
                                                    <View style={{ marginLeft: 10 }}>
                                                        <RecentGames />
                                                    </View>
                                                    :
                                                    null
                                                }
                                                <View style={{...Styling.profileDivisionLine, height: HeightRatio(50)}}></View>

                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            deleteKey('cosmicKey');
                                                            setTimeout(() => {
                                                                setDisplaySetUpCosmicKeyModal(true)
                                                            }, 500)
                                                        }}
                                                        style={{
                                                            backgroundColor: 'rgba(255, 0, 0, 0.5)',
                                                            padding: HeightRatio(20),
                                                            borderRadius: HeightRatio(20),
                                                            borderWidth: 2, 
                                                            borderColor: 'white',
                                                            margin: HeightRatio(10) 
                                                        }}
                                                    >
                                                        <View
                                                        style={{ flexDirection: 'row', alignSelf: 'center' }}
                                                    >
                                                       
                                                        <Text 
                                                            style={{...Styling.modalScoringVarText, fontSize: HeightRatio(25)}} 
                                                            allowFontScaling={false}>
                                                            Remove/Reset Keycode
                                                        </Text>
                                                    </View>
                                                    </TouchableOpacity>
                                                </View>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        deleteKey('cosmicKey');

                                                        setMainState({
                                                            bearerToken: null,
                                                            userID: null,
                                                            authState: false
                                                        })
                                                        navigation.dispatch(resetActionAuth)
                                                    }}
                                                    style={{
                                                        backgroundColor: 'rgba(96, 106, 184, 0.5)',
                                                        padding: HeightRatio(20),
                                                        borderRadius: HeightRatio(20),
                                                        borderWidth: 2, 
                                                        borderColor: 'white',
                                                        margin: HeightRatio(10) 
                                                    }}
                                                >
                                                    <View
                                                    style={{ flexDirection: 'row', alignSelf: 'center' }}
                                                >
                                                   
                                                    <Text 
                                                        style={{...Styling.modalScoringVarText, fontSize: HeightRatio(25)}} 
                                                        allowFontScaling={false}>
                                                        Logout
                                                    </Text>
                                                </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginBottom: 200 }}></View>
                                        </>
                                    }
                                </View >
                            </ScrollView>
                        </SafeAreaView>
                    </View>
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#00d8ff" />
                        </View>
                    </View>
                }
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={displaySetUpCosmicKeyModal}
                onRequestClose={() => {
                    setDisplaySetUpCosmicKeyModal(!displaySetUpCosmicKeyModal);
                }}
            >
                <View style={Styling.modal_centered_view}>
                    <View style={Styling.modal_view}>
                        <View style={{ flexDirection: 'column' }}>

                            <SecureStorage />

                            <TouchableOpacity
                                onPress={() => setDisplaySetUpCosmicKeyModal(!displaySetUpCosmicKeyModal)}
                                style={{ marginTop: HeightRatio(20) }}>
                                <Text
                                    style={{ color: '#35faa9', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center' }}
                                    allowFontScaling={false}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <StatusBar
                barStyle="default"
                hidden={false}
                backgroundColor="transparent"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
        </>
    )
}