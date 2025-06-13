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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BackgroundBlobs } from '../components/BackgroundBlobs';

interface Props {
    isWin: boolean;
    score: number;
    onRetry: () => void;
    onExit: () => void;
}

export default function EndScreen({
    isWin,
    score,
    onRetry,
    onExit,
}: Props) {
    const title = isWin ? 'Amazing!' : 'Game Over';
    const subtitle = isWin
        ? `You reached ${score} points 🎉`
        : `You ran out of lives 💀`;

    return (
        <View style={styles.container}>
            <BackgroundBlobs
                backgroundColor='transparent'
                blobCount={2}
                animated={true}
                maxOpacity={80}
            />
            <View style={styles.spacer} />

            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={onRetry}>
                    <Text style={styles.buttonText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.exitButton]}
                    onPress={onExit}
                >
                    <MaterialCommunityIcons
                        name="location-exit"
                        size={20}
                        color="white"
                    />
                    <Text style={styles.buttonText}> Exit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.spacer} />


            <Image
                source={isWin
                    ? require('../assets/victory.png')
                    : require('../assets/lose.png')
                }
                style={styles.image}
                resizeMode="contain"
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DB9046',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hp(5),
    },
    spacer: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: hp(2),
    },
    title: {
        fontSize: hp(8),
        fontWeight: '400',
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Pagkaki',
        lineHeight: hp(9)
    },
    subtitle: {
        fontSize: hp(2.5),
        color: '#fff',
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row',
        gap: wp(5),
        marginBottom: hp(20),
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#943416',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(10),
        borderRadius: 8,
        alignItems: 'center',
    },
    exitButton: {
        backgroundColor: '#6e2c2c',
    },
    buttonText: {
        fontSize: hp(2),
        fontWeight: '600',
        color: '#fff',
    },
    image: {
        position: 'absolute',
        bottom: 0,
        width: wp(100),
        height: hp(33),
    },
});
