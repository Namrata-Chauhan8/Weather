import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OpenWeatherResponse } from './types';
import Weather from './Weather';
import CityDetailScreen from './CityDetailScreen';

export type WeatherStackParamList = {
    Weather: undefined;
    CityDetail: { cityData: OpenWeatherResponse };
};

const Stack = createNativeStackNavigator<WeatherStackParamList>();

const WeatherNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="Weather" component={Weather} />
                <Stack.Screen name='CityDetail' component={CityDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default WeatherNavigator;
