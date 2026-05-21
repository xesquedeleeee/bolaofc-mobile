import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../src/services/api";
import { Colors } from "../../constants/theme";
import { useThemeColors } from "../../src/hooks/useThemeColors";
import {
  Target,
  Pencil,
  Trash2,
  Star,
  X,
  ChevronDown,
} from "lucide-react-native";

interface Bet {
  id: string;
  matchId: string;
  predictedHome: number;
  predictedAway: number;
  points: number;
  match?: {
    homeTeam: string;
    awayTeam: string;
  };
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
}

export default function Bets() {
  const qc = useQueryClient();
  const colors = useThemeColors();
  const [showForm, setShowForm] = useState(false);
  const [showMatchPicker, setShowMatchPicker] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [predictedHome, setPredictedHome] = useState("");
  const [predictedAway, setPredictedAway] = useState("");
  const [editingBet, setEditingBet] = useState<Bet | null>(null);
  const [editHome, setEditHome] = useState("");
  const [editAway, setEditAway] = useState("");

  const {
    data: bets,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["bets"],
    queryFn: () => api.get("/bets").then((r) => r.data),
  });

  const { data: matches } = useQuery({
    queryKey: ["all-matches"],
    queryFn: () => api.get("/matches").then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/bets", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bets"] });
      setShowForm(false);
      setSelectedMatch(null);
      setPredictedHome("");
      setPredictedAway("");
    },
    onError: () => Alert.alert("Erro", "Não foi possível registrar o palpite."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/bets/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bets"] });
      setEditingBet(null);
      setEditHome("");
      setEditAway("");
    },
    onError: () => Alert.alert("Erro", "Não foi possível atualizar o palpite."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/bets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bets"] }),
    onError: () => Alert.alert("Erro", "Não foi possível deletar o palpite."),
  });

  function handleCreate() {
    if (!selectedMatch || predictedHome === "" || predictedAway === "") {
      Alert.alert("Atenção", "Selecione uma partida e preencha os palpites.");
      return;
    }
    createMutation.mutate({
      matchId: selectedMatch.id,
      predictedHome: Number(predictedHome),
      predictedAway: Number(predictedAway),
    });
  }

  function handleEdit(bet: Bet) {
    setEditingBet(bet);
    setEditHome(String(bet.predictedHome));
    setEditAway(String(bet.predictedAway));
  }

  function handleUpdate() {
    if (!editingBet || editHome === "" || editAway === "") {
      Alert.alert("Atenção", "Preencha os dois palpites.");
      return;
    }
    updateMutation.mutate({
      id: editingBet.id,
      data: {
        predictedHome: Number(editHome),
        predictedAway: Number(editAway),
      },
    });
  }

  function handleDelete(id: string) {
    Alert.alert("Confirmar", "Deseja deletar este palpite?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={Colors.secondary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Target color={Colors.primary} size={24} />
          <Text style={[styles.title, { color: colors.text }]}>
            Meus Palpites
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <X color={Colors.white} size={18} />
          ) : (
            <Text style={styles.addButtonText}>+ Novo</Text>
          )}
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TouchableOpacity
            style={[
              styles.matchPicker,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
              },
            ]}
            onPress={() => setShowMatchPicker(true)}
          >
            <Text style={[styles.matchPickerText, { color: colors.text }]}>
              {selectedMatch
                ? `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`
                : "Selecionar partida..."}
            </Text>
            <ChevronDown color={colors.textMuted} size={16} />
          </TouchableOpacity>

          {selectedMatch && (
            <>
              <View style={styles.scoreRow}>
                <View style={styles.scoreTeam}>
                  <Text
                    style={[
                      styles.scoreTeamName,
                      { color: colors.textMuted },
                    ]}
                  >
                    {selectedMatch.homeTeam}
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
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    value={predictedHome}
                    onChangeText={setPredictedHome}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                </View>
                <Text style={[styles.scoreSeparator, { color: colors.text }]}>
                  x
                </Text>
                <View style={styles.scoreTeam}>
                  <Text
                    style={[
                      styles.scoreTeamName,
                      { color: colors.textMuted },
                    ]}
                  >
                    {selectedMatch.awayTeam}
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
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    value={predictedAway}
                    onChangeText={setPredictedAway}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreate}
              >
                <Text style={styles.submitButtonText}>
                  {createMutation.isPending
                    ? "Registrando..."
                    : "Registrar Palpite"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <Modal visible={showMatchPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Selecionar Partida
            </Text>
            <ScrollView>
              {matches?.map((match: Match) => (
                <TouchableOpacity
                  key={match.id}
                  style={[
                    styles.matchOption,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => {
                    setSelectedMatch(match);
                    setShowMatchPicker(false);
                  }}
                >
                  <Text
                    style={[styles.matchOptionText, { color: colors.text }]}
                  >
                    {match.homeTeam} vs {match.awayTeam}
                  </Text>
                  <Text
                    style={[
                      styles.matchOptionDate,
                      { color: colors.textMuted },
                    ]}
                  >
                    {new Date(match.matchDate).toLocaleDateString("pt-BR")}
                  </Text>
                </TouchableOpacity>
              ))}
              {(!matches || matches.length === 0) && (
                <Text style={[styles.empty, { color: colors.textMuted }]}>
                  Nenhuma partida disponível.
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.modalClose,
                { backgroundColor: colors.cardLight },
              ]}
              onPress={() => setShowMatchPicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.text }]}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={!!editingBet} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <View style={styles.modalTitleRow}>
              <Pencil color={Colors.primary} size={18} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Editar Palpite
              </Text>
            </View>
            {editingBet?.match && (
              <Text
                style={[styles.editMatchName, { color: colors.textMuted }]}
              >
                {editingBet.match.homeTeam} vs {editingBet.match.awayTeam}
              </Text>
            )}
            <View style={styles.scoreRow}>
              <View style={styles.scoreTeam}>
                <Text
                  style={[styles.scoreTeamName, { color: colors.textMuted }]}
                >
                  Casa
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
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={editHome}
                  onChangeText={setEditHome}
                  keyboardType="numeric"
                  textAlign="center"
                />
              </View>
              <Text style={[styles.scoreSeparator, { color: colors.text }]}>
                x
              </Text>
              <View style={styles.scoreTeam}>
                <Text
                  style={[styles.scoreTeamName, { color: colors.textMuted }]}
                >
                  Fora
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
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={editAway}
                  onChangeText={setEditAway}
                  keyboardType="numeric"
                  textAlign="center"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUpdate}
            >
              <Text style={styles.submitButtonText}>
                {updateMutation.isPending ? "Salvando..." : "Salvar Palpite"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalClose,
                { backgroundColor: colors.cardLight },
              ]}
              onPress={() => setEditingBet(null)}
            >
              <Text style={[styles.modalCloseText, { color: colors.text }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={bets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={({ item }: { item: Bet }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.matchInfo, { color: colors.text }]}>
                {item.match
                  ? `${item.match.homeTeam} vs ${item.match.awayTeam}`
                  : "Partida"}
              </Text>
              <View style={styles.pointsBadge}>
                <Star color={Colors.warning} size={14} fill={Colors.warning} />
                <Text style={styles.points}>{item.points} pts</Text>
              </View>
            </View>
            <Text style={[styles.betScore, { color: colors.textMuted }]}>
              Palpite: {item.predictedHome} x {item.predictedAway}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Pencil color={Colors.white} size={14} />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  { backgroundColor: colors.cardLight },
                ]}
                onPress={() => handleDelete(item.id)}
              >
                <Trash2 color={colors.textMuted} size={14} />
                <Text
                  style={[
                    styles.deleteButtonText,
                    { color: colors.textMuted },
                  ]}
                >
                  Deletar
                </Text>
              </TouchableOpacity>
            </View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  matchPicker: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchPickerText: {
    fontSize: 14,
    flex: 1,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  scoreTeam: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  scoreTeamName: {
    fontSize: 13,
    textAlign: "center",
  },
  scoreInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    fontSize: 20,
    width: "100%",
  },
  scoreSeparator: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editMatchName: {
    fontSize: 14,
    marginBottom: 16,
  },
  matchOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  matchOptionText: {
    fontSize: 15,
    fontWeight: "600",
  },
  matchOptionDate: {
    fontSize: 12,
    marginTop: 2,
  },
  modalClose: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  modalCloseText: {
    fontWeight: "600",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  matchInfo: {
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  points: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.warning,
  },
  betScore: {
    fontSize: 14,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  deleteButtonText: {
    fontSize: 13,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
});