import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroScreen from './screens/IntroScreen';
import VerbSelectScreen from './screens/VerbSelectScreen';
import GameScreen from './screens/GameScreen';
import { TenseType, GameScreenType } from './types/types';

export type RootStackParamList = {
  Intro: undefined;
  VerbSelect: TenseType;
  Game: GameScreenType;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    'Pagkaki': require('./assets/fonts/pagkaki.ttf')
  });

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="VerbSelect" component={VerbSelectScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DB9046' },
});
