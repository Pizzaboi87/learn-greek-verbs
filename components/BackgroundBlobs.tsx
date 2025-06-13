import { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';

type BlobProps = {
    backgroundColor?: string;
    blobCount?: number;
    animated?: boolean;
    maxOpacity?: number;
};

const { height } = Dimensions.get('window');

export const BackgroundBlobs: React.FC<BlobProps> = ({
    backgroundColor = 'transparent',
    blobCount = 8,
    animated = true,
    maxOpacity = 50,
}) => {
    const [blobs, setBlobs] = useState<Array<{
        size: number;
        x: number;
        y: number;
        opacity: number;
        animation: Animated.Value;
    }>>([]);

    const animationLoops = useRef<Animated.CompositeAnimation[]>([]);

    useEffect(() => {
        const newBlobs = Array.from({ length: blobCount }, () => {
            const size = Math.random() * 300 + 200;
            const maxOffscreen = size / 4;
            const x = Math.random() * (maxOffscreen * 2) - maxOffscreen;
            const y = Math.random() * (height + maxOffscreen * 2) - maxOffscreen;

            return {
                size,
                x,
                y,
                opacity: Math.random() * (maxOpacity * 0.7) + (maxOpacity * 0.5),
                animation: new Animated.Value(0),
            };
        });
        setBlobs(newBlobs);
    }, [blobCount, maxOpacity]);

    useEffect(() => {
        if (!animated) return;

        animationLoops.current = blobs.map(blob => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(blob.animation, {
                        toValue: 1,
                        duration: 8000 + Math.random() * 12000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(blob.animation, {
                        toValue: 0,
                        duration: 8000 + Math.random() * 12000,
                        useNativeDriver: true,
                    }),
                ])
            );
        });

        animationLoops.current.forEach(loop => loop.start());

        return () => {
            animationLoops.current.forEach(loop => loop.stop());
        };
    }, [blobs, animated]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {blobs.map((blob, index) => {
                const scale = animated
                    ? blob.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15],
                    })
                    : 1;

                const opacity = animated
                    ? blob.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [blob.opacity * 0.7, blob.opacity],
                    })
                    : blob.opacity;

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.blob,
                            {
                                width: blob.size,
                                height: blob.size,
                                left: blob.x,
                                top: blob.y,
                                opacity,
                                transform: [{ scale }],
                                borderRadius: blob.size / 2,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    blob: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});
