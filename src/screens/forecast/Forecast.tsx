import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { fetchForecastByCity, weatherIconUrl } from '../weather/fetchWeather';
import type { ForecastItem } from '../weather/types';
import type { WeatherTheme } from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    city: string;
    theme: WeatherTheme;
    isFahrenheit: boolean;
}

const Forecast = ({ city, theme, isFahrenheit }: Props) => {
    const [loading, setLoading] = useState(true);
    const [dailyForecast, setDailyForecast] = useState<ForecastItem[]>([]);

    useEffect(() => {
        async function loadForecast() {
            try {
                const res = await fetchForecastByCity(city);

                const daysMap = new Map<string, ForecastItem>();

                for (const item of res.list) {
                    const d = new Date(item.dt * 1000);
                    const dayKey = d.toLocaleDateString();
                    if (!daysMap.has(dayKey)) {
                        daysMap.set(dayKey, item);
                    }
                }

                setDailyForecast(Array.from(daysMap.values()).slice(1, 6));
            } catch (err) {
                console.warn(err);
            } finally {
                setLoading(false);
            }
        }

        loadForecast();
    }, [city]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator color={theme.text} />
            </View>
        );
    }

    if (dailyForecast.length === 0) {
        return null;
    }

    const formatTemp = (tempC: number) => {
        if (isFahrenheit) {
            return `${Math.round(tempC * 9 / 5 + 32)}°F`;
        }
        return `${Math.round(tempC)}°C`;
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.textMuted }]}>5-DAY FORECAST</Text>

            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                {dailyForecast?.map((item, idx) => {
                    const primary = item.weather[0];
                    console.log(primary);
                    const d = new Date(item.dt * 1000);
                    const dayStr = d.toLocaleDateString([], { weekday: 'short' });

                    return (
                        <View key={item.dt} style={[
                            styles.row,
                            idx !== dailyForecast.length - 1 && [styles.divider, { borderBottomColor: theme.background }]
                        ]}>
                            <Text style={[styles.dayText, { color: theme.text }]}>{dayStr}</Text>

                            <View style={styles.conditionCol}>
                                {primary?.icon && (
                                    <Image
                                        source={{ uri: weatherIconUrl(primary.icon) }}
                                        style={styles.icon}
                                    />
                                )}
                                <Text style={[styles.desc, { color: theme.textMuted }]}>
                                    {primary?.main}
                                </Text>
                            </View>
                            <View style={styles.humidityCol}>
                                <Icon name="water-outline" size={16} color={theme.textMuted} />
                                <Text style={[styles.desc, { color: theme.textMuted }]}>
                                    {item?.main?.humidity}%
                                </Text>
                            </View>
                            <View style={styles.tempCol}>
                                <Text style={[styles.tempMax, { color: theme.text }]}>
                                    {formatTemp(item.main.temp_max)}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loader: {
        padding: 40,
        alignItems: 'center',
    },
    container: {
        marginTop: 24,
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 10,
        marginLeft: 4,
    },
    card: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    divider: {
        borderBottomWidth: 1,
    },
    dayText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    conditionCol: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        width: 32,
        height: 32,
    },
    desc: {
        fontSize: 15,
        textTransform: 'capitalize',
    },
    tempCol: {
        flex: 1,
        alignItems: 'flex-end',
    },
    tempMax: {
        fontSize: 18,
        fontWeight: '600',
    },
    humidityCol: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
});

export default Forecast;
