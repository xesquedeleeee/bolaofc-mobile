import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/theme";
import useAuthStore from "../../src/store/authStore";
import useThemeStore from "../../src/store/themeStore";
import { useThemeColors } from "../../src/hooks/useThemeColors";

export default function Home() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const colors = useThemeColors();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/(auth)/login");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Olá, {user?.name} 👋
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Bem-vindo ao BolãoFC!
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={toggleTheme}
          >
            <Text style={{ fontSize: 16 }}>{isDark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: colors.textMuted }]}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerEmoji}>🏆</Text>
        <Text style={styles.bannerTitle}>BolãoFC</Text>
        <Text style={styles.bannerSubtitle}>
          Faça seus palpites e dispute com seus amigos!
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Acesso Rápido
      </Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push("/(tabs)/championships")}
        >
          <Text style={styles.cardEmoji}>🏆</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Campeonatos
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Ver todos os campeonatos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push("/(tabs)/bets")}
        >
          <Text style={styles.cardEmoji}>🎯</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Palpites
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Registre seus palpites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push("/(tabs)/ranking")}
        >
          <Text style={styles.cardEmoji}>🏅</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Ranking
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Veja a classificação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => router.push("/sobre")}
        >
          <Text style={styles.cardEmoji}>ℹ️</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sobre</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
            Sobre o app
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 13,
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
  },
  bannerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    width: "47%",
    borderWidth: 1,
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
  },
});
