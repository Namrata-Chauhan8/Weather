import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import WeatherNavigator from './src/screens/weather/WeatherNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <WeatherNavigator />
      <Toast />
    </SafeAreaProvider>
  );
}

export default App;
