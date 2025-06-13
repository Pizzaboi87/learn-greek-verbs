import ShipImage from '../assets/ship.png';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

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
const MIN_SHIP_WIDTH = BASE_SHIP_WIDTH;
const PADDING = hp(10);

const getShipWidth = (form: string) =>
    Math.max(MIN_SHIP_WIDTH, form.length * CHAR_WIDTH + PADDING);

interface ShipInstance {
    id: number;
    animX: Animated.Value;
    y: number;
    form: string;
    lane: number;
}

let shipIdCounter = 0;

interface Props {
    onShipPress: (form: string) => void;
    conjugations: string[];
}

export default function AnimatedShips({
    conjugations,
    onShipPress,
}: Props) {
    const [ships, setShips] = useState<ShipInstance[]>([]);
    const shipsRef = useRef<ShipInstance[]>([]);
    useEffect(() => {
        shipsRef.current = ships;
    }, [ships]);

    const uniqueForms = useMemo(() => {
        return Array.from(new Set(conjugations));
    }, [conjugations]);

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
        const newShip: ShipInstance = { id, animX, y, form, lane };
        setShips((prev) => [...prev, newShip]);

        Animated.timing(animX, {
            toValue: -width,
            duration,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                setShips((prev) => prev.filter((s) => s.id !== id));
            }, 0);
        });
    };

    const spawnShipInPatternIndex = () => {
        const step = patternStepRef.current;
        for (let lane = 0; lane < LANES; lane++) {
            if (PATTERN_ROWS[lane][step] === '-') {
                const form = uniqueForms[formIndexRef.current];
                spawnShip(lane, form);
                formIndexRef.current =
                    (formIndexRef.current + 1) % uniqueForms.length;
            }
        }
        patternStepRef.current = (step + 1) % PATTERN_LENGTH;
    };

    useEffect(() => {
        const interval = setInterval(
            spawnShipInPatternIndex,
            PATTERN_INTERVAL
        );
        return () => clearInterval(interval);
    }, [uniqueForms]);

    return (
        <View style={StyleSheet.absoluteFill}>
            {ships.map((ship) => {
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
                        }}
                    >
                        <TouchableOpacity
                            style={styles.touchable}
                            activeOpacity={0.7}
                            onPress={() => onShipPress(ship.form)}
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
                                <View style={styles.textOverlay}>
                                    <Text style={styles.shipText}>{ship.form}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    touchable: {
        width: '100%',
        height: '100%'
    },
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
