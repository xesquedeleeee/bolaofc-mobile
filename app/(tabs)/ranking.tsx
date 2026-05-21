import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import api from "../../src/services/api";
import { Colors } from "../../constants/theme";
import { useThemeColors } from "../../src/hooks/useThemeColors";

interface RankingItem {
  user: {
    id: string;
    name: string;
    email: string;
  };
  totalPoints: number;
  totalBets: number;
}

export default function Ranking() {
  const colors = useThemeColors();
  const { data, isLoading } = useQuery({
    queryKey: ["ranking"],
    queryFn: () => api.get("/bets/ranking").then((r) => r.data),
  });
  const medals = ["🥇", "🥈", "🥉"];

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={Colors.warning} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        🏅 Ranking Geral
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }: { item: RankingItem; index: number }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
              index === 0 && styles.cardFirst,
            ]}
          >
            <Text style={styles.medal}>{medals[index] || `${index + 1}.`}</Text>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>
                {item.user.name}
              </Text>
              <Text style={[styles.bets, { color: colors.textMuted }]}>
                {item.totalBets} palpites
              </Text>
            </View>
            <Text
              style={[
                styles.points,
                { color: colors.textMuted },
                index === 0 && styles.pointsFirst,
              ]}
            >
              {item.totalPoints} pts
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Nenhum palpite registrado ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardFirst: { borderColor: Colors.warning, backgroundColor: "#1c1a0f" },
  medal: { fontSize: 28, width: 40 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  bets: { fontSize: 12 },
  points: { fontSize: 18, fontWeight: "bold" },
  pointsFirst: { color: Colors.warning },
  empty: { textAlign: "center", marginTop: 40, fontSize: 14 },
});
