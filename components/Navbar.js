import React, { useEffect, useInsertionEffect, useState, useRef, useContext } from 'react';
import { View, Text, Button, Dimensions, Image, TouchableOpacity, PixelRatio } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faComment, faPen, faW, faF, faFlagCheckered, faGear, faTrophy, faHouse } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { MainStateContext } from '../App';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID, GET_ME } from '../utils/queries';
import { Styling } from '../Styling';


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

const colors = [
    { value: 'red', gradient: ['#4f000b', '#ff595e'], image: require('../assets/dalle_1.png'), id: 0 },
    { value: 'orange', gradient: ['#b21e35', '#faa307'], image: require('../assets/dalle_4.png'), id: 1 },
    { value: 'green', gradient: ['#132a13', '#83e377'], image: require('../assets/dalle_2.png'), id: 2 },
    { value: 'blue', gradient: ['#00171f', '#0466c8'], image: require('../assets/dalle_3.png'), id: 3 },
    { value: 'purple', gradient: ['#240046', '#c77dff'], image: require('../assets/dalle_5.png'), id: 4 },
    { value: '#0b132b', gradient: ['#0b132b', '#3a506b'], image: require('../assets/dalle_7.png'), id: 5 },
];


export const Navbar = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [homeBg, setHomeBg] = useState('rgba(255, 255, 255, 0.1)');
    const [gameBg, setGameBg] = useState('rgba(255, 255, 255, 0.1)');
    const [leaderBg, setLeaderBg] = useState('rgba(255, 255, 255, 0.1)');
    // const [settingsBg, setSettingsBg] = useState('rgba(255, 255, 255, 0.1)');
    const [profileBg, setProfileBg] = useState('rgba(255, 255, 255, 0.1)');
    const [bearerToken, storeBearerToken] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(null);
    const [displayColorOptions, setDisplayColorOptions] = useState(false);
    const [displaySignUpModal, setDisplaySignUpModal] = useState(false)
    const displaySignUpModalPreviousRef = useRef(null);

    const authState = useRef(false);
    const userID = useRef(null);

    let localKeyMoment = moment();

    const checkToken = async () => {
        // console.log("= = = = = = ")
        // console.log(mainState.current.bearerToken)
        // console.log("= = = = = = ")

        try {
            const response = await fetch('https://wordlit-backend.herokuapp.com/protected-route', {
                method: 'GET',
                headers: {
                    'Authorization': `${mainState.current.bearerToken}`
                }
            });
            if (response.ok) {
                // Token is still valid
                // console.log("NAV - Token is still valid")
                setIsTokenValid(true)
                return true;
            } else {
                // Token is no longer valid
                // console.log("NAV - Token is no longer valid")

                setIsTokenValid(false)
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const resetActionHome = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Home', params: {} }]
    });
    const resetActionGame = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Game', params: {} }]
    });
    // const resetActionLeader = CommonActions.reset({
    //     index: 1,
    //     routes: [{ name: 'Leader', params: {} }]
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


    const selectColor = async (color) => {
        // console.log(color)
        // setSelectedColor(color);
        try {
            const jsonValue = JSON.stringify(color)
            await AsyncStorage.setItem('selectedColor', jsonValue);
        } catch (e) {
            console.error(e)
        }
    };


    // let checkSignUpModalIntervalID; 
    const checkSignUpModalIntervalID = useRef(null);

    useEffect(() => {
        if (props.from == 'home') { setHomeBg('rgba(255, 255, 255, 0.1)') } else { setHomeBg('transparent') }
        if (props.from == 'game') { setGameBg('rgba(255, 255, 255, 0.1)') } else { setGameBg('transparent') }
        if (props.from == 'leader') { setLeaderBg('rgba(255, 255, 255, 0.1)') } else { setLeaderBg('transparent') }
        // if (props.from == 'settings') {setSettingsBg('rgba(255, 255, 255, 0.1)')} else {setSettingsBg('transparent')}
        if (props.from == 'profile') { setProfileBg('rgba(255, 255, 255, 0.1)') } else { setProfileBg('transparent') }
        // CurrentUser()
        // getBearerToken()

        authState.current = mainState.current.authState
        userID.current = mainState.current.userID;

        if (props.from == 'home') {
            checkSignUpModalIntervalID.current = setInterval(() => {
                displaySignUpModalPreviousRef.current = displaySignUpModal;
                if (authState.current == true && userID.current != null) {
                    setDisplaySignUpModal(false)
                } else if (!mainState.current.displaySignUpModal) {
                    setDisplaySignUpModal(false)
                } else if (mainState.current.displaySignUpModal) {
                    setDisplaySignUpModal(true)
                }
            }, 10)
        }
        return () => clearInterval(checkSignUpModalIntervalID.current); // Clear the interval on unmount
    }, [])

    if (localKeyMoment != mainState.current.initialKeyMoment && mainState.current.bearerToken != null) {
        checkToken();
    }

    useEffect(() => {
        if (displaySignUpModalPreviousRef.current != displaySignUpModal) {
            return;
        } else {
            clearInterval(checkSignUpModalIntervalID.current)
        }
    }, [displaySignUpModal])




    return (
        <>
            {displayColorOptions &&
                <>
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 10,
                            // left: 0,
                            // right: 0,
                            // bottom: HeightRatio(100),
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            flexDirection: 'row',
                            padding: HeightRatio(10),
                            height: windowHeight,
                            width: windowWidth,
                            borderRadius: HeightRatio(30)
                        }}
                    ></View>
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 20,
                            // left: 0,
                            // right: 0,
                            bottom: HeightRatio(100),
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#161b21',
                            flexDirection: 'row',
                            padding: HeightRatio(10),
                            height: HeightRatio(90),
                            width: HeightRatio(350),
                            borderRadius: HeightRatio(30)
                        }}
                    >
                        <View style={Styling.circlecontainer}>
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={color.id}
                                    style={[Styling.circle, { backgroundColor: color.value }]}
                                    onPress={() => { selectColor(color); setDisplayColorOptions(current => !current) }}
                                    accessible={true}
                                    accessibilityLabel={`${color} background.`}
                                />
                            ))}
                        </View>
                    </View>
                </>
            }
            <View
                style={{
                    position: 'absolute',
                    zIndex: 10,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#161b21',
                    flexDirection: 'row',
                    padding: HeightRatio(10),
                    opacity: displaySignUpModal ? 0.1 : 1.0
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
                            borderRadius: HeightRatio(10),
                            width: windowWidth / 5,
                            flexDirection: 'column'
                        }}
                        accessible={true}
                        accessibilityLabel="Home"
                    >
                        <FontAwesomeIcon
                            icon={faSolid, faHouse}
                            style={{ color: '#7678ed', alignSelf: 'center' }}
                            size={16}
                        />
                        <Text
                            style={{ color: 'white', marginTop: 6, textAlign: 'center', fontSize: HeightRatio(18) }}
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
                            borderRadius: HeightRatio(10),
                            width: windowWidth / 5,
                            flexDirection: 'column'
                        }}
                        accessible={true}
                        accessibilityLabel="Play"
                    >
                        <FontAwesomeIcon
                            icon={faSolid, faFlagCheckered}
                            style={{ color: '#aaf683', alignSelf: 'center' }}
                            size={16}
                        />
                        <Text
                            style={{ color: 'white', marginTop: 6, textAlign: 'center', fontSize: HeightRatio(18) }}
                            allowFontScaling={false}
                        >
                            Play
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* [[[COLOR]]] */}
                <TouchableOpacity
                    onPress={() => { setDisplayColorOptions(current => !current) }}
                >
                    <View
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            padding: 8,
                            borderRadius: HeightRatio(50),
                            width: windowWidth / 7,
                            margin: HeightRatio(10),
                            flexDirection: 'column'
                        }}
                        accessible={true}
                        accessibilityLabel="Mood Color"
                    >
                        <Image
                            source={require('../assets/color_wheel.png')}
                            style={{ width: HeightRatio(40), height: HeightRatio(40), alignSelf: 'center' }}
                        />
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
                            borderRadius: HeightRatio(10),
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
                            size={16}
                        />
                        <Text
                            style={{ color: 'white', marginTop: 6, textAlign: 'center', fontSize: HeightRatio(18) }}
                            allowFontScaling={false}
                        >
                            Leader
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* [[[PROFILE]]] */}
                {isTokenValid ?
                    <TouchableOpacity
                        onPress={() => {
                            props.nav.dispatch(resetActionProfile);
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: `${profileBg}`,
                                padding: 8,
                                borderRadius: HeightRatio(10),
                                width: windowWidth / 5,
                                flexDirection: 'column'
                            }}
                            accessible={true}
                            accessibilityLabel="User profile"
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faUser}
                                style={{ color: '#00b2ca', alignSelf: 'center' }}
                                size={16}
                            />
                            <Text
                                style={{ color: 'white', marginTop: 6, textAlign: 'center', fontSize: HeightRatio(18) }}
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
                                borderRadius: HeightRatio(10),
                                width: windowWidth / 5,
                                flexDirection: 'column'
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faUser}
                                style={{ color: '#00b2ca', alignSelf: 'center' }}
                                size={16}
                            />
                            <Text
                                style={{ color: 'white', marginTop: 6, textAlign: 'center', fontSize: HeightRatio(18) }}
                                allowFontScaling={false}
                            >
                                Profile
                            </Text>
                        </View>
                    </TouchableOpacity>

                }
            </View>
        </>
    )
}