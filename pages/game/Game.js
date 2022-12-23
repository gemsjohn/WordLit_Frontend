import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { ADD_GAME } from '../../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import { CommonActions, useTheme } from '@react-navigation/native';
import { Styling } from '../../Styling';
import { Navbar } from '../../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    faTrophy,
    faGamepad,
    faSquareMinus
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
    //   if (Platform.OS === 'ios') {
    //     return Math.round(PixelRatio.roundToNearestPixel(newSize))
    //   } else {
    //     return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    //   }
}

const HeightRatio = (size) => {
    const newSize = size * scaleHeight;
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
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

export const GameScreen = ({ navigation }) => {

    let CompArray_0 = [];
    let CompArray_1 = [];
    let indexArray_0 = [];
    let indexArray_1 = [];
    let localSplitWord_1 = [];
    let localSplitWord_2 = [];
    let layer_0 = []
    let layer_1 = []
    let layer_2 = []
    let buttonArray = [];
    let tempGridArray_0 = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    let keyContainer = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',];
    let storedGuesses = ['', '', '', '', '', '', '', '', '', '', '', '',];
    let guessBoxes = [];
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let u0;
    let u1;

    const [userID, setUserID] = useState('');
    const [authState, setAuthState] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);

    const [words, setWords] = useState([])
    const [word1, setWord1] = useState('');
    const [word2, setWord2] = useState('');

    const [iVar, setIVar] = useState([]);
    const [promptGuessInput, setPromptGuessInput] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [displayGrid, setDisplayGrid] = useState(false)
    const [randomItems, setRandomItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Scoring Logic
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [storeCorrectAnswers, setStoreCorrectAnswers] = useState(0);
    const [storeIncorrectAnswers, setStoreIncorrectAnswers] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0)
    const [score, setScore] = useState(0)
    const [extraPoints, setExtraPoints] = useState(0);
    const [awardExtraPoints, setAwardExtraPoints] = useState(false);

    // Definitions: Word 1 & Word 2
    const [displayDetails, setDisplayDetails] = useState(false);
    const [phonetic1, setPhonetic1] = useState('');
    const [phonetic2, setPhonetic2] = useState('');
    const [definition0, setDefinition0] = useState('');
    const [definition1, setDefinition1] = useState('');
    const [definition2, setDefinition2] = useState('');
    const [definition3, setDefinition3] = useState('');
    const [definition4, setDefinition4] = useState('');
    const [definition5, setDefinition5] = useState('');

    // HINTS
    const [hintTopBottomModal, setHintTopBottomModal] = useState(false);
    const [hintLeftRightModal, setHintLeftRightModal] = useState(false);
    const [displayTopBottomHint, setDisplayTopBottomHint] = useState(false);
    const [displayLeftRightHint, setDisplayLeftRightHint] = useState(false);
    const [leftRightHintReduction, setLeftRightHintReduction] = useState(0);
    const [topBottomHintReduction, setTopBottomHintReduction] = useState(0);

    // Timer: Start and Stop
    const start = () => { setStartTime(Date.now()) };
    const end = () => { setEndTime(Date.now()) };

    // REACT Navigation
    const resetActionGame = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Game', params: {} }]
    });

    // ADD_GAME
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: userID }
    });
    // console.log(userByID?.user)
    const [addGame] = useMutation(ADD_GAME);

    const CheckAuthState = async () => {
        let value = await AsyncStorage.getItem('@authState')
        if (value === 'true') {
            setAuthState(true);
        } else if (value === 'false') {
            setAuthState(false);
        }
    }

    const CurrentUser = async () => {
        let value = await AsyncStorage.getItem('@userID', value);
        setUserID(value);
    }


    const getSelectedColor = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('selectedColor')
            if (jsonValue != null) {
                let color = JSON.parse(jsonValue)
                setSelectedColor(color);
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        CheckAuthState();
        CurrentUser();
        getSelectedColor();
    }, [])



    const handleAddGame = async (w1, w2, t, s) => {
        if (authState) {
            console.log("AUTH TRUE")
            try {
                const { data } = await addGame({
                    variables: {
                        userid: userByID?.user._id,
                        username: userByID?.user.username,
                        w1: w1,
                        w2: w2,
                        w3: "",
                        time: `${t}`,
                        score: `${s}`,
                        date: "",
                        difficulty: ""
                    }
                });
                refetch();
            }
            catch (e) { console.error(e); }
        } else {
            console.log("AUTH FALSE")
        }

    }




    const keyLayers = [
        { layer: layer_0, init: '0', final: 10 },
        { layer: layer_1, init: '10', final: 19 },
        { layer: layer_2, init: '19', final: 26 },
    ]

    const Keyboard = () => {
        for (let x = 0; x < keyLayers.length; x++) {
            let localInit = keyLayers[x].init;
            let localFinal = keyLayers[x].final;
            let localLayer = keyLayers[x].layer;
            for (let i = localInit; i < localFinal; i++) {
                localLayer[i] =
                    <LinearGradient
                        // Button Linear Gradient
                        colors={['#f8f9fa', '#ced4da']}
                        style={{
                            borderRadius: 6,
                            borderWidth: 1,
                            height: HeightRatio(50),
                            width: WidthRatio(35),
                        }}
                        key={i}
                    >
                        <TouchableOpacity
                            onPress={() => { setPromptGuessInput(keyContainer[i]); }}
                            key={`${layer_0}` + i}
                        >
                            <Text
                                style={{ color: '#001219', fontSize: HeightRatio(30), fontWeight: 'bold', marginLeft: WidthRatio(6) }}
                                allowFontScaling={false}
                            >
                                {keyContainer[i]}
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
            }
        }

        const MergeKeyboardLayers = () => {
            let display = []
            for (let i = 0; i < keyLayers.length; i++) {
                display[i] =
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }} key={i}>
                        {keyLayers[i].layer}
                    </View>
            }

            return display;
        }

        return (
            <View style={{ flexDirection: 'column', alignSelf: 'center', marginTop: windowHeight / 50, marginBottom: windowHeight / 10 }}>
                <MergeKeyboardLayers />
            </View>
        )
    }


    useEffect(() => {
        setPromptGuessInput(promptGuessInput)
    }, [promptGuessInput])


    const ResetAllVariables = () => {
        setWord1('')
        setWord2('')
        setRandomItems([])
        setDisplayGrid(false)
        setGuesses([])
        setIVar([])
        setPromptGuessInput([])
        setDisplayDetails(false)
        setPhonetic1('')
        setPhonetic2('')
        setDefinition0('')
        setDefinition1('')
        setDefinition2('')
        setDefinition3('')
        setDefinition4('')
        setDefinition5('')
    }

    // // GEN VERSION 1
    // const Generate = () => {
    //     ResetAllVariables();
    //     // Load the JSON file containing the words
    //     const data = require('../../wordlist.json');

    //     // Create an empty array to hold the chosen words
    //     const chosenWords = [];

    //     // Choose five random words from the list and add them to the array
    //     for (let i = 0; i < 5; i++) {
    //         // Generate a random index between 0 and the length of the words array
    //         const index = Math.floor(Math.random() * data.words.length);

    //         // Add the word at the chosen index to the array of chosen words
    //         chosenWords.push(data.words[index]);
    //     }

    //     // Update the setWords state variable with the array of chosen words
    //     setWords(chosenWords);
    //     setDisplayGrid(true)
    // }

    // GEN VERSION 2
    const Generate = () => {
        ResetAllVariables();
        // Load the JSON file containing the words
        const data = require('../../output.json');

        // Create an empty array to hold the chosen words
        const chosenWords = [];

        // Choose five random words from the list and add them to the array
        for (let i = 0; i < 5; i++) {
            // Generate a random index between 0 and the length of the words array
            const index = Math.floor(Math.random() * data.length);

            // Add the word at the chosen index to the array of chosen words
            chosenWords.push(data[index].word);
        }

        // Update the setWords state variable with the array of chosen words
        setWords(chosenWords);
        setDisplayGrid(true)
    }

    const DisplayWords = () => {
        for (let i = 0; i < words.length; i++) {
            for (let y = 0; y < 5; y++) {
                if (words[y]) {
                    for (let x in words[i]) {
                        words[y].includes(words[i][x]) ? indexArray_0.push(x) : false;
                    }
                    for (let x in words[y]) {
                        words[i].includes(words[y][x]) ? indexArray_1.push(x) : false;
                    }
                    CompArray_0.push({
                        w1: `${words[y].toUpperCase()}`,
                        w2: `${words[i].toUpperCase()}`,
                        index_0: { indexArray_0 }, index_1: { indexArray_1 }
                    })
                    indexArray_0 = [];
                    indexArray_1 = [];
                }
            }
        }

        for (let i = 0; i < CompArray_0.length; i++) {
            if (CompArray_0[i].index_0 != "") {
                CompArray_1.push(CompArray_0[i])
            }
        }

        for (let i = 0; i < CompArray_1.length; i++) {

            let filterArray_0 = CompArray_1[i].index_0.indexArray_0;
            let filterArray_1 = CompArray_1[i].index_1.indexArray_1;
            localSplitWord_1 = CompArray_1[i].w1.split('');
            localSplitWord_2 = CompArray_1[i].w2.split('');

            if (word1 == '' && word2 == '') {
                setWord1(CompArray_1[i].w1)
                setWord2(CompArray_1[i].w2)
            }

            if (localSplitWord_1.length != 5) {
                localSplitWord_1.push("")
            }
            if (localSplitWord_2.length != 5) {
                localSplitWord_1.push("")
            }

            if (CompArray_1[i].w1 != CompArray_1[i].w2) {

                if (filterArray_0.filter(el => el == 0 || 1 || 2 || 3 || 4)) {
                    if (filterArray_1.filter(el => el == 0 || 1 || 2 || 3 || 4)) {
                        for (let y = 0; y < localSplitWord_1.length; y++) {
                            for (let x = 0; x < localSplitWord_2.length; x++) {
                                if (localSplitWord_1[y] == localSplitWord_2[x]) {
                                    u0 = x * 5;
                                    u1 = y;
                                }
                            }
                        }

                        if (filterArray_0.length == 0 || filterArray_1.length == 0) {
                            Generate();

                        }
                    }


                    tempGridArray_0.splice(
                        u0,
                        1,
                        localSplitWord_1[0],
                        localSplitWord_1[1],
                        localSplitWord_1[2],
                        localSplitWord_1[3],
                        localSplitWord_1[4]
                    )

                    if (u1 == 0) {
                        tempGridArray_0.splice(0, 1, localSplitWord_2[0])
                        tempGridArray_0.splice(5, 1, localSplitWord_2[1])
                        tempGridArray_0.splice(10, 1, localSplitWord_2[2])
                        tempGridArray_0.splice(15, 1, localSplitWord_2[3])
                        tempGridArray_0.splice(20, 1, localSplitWord_2[4])
                    } else if (u1 == 1) {
                        tempGridArray_0.splice(1, 1, localSplitWord_2[0])
                        tempGridArray_0.splice(6, 1, localSplitWord_2[1])
                        tempGridArray_0.splice(11, 1, localSplitWord_2[2])
                        tempGridArray_0.splice(16, 1, localSplitWord_2[3])
                        tempGridArray_0.splice(21, 1, localSplitWord_2[4])
                    } else if (u1 == 2) {
                        tempGridArray_0.splice(2, 1, localSplitWord_2[0])
                        tempGridArray_0.splice(7, 1, localSplitWord_2[1])
                        tempGridArray_0.splice(12, 1, localSplitWord_2[2])
                        tempGridArray_0.splice(17, 1, localSplitWord_2[3])
                        tempGridArray_0.splice(22, 1, localSplitWord_2[4])
                    } else if (u1 == 3) {
                        tempGridArray_0.splice(3, 1, localSplitWord_2[0])
                        tempGridArray_0.splice(8, 1, localSplitWord_2[1])
                        tempGridArray_0.splice(13, 1, localSplitWord_2[2])
                        tempGridArray_0.splice(18, 1, localSplitWord_2[3])
                        tempGridArray_0.splice(23, 1, localSplitWord_2[4])
                    } else if (u1 == 4) {
                        tempGridArray_0.splice(4, 1, localSplitWord_2[0])
                        tempGridArray_0.splice(9, 1, localSplitWord_2[1])
                        tempGridArray_0.splice(14, 1, localSplitWord_2[2])
                        tempGridArray_0.splice(19, 1, localSplitWord_2[3])
                        tempGridArray_0.splice(24, 1, localSplitWord_2[4])
                    }
                    break;
                }

            }

        }

        for (let i = 0; i < 25; i++) {
            buttonArray[i] =
                <View key={i}>
                    {tempGridArray_0[i] != "" ?
                        <>
                            {tempGridArray_0[i] == undefined ?
                                <LinearGradient
                                    // Button Linear Gradient
                                    colors={['#f8f9fa', '#ced4da']}
                                    style={Styling.gridBlock}
                                >
                                    <TouchableOpacity
                                        onPress={() => console.log(i)}
                                    >
                                        <Text style={Styling.letters} allowFontScaling={false}>{tempGridArray_0[i]}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                :
                                <>
                                    {i == iVar[0] || i == iVar[1] || i == iVar[2] || i == iVar[3] || i == iVar[4] || i == iVar[5] || i == iVar[6] || i == iVar[7] || i == iVar[8] || i == iVar[9] || i == iVar[10] || i == iVar[11] ?
                                        <LinearGradient
                                            // Button Linear Gradient
                                            colors={['#aacc00', '#80b918']}
                                            style={Styling.gridBlock}
                                        >
                                            <TouchableOpacity
                                                onPress={() => console.log(i)}

                                            >
                                                <Text style={Styling.letters} allowFontScaling={false}>{tempGridArray_0[i]}</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                        :
                                        <>
                                            <LinearGradient
                                                // Button Linear Gradient
                                                colors={['#ffba08', '#faa307']}
                                                style={Styling.gridBlock}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => console.log(i)}

                                                >
                                                    {i == (u0 + u1) ?
                                                        <Text style={Styling.letters} allowFontScaling={false}>{tempGridArray_0[i]}</Text>
                                                        :
                                                        null
                                                    }
                                                </TouchableOpacity>
                                            </LinearGradient>
                                        </>
                                    }
                                </>
                            }
                        </>
                        :
                        <LinearGradient
                            // Button Linear Gradient
                            colors={['#f8f9fa', '#ced4da']}
                            style={Styling.gridBlock}
                        >
                            <TouchableOpacity
                                onPress={() => console.log(i)}
                            ></TouchableOpacity>
                        </LinearGradient>
                    }
                </View>
        }

    }
    DisplayWords();

    const CheckArray = (guess) => {
        if (!guesses.includes(guess)) {
            setGuesses(guesses => [...guesses, guess])
            for (let i = 0; i < tempGridArray_0.length; i++) {
                if (promptGuessInput == tempGridArray_0[i]) {
                    setIVar(iVar => [...iVar, i]);
                }
            }
        }
    }

    const PreviousGuess = () => {
        for (let i = 0; i < guesses.length; i++) {
            storedGuesses.splice(i, 1, guesses[i])
        }

        for (let i = 0; i < 12; i++) {
            guessBoxes[i] =
                <View key={i}>
                    {tempGridArray_0.includes(`${storedGuesses[i]}`) ?
                        <>
                            {storedGuesses[i] != "" ?
                                <View
                                    style={{
                                        backgroundColor: '#8ac926',
                                        ...Styling.guessBlocks
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontWeight: 'bold',
                                            fontSize: HeightRatio(25),
                                        }}
                                        allowFontScaling={false}
                                    >
                                        {storedGuesses[i]}
                                    </Text>
                                </View>
                                :
                                <View
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                        ...Styling.guessBlocks
                                    }}
                                >
                                </View>
                            }
                        </>
                        :
                        // Wrong guesses
                        <View
                            style={{
                                backgroundColor: '#ff595e',
                                ...Styling.guessBlocks
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: HeightRatio(25),
                                }}
                                allowFontScaling={false}
                            >
                                {storedGuesses[i]}
                            </Text>
                        </View>
                    }
                </View>
        }

        return (
            <View
                style={{
                    // width: WidthRatio(230),
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                {guessBoxes}
            </View>
        )



    }

    const cleanArrays = (arr1, arr2) => {
        const removeEmptyStrings = (arr) => {
            return arr.filter(str => str !== '');
        }
        let newArr1 = removeEmptyStrings(arr1);

        evaluateArrays(newArr1, arr2);
    }


    const evaluateArrays = (arr1, arr2) => {
        // First, determine which array is shorter and which is longer
        let arr1Filtered = arr1.filter(item => item !== undefined);
        let arr2Filtered = arr2.filter(item => item !== undefined);
        let uniqueArr = [];

        const removeDuplicates = (arr) => {
            // create a Set to store unique values
            const uniqueValues = new Set();

            // loop through the array and add each value to the Set
            for (let i = 0; i < arr.length; i++) {
                uniqueValues.add(arr[i]);
            }

            // return an array of the unique values
            return [...uniqueValues];
        }
        uniqueArr = removeDuplicates(arr1Filtered);

        const arraysAreEquivalent = (arr1, arr2) => {
            // First, check if the arrays have the same length. If not, they cannot be equivalent.
            if (arr1.length !== arr2.length) {
                return false;
            }

            // Sort the arrays so that their elements are in a consistent order.
            arr1.sort();
            arr2.sort();

            // Now that the arrays are sorted, we can simply iterate over their elements
            // and compare them to determine if they are equivalent.
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }

            // If we reach this point, the arrays are equivalent.
            return true;
        }

        const compareAndRemoveDiscrepancies = (arr1, arr2) => {
            // Create a copy of arr1 so we don't modify the original array
            const result = [...arr1];

            // Loop through each element in arr2
            for (let i = 0; i < arr2.length; i++) {
                // Check if the current element exists in arr1
                const index = result.indexOf(arr2[i]);
                if (index > -1) {
                    // If the element exists, remove it from the result array
                    result.splice(index, 1);
                }
            }

            // Return the array without any discrepancies
            return result;
        }

        const result_0 = arraysAreEquivalent(uniqueArr, arr2Filtered);
        if (result_0) {
            // console.log("Congrats, perfect score!")
            setAwardExtraPoints(true)
            end();
        }

        const modify_0 = compareAndRemoveDiscrepancies(arr2Filtered, uniqueArr)
        const modify_1 = arr2Filtered.filter((item) => !modify_0.includes(item))
        const result_1 = arraysAreEquivalent(uniqueArr, modify_1)
        if (result_1 && !result_0) {
            // console.log(`Nice, you only got ${modify_0.length} wrong.`)
            setAwardExtraPoints(true)
            end();
        }

        if (guesses.length == 12) {
            // console.log("You have run out of guesses.")
            setAwardExtraPoints(false)
            end();
        }

        return true;
    };


    const ScoreCalculator = () => {
        const filteredArray = tempGridArray_0.filter(element => element !== "");
        const unique = filteredArray.filter((item, index) => filteredArray.indexOf(item) === index);

        let localTimeTaken;
        let localScore;
        //  Identify how many guess were correct
        for (let i = 0; i < guesses.length; i++) {
            if (tempGridArray_0.includes(`${storedGuesses[i]}`)) {
                correctAnswers = correctAnswers + 1
            } else {
                incorrectAnswers = incorrectAnswers + 1
            }

        }
        setStoreCorrectAnswers(correctAnswers)
        setStoreIncorrectAnswers(incorrectAnswers)

        localTimeTaken = Math.trunc((endTime - startTime) / 1000);
        setTimeTaken(localTimeTaken);
        // Calculate the score as a percentage of correct answers
        // setScore(Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100));

        // If the time taken is less than 60 seconds, add a bonus to the score
        if (localTimeTaken < 30 && awardExtraPoints) {
            localScore = Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) + 20;
            setExtraPoints(100);

        } else if (localTimeTaken >= 30 && localTimeTaken < 60 && awardExtraPoints) {
            localScore = Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) + 10;
            setExtraPoints(80);

        } else if (localTimeTaken >= 60 && localTimeTaken < 90 && awardExtraPoints) {
            localScore = Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) + 5;
            setExtraPoints(40);

        } else if (localTimeTaken >= 90 && localTimeTaken < 120 && awardExtraPoints) {
            localScore = Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) + 5;
            setExtraPoints(20);

        } else if (localTimeTaken >= 120 && localTimeTaken < 150 && awardExtraPoints) {
            localScore = Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) + 5;
            setExtraPoints(10);

        } else if (localTimeTaken >= 150 && awardExtraPoints) {
            localScore = Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) + 5;
            setExtraPoints(5);

        } else {
            localScore = Math.trunc((correctAnswers / (correctAnswers + incorrectAnswers)) * 100);
            console.log("NO EXTRA")
        }

        if (displayLeftRightHint) {
            localScore = localScore - 10;
            setLeftRightHintReduction(-10)
        }
        if (displayTopBottomHint) {
            localScore = localScore - 10;
            setTopBottomHintReduction(-10)
        }

        console.log("TIME TAKEN: " + localTimeTaken)

        setScore(localScore);

        handleAddGame(word1, word2, localTimeTaken, localScore);

        setModalVisible(true)
    };


    function searchWord1(word) {
        const data = require('../../output.json');
        // console.log(word.toLowerCase())
        const wordObject = data.find(obj => obj.word === word.toLowerCase());

        console.log(wordObject)

        setPhonetic1(wordObject.phonetic)

        const updateDefState = (i, value) => {
            switch (i) {
                case 0: setDefinition0(value); break;
                case 1: setDefinition1(value); break;
                case 2: setDefinition2(value); break;
                default: break;
            }
        }

        for (let i = 0; i < 3; i++) {
            console.log(wordObject.definition[i])
            updateDefState(i, wordObject.definition[i] || "");

        }

        // 

        // const API_ENDPOINT = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        // // Use Axios to fetch the word from the dictionary API
        // axios.get(API_ENDPOINT)
        //     .then(response => {
        //         if (response && response.data &&
        //             response.data[0] && response.data[0].phonetic) {
        //             // console.log("Phonetic")
        //             // console.log(response.data[0].phonetic)
        //             setPhonetic1(response.data[0].phonetic)
        //         }
        //         if (response && response.data &&
        //             response.data[0] && response.data[0].meanings &&
        //             response.data[0].meanings[0] &&
        //             response.data[0].meanings[0].definitions &&
        //             response.data[0].meanings[0].definitions[0]) {
        //             // console.log("Definition 1")
        //             // console.log(response.data[0].meanings[0].definitions[0].definition)
        //             setDefinition0(response.data[0].meanings[0].definitions[0].definition)
        //         }
        //         if (response && response.data &&
        //             response.data[0] && response.data[0].meanings &&
        //             response.data[0].meanings[0] &&
        //             response.data[0].meanings[0].definitions &&
        //             response.data[0].meanings[0].definitions[1]) {
        //             // console.log("Definition 2")
        //             // console.log(response.data[0].meanings[0].definitions[1].definition)
        //             setDefinition1(response.data[0].meanings[0].definitions[1].definition)
        //         }
        //         if (response && response.data &&
        //             response.data[0] && response.data[0].meanings &&
        //             response.data[0].meanings[0] &&
        //             response.data[0].meanings[0].definitions &&
        //             response.data[0].meanings[0].definitions[2]) {
        //             // console.log("Definition 3")
        //             // console.log(response.data[0].meanings[0].definitions[2].definition)
        //             setDefinition2(response.data[0].meanings[0].definitions[2].definition)
        //         }
        //         // console.log("_________1__________")
        //     })
        //     .catch(error => {
        //         // Handle any errors
        //         console.error(error);
        //     });

    }
    function searchWord2(word) {
        const API_ENDPOINT = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;


        // Use Axios to fetch the word from the dictionary API
        axios.get(API_ENDPOINT)
            .then(response => {
                // Do something with the data, such as display the definition
                // console.log("__________2_________")
                if (response && response.data &&
                    response.data[0] && response.data[0].phonetic) {
                    // console.log("Phonetic")
                    // console.log(response.data[0].phonetic)
                    setPhonetic2(response.data[0].phonetic)
                }
                if (response && response.data &&
                    response.data[0] && response.data[0].meanings &&
                    response.data[0].meanings[0] &&
                    response.data[0].meanings[0].definitions &&
                    response.data[0].meanings[0].definitions[0]) {
                    // console.log("Definition 1")
                    // console.log(response.data[0].meanings[0].definitions[0].definition)
                    setDefinition3(response.data[0].meanings[0].definitions[0].definition)
                }
                if (response && response.data &&
                    response.data[0] && response.data[0].meanings &&
                    response.data[0].meanings[0] &&
                    response.data[0].meanings[0].definitions &&
                    response.data[0].meanings[0].definitions[1]) {
                    // console.log("Definition 2")
                    // console.log(response.data[0].meanings[0].definitions[1].definition)
                    setDefinition4(response.data[0].meanings[0].definitions[1].definition)
                }
                if (response && response.data &&
                    response.data[0] && response.data[0].meanings &&
                    response.data[0].meanings[0] &&
                    response.data[0].meanings[0].definitions &&
                    response.data[0].meanings[0].definitions[2]) {
                    // console.log("Definition 3")
                    // console.log(response.data[0].meanings[0].definitions[2].definition)
                    setDefinition5(response.data[0].meanings[0].definitions[2].definition)
                }
                // console.log("_________2__________")
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });

    }

    useEffect(() => {
        if (startTime) {
            cleanArrays(tempGridArray_0, guesses)
        }
    }, [guesses])

    useEffect(() => {
        if (endTime) {
            ScoreCalculator();
        }
    }, [endTime])





    return (
        <>
            <View style={Styling.container}>
                <Navbar nav={navigation} auth={authState} position={'relative'} from={'game'} />
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

                <View
                    style={{
                        alignSelf: 'center',
                        marginTop: WidthRatio(30)

                    }}
                >
                    <View style={{ flexDirection: 'column' }}>

                        {/* - - - - - - - - - - - - - -  */}
                        {/* Crossword Grid / Placeholder */}
                        {/* - - - - - - - - - - - - - -  */}
                        {displayGrid ?
                            <>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        marginTop: HeightRatio(8),
                                        width: windowWidth * 0.8
                                    }}
                                >
                                    {buttonArray}
                                </View>
                                <TouchableOpacity
                                    onPress={() => { console.log("Q? T -> B"); setHintTopBottomModal(true) }}
                                    style={{
                                        position: 'absolute',
                                        borderRadius: 100,
                                        height: HeightRatio(40),
                                        width: HeightRatio(40),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 5,
                                        top: HeightRatio(8) - HeightRatio(35),
                                        left: ((windowWidth * 0.14) * (u1 + 1)) + (u1 * 2) + ((windowWidth * 0.07) - HeightRatio(20))
                                    }}
                                >
                                    <View

                                    >
                                        {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: HeightRatio(20) }}>?</Text> */}
                                        <Image
                                            style={{ height: HeightRatio(50), width: HeightRatio(50) }}
                                            source={require('../../assets/qmark.png')}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { console.log("Q? L -> R"); setHintLeftRightModal(true) }}
                                    style={{
                                        position: 'absolute',
                                        borderRadius: 100,
                                        height: HeightRatio(40),
                                        width: HeightRatio(40),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 5,
                                        top: HeightRatio(8) + ((windowWidth * 0.14) * ((u0) / 5)) + ((u0 / 5) * 2) + HeightRatio(20),
                                        left: WidthRatio(13)
                                    }}
                                >
                                    <View

                                    >
                                        {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: HeightRatio(20) }}>?</Text> */}
                                        <Image
                                            style={{ height: HeightRatio(50), width: HeightRatio(50) }}
                                            source={require('../../assets/qmark.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                                {/* - - - - - - - - - - - - - -  */}
                                {/* Guess Area */}
                                {/* - - - - - - - - - - - - - -  */}
                                <View
                                    style={{
                                        // flexDirection: 'row',
                                        // alignSelf: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: HeightRatio(8),
                                        width: windowWidth,
                                        alignSelf: 'center',
                                        // backgroundColor: 'red'
                                    }}
                                >
                                    {/* - - - - - - - - - - - - - -  */}
                                    {/* Guess Box */}
                                    {/* - - - - - - - - - - - - - -  */}
                                    <View style={{ flexDirection: 'column' }}>

                                        <TouchableOpacity
                                            disabled={promptGuessInput == '' ? true : false}
                                            onPress={() => { CheckArray(promptGuessInput); setPromptGuessInput([]) }}
                                        >
                                            <Image
                                                style={{ height: HeightRatio(25), width: WidthRatio(60), position: 'absolute', zIndex: 10, top: -12, left: -8 }}
                                                source={require('../../assets/click.png')}
                                            />
                                            <View
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    ...Styling.guessBlock
                                                }}
                                            >
                                                <Text
                                                    style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(45), fontWeight: 'bold' }}
                                                    allowFontScaling={false}
                                                >
                                                    {promptGuessInput}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/* <View style={{alignSelf: 'center'}}>
                                    <Text style={{color: 'white', fontSize: HeightRatio(18), fontWeight: 'bold'}}>Enter</Text>
                                </View> */}
                                    </View>
                                    {/* - - - - - - - - - - - - - -  */}
                                    {/* Previous Guesses */}
                                    {/* - - - - - - - - - - - - - -  */}
                                    <View
                                        style={{
                                            width: WidthRatio(200),
                                            marginLeft: WidthRatio(4),
                                            marginRight: WidthRatio(4),
                                        }}
                                    >
                                        <PreviousGuess />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        // position: 'absolute',
                                        // bottom: HeightRatio(-250),
                                        alignSelf: 'center',
                                        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                    }}
                                >
                                    <Keyboard />
                                </View>
                            </>
                            :
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    height: windowWidth * 0.833,
                                    width: windowWidth * 0.833,
                                    margin: 10,
                                }}
                            >
                                {/* - - - - - - - - - - - - - -  */}
                                {/* BUTTON: New Game */}
                                {/* - - - - - - - - - - - - - -  */}
                                <TouchableOpacity
                                    onPress={() => { Generate(); start(); }}
                                    style={{
                                        borderWidth: 2,
                                        borderColor: 'white',
                                        width: WidthRatio(320),
                                        height: HeightRatio(600),
                                        borderRadius: WidthRatio(20),
                                    }}
                                >
                                    {/* <LinearGradient
                                // Button Linear Gradient
                                colors={['#aacc00', '#80b918']}
                                style={{ ...Styling.modalWordButton, height: HeightRatio(400) }}
                            > */}
                                    <FontAwesomeIcon
                                        icon={faSolid, faGamepad}
                                        style={{
                                            ...Styling.modalFontAwesomeIcons,
                                            color: 'white',
                                            marginTop: WidthRatio(90),
                                        }}
                                        size={260}
                                    />
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: WidthRatio(60),
                                            alignSelf: 'center',
                                            // justifyContent: 'center',
                                            // margin: 4
                                        }}
                                        allowFontScaling={false}
                                    >
                                        New Game
                                    </Text>
                                    {/* </LinearGradient> */}
                                </TouchableOpacity>
                            </View>
                        }



                    </View>

                    {hintTopBottomModal &&
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={hintTopBottomModal}
                            onRequestClose={() => {
                                setHintTopBottomModal(!hintTopBottomModal);
                            }}
                        >
                            {/* [[[TOP ROW]]] */}
                            <LinearGradient
                                // Button Linear Gradient
                                colors={['#002855', '#001219']}
                                // style={Styling.modalWordButton}
                                style={{ ...Styling.modalView, alignSelf: 'center' }}
                            >
                                <View
                                    style={{
                                        backgroundColor: 'rgba(255, 0, 0, 1)',
                                        alignSelf: 'center',
                                        borderRadius: 8,
                                        position: 'absolute',
                                        zIndex: 10,
                                        top: -1,
                                        right: -1
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => { setHintTopBottomModal(!hintTopBottomModal) }}
                                        style={{
                                            borderRadius: 10,
                                            height: 50,
                                            width: 50
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faX}
                                            style={{
                                                color: 'black',
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                                marginTop: 17
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/* [[[MIDDLE ROW]]] */}
                                <SafeAreaView style={{}}>
                                    <ScrollView style={Styling.gameScrollView}>
                                        <View
                                            style={{ flexDirection: 'column', marginTop: 10, marginBottom: 10 }}
                                        >
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: HeightRatio(20), marginBottom: HeightRatio(20), marginLeft: WidthRatio(20) }}>
                                                <Text
                                                    style={{ color: 'white', fontSize: HeightRatio(40), fontWeight: 'bold', width: WidthRatio(280) }}
                                                    allowFontScaling={false}>
                                                    Warning:
                                                </Text>
                                                <Text
                                                    style={{ color: 'white', fontSize: HeightRatio(30), width: WidthRatio(280), alignSelf: 'center' }}
                                                >
                                                    Selecting hint reduces your score by 10 points!
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => { searchWord2(word2); setDisplayTopBottomHint(true); }}
                                                // style={Styling.modalWordButton}
                                                disabled={!displayTopBottomHint ? false : true}
                                            >
                                                <Image
                                                    style={{ height: 150, width: 150 }}
                                                    source={require('../../assets/hint.png')}
                                                />
                                            </TouchableOpacity>
                                            <View style={{ width: WidthRatio(280), alignSelf: 'center' }}>
                                                {definition3 != '' || definition4 != '' || definition5 != '' ?
                                                    <View>
                                                        <Text style={Styling.modalContentHeader}>
                                                            Definitions
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                {definition3 != '' ?
                                                    <View
                                                        style={{ flexDirection: 'row', marginBottom: 10 }}
                                                    >

                                                        <Text style={Styling.modalContent}>
                                                            {definition3}
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                {definition4 != '' ?
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                    >
                                                        <Text style={Styling.modalContent}>
                                                            {definition4}
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                {definition5 != '' ?
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                    >
                                                        <Text style={Styling.modalContent}>
                                                            {definition5}
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                            </View>

                                        </View>
                                    </ScrollView>
                                </SafeAreaView>
                            </LinearGradient>
                        </Modal>
                    }

                    {hintLeftRightModal &&
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={hintLeftRightModal}
                            onRequestClose={() => {
                                setHintLeftRightModal(!hintLeftRightModal);
                            }}
                        >
                            {/* [[[TOP ROW]]] */}
                            <LinearGradient
                                // Button Linear Gradient
                                colors={['#002855', '#001219']}
                                // style={Styling.modalWordButton}
                                style={{ ...Styling.modalView, alignSelf: 'center' }}
                            >
                                <View
                                    style={{
                                        backgroundColor: 'rgba(255, 0, 0, 1)',
                                        alignSelf: 'center',
                                        borderRadius: 8,
                                        position: 'absolute',
                                        zIndex: 10,
                                        top: -1,
                                        right: -1
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => { setHintLeftRightModal(!hintLeftRightModal) }}
                                        style={{
                                            borderRadius: 10,
                                            height: 50,
                                            width: 50
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faX}
                                            style={{
                                                color: 'black',
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                                marginTop: 17
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/* [[[MIDDLE ROW]]] */}
                                <SafeAreaView style={Styling.container}>
                                    <ScrollView style={Styling.gameScrollView}>
                                        <View
                                            style={{ flexDirection: 'column', marginTop: 10, marginBottom: 10 }}
                                        >
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: HeightRatio(20), marginBottom: HeightRatio(20), marginLeft: WidthRatio(20) }}>
                                                <Text
                                                    style={{ color: 'white', fontSize: HeightRatio(40), fontWeight: 'bold', width: WidthRatio(280) }}
                                                    allowFontScaling={false}
                                                >
                                                    Warning:
                                                </Text>
                                                <Text style={{ color: 'white', fontSize: HeightRatio(30), width: WidthRatio(280), alignSelf: 'center' }}>
                                                    Selecting hint reduces your score by 10 points!
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => { searchWord1(word1); setDisplayLeftRightHint(true); }}
                                                // style={Styling.modalWordButton}
                                                disabled={!displayLeftRightHint ? false : true}
                                            >
                                                <Image
                                                    style={{ height: 150, width: 150 }}
                                                    source={require('../../assets/hint.png')}
                                                />
                                            </TouchableOpacity>
                                            <View style={{ width: WidthRatio(280), alignSelf: 'center' }}>
                                                {definition0 != '' || definition1 != '' || definition2 != '' ?
                                                    <View>
                                                        <Text style={Styling.modalContentHeader}>
                                                            Definitions
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                {definition0 != '' ?
                                                    <View
                                                        style={{ flexDirection: 'row', marginBottom: 10 }}
                                                    >

                                                        <Text style={Styling.modalContent}>
                                                            {definition0}
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                {definition1 != '' ?
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                    >
                                                        <Text style={Styling.modalContent}>
                                                            {definition1}
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                {definition2 != '' ?
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                    >
                                                        <Text style={Styling.modalContent}>
                                                            {definition2}
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                }
                                            </View>

                                        </View>
                                    </ScrollView>
                                </SafeAreaView>
                            </LinearGradient>
                        </Modal>
                    }

                    {/* - - - - - - - - - - - - - -  */}
                    {/* [[[  RESULT MODAL  ]]] */}
                    {/* - - - - - - - - - - - - - -  */}
                    {modalVisible &&
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >

                            <View style={Styling.gameCenteredView}>
                                <View>
                                    {/* [[[TOP ROW]]] */}
                                    <LinearGradient
                                        // Button Linear Gradient
                                        colors={['#002855', '#001219']}
                                        // style={Styling.modalWordButton}
                                        style={Styling.modalView}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(255, 0, 0, 1)',
                                                alignSelf: 'center',
                                                borderRadius: 8,
                                                position: 'absolute',
                                                zIndex: 10,
                                                top: -1,
                                                right: -1
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => { setModalVisible(!modalVisible); navigation.dispatch(resetActionGame); }}
                                                style={{
                                                    borderRadius: 10,
                                                    height: 50,
                                                    width: 50
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSolid, faX}
                                                    style={{
                                                        color: 'black',
                                                        justifyContent: 'center',
                                                        alignSelf: 'center',
                                                        marginTop: 17
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        {/* [[[MIDDLE ROW]]] */}
                                        <SafeAreaView style={Styling.container}>
                                            <ScrollView style={Styling.gameScrollView}>
                                                <View
                                                    style={{ flexDirection: 'column' }}
                                                >
                                                    {/* WORDS */}
                                                    {/* WORD 1 */}
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                    >

                                                        <TouchableOpacity
                                                            onPress={() => { searchWord1(word1); searchWord2(word2); setDisplayDetails(true); }}
                                                            // style={Styling.modalWordButton}
                                                            disabled={!displayDetails ? false : true}
                                                        >
                                                            <LinearGradient
                                                                // Button Linear Gradient
                                                                colors={['#aacc00', '#80b918']}
                                                                style={Styling.modalWordButton}
                                                            >
                                                                <Text
                                                                    style={Styling.modalWordButtonText}
                                                                    allowFontScaling={false}
                                                                >
                                                                    {word1}
                                                                </Text>
                                                                <FontAwesomeIcon
                                                                    icon={faSolid, faCaretDown}
                                                                    style={{ ...Styling.modalFontAwesomeIcons, color: '#001219', marginLeft: 10 }}
                                                                    size={20}
                                                                />
                                                            </LinearGradient>
                                                        </TouchableOpacity>

                                                    </View>

                                                    <View style={{ marginLeft: 20 }}>
                                                        {displayDetails &&
                                                            <View>
                                                                {phonetic1 != '' ?
                                                                    <>
                                                                        <Text style={Styling.modalContentHeader}>
                                                                            Phonetic
                                                                        </Text>
                                                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                                                                            <Text style={Styling.modalContent}>
                                                                                {phonetic1}
                                                                            </Text>
                                                                        </View>
                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                                {definition0 != '' || definition1 != '' || definition2 != '' ?
                                                                    <View>
                                                                        <Text style={Styling.modalContentHeader}>
                                                                            Definitions
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                                {definition0 != '' ?
                                                                    <View
                                                                        style={{ flexDirection: 'row', marginBottom: 10 }}
                                                                    >

                                                                        <Text style={Styling.modalContent}>
                                                                            {definition0}
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                                {definition1 != '' ?
                                                                    <View
                                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                                    >
                                                                        <Text style={Styling.modalContent}>
                                                                            {definition1}
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                                {definition2 != '' ?
                                                                    <View
                                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                                    >
                                                                        <Text style={Styling.modalContent}>
                                                                            {definition2}
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                            </View>
                                                        }
                                                    </View>
                                                    {/* WORD 2 */}
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                    >
                                                        <View
                                                            style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                        >
                                                            <TouchableOpacity
                                                                onPress={() => { searchWord1(word1); searchWord2(word2); setDisplayDetails(true); }}
                                                                // style={Styling.modalWordButton}
                                                                disabled={!displayDetails ? false : true}
                                                            >
                                                                <LinearGradient
                                                                    // Button Linear Gradient
                                                                    colors={['#aacc00', '#80b918']}
                                                                    style={Styling.modalWordButton}
                                                                >
                                                                    <Text
                                                                        style={Styling.modalWordButtonText}
                                                                        allowFontScaling={false}
                                                                    >
                                                                        {word2}
                                                                    </Text>
                                                                    <FontAwesomeIcon
                                                                        icon={faSolid, faCaretDown}
                                                                        style={{ ...Styling.modalFontAwesomeIcons, color: '#001219', marginLeft: 10 }}
                                                                        size={20}
                                                                    />
                                                                </LinearGradient>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginLeft: 20 }}>
                                                        {displayDetails &&
                                                            <>
                                                                {phonetic2 != '' ?
                                                                    <>
                                                                        <Text style={Styling.modalContentHeader}>
                                                                            Phonetic
                                                                        </Text>
                                                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                                                                            <Text style={Styling.modalContent}>
                                                                                {phonetic2}
                                                                            </Text>
                                                                        </View>
                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                                {definition3 != '' || definition4 != '' || definition5 != '' ?
                                                                    <View>
                                                                        <Text style={Styling.modalContentHeader}>
                                                                            Definitions
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                                {definition3 != '' ?
                                                                    <View
                                                                        style={{ flexDirection: 'row', marginBottom: 10 }}
                                                                    >

                                                                        <Text style={Styling.modalContent}>
                                                                            {definition3}
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                                {definition4 != '' ?
                                                                    <View
                                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                                    >
                                                                        <Text style={Styling.modalContent}>
                                                                            {definition4}
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                                {definition5 != '' ?
                                                                    <View
                                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                                                    >
                                                                        <Text style={Styling.modalContent}>
                                                                            {definition5}
                                                                        </Text>
                                                                    </View>
                                                                    :
                                                                    null
                                                                }
                                                            </>
                                                        }
                                                    </View>

                                                    <View style={Styling.modalDivisionLine}></View>
                                                    {/* TIME */}
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, marginLeft: 20 }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faClock}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: 'white' }}
                                                            size={30}
                                                        />
                                                        <Text
                                                            style={Styling.modalScoringVarText}
                                                            allowFontScaling={false}>
                                                            Time: {timeTaken} seconds
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignSelf: 'center',
                                                            marginTop: 10,
                                                            marginBottom: 10
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faGift}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f9c74f' }}
                                                            size={30}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: 40,
                                                                fontWeight: 'bold',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            + {extraPoints} points
                                                        </Text>
                                                    </View>
                                                    {extraPoints != 0 &&
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: 20,
                                                                fontWeight: 'bold',
                                                                alignSelf: 'center',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            Bonus points!
                                                        </Text>
                                                    }
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignSelf: 'center',
                                                            marginTop: 10,
                                                            marginBottom: 10
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faSquareMinus}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f9c74f' }}
                                                            size={30}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: 40,
                                                                fontWeight: 'bold',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {leftRightHintReduction} points
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            color: '#f9c74f',
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            alignSelf: 'center',
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Left to Right hint reduction.
                                                    </Text>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignSelf: 'center',
                                                            marginTop: 10,
                                                            marginBottom: 10
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faSquareMinus}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f9c74f' }}
                                                            size={30}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: 40,
                                                                fontWeight: 'bold',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {topBottomHintReduction} points
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            color: '#f9c74f',
                                                            fontSize: 20,
                                                            fontWeight: 'bold',
                                                            alignSelf: 'center',
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Top to Bottom hint reduction.
                                                    </Text>

                                                    <View style={Styling.modalDivisionLine}></View>
                                                    {/* CORRECT */}
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, marginLeft: 20 }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faCheck}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#90be6d' }}
                                                            size={30}
                                                        />
                                                        <Text
                                                            style={Styling.modalScoringVarText}
                                                            allowFontScaling={false}
                                                        >
                                                            Correct: {storeCorrectAnswers}
                                                        </Text>
                                                    </View>

                                                    {/* INCORRECT */}
                                                    <View
                                                        style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, marginLeft: 20 }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faX}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f94144' }}
                                                            size={30}
                                                        />
                                                        <Text
                                                            style={Styling.modalScoringVarText}
                                                        >
                                                            Incorrect: {storeIncorrectAnswers}
                                                        </Text>
                                                    </View>

                                                    <View style={Styling.modalDivisionLine}></View>
                                                    {/* SCORE */}
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            marginTop: 10,
                                                            marginBottom: 10,
                                                            marginLeft: 20
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faFlagCheckered}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#277da1' }}
                                                            size={30}
                                                        />
                                                        <Text
                                                            style={Styling.modalScoringVarText}
                                                        >
                                                            Score: {score}
                                                        </Text>
                                                    </View>
                                                    <View style={{ marginBottom: 200 }}></View>

                                                </View>
                                            </ScrollView>
                                        </SafeAreaView>
                                    </LinearGradient>
                                </View>

                            </View>
                        </Modal>
                    }
                </View>

            </View>
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
