import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';

export default function Sobre() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>BolãoFC</Text>
      <Text style={styles.version}>Versão 1.0.0</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sobre o App</Text>
        <Text style={styles.cardText}>
          O BolãoFC é um app de bolão de futebol onde você pode criar
          campeonatos, cadastrar partidas, fazer palpites e competir com
          seus amigos em um ranking automático de pontuação.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Como funciona a pontuação?</Text>
        <View style={styles.pointRow}>
          <Text style={styles.pointEmoji}>⭐⭐⭐</Text>
          <Text style={styles.pointText}>Placar exato acertado = 3 pontos</Text>
        </View>
        <View style={styles.pointRow}>
          <Text style={styles.pointEmoji}>⭐</Text>
          <Text style={styles.pointText}>Acertou o vencedor = 1 ponto</Text>
        </View>
        <View style={styles.pointRow}>
          <Text style={styles.pointEmoji}>❌</Text>
          <Text style={styles.pointText}>Errou o vencedor = 0 pontos</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tecnologias</Text>
        <Text style={styles.cardText}>
          React Native · Expo Router · Zustand · TanStack Query · Axios
        </Text>
        <Text style={styles.cardText}>
          Backend: Express · PostgreSQL · NeonDB · Vercel
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Equipe</Text>
        <TouchableOpacity
          style={styles.memberRow}
          onPress={() => router.push('/perfil-luan')}
        >
          <Text style={styles.memberName}>👤 Luan</Text>
          <Text style={styles.memberRole}>Auth + User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.memberRow}
          onPress={() => router.push('/perfil-alexis')}
        >
          <Text style={styles.memberName}>👤 Alexis</Text>
          <Text style={styles.memberRole}>Championship + Match</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.memberRow}
          onPress={() => router.push('/perfil-levi')}
        >
          <Text style={styles.memberName}>👤 Levi</Text>
          <Text style={styles.memberRole}>Bet + Ranking</Text>
        </TouchableOpacity>
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
  emoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
    color: Colors.textMuted,
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
    marginBottom: 4,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  pointEmoji: {
    fontSize: 16,
    width: 60,
  },
  pointText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  memberRole: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});