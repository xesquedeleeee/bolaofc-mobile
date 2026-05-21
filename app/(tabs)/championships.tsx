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
import { useRouter } from "expo-router";
import { useState } from "react";
import api from "../../src/services/api";
import { Colors } from "../../constants/theme";
import { useThemeColors } from "../../src/hooks/useThemeColors";
import { Trophy, Trash2, X } from "lucide-react-native";

interface Championship {
  id: string;
  name: string;
  season: string;
  description: string;
}

export default function Championships() {
  const router = useRouter();
  const qc = useQueryClient();
  const colors = useThemeColors();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["championships"],
    queryFn: () => api.get("/championships").then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/championships", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["championships"] });
      setShowForm(false);
      setName("");
      setSeason("");
      setDescription("");
    },
    onError: () => Alert.alert("Erro", "Não foi possível criar o campeonato."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/championships/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["championships"] }),
    onError: () =>
      Alert.alert("Erro", "Não foi possível deletar o campeonato."),
  });

  function handleCreate() {
    if (!name || !season) {
      Alert.alert("Atenção", "Nome e temporada são obrigatórios.");
      return;
    }
    createMutation.mutate({ name, season, description });
  }

  function handleDelete(id: string) {
    Alert.alert("Confirmar", "Deseja deletar este campeonato?", [
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
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
        <Trophy color={Colors.primary} size={24} />
        <Text style={[styles.title, { color: colors.text }]}>Campeonatos</Text>
      </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
        {showForm ? <X color={Colors.white} size={18} /> : <Text style={styles.addButtonText}>+ Novo</Text>}
        </TouchableOpacity>
      </View>

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
            placeholder="Nome do campeonato"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
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
            placeholder="Temporada (ex: 2026)"
            placeholderTextColor={colors.textMuted}
            value={season}
            onChangeText={setSeason}
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
            placeholder="Descrição (opcional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitButtonText}>
              {createMutation.isPending ? "Criando..." : "Criar Campeonato"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={({ item }: { item: Championship }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => router.push(`/championship/${item.id}`)}
          >
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[styles.cardSubtitle, { color: colors.textMuted }]}
                >
                  Temporada {item.season}
                </Text>
                {item.description ? (
                  <Text
                    style={[
                      styles.cardDescription,
                      { color: colors.textMuted },
                    ]}
                  >
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Trash2 color={colors.textMuted} size={20} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Nenhum campeonato cadastrado ainda.
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
  },
  cardDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  titleRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},
});
