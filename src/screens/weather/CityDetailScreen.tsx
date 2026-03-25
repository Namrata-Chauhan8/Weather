import { useMemo, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import type { WeatherStackParamList } from './WeatherNavigator';
import { themeForWeatherMain } from '../../theme';
import { weatherIconUrl } from './fetchWeather';
import { Stat } from '../../component/stats';
import Forecast from '../forecast/Forecast';

type Props = NativeStackScreenProps<WeatherStackParamList, 'CityDetail'>;

const CityDetailScreen = ({ route, navigation }: Props) => {
  const { cityData } = route.params;
  const insets = useSafeAreaInsets();
  const primary = cityData.weather[0];

  const [isFahrenheit, setIsFahrenheit] = useState(false);

  const theme = useMemo(
    () => themeForWeatherMain(primary?.main as any),
    [primary],
  );

  const sys = cityData.sys as any;
  const formatTime = (unix?: number) => {
    if (!unix) {
      return '—';
    }
    const d = new Date(unix * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTemp = (tempC: number) => {
    if (isFahrenheit) {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }
    return `${Math.round(tempC)}°`;
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            paddingLeft: Math.max(insets.left, 16),
            paddingRight: Math.max(insets.right, 16),
            backgroundColor: theme.surface,
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: theme.background, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Icon
            name={Platform.OS === 'ios' ? 'arrow-back' : 'arrow-back'}
            size={24}
            color={theme.text}
          />
        </Pressable>
        <Text
          style={[styles.headerTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {cityData.name}
          {cityData.sys.country ? `, ${cityData.sys.country}` : ''}
        </Text>
        <View style={styles.unitToggle}>
          <Text
            style={[
              styles.unitText,
              { color: !isFahrenheit ? theme.text : theme.textMuted },
            ]}
          >
            °C
          </Text>
          <Switch
            value={isFahrenheit}
            onValueChange={setIsFahrenheit}
            trackColor={{ false: theme.surface, true: theme.surface }}
            thumbColor={Platform.OS === 'android' ? theme.text : undefined}
            ios_backgroundColor={theme.surface}
            style={{
              transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
              marginHorizontal: -4,
            }}
          />
          <Text
            style={[
              styles.unitText,
              { color: isFahrenheit ? theme.text : theme.textMuted },
            ]}
          >
            °F
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: insets.bottom + 32,
            paddingLeft: Math.max(insets.left, 20),
            paddingRight: Math.max(insets.right, 20),
          },
        ]}
      >
        {/* ── Hero Card ──────────────────────────────────────── */}
        <View style={[styles.hero, { backgroundColor: theme.surface }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroText}>
              <Text style={[styles.heroCity, { color: theme.text }]}>
                {cityData.name}, {cityData.sys.country ?? ''}
              </Text>
              <Text style={[styles.heroCondition, { color: theme.textMuted }]}>
                {primary?.description ?? '—'}
              </Text>
            </View>
            {primary?.icon && (
              <Image
                accessibilityIgnoresInvertColors
                source={{ uri: weatherIconUrl(primary.icon) }}
                style={styles.heroIcon}
              />
            )}
          </View>

          <Text style={[styles.heroTemp, { color: theme.text }]}>
            {formatTemp(cityData.main.temp)}
          </Text>
          <View style={styles.heroBottom}>
            <Text style={[styles.heroFeels, { color: theme.textMuted }]}>
              Feels like {formatTemp(cityData.main.feels_like)}
            </Text>
            {/* Day */}
            <Text style={[styles.heroCondition, { color: theme.text }]}>
              {new Date().toLocaleDateString([], { weekday: 'long' })},{' '}
              {new Date().toLocaleDateString([], { hour12: true })}
            </Text>
          </View>
        </View>

        {/* ── Details ────────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          DETAILS
        </Text>
        <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
          <View style={styles.statsRow}>
            <Stat
              label="Humidity"
              value={`${cityData.main.humidity}%`}
              theme={theme}
            />
            <Stat
              label="Wind"
              value={`${cityData.wind.speed} m/s`}
              theme={theme}
            />
            <Stat
              label="Pressure"
              value={`${cityData.main.pressure} hPa`}
              theme={theme}
            />
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.background }]}
          />

          <View style={styles.statsRow}>
            <Stat
              label="Min Temp"
              value={formatTemp(
                (cityData.main as any).temp_min ?? cityData.main.temp,
              )}
              theme={theme}
            />
            <Stat
              label="Max Temp"
              value={formatTemp(
                (cityData.main as any).temp_max ?? cityData.main.temp,
              )}
              theme={theme}
            />
            <Stat
              label="Visibility"
              value={
                (cityData as any).visibility
                  ? `${((cityData as any).visibility / 1000).toFixed(1)} km`
                  : '—'
              }
              theme={theme}
            />
          </View>

          {(sys?.sunrise || sys?.sunset) && (
            <>
              <View
                style={[styles.divider, { backgroundColor: theme.background }]}
              />
              <View style={styles.statsRow}>
                <Stat
                  label={
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Icon name="sunny" size={24} color={theme.text} />
                      <Text style={{ color: theme.text, marginLeft: 6 }}>
                        Sunrise
                      </Text>
                    </View>
                  }
                  value={formatTime(sys.sunrise)}
                  theme={theme}
                />
                <Stat
                  label={
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Icon name="moon" size={24} color={theme.text} />
                      <Text style={{ color: theme.text, marginLeft: 6 }}>
                        Sunset
                      </Text>
                    </View>
                  }
                  value={formatTime(sys.sunset)}
                  theme={theme}
                />
                <Stat
                  label="Wind Dir"
                  value={
                    (cityData.wind as any).deg != null
                      ? `${(cityData.wind as any).deg}°`
                      : '—'
                  }
                  theme={theme}
                />
              </View>
            </>
          )}
        </View>

        <Forecast
          city={cityData.name}
          theme={theme}
          isFahrenheit={isFahrenheit}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 26,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 40,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    paddingTop: 20,
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroText: {
    flex: 1,
  },
  heroCity: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroCountry: {
    fontSize: 15,
    marginTop: 2,
  },
  heroCondition: {
    fontSize: 15,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  heroIcon: {
    width: 100,
    height: 100,
  },
  heroTemp: {
    fontSize: 80,
    fontWeight: '100',
    letterSpacing: -4,
    marginTop: 4,
  },
  heroFeels: {
    fontSize: 15,
    marginTop: -8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CityDetailScreen;
