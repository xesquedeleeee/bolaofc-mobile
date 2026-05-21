import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import api from "../../src/services/api";
import { Colors } from "../../constants/theme";
import { useThemeColors } from "../../src/hooks/useThemeColors";
import { ArrowLeft, Plus, X, Swords, Trash2, Calendar } from "lucide-react-native";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  homeScore: number | null;
  awayScore: number | null;
}

export default function ChampionshipDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const colors = useThemeColors();
  const [showForm, setShowForm] = useState(false);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: championship, isLoading } = useQuery({
    queryKey: ["championship", id],
    queryFn: () => api.get(`/championships/${id}`).then((r) => r.data),
  });

  const {
    data: matches,
    isLoading: loadingMatches,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["matches", id],
    queryFn: () => api.get(`/championships/${id}/matches`).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/matches", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matches", id] });
      setShowForm(false);
      setHomeTeam("");
      setAwayTeam("");
      setMatchDate("");
    },
    onError: () => Alert.alert("Erro", "Não foi possível criar a partida."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ matchId, data }: any) =>
      api.put(`/matches/${matchId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matches", id] });
      setEditingId(null);
      setHomeScore("");
      setAwayScore("");
    },
    onError: () => Alert.alert("Erro", "Não foi possível atualizar o placar."),
  });

  const deleteMutation = useMutation({
    mutationFn: (matchId: string) => api.delete(`/matches/${matchId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matches", id] }),
    onError: () => Alert.alert("Erro", "Não foi possível deletar a partida."),
  });

  function handleCreate() {
    if (!homeTeam || !awayTeam || !matchDate) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    createMutation.mutate({
      homeTeam,
      awayTeam,
      matchDate: new Date(matchDate).toISOString(),
      championshipId: id,
    });
  }

  function handleUpdateScore(matchId: string) {
    if (homeScore === "" || awayScore === "") {
      Alert.alert("Atenção", "Preencha os dois placares.");
      return;
    }
    updateMutation.mutate({
      matchId,
      data: { homeScore: Number(homeScore), awayScore: Number(awayScore) },
    });
  }

  function handleDelete(matchId: string) {
    Alert.alert("Confirmar", "Deseja deletar esta partida?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () => deleteMutation.mutate(matchId),
      },
    ]);
  }

  if (isLoading || loadingMatches) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={Colors.primary} size={20} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>
            {showForm ? <X color={Colors.white} size={18} /> : <><Plus color={Colors.white} size={16} /><Text style={styles.addButtonText}>Partida</Text></>}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        {championship?.name}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Temporada {championship?.season}
      </Text>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder="Time da casa (ex: Brasil)"
            placeholderTextColor={colors.textMuted}
            value={homeTeam}
            onChangeText={setHomeTeam}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder="Time visitante (ex: Argentina)"
            placeholderTextColor={colors.textMuted}
            value={awayTeam}
            onChangeText={setAwayTeam}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder="Data (ex: 2026-06-15)"
            placeholderTextColor={colors.textMuted}
            value={matchDate}
            onChangeText={setMatchDate}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitButtonText}>
              {createMutation.isPending ? "Criando..." : "Criar Partida"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={({ item }: { item: Match }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.matchRow}>
              <Text style={[styles.team, { color: colors.text }]}>
                {item.homeTeam}
              </Text>
              <Text style={styles.vs}>
                {item.homeScore !== null
                  ? `${item.homeScore} x ${item.awayScore}`
                  : "vs"}
              </Text>
              <Text style={[styles.team, { color: colors.text }]}>
                {item.awayTeam}
              </Text>
            </View>

            <View style={styles.dateRow}>
              <Calendar color={colors.textMuted} size={13} />
              <Text style={[styles.date, { color: colors.textMuted }]}>
              {new Date(item.matchDate).toLocaleDateString("pt-BR")}
              </Text>
            </View>

            {editingId === item.id && (
              <View style={styles.scoreForm}>
                <TextInput
                  style={[
                    styles.scoreInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Casa"
                  placeholderTextColor={colors.textMuted}
                  value={homeScore}
                  onChangeText={setHomeScore}
                  keyboardType="numeric"
                />
                <Text style={[styles.scoreSeparator, { color: colors.text }]}>
                  x
                </Text>
                <TextInput
                  style={[
                    styles.scoreInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Fora"
                  placeholderTextColor={colors.textMuted}
                  value={awayScore}
                  onChangeText={setAwayScore}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleUpdateScore(item.id)}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.cardLight },
                ]}
                onPress={() => {
                  setEditingId(editingId === item.id ? null : item.id);
                  setHomeScore("");
                  setAwayScore("");
                }}
              >
                <Swords color={colors.textMuted} size={14} />
                <Text>Placar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.cardLight },
                ]}
                onPress={() => handleDelete(item.id)}
              >
                <Trash2 color={colors.textMuted} size={14} />
                <Text>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Nenhuma partida cadastrada ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  team: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  vs: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    paddingHorizontal: 8,
  },
  date: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  scoreForm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  scoreInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: "center",
  },
  scoreSeparator: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    fontSize: 13,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  dateRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  marginBottom: 10,
},
});
