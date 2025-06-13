import Wave from '../assets/wave.svg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const NUM_WAVES = 5;
const WAVE_WIDTH = wp('35%');
const WAVE_HEIGHT = hp('10%');
const WRAPPER_HEIGHT = hp('10%');
const CONTAINER_WIDTH = WAVE_WIDTH * NUM_WAVES;

export default function AnimatedWave() {
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: -WAVE_WIDTH,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [translateX]);

    return (
        <View style={styles.wrapper}>
            <Animated.View
                style={[
                    styles.waveContainer,
                    { transform: [{ translateX }] },
                ]}
            >
                {Array.from({ length: NUM_WAVES }).map((_, i) => (
                    <Wave
                        key={i}
                        width={WAVE_WIDTH}
                        height={WAVE_HEIGHT}
                    />
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: -hp('1.5%'),
        width: wp('100%'),
        height: WRAPPER_HEIGHT,
        overflow: 'hidden',
    },
    waveContainer: {
        flexDirection: 'row',
        width: CONTAINER_WIDTH,
        height: WAVE_HEIGHT,
    },
});
