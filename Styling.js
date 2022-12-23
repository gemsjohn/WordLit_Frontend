import { StyleSheet, Dimensions, StatusBar, PixelRatio } from 'react-native';

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

export const Styling = StyleSheet.create({
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: windowHeight,
    },
    label: {
      marginBottom: 2,
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    section: {
      marginVertical: 12,
    },
    tinyLogo: {
      width: 50,
      height: 50,
      alignSelf: 'center',
      borderRadius: 10,
      marginBottom: 50
    },
    newcontainer: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
      marginHorizontal: 0,
    },
    circlecontainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    circle: {
      width: HeightRatio(40),
      height: HeightRatio(40),
      borderRadius: 20,
      margin: 10,
    },
    difficultyButton: {
      display: 'flex',
      justifyContent: 'center',
      padding: 20,
      alignSelf: 'center',
      margin: 10,
      width: windowWidth / 3 - 1,
      height: windowHeight / 12,
      flexDirection: 'row'
    },
    difficultyText: {
      color: '#001219',
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center'
    },
    textInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 4,
      borderColor: 'white',
      color: 'white',
      width: windowWidth - 80,
      alignSelf: 'center',
      height: windowHeight / 3,
      borderRadius: 10,
      padding: 30
    },
    sendButton: {
      display: 'flex',
      justifyContent: 'center',
      padding: 20,
      borderRadius: 40,
      alignSelf: 'center',
      margin: 10,
      width: windowWidth - 80,
      flexDirection: 'row'
    },
    sendButtonText: {
      color: '#001219',
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center'
    },
    gridBlock: {
      height: windowWidth * 0.14,
      width: windowWidth * 0.14,
      margin: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalDivisionLine: {
      borderColor: '#4cc9f0',
      borderBottomWidth: 1,
      width: WidthRatio(320),
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      backgroundColor: '#d90429'
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#4361ee",
      borderRadius: 10,
      padding: 20
    },
    textStyle: {
      color: "white",
      fontSize: HeightRatio(25),
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      color: 'black',
      fontSize: HeightRatio(30),
      fontWeight: 'bold'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      container: {
        flex: 1,
        // backgroundColor: '#240046',
        marginTop: 30
      },
      scrollContainer: {
        // paddingTop: StatusBar.currentHeight,
      },
      flatlistContainer: {
        flex: 1,
        marginTop: StatusBar.currentHeight - 20 || 0,
      },
      item: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: 'solid',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        borderBottomLeftRadius: 25,
        padding: 10,
        width: windowWidth - 20,
        flexDirection: 'column',
        margin: 10,
      },
      number: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'blue',
        marginLeft: 15,
        marginTop: 2
      },
      title: {
        fontSize: 32,
      },
      letters: {
        alignSelf: 'center',
        fontSize: HeightRatio(44),
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.85)',
      },
      textInputStyle: {
        outline: 'none',
        backgroundColor: 'transparent',
        color: 'white',
        display: 'flex',
        justifyContent: 'flex-start',
        padding: 20,
        border: 'solid',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 40,
        alignSelf: 'center',
        margin: 10,
        width: windowWidth - 80
      },
      profileContainer: {
        // paddingTop: StatusBar.currentHeight,
    },
    profileScrollView: {
        backgroundColor: 'transparent',
        marginHorizontal: -20,
        alignSelf: "center",
        width: windowWidth - 10,
        height: windowHeight - 100,
        marginTop: 10
    },
    modalWordButton: {
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
    profileDivisionLine: {
        borderColor: '#4cc9f0',
        borderBottomWidth: 1,
        width: windowWidth - 80,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    gameScrollView: {
        backgroundColor: 'transparent',
        marginHorizontal: -20,
    },
    gameCenteredView: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        marginTop: 0
    },
    guessBlock: {
        height: WidthRatio(60),
        width: WidthRatio(60),
        // margin: 2,
        marginLeft: WidthRatio(4),
        marginRight: WidthRatio(4),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#00b4d8',
        borderWidth: WidthRatio(4),
        borderRadius: WidthRatio(5)
    },
    guessBlocks: {
        height: WidthRatio(30),
        width: WidthRatio(30),
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        borderRadius: 10,
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
    modalContentHeader: {
        color: '#4cc9f0',
        fontSize: 30,
        fontWeight: 'bold',
    },
    modalContent: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    modalScoringVarText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
  });
  
  
  
  