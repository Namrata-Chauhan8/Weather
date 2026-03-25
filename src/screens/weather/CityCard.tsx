import { useMemo } from "react";
import { OpenWeatherResponse } from "./types";
import { themeForWeatherMain } from "../../theme";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { weatherIconUrl } from "./fetchWeather";

interface CityCardProps {
    data: OpenWeatherResponse;
    onPress?: () => void;
}

const CityCard = ({ data, onPress }: CityCardProps) => {
    const primary = data.weather[0];
    const cardTheme = useMemo(() => themeForWeatherMain(primary?.main as any), [primary]);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                cityStyles.card,
                { backgroundColor: cardTheme.surface, opacity: pressed ? 0.85 : 1 },
            ]}>
            <View style={cityStyles.row}>
                <View style={cityStyles.info}>
                    <Text style={[cityStyles.cityName, { color: cardTheme.text }]} numberOfLines={1}>
                        {data.name}{data.sys.country ? `, ${data.sys.country}` : ''}
                    </Text>
                    <Text style={[cityStyles.condition, { color: cardTheme.textMuted }]} numberOfLines={1}>
                        {primary?.description ?? '—'}
                    </Text>
                    <View style={cityStyles.metaRow}>
                        <Text style={[cityStyles.meta, { color: cardTheme.textMuted }]}>
                            💧 {data.main.humidity}%
                        </Text>
                        <Text style={[cityStyles.meta, { color: cardTheme.textMuted }]}>
                            💨 {data.wind.speed} m/s
                        </Text>
                    </View>
                </View>
                <View style={cityStyles.tempCol}>
                    {primary?.icon ? (
                        <Image
                            accessibilityIgnoresInvertColors
                            source={{ uri: weatherIconUrl(primary.icon) }}
                            style={cityStyles.icon}
                        />
                    ) : null}
                    <Text style={[cityStyles.temp, { color: cardTheme.text }]}>
                        {Math.round(data.main.temp)}°
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

const cityStyles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    info: {
        flex: 1,
        paddingRight: 8,
    },
    cityName: {
        fontSize: 18,
        fontWeight: '700',
    },
    condition: {
        fontSize: 13,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    meta: {
        fontSize: 13,
    },
    tempCol: {
        alignItems: 'center',
    },
    icon: {
        width: 56,
        height: 56,
    },
    temp: {
        fontSize: 28,
        fontWeight: '200',
        textAlign: 'center',
    },
});   

export default CityCard;