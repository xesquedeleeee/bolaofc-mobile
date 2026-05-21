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

export default function PerfilLuan() {
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

      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>👤</Text>
      </View>

      <Text style={[styles.name, { color: colors.text }]}>Luan</Text>
      <Text style={styles.role}>Auth + User</Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Informações
        </Text>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
            RA
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>855241</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
            Curso
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            Sistemas para Internet
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
          Contribuição no Projeto
        </Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>
          Responsável pela estrutura inicial do projeto, configuração do banco
          de dados, autenticação com JWT e Refresh Token, e telas de Login,
          Signup e Home do mobile.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Tecnologias utilizadas
        </Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>
          Express · Sequelize · JWT · NeonDB · React Native · Expo Router ·
          Zustand
        </Text>
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    fontSize: 72,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: Colors.primary,
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
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
