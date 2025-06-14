import { useEffect, useRef, useState, useMemo } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    Text,
    GestureResponderEvent,
    ImageBackground,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShipImage from '../assets/ship.png';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_SHIP_WIDTH = wp(50);
const SHIP_HEIGHT = hp(20);
const WAVE_HEIGHT = hp(5);
const LANES = 3;
const SHIP_SPEED = 100;

const PATTERN_ROWS = [
    '-   -   -   -  -   - ',
    ' -  -  -  -   -  - - ',
    '  -  -   -   -  - -  ',
];
const PATTERN_LENGTH = PATTERN_ROWS[0].length;
const PATTERN_INTERVAL = 1200;

const CHAR_WIDTH = wp(7);
const PADDING = hp(10);
const getShipWidth = (form: string) =>
    Math.max(BASE_SHIP_WIDTH, form.length * CHAR_WIDTH + PADDING);

interface ShipInstance {
    id: number;
    animX: Animated.Value;
    y: number;
    form: string;
    lane: number;
    dismissed?: boolean;
}
let shipIdCounter = 0;

interface Props {
    conjugations: string[];
    onShipPress: (form: string) => void;
}

export default function AnimatedShips({
    conjugations,
    onShipPress,
}: Props) {
    const [ships, setShips] = useState<ShipInstance[]>([]);

    // Spawn ships by pattern
    const uniqueForms = useMemo(
        () => Array.from(new Set(conjugations)),
        [conjugations]
    );
    const formIndexRef = useRef(0);
    const patternStepRef = useRef(0);

    const spawnShip = (lane: number, form: string) => {
        const width = getShipWidth(form);
        const minY = SCREEN_HEIGHT * 0.3;
        const maxY = SCREEN_HEIGHT - WAVE_HEIGHT - SHIP_HEIGHT;
        const laneSpacing = LANES > 1 ? (maxY - minY) / (LANES - 1) : 0;
        const y = minY + lane * laneSpacing;

        const distance = SCREEN_WIDTH + width;
        const duration = (distance / SHIP_SPEED) * 1000;

        const id = shipIdCounter++;
        const animX = new Animated.Value(SCREEN_WIDTH);
        const newShip: ShipInstance = { id, animX, y, form, lane, dismissed: false };
        setShips(prev => [...prev, newShip]);

        Animated.timing(animX, {
            toValue: -width,
            duration,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                setShips(prev => prev.filter(s => s.id !== id));
            }, 0);
        });
    };

    const spawnShipInPatternIndex = () => {
        const step = patternStepRef.current;
        for (let lane = 0; lane < LANES; lane++) {
            if (PATTERN_ROWS[lane][step] === '-') {
                const form = uniqueForms[formIndexRef.current];
                spawnShip(lane, form);
                formIndexRef.current = (formIndexRef.current + 1) % uniqueForms.length;
            }
        }
        patternStepRef.current = (step + 1) % PATTERN_LENGTH;
    };

    useEffect(() => {
        const interval = setInterval(spawnShipInPatternIndex, PATTERN_INTERVAL);
        return () => clearInterval(interval);
    }, [uniqueForms]);

    // Ontouch will be remove the current ship
    const handleResponderRelease = (
        ship: ShipInstance,
        e: GestureResponderEvent
    ) => {
        onShipPress(ship.form);

        setShips(prev =>
            prev.map(s =>
                s.id === ship.id ? { ...s, dismissed: true } : s
            )
        );
    };

    return (
        <View style={StyleSheet.absoluteFill}>
            {ships.map(ship => {
                if (ship.dismissed) return null;
                const width = getShipWidth(ship.form);
                return (
                    <Animated.View
                        key={ship.id}
                        style={{
                            position: 'absolute',
                            top: ship.y,
                            transform: [{ translateX: ship.animX }],
                            width,
                            height: SHIP_HEIGHT,
                            zIndex: 10,
                        }}
                        onStartShouldSetResponder={() => true}
                        onResponderRelease={e => handleResponderRelease(ship, e)}
                    >
                        <ImageBackground
                            source={ShipImage}
                            style={{
                                width,
                                height: SHIP_HEIGHT,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            resizeMode="stretch"
                        >
                            <View style={styles.textOverlay} pointerEvents="none">
                                <Text style={styles.shipText}>{ship.form}</Text>
                            </View>
                        </ImageBackground>
                    </Animated.View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    textOverlay: {
        position: 'absolute',
        backgroundColor: '#251f20',
        top: hp(2),
        paddingHorizontal: hp(2),
        paddingVertical: hp(1),
        borderRadius: 4,
    },
    shipText: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: 'white',
    },
});
