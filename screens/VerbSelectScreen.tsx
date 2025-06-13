import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

import presentData from '../data/present.json';
import simplePastData from '../data/simple-past.json';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { useRef } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'VerbSelect'>;

export default function VerbSelectScreen({ route, navigation }: Props) {
    const { tense } = route.params;
    const data = tense === 'present' ? presentData : simplePastData;

    // Create animated values for each verb item
    const buttonAnimations = useRef(
        data.map(() => new Animated.Value(1))
    ).current;

    const animateButton = (index: number) => {
        Animated.sequence([
            Animated.timing(buttonAnimations[index], {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnimations[index], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };

    const getTitle = () => {
        switch (tense) {
            case 'present':
                return 'Ενεστώτας (Present)'
            case 'aorist':
                return 'Αόριστος (Simple Past)'
            case 'imperfect':
                return 'Παρατατικός (Imperfect)'
            default:
                return 'Μέλλοντας (Future)'
        }
    }

    return (
        <View style={styles.container}>
            <BackgroundBlobs
                backgroundColor='transparent'
                blobCount={4}
                animated={true}
                maxOpacity={50}
            />

            <Text style={styles.title}>
                {getTitle()}
            </Text>

            <FlatList
                data={data}
                style={styles.buttonContainer}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                    <Animated.View
                        style={[
                            styles.buttonWrapper,
                            { transform: [{ scale: buttonAnimations[index] }] }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.8}
                            onPress={() => {
                                animateButton(index);
                                setTimeout(() => {
                                    navigation.navigate('Game', { tense, verbIndex: index });
                                }, 150);
                            }}
                        >
                            <View style={styles.buttonInner}>
                                <View style={styles.greekPattern} />
                                <Text style={styles.buttonText}>
                                    {item.verb} ({item.translation})
                                </Text>
                                <View style={styles.greekPattern} />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                contentContainerStyle={{ paddingVertical: 20 }}
            />

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons
                    style={styles.exitIcon}
                    name="location-exit"
                    size={hp(7)}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DB9046',
        paddingHorizontal: hp(5),
        paddingTop: hp(7),
    },
    title: {
        fontSize: hp(4),
        fontWeight: '400',
        fontFamily: 'Pagkaki',
        color: '#251f20',
        textAlign: 'center',
        lineHeight: hp(5),
    },
    exitIcon: {
        paddingBlock: hp(3),
        alignSelf: 'flex-end'
    },
    buttonContainer: {
        width: wp(80),
        alignSelf: 'center',
    },
    buttonWrapper: {
        width: wp(80),
        marginBottom: hp(1.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#943416',
    },
    buttonInner: {
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    buttonText: {
        fontSize: hp(2.25),
        fontWeight: '600',
        fontFamily: 'Roboto_400Regular',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    greekPattern: {
        height: 2,
        width: '80%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: hp(0.75),
    },
});
