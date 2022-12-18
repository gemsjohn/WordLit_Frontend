import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
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
    Image,
    PixelRatio
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

const COLORS = [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#43aa8b',
    '#577590',
    '#f72585',
    '#4361ee',
    '#9f86c0',
    '#ff1654',
    '#4a5759',
    '#ad2831',
    '#cc8b79'
];

export const RecentGames = (props) => {
    const [currentColor, setCurrentColor] = useState('white');
    let gameCards = [];

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
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

    for (let i = 0; i < userByID?.user.games.length; i++) {
        const index = Math.floor(Math.random() * COLORS.length);
        gameCards[i] =
            <View 
                style={{ 
                    backgroundColor: `${COLORS[index]}`, 
                    padding: 10, 
                    borderRadius: 10, 
                    borderTopLeftRadius: 10, 
                    borderBottomLeftRadius: 40, 
                    marginRight: 20, 
                    flexDirection: 'row', 
                    borderLeftWidth: 2, 
                    borderBottomWidth: 2, 
                    marginTop: 5, 
                    marginBottom: 5,
                    width: windowWidth*0.9,
                }}
                key={i}
            >
                <View style={{ flexDirection: 'column', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 100, width: WidthRatio(50), height: WidthRatio(50), marginRight: 10, borderLeftWidth: 2, borderBottomWidth: 2 }}>
                    <FontAwesomeIcon
                        icon={faSolid, faFlagCheckered}
                        style={{ color: 'white', alignSelf: 'center', marginRight: 10 }}
                        size={20}
                    />
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                        

                        <Text 
                            style={{ fontSize: windowWidth*0.05, fontWeight: 'bold', color: '#efea5a', marginRight: 10 }}
                            allowFontScaling={false}
                        >{userByID?.user.games[i].score} points</Text>
                        <FontAwesomeIcon
                            icon={faSolid, faClock}
                            style={{ color: 'white', alignSelf: 'center', marginRight: 10 }}
                            size={20}
                        />
                        <Text 
                            style={{ fontSize: windowWidth*0.05, fontWeight: 'bold', color: 'white', marginRight: 10 }}
                            allowFontScaling={false}
                            >{userByID?.user.games[i].time} seconds</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                        <Text 
                            style={{ fontSize: windowWidth*0.05, fontWeight: 'bold', color: '#aaf683', marginRight: 10 }}
                            allowFontScaling={false}
                        >Words:</Text>
                        <Text 
                            style={{ fontSize: windowWidth*0.05, fontWeight: 'bold', color: 'white', marginRight: 10 }}
                            allowFontScaling={false}
                        >{userByID?.user.games[i].w1},</Text>
                        <Text 
                            style={{ fontSize: windowWidth*0.05, fontWeight: 'bold', color: 'white', marginRight: 10 }}
                            allowFontScaling={false}
                        >{userByID?.user.games[i].w2}</Text>
                    </View>
                </View>
            </View>
    }

    useEffect(() => {
        refetch()
    }, [])

    return (
        <>
            <View>
                {gameCards.reverse()}
            </View>
        </>
    )
}