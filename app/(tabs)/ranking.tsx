import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import api from "../../src/services/api";
import { Colors } from "../../constants/theme";
import { useThemeColors } from "../../src/hooks/useThemeColors";
import { Medal, Trophy, Award } from "lucide-react-native";

interface RankingItem {
  user: { id: string; name: string; email: string };
  totalPoints: number;
  totalBets: number;
}

const MedalIcon = ({ index }: { index: number }) => {
  if (index === 0) return <Trophy color="#FFD700" size={28} fill="#FFD700" />;
  if (index === 1) return <Medal color="#C0C0C0" size={28} fill="#C0C0C0" />;
  if (index === 2) return <Award color="#CD7F32" size={28} fill="#CD7F32" />;
  return <Text style={styles.position}>{index + 1}.</Text>;
};

export default function Ranking() {
  const colors = useThemeColors();
  const { data, isLoading } = useQuery({
    queryKey: ["ranking"],
    queryFn: () => api.get("/bets/ranking").then((r) => r.data),
  });

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={Colors.warning} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleRow}>
        <Medal color={Colors.primary} size={24} />
        <Text style={[styles.title, { color: colors.text }]}>Ranking Geral</Text>
      </View>

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
            <View style={styles.medalContainer}>
              <MedalIcon index={index} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>{item.user.name}</Text>
              <Text style={[styles.bets, { color: colors.textMuted }]}>{item.totalBets} palpites</Text>
            </View>
            <Text style={[styles.points, { color: colors.textMuted }, index === 0 && styles.pointsFirst]}>
              {item.totalPoints} pts
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>Nenhum palpite registrado ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  cardFirst: { borderColor: Colors.warning, backgroundColor: "#1c1a0f" },
  medalContainer: { width: 36, alignItems: "center" },
  position: { fontSize: 18, fontWeight: "bold", color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  bets: { fontSize: 12 },
  points: { fontSize: 18, fontWeight: "bold" },
  pointsFirst: { color: Colors.warning },
  empty: { textAlign: "center", marginTop: 40, fontSize: 14 },
});