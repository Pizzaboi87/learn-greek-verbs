import Row from '../assets/row.svg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface Props {
    selected: {
        form: string;
        pronoun: string;
    },
    guess: {
        translation: string;
        verb: string;
    }
}

export default function Header({ selected, guess }: Props) {
    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    const rowWidth = 100;
    const count = Math.ceil(SCREEN_WIDTH / rowWidth);

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                {Array.from({ length: count }).map((_, i) => (
                    <Row key={`l-${i}`} width={rowWidth} height={20} style={styles.rotate} />
                ))}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.verb}>
                    {guess.verb} <Text style={styles.label}>({guess.translation})</Text>
                </Text>
                <Text style={styles.pronoun}>
                    {selected.pronoun}
                </Text>
            </View>
            <View style={styles.rowContainer}>
                {Array.from({ length: count }).map((_, i) => (
                    <Row key={`r-${i}`} width={rowWidth} height={20} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: hp(6),
        alignItems: 'center',
    },
    textContainer: {
        backgroundColor: '#943416',
        alignItems: 'center',
        width: '100%',
        marginBottom: -1,
    },
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
        overflow: 'hidden',
        marginBottom: -2,
    },
    rotate: {
        transform: [{ scaleX: -1 }],
    },
    verb: {
        fontSize: hp(3),
        fontWeight: '600',
        fontFamily: 'Roboto_400Regular',
        color: '#fff',
    },
    label: {
        fontSize: hp(3),
        fontWeight: '600',
        color: '#fff',
    },
    pronoun: {
        marginTop: hp(0.25),
        fontSize: hp(4),
        paddingBottom: 5,
        fontWeight: '600',
        fontFamily: 'Roboto_400Regular',
        color: '#fff',
    },
});
