import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { TenseType } from '../types/types';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { useRef } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

const selectOptions = [
    { title: 'Ενεστώτας (Present)', tense: 'present' },
    { title: 'Αόριστος (Simple Past)', tense: 'aorist' },
    { title: 'Παρατατικός (Imperfect)', tense: 'imperfect' },
    { title: 'Μέλλοντας (Future)', tense: 'future' }
];

export default function IntroScreen({ navigation }: Props) {
    // Create animated values for each button
    const buttonAnimations = useRef(
        selectOptions.map(() => new Animated.Value(1))
    ).current;

    // Handle button press animation
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

    return (
        <View style={styles.container}>
            <BackgroundBlobs
                backgroundColor='transparent'
                blobCount={4}
                animated={true}
                maxOpacity={50}
            />

            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.centerContent}>
                <Text style={styles.title}>Choose a Tense</Text>

                <View style={styles.buttonContainer}>
                    {selectOptions.map(({ title, tense }, index) => (
                        <Animated.View
                            key={tense}
                            style={[
                                styles.buttonWrapper,
                                { transform: [{ scale: buttonAnimations[index] }] }
                            ]}
                        >
                            <TouchableOpacity
                                key={tense}
                                style={styles.button}
                                onPress={() => {
                                    animateButton(index);
                                    setTimeout(() => {
                                        navigation.navigate('VerbSelect', { tense } as TenseType);
                                    }, 150);
                                }}
                                activeOpacity={0.8}
                            >
                                <View style={styles.buttonInner}>
                                    <View style={styles.greekPattern} />
                                    <Text style={styles.buttonText}>{title}</Text>
                                    <View style={styles.greekPattern} />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </View>

            <Image
                source={require('../assets/women.png')}
                style={styles.women}
                resizeMode="contain"
            />
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
    logo: {
        width: wp(80),
        height: hp(12),
        resizeMode: 'contain',
        opacity: 0.85,
        marginBottom: hp(3),
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: hp(4),
        fontWeight: '400',
        fontFamily: 'Pagkaki',
        color: '#251f20',
        textAlign: 'center',
        lineHeight: hp(6)
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        alignItems: 'center',
        gap: hp(1.5),
    },
    buttonWrapper: {
        width: wp(80),
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
        paddingHorizontal: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    buttonText: {
        fontSize: hp(2),
        fontWeight: '600',
        fontFamily: 'Roboto_400Regular',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: wp(0.2),
    },
    greekPattern: {
        height: hp(0.2),
        width: '80%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: hp(0.5),
        position: 'relative',
    },
    women: {
        width: wp(90),
        height: hp(27),
        resizeMode: 'contain',
    },
});