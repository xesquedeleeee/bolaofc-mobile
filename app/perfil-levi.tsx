import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,

} from 'react-native';

import { useRouter } from 'expo-router';

import { Colors } from '../constants/theme';

export default function PerfilLevi() {
    const router = useRouter();

    return (

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>

                <Text style={styles.backText}>← Voltar</Text>

            </TouchableOpacity>

            <View style={styles.avatarContainer}>

                <Text style={styles.avatar}>👤</Text>

            </View>

            <Text style={styles.name}>Levi Vitor</Text>

            <Text style={styles.role}>Bet + Ranking</Text>

            <View style={styles.card}>

                <Text style={styles.cardTitle}>Informações</Text>

                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>RA</Text>

                    <Text style={styles.infoValue}>855503</Text>

                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Curso</Text>

                    <Text style={styles.infoValue}>Sistemas Para Internet</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Contribuição no Projeto</Text>

                <Text style={styles.cardText}>
                    Responsável pelo CRUD de palpites, lógica de pontuação automática,
                    ranking geral de usuários no backend, e telas de palpites e
                    ranking no mobile.

                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Tecnologias utilizadas</Text>
                <Text style={styles.cardText}>
                    Express · Sequelize · React Native · Expo Router · TanStack Query
                </Text>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backButton: {
        marginBottom: 24,
    },
    backText: {
        color: Colors.primary,
        fontSize: 16,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        fontSize: 72,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: Colors.secondary,
        textAlign: 'center',
        marginBottom: 28,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 14,
        color: Colors.textMuted,
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.textMuted,
    },
    infoValue: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
    },
});