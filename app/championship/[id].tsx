import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import api from '../../src/services/api';
import { Colors } from '../../constants/theme';

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
  const [showForm, setShowForm] = useState(false);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: championship, isLoading } = useQuery({
    queryKey: ['championship', id],
    queryFn: () => api.get(`/championships/${id}`).then((r) => r.data),
  });

  const { data: matches, isLoading: loadingMatches } = useQuery({
    queryKey: ['matches', id],
    queryFn: () => api.get(`/championships/${id}/matches`).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/matches', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matches', id] });
      setShowForm(false);
      setHomeTeam('');
      setAwayTeam('');
      setMatchDate('');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível criar a partida.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ matchId, data }: any) =>
      api.put(`/matches/${matchId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matches', id] });
      setEditingId(null);
      setHomeScore('');
      setAwayScore('');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível atualizar o placar.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (matchId: string) => api.delete(`/matches/${matchId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matches', id] }),
    onError: () => Alert.alert('Erro', 'Não foi possível deletar a partida.'),
  });

  function handleCreate() {
    if (!homeTeam || !awayTeam || !matchDate) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
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
    if (homeScore === '' || awayScore === '') {
      Alert.alert('Atenção', 'Preencha os dois placares.');
      return;
    }
    updateMutation.mutate({
      matchId,
      data: {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
      },
    });
  }

  function handleDelete(matchId: string) {
    Alert.alert('Confirmar', 'Deseja deletar esta partida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(matchId),
      },
    ]);
  }

  if (isLoading || loadingMatches) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? '✕' : '+ Partida'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{championship?.name}</Text>
      <Text style={styles.subtitle}>Temporada {championship?.season}</Text>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Time da casa (ex: Brasil)"
            placeholderTextColor={Colors.textMuted}
            value={homeTeam}
            onChangeText={setHomeTeam}
          />
          <TextInput
            style={styles.input}
            placeholder="Time visitante (ex: Argentina)"
            placeholderTextColor={Colors.textMuted}
            value={awayTeam}
            onChangeText={setAwayTeam}
          />
          <TextInput
            style={styles.input}
            placeholder="Data (ex: 2026-06-15)"
            placeholderTextColor={Colors.textMuted}
            value={matchDate}
            onChangeText={setMatchDate}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitButtonText}>
              {createMutation.isPending ? 'Criando...' : 'Criar Partida'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Match }) => (
          <View style={styles.card}>
            <View style={styles.matchRow}>
              <Text style={styles.team}>{item.homeTeam}</Text>
              <Text style={styles.vs}>
                {item.homeScore !== null
                  ? `${item.homeScore} x ${item.awayScore}`
                  : 'vs'}
              </Text>
              <Text style={styles.team}>{item.awayTeam}</Text>
            </View>

            <Text style={styles.date}>
              📅 {new Date(item.matchDate).toLocaleDateString('pt-BR')}
            </Text>

            {editingId === item.id ? (
              <View style={styles.scoreForm}>
                <TextInput
                  style={styles.scoreInput}
                  placeholder="Casa"
                  placeholderTextColor={Colors.textMuted}
                  value={homeScore}
                  onChangeText={setHomeScore}
                  keyboardType="numeric"
                />
                <Text style={styles.scoreSeparator}>x</Text>
                <TextInput
                  style={styles.scoreInput}
                  placeholder="Fora"
                  placeholderTextColor={Colors.textMuted}
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
            ) : null}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setEditingId(editingId === item.id ? null : item.id);
                  setHomeScore('');
                  setAwayScore('');
                }}
              >
                <Text style={styles.actionText}>⚽ Placar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>🗑️ Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma partida cadastrada ainda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  team: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    paddingHorizontal: 8,
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  scoreInput: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  scoreSeparator: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.cardLight,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  empty: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});