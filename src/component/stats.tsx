import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { themeForWeatherMain } from "../theme";

export function Stat({
    label,
    value,
    theme,
}: {
    label: React.ReactNode;
    value: string;
    theme: ReturnType<typeof themeForWeatherMain>;
}) {
    return (
        <View style={styles.stat}>
            {typeof label === 'string' ? (
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
            ) : (
                <View style={{ marginBottom: 4 }}>{label}</View>
            )}
            <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    stat: {
        flex: 1,
    },
    statLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
    },
});
