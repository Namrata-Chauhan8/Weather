import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { OpenWeatherResponse } from './types';
import { themeForWeatherMain } from '../../theme';
import { fetchWeatherByCity, weatherIconUrl } from './fetchWeather';
import { Stat } from '../../component/stats';
import CityCard from './CityCard';
import type { WeatherStackParamList } from './WeatherNavigator';

type WeatherNavProp = NativeStackNavigationProp<
  WeatherStackParamList,
  'Weather'
>;

const POPULAR_CITIES = [
  'Delhi',
  'New York',
  'London',
  'Canada',
  'Japan',
  'Australia',
];

const Weather = () => {
  const navigation = useNavigation<WeatherNavProp>();
  const safeAreaInsets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<OpenWeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [cityWeathers, setCityWeathers] = useState<OpenWeatherResponse[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadCities() {
      setCitiesLoading(true);
      const results: OpenWeatherResponse[] = [];
      for (const city of POPULAR_CITIES) {
        try {
          const data = await fetchWeatherByCity(city);
          if (!cancelled) results.push(data);
        } catch {
          // skip cities that fail
        }
      }
      if (!cancelled) {
        setCityWeathers(results);
        setCitiesLoading(false);
      }
    }
    loadCities();
    return () => {
      cancelled = true;
    };
  }, []);

  const theme = useMemo(() => {
    const main = weather?.weather[0]?.main;
    return themeForWeatherMain(main);
  }, [weather]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await fetchWeatherByCity(query);
      setWeather(data);
    } catch (e) {
      setWeather(null);
      const message = e instanceof Error ? e.message : 'Something went wrong.';
      Toast.show({
        type: 'error',
        text1: message,
        visibilityTime: 4500,
      });
    } finally {
      setLoading(false);
    }
  };

  const primary = weather?.weather[0];

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: safeAreaInsets.top + 12,
            paddingBottom: safeAreaInsets.bottom + 24,
            paddingLeft: Math.max(safeAreaInsets.left, 20),
            paddingRight: Math.max(safeAreaInsets.right, 20),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // iOS 13+: native keyboard inset adjustment (most reliable on iOS)
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios' ? true : false}
      >
        <Text style={[styles.title, { color: theme.text }]}>Weather</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Search by city
        </Text>

        <View style={[styles.searchRow, { backgroundColor: theme.surface }]}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="City name"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text }]}
            onSubmitEditing={handleSearch}
            editable={!loading}
          />
          <Pressable
            onPress={handleSearch}
            disabled={loading || query.trim() === ''}
            style={({ pressed }) => [
              styles.searchButton,
              { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
              loading && styles.searchButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <Text style={styles.searchButtonLabel}>Search</Text>
            )}
          </Pressable>
        </View>

        {weather && primary ? (
          <Pressable
            style={[styles.card, { backgroundColor: theme.surface }]}
            onPress={() =>
              navigation.navigate('CityDetail', { cityData: weather })
            }
          >
            <View style={styles.resultHeader}>
              <View style={styles.resultTitles}>
                <Text style={[styles.city, { color: theme.text }]}>
                  {weather.name}
                  {weather.sys.country ? `, ${weather.sys.country}` : ''}
                </Text>
                <Text style={[styles.condition, { color: theme.textMuted }]}>
                  {primary.description}
                </Text>
              </View>
              <Image
                accessibilityIgnoresInvertColors
                source={{ uri: weatherIconUrl(primary.icon) }}
                style={styles.icon}
              />
            </View>

            <Text style={[styles.temp, { color: theme.text }]}>
              {Math.round(weather.main.temp)}°
            </Text>
            <Text style={[styles.feels, { color: theme.textMuted }]}>
              Feels like {Math.round(weather.main.feels_like)}°
            </Text>

            <View style={styles.statsRow}>
              <Stat
                label="Humidity"
                value={`${weather.main.humidity}%`}
                theme={theme}
              />
              <Stat
                label="Wind"
                value={`${weather.wind.speed} m/s`}
                theme={theme}
              />
              <Stat
                label="Pressure"
                value={`${weather.main.pressure} hPa`}
                theme={theme}
              />
            </View>
          </Pressable>
        ) : (
          <></>
        )}

        {/* ── Popular Cities Section ─────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          🌍 Popular Cities
        </Text>
        {citiesLoading ? (
          <ActivityIndicator
            color={theme.accent}
            size="large"
            style={styles.citiesLoader}
          />
        ) : (
          cityWeathers.map(cityData => (
            <CityCard
              key={cityData.name}
              data={cityData}
              onPress={() => navigation.navigate('CityDetail', { cityData })}
            />
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 12,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  searchButtonLabel: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitles: {
    flex: 1,
    paddingRight: 8,
  },
  city: {
    fontSize: 24,
    fontWeight: '700',
  },
  condition: {
    fontSize: 16,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  icon: {
    width: 96,
    height: 96,
  },
  temp: {
    fontSize: 64,
    fontWeight: '200',
    marginTop: 8,
  },
  feels: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 12,
  },
  citiesLoader: {
    marginVertical: 24,
  },
});

export default Weather;
