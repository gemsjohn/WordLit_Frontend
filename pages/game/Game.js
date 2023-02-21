import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext, useRef, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { shuffle } from 'lodash';
import axios from 'axios';
import { ADD_GAME } from '../../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import { CommonActions, useTheme } from '@react-navigation/native';
import { Styling, HeightRatio, WidthRatio, windowHeight, windowWidth } from '../../Styling';
import { Navbar } from '../../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStateContext } from '../../App';
import {
    Stylingheet,
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

export const GameScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);

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

    const authState = useRef(false);
    const userID = useRef(null);

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const [addGame] = useMutation(ADD_GAME);

    const [selectedColor, setSelectedColor] = useState(null);
    const [currentGuess, setCurrentGuess] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);

    const [inputInit, setInputInit] = useState([])
    const [words, setWords] = useState([])
    const [word1, setWord1] = useState('');
    const [word2, setWord2] = useState('');
    const [bothWordsSelected, setBothWordsSelected] = useState(false)
    const [letterOptionDisplay, setLetterOptionDisplay] = useState([])
    const [revealOptions, setRevealOptions] = useState(false);

    const [iVar, setIVar] = useState([]);
    const [promptGuessInput, setPromptGuessInput] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [displayGrid, setDisplayGrid] = useState(false)
    const [randomItems, setRandomItems] = useState([]);
    const [flashScore, setFlashScore] = useState(false);
    const [seePreviousScore, setSeePreviousScore] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const [expandScoreDetails, setExpandScoreDetails] = useState(false)

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
    const start = () => { setStartTime(Date.now()); };
    const end = () => { setEndTime(Date.now()) };

    // REACT Navigation
    const resetActionGame = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Game', params: {} }]
    });

    useLayoutEffect(() => {
        Generate();
    }, [])


    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result && authState) {
            return;
        } else if (!result && authState.current) {
            setDisplaySetUpCosmicKeyModal(true)
        }
    }

    // ADD_GAME
    useEffect(() => {
        setBothWordsSelected(false)

        refetch();
        setTimeout(() => {
            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;
            getValueFor('cosmicKey')
        }, 500)

    }, [])

    const handleAddGame = async (w1, w2, t, s) => {
        if (authState.current == true && userID.current != null) {
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

    const [selected, setSelected] = useState(null);
    const [count, setCount] = useState(0);
    const [letter, setLetter] = useState('');

    const TelephonePad = () => {
        const buttons = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            // ['*', '0', '#']
        ];
        const letters = {
            '2': ['A', 'B', 'C'],
            '3': ['D', 'E', 'F'],
            '4': ['G', 'H', 'I'],
            '5': ['J', 'K', 'L'],
            '6': ['M', 'N', 'O'],
            '7': ['P', 'Q', 'R', 'S'],
            '8': ['T', 'U', 'V'],
            '9': ['W', 'X', 'Y', 'Z']
        };

        const handlePress = (button) => {
            if (button == '1' || button == '*' || button == '0' || button === '#') {
                console.log("#1")
            } else {
                if (selected !== button) {
                    setSelected(button);
                    let test = letters[button]
                    setLetter(test[(0) % letters[button].length])
                    setCount(1)
                } else {
                    let test = letters[button]
                    setLetter(test[(count) % letters[button].length])
                    setCount(count + 1)
                }
            }
        }

        return (
            <View style={{ flexDirection: 'column', alignSelf: 'center', marginTop: 200, marginBottom: 80 }}>
                {buttons.map((row, index) => (
                    <View key={index} style={Styling.row}>
                        {row.map((button) => (
                            <TouchableOpacity
                                key={button}
                                style={selected === button ? Styling.telePadButtonSelected : Styling.telePadButton}
                                onPress={() => handlePress(button)}
                            >
                                <View style={Styling.row}>
                                    <Text style={{ ...Styling.telePadButtonText, margin: 4 }}>
                                        {/* {selected === button ? letters[button][count]: button} */}
                                        {button}
                                    </Text>
                                    <Text style={{ ...Styling.telePadButtonText, margin: 4 }}>
                                        {letters[button]}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        );
    }

    useEffect(() => {
        setPromptGuessInput(letter)
    }, [count && letter])


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

                // console.log("- - - - - - - - - ")
                // console.log("WORDS: ")
                // console.log("#1: " + CompArray_1[i].w1)
                // console.log("#2: " + CompArray_1[i].w2)
                // console.log("- - - - - - - - - ")

                setBothWordsSelected(true)

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
                                    // colors={['#f8f9fa', '#ced4da']}
                                    colors={['rgba(248, 249, 250, 0.75)', 'rgba(206, 212, 218, 0.75)']}
                                    style={Styling.gridBlock}
                                >
                                    <TouchableOpacity
                                        onPress={() => console.log(i)}
                                    >
                                        <Text style={Styling.letters} allowFontScaling={false} accessible={true} accessibilityLabel="Blank block.">{tempGridArray_0[i]}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                :
                                <>
                                    {i == iVar[0] || i == iVar[1] || i == iVar[2] || i == iVar[3] || i == iVar[4] || i == iVar[5] || i == iVar[6] || i == iVar[7] || i == iVar[8] || i == iVar[9] || i == iVar[10] || i == iVar[11] ?
                                        <LinearGradient
                                            // Button Linear Gradient
                                            colors={['#19d0bf', '#19d0bf']}
                                            style={Styling.gridBlock}
                                        >
                                            <TouchableOpacity
                                                onPress={() => console.log(i)}
                                                accessible={true} accessibilityLabel="Correct block."
                                            >
                                                <Text style={Styling.letters} allowFontScaling={false}>{tempGridArray_0[i]}</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                        :
                                        <>
                                            <LinearGradient
                                                // Button Linear Gradient
                                                // colors={['#ffba08', '#faa307']}
                                                colors={['#d9005b', '#ff0076']}
                                                style={Styling.gridBlock}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => console.log(i)}
                                                    accessible={true} accessibilityLabel="Block."
                                                >
                                                    {i == (u0 + u1) ?
                                                        <Text style={{ ...Styling.letters, color: 'white' }} allowFontScaling={false}>{tempGridArray_0[i]}</Text>
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
                            // colors={['#f8f9fa', '#ced4da']}
                            colors={['rgba(248, 249, 250, 0.75)', 'rgba(206, 212, 218, 0.75)']}
                            style={Styling.gridBlock}
                        >
                            <TouchableOpacity
                                onPress={() => console.log(i)}
                                accessible={true} accessibilityLabel="Block."
                            ></TouchableOpacity>
                        </LinearGradient>
                    }
                </View>
        }

    }
    DisplayWords();

    // const oldStoredGuesses = useRef([...storedGuesses]);

    const CheckArray = (guess) => {
        if (!guesses.includes(guess)) {
            setGuesses(guesses => [...guesses, guess])
            for (let i = 0; i < tempGridArray_0.length; i++) {
                if (promptGuessInput == tempGridArray_0[i]) {
                    setIVar(iVar => [...iVar, i]);
                }
            }
        }

        // const contentsChanged = storedGuesses.every((guess, i) => guess === oldStoredGuesses[i]);

        // if (contentsChanged) {
        //     console.log("The contents of storedGuesses have not changed.");
        // } else {
        //     console.log("The contents of storedGuesses have changed.");
        // }


    }



    const PreviousGuess = () => {
        // oldStoredGuesses.current = [...storedGuesses];
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
                                            fontSize: HeightRatio(22),
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
                                    fontSize: HeightRatio(22),
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
        let localTimeTaken;
        let localExtraPoints = 0;
        let localLeftRightHintReduction = 0;
        let localTopBottomHintReduction = 0;
        let localScore;
        let totalGuesses = storedGuesses.length;
        let correctAnswers = 0;
        let incorrectAnswers = 0;
        for (let i = 0; i < totalGuesses; i++) {
          if (tempGridArray_0.includes(`${storedGuesses[i]}`)) {
            correctAnswers = correctAnswers + 1;
          } else {
            if (localTimeTaken < 20) {
              incorrectAnswers = incorrectAnswers*2;
            } else if (localTimeTaken >= 20 && localTimeTaken < 40) {
              incorrectAnswers = incorrectAnswers*1.5;
            } else if (localTimeTaken >= 40 && localTimeTaken < 60) {
              incorrectAnswers = incorrectAnswers*1.25;
            } else {
              incorrectAnswers = incorrectAnswers + 1;
            }
          }
        }
        setStoreCorrectAnswers(correctAnswers);
        setStoreIncorrectAnswers(incorrectAnswers);
      
        localTimeTaken = Math.trunc((endTime - startTime) / 1000);
        setTimeTaken(localTimeTaken);
        // Calculate the score as a percentage of correct answers
        let scorePercentage = Math.trunc(
          (correctAnswers / (correctAnswers + incorrectAnswers)) * 100
        );
      
        // If the time taken is less than the average time per guess, add a bonus to the score
        if (localTimeTaken < 20 && awardExtraPoints) {
          localScore = scorePercentage + 100;
          setExtraPoints(100);
          localExtraPoints = 100;
        } else if (localTimeTaken >= 20 && localTimeTaken < 40 && awardExtraPoints) {
          localScore = scorePercentage + 80;
          setExtraPoints(80);
          localExtraPoints = 80;
        } else if (localTimeTaken >= 40 && localTimeTaken < 60 && awardExtraPoints) {
          localScore = scorePercentage + 40;
          setExtraPoints(40);
          localExtraPoints = 40;
        } else if (localTimeTaken >= 60 && localTimeTaken < 80 && awardExtraPoints) {
          localScore = scorePercentage + 20;
          setExtraPoints(20);
          localExtraPoints = 20;
        } else if (localTimeTaken >= 80 && localTimeTaken < 100 && awardExtraPoints) {
          localScore = scorePercentage + 10;
          setExtraPoints(10);
          localExtraPoints = 10;
        } else if (localTimeTaken >= 100 && awardExtraPoints) {
          localScore = scorePercentage + 5;
          setExtraPoints(5);
          localExtraPoints = 5;
        } else {
          localScore = scorePercentage;
          console.log("NO EXTRA");
        }
      
        if (displayLeftRightHint) {
          localScore = localScore - 10;
          setLeftRightHintReduction(-10);
          localLeftRightHintReduction = -10;
        }
        if (displayTopBottomHint) {
          localScore = localScore - 10;
          setTopBottomHintReduction(-10);
          localTopBottomHintReduction = -10;
        }
      
        console.log("TIME TAKEN: " + localTimeTaken)
      

        setScore(localScore);

        handleAddGame(word1, word2, localTimeTaken, localScore);
        setFlashScore(true)
        setMainState({
            prevGame_word1: word1,
            prevGame_word2: word2,
            prevGame_timeTaken: localTimeTaken,
            prevGame_extraPoints: localExtraPoints,
            prevGame_leftRightHintReduction: localLeftRightHintReduction,
            prevGame_topBottomHintReduction: localTopBottomHintReduction,
            prevGame_storeCorrectAnswers: correctAnswers,
            prevGame_storeIncorrectAnswers: incorrectAnswers,
            prevGame_score: localScore
        })
        setTimeout(() => {
            setFlashScore(false)
            navigation.dispatch(resetActionGame);
        }, 2000)
        

    };


    function searchWord1(word) {
        const data = require('../../output.json');
        const wordObject = data.find(obj => obj.word === word.toLowerCase());

        // console.log(wordObject)

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

    }
    function searchWord2(word) {
        const data = require('../../output.json');
        const wordObject = data.find(obj => obj.word === word.toLowerCase());

        // console.log(wordObject)

        const updateDefState = (i, value) => {
            switch (i) {
                case 0: setDefinition3(value); break;
                case 1: setDefinition4(value); break;
                case 2: setDefinition5(value); break;
                default: break;
            }
        }

        for (let i = 0; i < 3; i++) {
            console.log(wordObject.definition[i])
            updateDefState(i, wordObject.definition[i] || "");

        }

    }

    useEffect(() => {
        if (startTime) {
            cleanArrays(tempGridArray_0, guesses)
        }
    }, [guesses])

    useEffect(() => {
        if (endTime) {
            setRevealOptions(false);
            ScoreCalculator();
        }
    }, [endTime])

    useEffect(() => {
        if (revealOptions) {
            start();
        }
    }, [revealOptions])




    const handleKeyPress = (key) => {
        console.log("handleKeyPress")
        setSelectedKey(key);
        NewKeyboard(inputInit);
    };

    const ReplaceKeyboard = () => {
        setRevealOptions(false);
        const letters_word1 = word1.split('');
        const letters_word2 = word2.split('');

        const randomLetters = [];
        let remainingLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

        let combined_v0 = letters_word1.concat(letters_word2);
        let combined_v1 = combined_v0.concat(randomLetters);

        let uniqueCombined = [...new Set(combined_v1)];
        let scrambledCombined = shuffle(uniqueCombined).map(letter => letter.toUpperCase());

        while (scrambledCombined.length < 13) {
            // Determine number of additional letters needed
            const lettersNeeded = 13 - scrambledCombined.length;

            // Remove letters that already appear in the words or in the current scrambledCombined
            const usedLetters = [...new Set(letters_word1.concat(letters_word2, scrambledCombined))];
            remainingLetters = remainingLetters.filter(letter => !usedLetters.includes(letter));

            // Generate additional letters
            for (let i = 0; i < lettersNeeded; i++) {
                const letterCode = Math.floor(Math.random() * remainingLetters.length);
                const letter = remainingLetters[letterCode];
                remainingLetters.splice(letterCode, 1); // Remove selected letter from remaining letters
                randomLetters.push(letter.toLowerCase());
            }

            combined_v0 = letters_word1.concat(letters_word2);
            combined_v1 = combined_v0.concat(randomLetters);

            uniqueCombined = [...new Set(combined_v1)];
            scrambledCombined = shuffle(uniqueCombined).map(letter => letter.toUpperCase());
        }

        console.log("- - - - - - -")
        console.log("Combined and scrambled: ")
        console.log(scrambledCombined)
        console.log("- - - - - - -")

        setInputInit(scrambledCombined.filter((letter, index) => scrambledCombined.indexOf(letter) === index))

        NewKeyboard(scrambledCombined.filter((letter, index) => scrambledCombined.indexOf(letter) === index));
    }







    const NewKeyboard = (input) => {
        let keys = input.map(letter => {
            return {
                letter: letter.toUpperCase(),
                color: storedGuesses.includes(letter.toUpperCase()) ? 'black' : '#19d0bf',
            };
        });

        setLetterOptionDisplay(keys);

        setTimeout(() => {
            setRevealOptions(true);
        }, 10);
    };

    const renderKeyButton = (key, index) => (
        <View
            key={index}
            style={{

            }}>
            <TouchableOpacity
                onPress={() => {
                    setPromptGuessInput(key.letter);
                    handleKeyPress(key.letter);
                }}
                style={{
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: 'black',
                    height: HeightRatio(60),
                    width: HeightRatio(60),
                    margin: HeightRatio(4),
                    opacity: 0.9,
                    backgroundColor: selectedKey === key.letter ? '#a2ffff' : key.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                accessible={true}
                accessibilityLabel={`Keyboard letter ${key.letter}.`}>
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(27),
                        fontWeight: 'bold',
                    }}
                    allowFontScaling={false}>
                    {key.letter}
                </Text>
            </TouchableOpacity>
        </View>
    );

    useEffect(() => {
        if (bothWordsSelected) {
            ReplaceKeyboard()
        }
    }, [bothWordsSelected])


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
            <View style={{
                ...Styling.container,
                backgroundColor: 'black'
            }}>

                {selectedColor && selectedColor.gradient && selectedColor.image ?
                    <DisplayGradient
                        gradient={selectedColor.gradient}
                        image={selectedColor.image}
                    />
                    :
                    <>
                        <Image
                            source={require('../../assets/dalle_7.png')}
                            style={{ ...Styling.background, opacity: 0.4 }}
                        />
                        <LinearGradient
                            colors={['#0b132b', '#3a506b']}
                            style={{ ...Styling.background, opacity: 0.5 }}
                        />
                    </>
                }

                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        marginTop: 40
                    }}
                >
                    <View style={{
                        flexDirection: 'column'
                    }}>

                        {/* - - - - - - - - - - - - - -  */}
                        {/* Crossword Grid / Placeholder */}
                        {/* - - - - - - - - - - - - - -  */}
                        {displayGrid ?
                            <>
                                {revealOptions ?
                                    <>
                                        {!hintTopBottomModal && !hintLeftRightModal && !modalVisible && !flashScore &&
                                            <>
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -25,
                                                        left: 5,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <Image
                                                        source={require('../../assets/clock_icon.png')}
                                                        style={{ height: HeightRatio(35), width: HeightRatio(35), marginRight: HeightRatio(5) }}
                                                    />
                                                    <Text style={{ color: 'white', fontSize: HeightRatio(20), width: HeightRatio(200) }}>
                                                        Timer
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        alignSelf: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'row',
                                                        flexWrap: 'wrap',
                                                        marginTop: HeightRatio(20),
                                                        width: WidthRatio(300),
                                                        padding: HeightRatio(6)
                                                    }}
                                                >
                                                    {buttonArray}
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => { setHintTopBottomModal(true) }}
                                                    style={{
                                                        position: 'absolute',
                                                        borderRadius: 100,
                                                        height: 40,
                                                        width: 40,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 5,
                                                        top: HeightRatio(-10),
                                                        left: ((WidthRatio(58)) * (u1 + 1)) + (u1 * 2) - HeightRatio(30)
                                                    }}
                                                    accessible={true}
                                                    accessibilityLabel="Top down hint."
                                                >
                                                    <View>
                                                        <Image
                                                            style={{ height: HeightRatio(50), width: HeightRatio(50) }}
                                                            source={require('../../assets/Qmark_0.png')}
                                                        />
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => { console.log("Q? L -> R"); setHintLeftRightModal(true) }}
                                                    style={{
                                                        position: 'absolute',
                                                        borderRadius: 100,
                                                        height: 40,
                                                        width: 40,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 5,
                                                        top: ((WidthRatio(58)) * ((u0) / 5)) + ((u0 / 5) * 2) + HeightRatio(30),
                                                        left: WidthRatio(0)
                                                    }}
                                                    accessible={true}
                                                    accessibilityLabel="Left right hint."
                                                >
                                                    <View>
                                                        <Image
                                                            style={{ height: HeightRatio(50), width: HeightRatio(50) }}
                                                            source={require('../../assets/Qmark.png')}
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
                                                        marginTop: 8,
                                                        width: WidthRatio(350),
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
                                                            onPress={() => { CheckArray(promptGuessInput); setPromptGuessInput([]); setCount(0) }}
                                                        >
                                                            <Image
                                                                style={{ height: HeightRatio(25), width: HeightRatio(80), position: 'absolute', zIndex: 10, top: -12, left: -8 }}
                                                                source={require('../../assets/click.png')}
                                                            />
                                                            <View
                                                                style={{
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                                    ...Styling.guessBlock
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(40), fontWeight: 'bold' }}
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
                                                            marginLeft: 7,
                                                            marginRight: 7,
                                                        }}
                                                    >
                                                        <PreviousGuess />
                                                    </View>
                                                </View>

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        flexWrap: 'wrap',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginTop: HeightRatio(6),
                                                        width: WidthRatio(300),
                                                        alignSelf: 'center'
                                                    }}>
                                                    {letterOptionDisplay.map((key, index) => renderKeyButton(key, index))}
                                                </View>
                                            </>
                                        }
                                    </>


                                    :
                                    <>
                                        {!modalVisible && !flashScore &&
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                                                    <ActivityIndicator size="large" color="#00d8ff" />
                                                </View>
                                            </View>
                                        }
                                    </>

                                }
                            </>
                            :

                            null
                        }



                    </View>

                    {hintTopBottomModal &&
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={hintTopBottomModal}
                            onRequestClose={() => {
                                setHintTopBottomModal(!hintTopBottomModal);
                            }}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ borderTopRightRadius: HeightRatio(10) }}>
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#ff0076',
                                            alignSelf: 'center',
                                            borderRadius: 100,
                                            position: 'absolute',
                                            zIndex: 10,
                                            bottom: 120,
                                            right: 0,
                                            left: 0,
                                            alignItems: 'center',
                                            justifyContent: 'center'

                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                setHintTopBottomModal(!hintTopBottomModal);
                                            }}
                                        >
                                            <View style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                padding: HeightRatio(20),
                                                borderRadius: HeightRatio(40),
                                                alignSelf: 'center',

                                                width: WidthRatio(300)
                                            }}>
                                                <View style={{
                                                    flexDirection: 'column'
                                                }}>
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            fontSize: HeightRatio(20),
                                                            textAlign: 'center'
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Return to game
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {/* [[[MIDDLE ROW]]] */}
                                    <SafeAreaView style={{}}>
                                        <ScrollView style={Styling.gameScrollView}>
                                            <View
                                                style={{ flexDirection: 'column', marginTop: 10, marginBottom: 10 }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => { searchWord2(word2); setDisplayTopBottomHint(true); }}
                                                    // style={Styling.modalWordButton}
                                                    disabled={!displayTopBottomHint ? false : true}
                                                >
                                                    <View style={{
                                                        // backgroundColor: '#09e049',
                                                        display: 'flex',
                                                        justifyContent: 'flex-start',
                                                        padding: HeightRatio(20),
                                                        borderRadius: HeightRatio(40),
                                                        alignSelf: 'center',
                                                        marginTop: HeightRatio(50),
                                                        // margin: HeightRatio(10),
                                                        width: WidthRatio(300)
                                                    }}>
                                                        <LinearGradient
                                                            colors={['#0b132b', '#181d21']}
                                                            style={{
                                                                ...Styling.background,
                                                                height: HeightRatio(95),
                                                                borderRadius: HeightRatio(80),
                                                                borderWidth: 2,
                                                                borderColor: '#09e049',
                                                                opacity: 0.9
                                                            }}
                                                        />
                                                        <View style={{
                                                            flexDirection: 'column'
                                                        }}>
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: HeightRatio(25),
                                                                    fontWeight: 'bold',
                                                                    alignSelf: 'center',
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                Show Hint
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: HeightRatio(20),
                                                                    // fontWeight: 'bold',
                                                                    // alignSelf: 'center',
                                                                    textAlign: 'center'
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                Top to Bottom
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>



                                                <View style={{ alignSelf: 'center', margin: 25, width: WidthRatio(280) }}>
                                                    {definition3 != '' || definition4 != '' || definition5 != '' ?
                                                        <View style={{ marginTop: 10 }}>
                                                            <Text style={Styling.modalContentHeader}>
                                                                Definitions
                                                            </Text>
                                                        </View>
                                                        :
                                                        <View style={{}}>
                                                            <Text
                                                                style={{ color: '#ff0076', fontSize: HeightRatio(25), fontWeight: 'bold' }}
                                                                allowFontScaling={false}>
                                                                Warning:
                                                            </Text>
                                                            <Text
                                                                style={{ color: 'white', fontSize: HeightRatio(18) }}
                                                            >
                                                                Selecting hint reduces your score by 10 points!
                                                            </Text>
                                                        </View>
                                                    }
                                                    {definition3 != '' ?
                                                        <View
                                                            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
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
                                </View>
                            </View>
                        </Modal>
                    }

                    {hintLeftRightModal &&
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={hintLeftRightModal}
                            onRequestClose={() => {
                                setHintLeftRightModal(!hintLeftRightModal);
                            }}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ borderTopRightRadius: HeightRatio(10) }}>
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#ff0076',
                                            alignSelf: 'center',
                                            borderRadius: 100,
                                            position: 'absolute',
                                            zIndex: 10,
                                            bottom: 120,
                                            right: 0,
                                            left: 0,
                                            alignItems: 'center',
                                            justifyContent: 'center'

                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => { setHintLeftRightModal(!hintLeftRightModal) }}
                                        >
                                            <View style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                padding: HeightRatio(20),
                                                borderRadius: HeightRatio(40),
                                                alignSelf: 'center',

                                                width: WidthRatio(300)
                                            }}>
                                                <View style={{
                                                    flexDirection: 'column'
                                                }}>
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            fontSize: HeightRatio(20),
                                                            textAlign: 'center'
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Return to game
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {/* [[[MIDDLE ROW]]] */}
                                    <SafeAreaView style={Styling.container}>
                                        <ScrollView style={Styling.gameScrollView}>
                                            <View
                                                style={{ flexDirection: 'column', marginTop: 10, marginBottom: 10 }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => { searchWord1(word1); setDisplayLeftRightHint(true); }}
                                                    // style={Styling.modalWordButton}
                                                    disabled={!displayLeftRightHint ? false : true}
                                                >
                                                    <View style={{
                                                        // backgroundColor: '#09e049',
                                                        display: 'flex',
                                                        justifyContent: 'flex-start',
                                                        padding: HeightRatio(20),
                                                        borderRadius: HeightRatio(40),
                                                        alignSelf: 'center',
                                                        marginTop: HeightRatio(50),
                                                        // margin: HeightRatio(10),
                                                        width: WidthRatio(300)
                                                    }}>
                                                        <LinearGradient
                                                            colors={['#0b132b', '#181d21']}
                                                            style={{
                                                                ...Styling.background,
                                                                height: HeightRatio(95),
                                                                borderRadius: HeightRatio(80),
                                                                borderWidth: 2,
                                                                borderColor: '#09e049',
                                                                opacity: 0.9
                                                            }}
                                                        />
                                                        <View style={{
                                                            flexDirection: 'column'
                                                        }}>
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: HeightRatio(25),
                                                                    fontWeight: 'bold',
                                                                    alignSelf: 'center',
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                Show Hint
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: HeightRatio(20),
                                                                    // fontWeight: 'bold',
                                                                    // alignSelf: 'center',
                                                                    textAlign: 'center'
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                Left to Right
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ alignSelf: 'center', margin: 25, width: WidthRatio(280) }}>
                                                    {definition0 != '' || definition1 != '' || definition2 != '' ?
                                                        <View style={{ marginTop: 10 }}>
                                                            <Text style={Styling.modalContentHeader}>
                                                                Definitions
                                                            </Text>
                                                        </View>
                                                        :
                                                        <View style={{}}>
                                                            <Text
                                                                style={{ color: '#ff0076', fontSize: HeightRatio(25), fontWeight: 'bold' }}
                                                                allowFontScaling={false}>
                                                                Warning:
                                                            </Text>
                                                            <Text
                                                                style={{ color: 'white', fontSize: HeightRatio(18) }}
                                                            >
                                                                Selecting hint reduces your score by 10 points!
                                                            </Text>
                                                        </View>
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
                                </View>
                            </View>
                        </Modal>
                    }

                    {flashScore &&
                        <View
                            style={{
                                // position: 'absolute',
                                // zIndex: 20,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: HeightRatio(30),
                                    padding: HeightRatio(15),
                                    width: WidthRatio(300),
                                    flexDirection: 'column',
                                    margin: HeightRatio(5),
                                    alignSelf: 'center'
                                }}

                            >
                                <LinearGradient
                                    colors={['#0b132b', '#181d21']}
                                    style={{
                                        ...Styling.background,
                                        height: HeightRatio(75),
                                        borderRadius: HeightRatio(8),
                                        borderWidth: 2,
                                        borderColor: '#09e049',
                                        opacity: 0.9
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesomeIcon
                                        icon={faSolid, faClock}
                                        style={{ ...Styling.modalFontAwesomeIcons, color: 'white' }}
                                        size={20}
                                    />
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(27),
                                            fontWeight: 'bold',
                                            margin: HeightRatio(5)
                                        }}
                                        allowFontScaling={false}
                                    >Time</Text>

                                    <Text
                                        style={{
                                            color: '#19d0bf',
                                            // alignSelf: 'center', 
                                            fontSize: HeightRatio(25),
                                            fontWeight: 'bold',
                                            margin: HeightRatio(5),
                                            marginLeft: HeightRatio(20),
                                            width: WidthRatio(180)
                                        }}
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        allowFontScaling={false}
                                    >
                                        {timeTaken} seconds
                                    </Text>

                                </View>
                            </View>
                            <View
                                style={{
                                    borderRadius: HeightRatio(30),
                                    padding: HeightRatio(15),
                                    width: WidthRatio(300),
                                    flexDirection: 'column',
                                    margin: HeightRatio(5),
                                    alignSelf: 'center'
                                }}

                            >
                                <LinearGradient
                                    colors={['#0b132b', '#181d21']}
                                    style={{
                                        ...Styling.background,
                                        height: HeightRatio(75),
                                        borderRadius: HeightRatio(8),
                                        borderWidth: 2,
                                        borderColor: '#09e049',
                                        opacity: 0.9
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesomeIcon
                                        icon={faSolid, faFlagCheckered}
                                        style={{ ...Styling.modalFontAwesomeIcons, color: 'white' }}
                                        size={20}
                                    />
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(27),
                                            fontWeight: 'bold',
                                            margin: HeightRatio(5)
                                        }}
                                        allowFontScaling={false}
                                    >Score</Text>

                                    <Text
                                        style={{
                                            color: '#19d0bf',
                                            // alignSelf: 'center', 
                                            fontSize: HeightRatio(25),
                                            fontWeight: 'bold',
                                            margin: HeightRatio(5),
                                            marginLeft: HeightRatio(20),
                                            width: WidthRatio(180)
                                        }}
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        allowFontScaling={false}
                                    >
                                        {score}
                                    </Text>

                                </View>
                            </View>
                        </View>
                    }

                    {seePreviousScore && mainState.current.prevGame_word1 != null && mainState.current.prevGame_word2  != null && !flashScore &&
                        <>

                            {!expandScoreDetails &&
                                <TouchableOpacity
                                    onPress={() => { setExpandScoreDetails(true); setModalVisible(true); searchWord1(mainState.current.prevGame_word1); searchWord2(mainState.current.prevGame_word2);  }}
                                    style={{}}
                                >
                                    <View style={{
                                        position: 'absolute',
                                        top: HeightRatio(10),
                                        right: HeightRatio(10),
                                        padding: HeightRatio(10),
                                        borderRadius: HeightRatio(10),
                                        alignSelf: 'center',
                                        marginTop: HeightRatio(0),
                                        width: HeightRatio(240),
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <LinearGradient
                                            colors={['#0b132b', '#181d21']}
                                            style={{
                                                ...Styling.background,
                                                height: HeightRatio(45),
                                                borderRadius: HeightRatio(10),
                                                borderWidth: 2,
                                                borderColor: '#ff0076',
                                                opacity: 0.9
                                            }}
                                        />
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}
                                            allowFontScaling={false}
                                        >
                                            SEE PREVIOUS SCORE
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </>
                    }

                    {modalVisible &&
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <SafeAreaView style={Styling.profileContainer}>
                                <ScrollView
                                    style={{ ...Styling.profileScrollView, height: HeightRatio(650), }}
                                >
                                    {/* expandScoreDetails */}

                                    <View style={{ ...Styling.gameCenteredView, marginTop: expandScoreDetails ? null : HeightRatio(200) }}>
                                        {expandScoreDetails &&
                                            <TouchableOpacity
                                                onPress={() => { setDisplayDetails(!displayDetails); }}

                                                style={{
                                                    borderRadius: HeightRatio(30),
                                                    padding: HeightRatio(15),
                                                    width: WidthRatio(300),
                                                    flexDirection: 'column',
                                                    // margin: HeightRatio(5),
                                                    alignSelf: 'center'
                                                }}

                                            >
                                                <LinearGradient
                                                    colors={['#0b132b', '#181d21']}
                                                    style={{
                                                        ...Styling.background,
                                                        height: HeightRatio(90),
                                                        borderRadius: HeightRatio(8),
                                                        borderWidth: 2,
                                                        borderColor: '#ff0076',
                                                        opacity: 0.9
                                                    }}
                                                />
                                                <View style={{ flexDirection: 'column' }}>

                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            fontSize: HeightRatio(25),
                                                            fontWeight: 'bold',
                                                            margin: HeightRatio(5)
                                                        }}
                                                        allowFontScaling={false}
                                                    >See Definitions</Text>

                                                    <Text
                                                        style={{
                                                            color: '#19d0bf',
                                                            // alignSelf: 'center', 
                                                            fontSize: HeightRatio(18),
                                                            fontWeight: 'bold',
                                                            margin: HeightRatio(5),
                                                            marginLeft: HeightRatio(20),
                                                            width: WidthRatio(180)
                                                        }}
                                                        numberOfLines={1}
                                                        ellipsizeMode='tail'
                                                        allowFontScaling={false}
                                                    >
                                                        {mainState.current.prevGame_word1}, {mainState.current.prevGame_word2}
                                                    </Text>

                                                    <View
                                                        style={{ flexDirection: 'column' }}
                                                    >


                                                        <View style={{ alignSelf: 'center', width: WidthRatio(280), marginTop: displayDetails ? HeightRatio(25) : HeightRatio(0) }}>
                                                            {displayDetails &&
                                                                <View>

                                                                    <View style={{
                                                                        flexDirection: 'column'
                                                                    }}>
                                                                        <Text
                                                                            style={{
                                                                                color: '#19d0bf',
                                                                                fontSize: HeightRatio(25),
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                            allowFontScaling={false}
                                                                        >
                                                                            {mainState.current.prevGame_word1}
                                                                        </Text>
                                                                    </View>


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

                                                        <View style={{ alignSelf: 'center', margin: 10, width: WidthRatio(280) }}>
                                                            {displayDetails &&
                                                                <>
                                                                    <View style={{
                                                                        flexDirection: 'column'
                                                                    }}>
                                                                        <Text
                                                                            style={{
                                                                                color: '#19d0bf',
                                                                                fontSize: HeightRatio(25),
                                                                                fontWeight: 'bold',
                                                                                // alignSelf: 'center',
                                                                            }}
                                                                            allowFontScaling={false}
                                                                        >
                                                                            {mainState.current.prevGame_word2}
                                                                        </Text>
                                                                    </View>

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



                                                    </View>

                                                </View>
                                            </TouchableOpacity>
                                        }
                                        <View
                                            style={{
                                                borderRadius: HeightRatio(30),
                                                padding: HeightRatio(15),
                                                width: WidthRatio(300),
                                                flexDirection: 'column',
                                                margin: HeightRatio(10),
                                                alignSelf: 'center'
                                            }}

                                        >
                                            <LinearGradient
                                                colors={['#0b132b', '#181d21']}
                                                style={{
                                                    ...Styling.background,
                                                    height: HeightRatio(65),
                                                    borderRadius: HeightRatio(8),
                                                    borderWidth: 2,
                                                    borderColor: '#ff0076',
                                                    opacity: 0.9
                                                }}
                                            />
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesomeIcon
                                                    icon={faSolid, faClock}
                                                    style={{ ...Styling.modalFontAwesomeIcons, color: 'white' }}
                                                    size={16}
                                                    
                                                />
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                        fontSize: HeightRatio(27),
                                                        fontWeight: 'bold',
                                                        margin: HeightRatio(5)
                                                    }}
                                                    allowFontScaling={false}
                                                >Time</Text>

                                                <Text
                                                    style={{
                                                        color: '#19d0bf',
                                                        // alignSelf: 'center', 
                                                        fontSize: HeightRatio(25),
                                                        fontWeight: 'bold',
                                                        margin: HeightRatio(5),
                                                        marginLeft: HeightRatio(20),
                                                        width: WidthRatio(180)
                                                    }}
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                    allowFontScaling={false}
                                                >
                                                    {mainState.current.prevGame_timeTaken} seconds
                                                </Text>

                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                borderRadius: HeightRatio(30),
                                                padding: HeightRatio(15),
                                                width: WidthRatio(300),
                                                flexDirection: 'column',
                                                margin: HeightRatio(5),
                                                alignSelf: 'center'
                                            }}

                                        >
                                            <LinearGradient
                                                colors={['#0b132b', '#181d21']}
                                                style={{
                                                    ...Styling.background,
                                                    height: expandScoreDetails ? HeightRatio(380) : HeightRatio(75),
                                                    borderRadius: HeightRatio(8),
                                                    borderWidth: 2,
                                                    borderColor: '#ff0076',
                                                    opacity: 0.9
                                                }}
                                            />
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <FontAwesomeIcon
                                                    icon={faSolid, faFlagCheckered}
                                                    style={{ ...Styling.modalFontAwesomeIcons, color: 'white' }}
                                                    size={16}
                                                />
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                        fontSize: HeightRatio(27),
                                                        fontWeight: 'bold',
                                                        margin: HeightRatio(5)
                                                    }}
                                                    allowFontScaling={false}
                                                >Score</Text>

                                                <Text
                                                    style={{
                                                        color: '#19d0bf',
                                                        // alignSelf: 'center', 
                                                        fontSize: HeightRatio(25),
                                                        fontWeight: 'bold',
                                                        margin: HeightRatio(5),
                                                        marginLeft: HeightRatio(20),
                                                        width: WidthRatio(180)
                                                    }}
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                    allowFontScaling={false}
                                                >
                                                    {mainState.current.prevGame_score}
                                                </Text>

                                            </View>

                                            {expandScoreDetails &&
                                                <View style={{}}>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            marginTop: HeightRatio(8),
                                                            marginBottom: HeightRatio(8),
                                                            marginLeft: HeightRatio(30)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faGift}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f9c74f' }}
                                                            size={16}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: HeightRatio(27),
                                                                fontWeight: 'bold',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {mainState.current.prevGame_extraPoints} points
                                                        </Text>
                                                    </View>
                                                    {mainState.current.prevGame_extraPoints != 0 &&
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: HeightRatio(20),
                                                                fontWeight: 'bold',
                                                                marginLeft: HeightRatio(35)
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            Bonus points!
                                                        </Text>
                                                    }
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            marginTop: HeightRatio(8),
                                                            marginBottom: HeightRatio(8),
                                                            marginLeft: HeightRatio(30)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faSquareMinus}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f9c74f' }}
                                                            size={16}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: HeightRatio(27),
                                                                fontWeight: 'bold',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {mainState.current.prevGame_leftRightHintReduction} points
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            color: '#f9c74f',
                                                            fontSize: HeightRatio(20),
                                                            fontWeight: 'bold',
                                                            marginLeft: HeightRatio(35)
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Left to Right hint reduction.
                                                    </Text>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            marginTop: HeightRatio(8),
                                                            marginBottom: HeightRatio(8),
                                                            marginLeft: HeightRatio(30)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faSquareMinus}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f9c74f' }}
                                                            size={16}
                                                        />
                                                        <Text
                                                            style={{
                                                                color: '#f9c74f',
                                                                fontSize: HeightRatio(27),
                                                                fontWeight: 'bold',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {mainState.current.prevGame_topBottomHintReduction} points
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            color: '#f9c74f',
                                                            fontSize: HeightRatio(20),
                                                            fontWeight: 'bold',
                                                            marginLeft: HeightRatio(35)
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Top to Bottom hint reduction.
                                                    </Text>

                                                    <View style={{ ...Styling.modalDivisionLine, width: WidthRatio(200) }}></View>
                                                    {/* CORRECT */}
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            marginTop: HeightRatio(8),
                                                            marginBottom: HeightRatio(8),
                                                            marginLeft: HeightRatio(30)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faCheck}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#90be6d' }}
                                                            size={16}
                                                        />
                                                        <Text
                                                            style={Styling.modalScoringVarText}
                                                            allowFontScaling={false}
                                                        >
                                                            Correct: {mainState.current.prevGame_storeCorrectAnswers}
                                                        </Text>
                                                    </View>

                                                    {/* INCORRECT */}
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            marginTop: HeightRatio(8),
                                                            marginBottom: HeightRatio(8),
                                                            marginLeft: HeightRatio(30)
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faX}
                                                            style={{ ...Styling.modalFontAwesomeIcons, color: '#f94144' }}
                                                            size={16}
                                                        />
                                                        <Text
                                                            style={Styling.modalScoringVarText}
                                                            allowFontScaling={false}
                                                        >
                                                            Incorrect: {mainState.current.prevGame_storeIncorrectAnswers}
                                                        </Text>
                                                    </View>

                                                    {/* <View style={{ ...Styling.modalDivisionLine, width: WidthRatio(200) }}></View> */}

                                                </View>
                                            }
                                        </View>


                                        {/* #ff0076 */}


                                        <TouchableOpacity
                                            onPress={() => { setModalVisible(!modalVisible); setSeePreviousScore(false); }}
                                            style={{}}
                                        >
                                            <View style={{
                                                // backgroundColor: '#09e049',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                padding: HeightRatio(20),
                                                borderRadius: HeightRatio(40),
                                                alignSelf: 'center',
                                                marginTop: HeightRatio(35),
                                                // margin: HeightRatio(10),
                                                width: WidthRatio(300)
                                            }}>
                                                <LinearGradient
                                                    colors={['#0b132b', '#181d21']}
                                                    style={{
                                                        ...Styling.background,
                                                        height: HeightRatio(60),
                                                        borderRadius: HeightRatio(80),
                                                        borderWidth: 2,
                                                        borderColor: '#09e049',
                                                        opacity: 0.9
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                        fontSize: HeightRatio(20),
                                                        fontWeight: 'bold',
                                                        alignSelf: 'center'
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    CLOSE
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </SafeAreaView>
                        </Modal>
                    }
                </View>

            </View>
            <Navbar
                nav={navigation}
                auth={authState}
                position={'relative'}
                from={'game'}
            />
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
