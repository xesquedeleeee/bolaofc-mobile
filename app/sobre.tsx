import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/theme";
import { useThemeColors } from "../src/hooks/useThemeColors";
import {
  Star,
  X,
  User,
  ChevronRight,
  ArrowLeft,
} from "lucide-react-native";

export default function Sobre() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft color={Colors.primary} size={20} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.hero}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.text }]}>BolãoFC</Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Versão 1.0.0
        </Text>
      </View>

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
          <View style={styles.starsRow}>
            <Star color={Colors.warning} size={16} fill={Colors.warning} />
            <Star color={Colors.warning} size={16} fill={Colors.warning} />
            <Star color={Colors.warning} size={16} fill={Colors.warning} />
          </View>
          <Text style={[styles.pointText, { color: colors.textMuted }]}>
            Placar exato acertado = 3 pontos
          </Text>
        </View>
        <View style={styles.pointRow}>
          <View style={styles.starsRow}>
            <Star color={Colors.warning} size={16} fill={Colors.warning} />
          </View>
          <Text style={[styles.pointText, { color: colors.textMuted }]}>
            Acertou o vencedor = 1 ponto
          </Text>
        </View>
        <View style={styles.pointRow}>
          <X color={Colors.danger} size={20} />
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
        {[
          { name: "Luan", role: "Auth + User", route: "/perfil-luan" },
          { name: "Alexis", role: "Championship + Match", route: "/perfil-alexis" },
          { name: "Levi", role: "Bet + Ranking", route: "/perfil-levi" },
        ].map((member) => (
          <TouchableOpacity
            key={member.name}
            style={[styles.memberRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push(member.route as any)}
          >
            <View style={styles.memberLeft}>
              <View
                style={[
                  styles.avatarSmall,
                  { backgroundColor: colors.cardLight },
                ]}
              >
                <User color={colors.textMuted} size={16} />
              </View>
              <View>
                <Text style={[styles.memberName, { color: colors.text }]}>
                  {member.name}
                </Text>
                <Text style={[styles.memberRole, { color: colors.textMuted }]}>
                  {member.role}
                </Text>
              </View>
            </View>
            <ChevronRight color={colors.textMuted} size={16} />
          </TouchableOpacity>
        ))}
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
  },
  hero: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
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
    gap: 12,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
    width: 60,
  },
  pointText: {
    fontSize: 14,
    flex: 1,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
  },
  memberRole: {
    fontSize: 12,
    marginTop: 2,
  },
});