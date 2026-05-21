import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/theme";
import { useThemeColors } from "../src/hooks/useThemeColors";

export default function Sobre() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.emoji}>🏆</Text>
      <Text style={[styles.title, { color: colors.text }]}>BolãoFC</Text>
      <Text style={[styles.version, { color: colors.textMuted }]}>
        Versão 1.0.0
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Sobre o App
        </Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>
          O BolãoFC é um app de bolão de futebol onde você pode criar
          campeonatos, cadastrar partidas, fazer palpites e competir com seus
          amigos em um ranking automático de pontuação.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Como funciona a pontuação?
        </Text>
        <View style={styles.pointRow}>
          <Text style={styles.pointEmoji}>⭐⭐⭐</Text>
          <Text style={[styles.pointText, { color: colors.textMuted }]}>
            Placar exato acertado = 3 pontos
          </Text>
        </View>
        <View style={styles.pointRow}>
          <Text style={styles.pointEmoji}>⭐</Text>
          <Text style={[styles.pointText, { color: colors.textMuted }]}>
            Acertou o vencedor = 1 ponto
          </Text>
        </View>
        <View style={styles.pointRow}>
          <Text style={styles.pointEmoji}>❌</Text>
          <Text style={[styles.pointText, { color: colors.textMuted }]}>
            Errou o vencedor = 0 pontos
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Tecnologias
        </Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>
          React Native · Expo Router · Zustand · TanStack Query · Axios
        </Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>
          Backend: Express · PostgreSQL · NeonDB · Vercel
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>Equipe</Text>
        <TouchableOpacity
          style={[styles.memberRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/perfil-luan")}
        >
          <Text style={[styles.memberName, { color: colors.text }]}>
            👤 Luan
          </Text>
          <Text style={[styles.memberRole, { color: colors.textMuted }]}>
            Auth + User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.memberRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/perfil-alexis")}
        >
          <Text style={[styles.memberName, { color: colors.text }]}>
            👤 Alexis
          </Text>
          <Text style={[styles.memberRole, { color: colors.textMuted }]}>
            Championship + Match
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.memberRow, { borderBottomColor: colors.border }]}
          onPress={() => router.push("/perfil-levi")}
        >
          <Text style={[styles.memberName, { color: colors.text }]}>
            👤 Levi
          </Text>
          <Text style={[styles.memberRole, { color: colors.textMuted }]}>
            Bet + Ranking
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 28,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  pointEmoji: {
    fontSize: 16,
    width: 60,
  },
  pointText: {
    fontSize: 14,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
  },
  memberRole: {
    fontSize: 13,
  },
});
