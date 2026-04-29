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
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../src/services/api';
import { Colors } from '../../constants/theme';

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
  const [showForm, setShowForm] = useState(false);
  const [showMatchPicker, setShowMatchPicker] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [predictedHome, setPredictedHome] = useState('');
  const [predictedAway, setPredictedAway] = useState('');

  const { data: bets, isLoading } = useQuery({
    queryKey: ['bets'],
    queryFn: () => api.get('/bets').then((r) => r.data),
  });

  const { data: matches } = useQuery({
    queryKey: ['all-matches'],
    queryFn: () => api.get('/matches').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/bets', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bets'] });
      setShowForm(false);
      setSelectedMatch(null);
      setPredictedHome('');
      setPredictedAway('');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível registrar o palpite.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/bets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bets'] }),
    onError: () => Alert.alert('Erro', 'Não foi possível deletar o palpite.'),
  });

  function handleCreate() {
    if (!selectedMatch || predictedHome === '' || predictedAway === '') {
      Alert.alert('Atenção', 'Selecione uma partida e preencha os palpites.');
      return;
    }
    createMutation.mutate({
      matchId: selectedMatch.id,
      predictedHome: Number(predictedHome),
      predictedAway: Number(predictedAway),
    });
  }

  function handleDelete(id: string) {
    Alert.alert('Confirmar', 'Deseja deletar este palpite?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.secondary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Meus Palpites</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? '✕' : '+ Novo'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TouchableOpacity
            style={styles.matchPicker}
            onPress={() => setShowMatchPicker(true)}
          >
            <Text style={styles.matchPickerText}>
              {selectedMatch
                ? `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`
                : 'Selecionar partida...'}
            </Text>
            <Text style={styles.matchPickerArrow}>▼</Text>
          </TouchableOpacity>

          {selectedMatch && (
            <>
              <View style={styles.scoreRow}>
                <View style={styles.scoreTeam}>
                  <Text style={styles.scoreTeamName}>{selectedMatch.homeTeam}</Text>
                  <TextInput
                    style={styles.scoreInput}
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                    value={predictedHome}
                    onChangeText={setPredictedHome}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                </View>
                <Text style={styles.scoreSeparator}>x</Text>
                <View style={styles.scoreTeam}>
                  <Text style={styles.scoreTeamName}>{selectedMatch.awayTeam}</Text>
                  <TextInput
                    style={styles.scoreInput}
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                    value={predictedAway}
                    onChangeText={setPredictedAway}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
                <Text style={styles.submitButtonText}>
                  {createMutation.isPending ? 'Registrando...' : 'Registrar Palpite'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Modal de seleção de partida */}
      <Modal visible={showMatchPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Selecionar Partida</Text>
            <ScrollView>
              {matches?.map((match: Match) => (
                <TouchableOpacity
                  key={match.id}
                  style={styles.matchOption}
                  onPress={() => {
                    setSelectedMatch(match);
                    setShowMatchPicker(false);
                  }}
                >
                  <Text style={styles.matchOptionText}>
                    {match.homeTeam} vs {match.awayTeam}
                  </Text>
                  <Text style={styles.matchOptionDate}>
                    {new Date(match.matchDate).toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
              ))}
              {(!matches || matches.length === 0) && (
                <Text style={styles.empty}>Nenhuma partida disponível.</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowMatchPicker(false)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={bets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Bet }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.matchInfo}>
                {item.match
                  ? `${item.match.homeTeam} vs ${item.match.awayTeam}`
                  : 'Partida'}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.betRow}>
              <Text style={styles.betScore}>
                Palpite: {item.predictedHome} x {item.predictedAway}
              </Text>
              <Text style={styles.points}>⭐ {item.points} pts</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum palpite registrado ainda.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  matchPicker: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchPickerText: {
    color: Colors.text,
    fontSize: 14,
  },
  matchPickerArrow: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  scoreTeam: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  scoreTeamName: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  scoreInput: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    paddingVertical: 12,
    fontSize: 20,
    color: Colors.text,
    width: '100%',
  },
  scoreSeparator: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  matchOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  matchOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  matchOptionDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  modalClose: {
    backgroundColor: Colors.cardLight,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseText: {
    color: Colors.text,
    fontWeight: '600',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchInfo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  deleteText: {
    fontSize: 20,
  },
  betRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  betScore: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  points: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.warning,
  },
  empty: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});