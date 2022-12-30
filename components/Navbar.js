import React, { useEffect, useInsertionEffect, useState } from 'react';
import { View, Text, Button, Dimensions, Image, TouchableOpacity, PixelRatio } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faComment, faPen, faW, faF, faFlagCheckered, faGear, faTrophy, faHouse } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID, GET_ME } from '../utils/queries';


const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scaleWidth = SCREEN_WIDTH / 360;
const scaleHeight = SCREEN_HEIGHT / 800;

const WidthRatio = (size) => {
    const newSize = size * scaleWidth;
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

const HeightRatio = (size) => {
    const newSize = size * scaleHeight;
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}


export const Navbar = (props) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [authState, setAuthState] = useState(false);
    const [homeBg, setHomeBg] = useState('rgba(255, 255, 255, 0.1)');
    const [gameBg, setGameBg] = useState('rgba(255, 255, 255, 0.1)');
    const [leaderBg, setLeaderBg] = useState('rgba(255, 255, 255, 0.1)');
    // const [settingsBg, setSettingsBg] = useState('rgba(255, 255, 255, 0.1)');
    const [profileBg, setProfileBg] = useState('rgba(255, 255, 255, 0.1)');
    const [userID, setUserID] = useState('');
    const [bearerToken, storeBearerToken] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(null);

    const checkToken = async (value) => {
        try {
          const response = await fetch('https://wordlit-backend.herokuapp.com/protected-route', {
            method: 'GET',
            headers: {
              'Authorization': `${value}`
            }
          });
          if (response.ok) {
            // Token is still valid
            setIsTokenValid(true)
            return true;
          } else {
            // Token is no longer valid
            setIsTokenValid(false)
            return false;
          }
        } catch (error) {
          console.error(error);
        }
    }

    const CurrentUser = async () => {
        let value = await AsyncStorage.getItem('@userID', value);
        setUserID(value);
    }

    const getBearerToken = async () => {
          let value = await AsyncStorage.getItem('@storage_Key', value)
          checkToken(value)
    }


    const CheckAuthState = async () => {
        let value = await AsyncStorage.getItem('@authState')
        // console.log(value)
        if (value === 'true') {
            setAuthState(true)
        } else if (value === 'false') {
            setAuthState(false)
        }
    }
    CheckAuthState()


    const resetActionHome = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Home', params: {} }]
    });
    const resetActionGame = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Game', params: {} }]
    });
    // const resetActionSettings = CommonActions.reset({
    //     index: 1,
    //     routes: [{ name: 'Settings', params: {} }]
    // });
    const resetActionProfile = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Profile', params: {} }]
    });
    const resetActionAuth = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Auth', params: {} }]
    });
    const resetActionLeader = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Leader', params: {} }]
    });

    

    

    useEffect(() => {
        if (props.from == 'home') {setHomeBg('rgba(255, 255, 255, 0.1)')} else {setHomeBg('transparent')}
        if (props.from == 'game') {setGameBg('rgba(255, 255, 255, 0.1)')} else {setGameBg('transparent')}
        if (props.from == 'leader') {setLeaderBg('rgba(255, 255, 255, 0.1)')} else {setLeaderBg('transparent')}
        // if (props.from == 'settings') {setSettingsBg('rgba(255, 255, 255, 0.1)')} else {setSettingsBg('transparent')}
        if (props.from == 'profile') {setProfileBg('rgba(255, 255, 255, 0.1)')} else {setProfileBg('transparent')}
        CurrentUser()
        getBearerToken()
    }, [])


    return (
        <View
            style={{
                position: `${props.position}`,
                zIndex: 10,
                top: 0,
                left: 0,
                right: 0,
                bottom: windowHeight - 90,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#001219',
                flexDirection: 'row',
            }}
        >
            {/* [[[HOME]]] */}
            <TouchableOpacity
                onPress={() => { props.nav.dispatch(resetActionHome); }}
            >
                <View
                    style={{
                        backgroundColor: `${homeBg}`,
                        padding: 8,
                        borderRadius: 30,
                        width: windowWidth / 5,
                        flexDirection: 'column'
                    }}
                    accessible={true}
                    accessibilityLabel="Home"
                >
                    <FontAwesomeIcon
                        icon={faSolid, faHouse}
                        style={{ color: '#7678ed', alignSelf: 'center' }}
                        size={25}
                    />
                    <Text 
                        style={{ color: 'white', marginTop: 6, alignSelf: 'center', fontSize: HeightRatio(18) }}
                        allowFontScaling={false}
                    >
                        Home
                    </Text>
                </View>
            </TouchableOpacity>
           
            {/* [[[GAME]]] */}
            <TouchableOpacity
                onPress={() => { props.nav.dispatch(resetActionGame); }}
            >
                <View
                    style={{
                        backgroundColor: `${gameBg}`,
                        padding: 8,
                        borderRadius: 30,
                        width: windowWidth / 5,
                        flexDirection: 'column'
                    }}
                    accessible={true}
                    accessibilityLabel="Game"
                >
                    <FontAwesomeIcon
                        icon={faSolid, faFlagCheckered}
                        style={{ color: '#aaf683', alignSelf: 'center' }}
                        size={25}
                    />
                    <Text 
                        style={{ color: 'white', marginTop: 6, alignSelf: 'center', fontSize: HeightRatio(18) }}
                        allowFontScaling={false}
                    >
                        Game
                    </Text>
                </View>
            </TouchableOpacity>
            {/* [[[LEADER BOARD]]] */}
            <TouchableOpacity
                onPress={() => { props.nav.dispatch(resetActionLeader); }}
            >
                <View
                    style={{
                        backgroundColor: `${leaderBg}`,
                        padding: 8,
                        borderRadius: 30,
                        width: windowWidth / 5,
                        flexDirection: 'column',
                        alignSelf: 'center'
                    }}
                    accessible={true}
                    accessibilityLabel="Leader board"
                >
                    <FontAwesomeIcon
                        icon={faSolid, faTrophy}
                        style={{ color: '#efea5a', alignSelf: 'center' }}
                        size={25}
                    />
                    <Text 
                        style={{ color: 'white', marginTop: 6, alignSelf: 'center', fontSize: HeightRatio(18) }}
                        allowFontScaling={false}
                    >
                        Leader
                    </Text>
                </View>
            </TouchableOpacity>
            
            {/* [[[PROFILE]]] */}
            {isTokenValid ?
                <TouchableOpacity
                    onPress={() => { props.nav.dispatch(resetActionProfile); }}
                >
                    <View
                        style={{
                            backgroundColor: `${profileBg}`,
                            padding: 8,
                            borderRadius: 30,
                            width: windowWidth / 5,
                            flexDirection: 'column'
                        }}
                        accessible={true}
                        accessibilityLabel="User profile"
                    >
                        <FontAwesomeIcon
                            icon={faSolid, faUser}
                            style={{ color: '#00b2ca', alignSelf: 'center' }}
                            size={25}
                        />
                        <Text 
                            style={{ color: 'white', marginTop: 6, alignSelf: 'center', fontSize: HeightRatio(18) }}
                            allowFontScaling={false}
                        >
                            Profile
                        </Text>
                    </View>
                </TouchableOpacity>
            :
                <TouchableOpacity
                    onPress={() => { props.nav.dispatch(resetActionAuth); }}
                >
                    <View
                        style={{
                            backgroundColor: `${profileBg}`,
                            padding: 8,
                            borderRadius: 30,
                            width: windowWidth / 5,
                            flexDirection: 'column'
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSolid, faUser}
                            style={{ color: '#00b2ca', alignSelf: 'center' }}
                            size={25}
                        />
                        <Text 
                            style={{ color: 'white', marginTop: 6, alignSelf: 'center', fontSize: HeightRatio(18) }}
                            allowFontScaling={false}
                        >
                            Profile
                        </Text>
                    </View>
                </TouchableOpacity>

            }
        </View>
    )
}