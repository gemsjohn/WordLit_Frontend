{modalVisible &&
    <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
    >

        <View style={Styling.gameCenteredView}>
            <View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: HeightRatio(650) }}>


                        {/* [[[MIDDLE ROW]]] */}
                        <SafeAreaView style={Styling.container}>
                            <ScrollView style={Styling.gameScrollView}>

                                <View
                                    style={{ flexDirection: 'column' }}
                                >
                                    {/* WORDS */}
                                    {/* WORD 1 */}
                                    {definition0 != '' || definition1 != '' || definition2 != '' ?
                                        null
                                        :
                                        <View
                                            style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10, alignSelf: 'center' }}
                                        >

                                            <TouchableOpacity
                                                onPress={() => { searchWord1(word1); searchWord2(word2); setDisplayDetails(true); }}
                                                // style={Styling.modalWordButton}
                                                disabled={!displayDetails ? false : true}
                                            >
                                                <View>
                                                    <Text style={Styling.modalContentHeader}>
                                                        Definitions
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    }

                                    <View style={{ alignSelf: 'center', margin: 5, width: WidthRatio(280) }}>
                                        {displayDetails &&
                                            <View>
                                                {definition0 != '' || definition1 != '' || definition2 != '' ?
                                                    <>
                                                        <View style={{
                                                            flexDirection: 'column'
                                                        }}>
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: HeightRatio(25),
                                                                    fontWeight: 'bold',
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                {word1}
                                                            </Text>
                                                        </View>

                                                    </>
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
                                    {/* <View
                                        style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10, alignSelf: 'center' }}
                                    >
                                        <View
                                            style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => { searchWord1(word1); searchWord2(word2); setDisplayDetails(true); }}
                                                // style={Styling.modalWordButton}
                                                disabled={!displayDetails ? false : true}
                                            >
                                                <View style={{
                                                    // backgroundColor: '#09e049',
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    padding: HeightRatio(20),
                                                    borderRadius: HeightRatio(40),
                                                    // alignSelf: 'center',
                                                    marginTop: HeightRatio(20),
                                                    // margin: HeightRatio(10),
                                                    width: WidthRatio(300)
                                                }}>
                                                    <LinearGradient
                                                        colors={['#0b132b', '#181d21']}
                                                        style={{
                                                            ...Styling.background,
                                                            height: HeightRatio(70),
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
                                                            {word2}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View> */}
                                    <View style={{ alignSelf: 'center', margin: 10, width: WidthRatio(280) }}>
                                        {displayDetails &&
                                            <>
                                                {/* {phonetic2 != '' ?
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
                                                } */}
                                                <View style={{
                                                        flexDirection: 'column'
                                                    }}>
                                                        <Text
                                                            style={{
                                                                color: 'white',
                                                                fontSize: HeightRatio(25),
                                                                fontWeight: 'bold',
                                                                // alignSelf: 'center',
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {word2}
                                                        </Text>
                                                    </View>
                                                {/* {definition3 != '' || definition4 != '' || definition5 != '' ?
                                                    <View>
                                                        <Text style={Styling.modalContentHeader}>
                                                            Definitions
                                                        </Text>
                                                    </View>
                                                    :
                                                    null
                                                } */}
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
                                            marginTop: 10,
                                            marginBottom: 10,
                                            marginLeft: 20
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
                                                fontSize: HeightRatio(30),
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
                                                fontSize: HeightRatio(20),
                                                fontWeight: 'bold',
                                                marginLeft: 20
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Bonus points!
                                        </Text>
                                    }
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            marginBottom: 10,
                                            marginLeft: 20
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
                                                fontSize: HeightRatio(30),
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
                                            fontSize: HeightRatio(20),
                                            fontWeight: 'bold',
                                            marginLeft: 20
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Left to Right hint reduction.
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            marginBottom: 10,
                                            marginLeft: 20
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
                                                fontSize: HeightRatio(30),
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
                                            fontSize: HeightRatio(20),
                                            fontWeight: 'bold',
                                            marginLeft: 20
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
                                            allowFontScaling={false}
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
                                            allowFontScaling={false}
                                        >
                                            Score: {score}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            alignSelf: 'center'

                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => { setModalVisible(!modalVisible); navigation.dispatch(resetActionGame); }}

                                        >
                                            <View style={{
                                                // backgroundColor: '#09e049',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                padding: HeightRatio(20),
                                                borderRadius: HeightRatio(40),
                                                // alignSelf: 'center',
                                                marginTop: HeightRatio(20),
                                                // margin: HeightRatio(10),
                                                width: WidthRatio(300)
                                            }}>
                                                <LinearGradient
                                                    colors={['#0b132b', '#181d21']}
                                                    style={{
                                                        ...Styling.background,
                                                        height: HeightRatio(70),
                                                        borderRadius: HeightRatio(80),
                                                        borderWidth: 2,
                                                        borderColor: '#ff0076',
                                                        opacity: 0.9
                                                    }}
                                                />
                                                <View style={{
                                                    justifyContent: 'center',
                                                    textAlign: 'center'
                                                }}>

                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            fontSize: HeightRatio(25),
                                                            // fontWeight: 'bold',
                                                            // alignSelf: 'center',
                                                            textAlign: 'center'
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Close
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginBottom: 200 }}></View>

                                </View>

                            </ScrollView>
                        </SafeAreaView>
                    </View>
                </View>
            </View>

        </View>
    </Modal>
}