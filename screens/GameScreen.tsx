import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { useState, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '../components/Header';
import AnimatedShips from '../components/AnimatedShips';
import AnimatedWave from '../components/AnimatedWave';
import EndScreen from './EndScreen';

import presentData from '../data/present.json';
import simplePastData from '../data/simple-past.json';
import pronouns from '../data/pronouns.json';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ route, navigation }: Props) {
    const { tense, verbIndex } = route.params;
    const data = tense === 'present' ? presentData : simplePastData;
    const conjugationData = data[verbIndex];

    const audioSource = require('../sound/music.mp3');
    const player = useAudioPlayer(audioSource);
    const status = useAudioPlayerStatus(player);

    useEffect(() => { player.play(); }, []);
    useEffect(() => {
        if (status.didJustFinish) {
            player.seekTo(0);
            player.play();
        }
    }, [status]);

    const [guess] = useState({
        verb: conjugationData.verb,
        translation: conjugationData.translation,
    });

    const [targetIndex, setTargetIndex] = useState(() =>
        Math.floor(Math.random() * conjugationData.conjugations.length)
    );

    const targetForm = conjugationData.conjugations[targetIndex];

    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    const handleShipPress = (form: string) => {
        if (form === targetForm) {
            setScore(s => s + 1);
            setTargetIndex(prev => pickNextIndex(conjugationData.conjugations.length, prev));
        } else {
            setLives(l => l - 1);
        }
    };

    const isWin = score >= 20;
    const isLose = lives <= 0;
    const isGameOver = isWin || isLose;

    if (isGameOver) {
        return (
            <EndScreen
                isWin={isWin}
                score={score}
                onRetry={() => {
                    setScore(0);
                    setLives(3);
                    const idx = Math.floor(Math.random() * conjugationData.conjugations.length);
                    setTargetIndex(idx);
                }}
                onExit={() => navigation.replace('Intro')}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Header
                selected={{
                    pronoun: pronouns[targetIndex],
                    form: targetForm,
                }}
                guess={guess}
            />

            <View style={styles.hud}>
                <Text style={styles.hudText}>
                    <FontAwesome5 name="heartbeat" size={hp(3)} color="white" /> {lives}
                </Text>
                <Text style={styles.hudText}>
                    <FontAwesome5 name="brain" size={hp(3)} color="white" /> {score}/20
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="location-exit" size={hp(5)} color="white" />
                </TouchableOpacity>
            </View>

            <AnimatedShips
                conjugations={conjugationData.conjugations}
                onShipPress={handleShipPress}
            />

            <AnimatedWave />
        </View>
    );
}

function pickNextIndex(length: number, prevIndex: number): number {
    let next;
    do {
        next = Math.floor(Math.random() * length);
    } while (next === prevIndex);
    return next;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DB9046',
    },
    hud: {
        paddingTop: hp(1.25),
        width: wp(90),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
    },
    hudText: {
        fontFamily: 'Roboto_400Regular',
        fontSize: hp(3),
        color: '#fff',
    },
});
