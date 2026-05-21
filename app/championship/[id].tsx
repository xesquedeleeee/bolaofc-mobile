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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import api from '../../src/services/api';
import { Colors } from '../../constants/theme';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import useAuthStore from '../../src/store/authStore';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  homeScore: number | null;
  awayScore: number | null;
}

interface Championship {
  id: string;
  name: string;
  season: string;
  userId: string;
  user?: { id: string; name: string };
}

interface RankingItem {
  user: { id: string; name: string; email: string };
  totalPoints: number;
  totalBets: number;
}

export default function ChampionshipDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTab, setShowTab] = useState<'partidas' | 'ranking'>('partidas');

  // Modal de palpite
  const [betMatch, setBetMatch] = useState<Match | null>(null);
  const [predictedHome, setPredictedHome] = useState('');
  const [predictedAway, setPredictedAway] = useState('');

  const { data: championship, isLoading } = useQuery({
    queryKey: ['championship', id],
    queryFn: () => api.get(`/championships/${id}`).then((r) => r.data),
  });

  const { data: matches, isLoading: loadingMatches, refetch, isRefetching } = useQuery({
    queryKey: ['matches', id],
    queryFn: () => api.get(`/championships/${id}/matches`).then((r) => r.data),
  });

  const { data: ranking, isLoading: loadingRanking, refetch: refetchRanking } = useQuery({
    queryKey: ['ranking'],
    queryFn: () => api.get('/bets/ranking').then((r) => r.data),
  });

  const { data: myBets } = useQuery({
    queryKey: ['bets'],
    queryFn: () => api.get('/bets').then((r) => r.data),
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
    mutationFn: ({ matchId, data }: any) => api.put(`/matches/${matchId}`, data),
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

  const betMutation = useMutation({
    mutationFn: (data: any) => api.post('/bets', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bets'] });
      qc.invalidateQueries({ queryKey: ['ranking'] });
      setBetMatch(null);
      setPredictedHome('');
      setPredictedAway('');
      Alert.alert('Sucesso', 'Palpite registrado!');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível registrar o palpite.'),
  });

  const isOwner = championship?.userId === user?.id;
  const now = new Date();

  const isMatchOpen = (match: Match) => {
    return new Date(match.matchDate) > now && match.homeScore === null;
  };

  const hasMyBet = (matchId: string) => {
    return (myBets || []).some((b: any) => b.matchId === matchId);
  };

  function handleCreate() {
    if (!homeTeam || !awayTeam || !matchDate) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    const brDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/;
    if (!brDateRegex.test(matchDate)) {
      Alert.alert('Atenção', 'Use o formato DD/MM/YYYY ou DD/MM/YYYY HH:MM');
      return;
    }
    createMutation.mutate({ homeTeam, awayTeam, matchDate, championshipId: id });
  }

  function handleUpdateScore(matchId: string) {
    if (homeScore === '' || awayScore === '') {
      Alert.alert('Atenção', 'Preencha os dois placares.');
      return;
    }
    updateMutation.mutate({
      matchId,
      data: { homeScore: Number(homeScore), awayScore: Number(awayScore) },
    });
  }

  function handleDelete(matchId: string) {
    Alert.alert('Confirmar', 'Deseja deletar esta partida?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: () => deleteMutation.mutate(matchId) },
    ]);
  }

  function handleBet() {
    if (!betMatch || predictedHome === '' || predictedAway === '') {
      Alert.alert('Atenção', 'Preencha os dois palpites.');
      return;
    }
    betMutation.mutate({
      matchId: betMatch.id,
      predictedHome: Number(predictedHome),
      predictedAway: Number(predictedAway),
    });
  }

  const medals = ['🥇', '🥈', '🥉'];

  if (isLoading || loadingMatches) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        {isOwner && showTab === 'partidas' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Text style={styles.addButtonText}>{showForm ? '✕' : '+ Partida'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info da liga */}
      <Text style={[styles.title, { color: colors.text }]}>{championship?.name}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Temporada {championship?.season}
      </Text>
      {championship?.user && (
        <Text style={[styles.owner, { color: colors.textMuted }]}>
          👤 Criado por {championship.user.name}{isOwner ? ' (você)' : ''}
        </Text>
      )}

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, showTab === 'partidas' && styles.tabActive]}
          onPress={() => setShowTab('partidas')}
        >
          <Text style={[styles.tabText, { color: showTab === 'partidas' ? Colors.primary : colors.textMuted }]}>
            ⚽ Partidas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, showTab === 'ranking' && styles.tabActive]}
          onPress={() => setShowTab('ranking')}
        >
          <Text style={[styles.tabText, { color: showTab === 'ranking' ? Colors.primary : colors.textMuted }]}>
            🏅 Ranking
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulário de nova partida */}
      {isOwner && showForm && showTab === 'partidas' && (
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Time da casa (ex: Brasil)"
            placeholderTextColor={colors.textMuted}
            value={homeTeam}
            onChangeText={setHomeTeam}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Time visitante (ex: Argentina)"
            placeholderTextColor={colors.textMuted}
            value={awayTeam}
            onChangeText={setAwayTeam}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Data: DD/MM/YYYY HH:MM (ex: 15/06/2026 20:00)"
            placeholderTextColor={colors.textMuted}
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

      {/* Aba Partidas */}
      {showTab === 'partidas' && (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }: { item: Match }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.matchRow}>
                <Text style={[styles.team, { color: colors.text }]}>{item.homeTeam}</Text>
                <Text style={styles.vs}>
                  {item.homeScore !== null ? `${item.homeScore} x ${item.awayScore}` : 'vs'}
                </Text>
                <Text style={[styles.team, { color: colors.text }]}>{item.awayTeam}</Text>
              </View>

              <Text style={[styles.date, { color: colors.textMuted }]}>
                📅 {new Date(item.matchDate).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </Text>

              {item.homeScore !== null && (
                <View style={styles.resultBadge}>
                  <Text style={styles.resultText}>✅ Finalizada</Text>
                </View>
              )}

              {/* Botão palpitar — apenas para membros, partidas abertas e sem palpite ainda */}
              {!isOwner && isMatchOpen(item) && !hasMyBet(item.id) && (
                <TouchableOpacity
                  style={styles.betButton}
                  onPress={() => {
                    setBetMatch(item);
                    setPredictedHome('');
                    setPredictedAway('');
                  }}
                >
                  <Text style={styles.betButtonText}>🎯 Palpitar</Text>
                </TouchableOpacity>
              )}

              {!isOwner && hasMyBet(item.id) && (
                <View style={styles.alreadyBet}>
                  <Text style={[styles.alreadyBetText, { color: colors.textMuted }]}>✓ Palpite registrado</Text>
                </View>
              )}

              {/* Ações do dono */}
              {isOwner && editingId === item.id && (
                <View style={styles.scoreForm}>
                  <TextInput
                    style={[styles.scoreInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Casa"
                    placeholderTextColor={colors.textMuted}
                    value={homeScore}
                    onChangeText={setHomeScore}
                    keyboardType="numeric"
                  />
                  <Text style={[styles.scoreSeparator, { color: colors.text }]}>x</Text>
                  <TextInput
                    style={[styles.scoreInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                    placeholder="Fora"
                    placeholderTextColor={colors.textMuted}
                    value={awayScore}
                    onChangeText={setAwayScore}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={styles.saveButton} onPress={() => handleUpdateScore(item.id)}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isOwner && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.cardLight }]}
                    onPress={() => {
                      setEditingId(editingId === item.id ? null : item.id);
                      setHomeScore('');
                      setAwayScore('');
                    }}
                  >
                    <Text style={[styles.actionText, { color: colors.textMuted }]}>⚽ Placar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.cardLight }]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={[styles.actionText, { color: colors.textMuted }]}>🗑️ Deletar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              {isOwner ? 'Clique em "+ Partida" para adicionar.' : 'Nenhuma partida ainda.'}
            </Text>
          }
        />
      )}

      {/* Aba Ranking */}
      {showTab === 'ranking' && (
        <FlatList
          data={ranking}
          keyExtractor={(item: RankingItem) => item.user.id}
          contentContainerStyle={styles.list}
          onRefresh={refetchRanking}
          refreshing={loadingRanking}
          renderItem={({ item, index }: { item: RankingItem; index: number }) => (
            <View style={[styles.rankingCard, { backgroundColor: colors.card, borderColor: index === 0 ? Colors.warning : colors.border }]}>
              <Text style={styles.medal}>{medals[index] || `${index + 1}.`}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rankingName, { color: colors.text }]}>{item.user.name}</Text>
                <Text style={[styles.rankingBets, { color: colors.textMuted }]}>{item.totalBets} palpites</Text>
              </View>
              <Text style={[styles.rankingPoints, index === 0 && styles.rankingPointsFirst]}>
                {item.totalPoints} pts
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>Nenhum palpite registrado ainda.</Text>
          }
        />
      )}

      {/* Modal de Palpite */}
      <Modal visible={!!betMatch} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>🎯 Fazer Palpite</Text>
            {betMatch && (
              <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                {betMatch.homeTeam} vs {betMatch.awayTeam}
              </Text>
            )}
            <View style={styles.scoreRow}>
              <View style={styles.scoreTeam}>
                <Text style={[styles.scoreTeamName, { color: colors.textMuted }]}>
                  {betMatch?.homeTeam}
                </Text>
                <TextInput
                  style={[styles.scoreInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={predictedHome}
                  onChangeText={setPredictedHome}
                  keyboardType="numeric"
                  textAlign="center"
                />
              </View>
              <Text style={[styles.scoreSeparator, { color: colors.text }]}>x</Text>
              <View style={styles.scoreTeam}>
                <Text style={[styles.scoreTeamName, { color: colors.textMuted }]}>
                  {betMatch?.awayTeam}
                </Text>
                <TextInput
                  style={[styles.scoreInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={predictedAway}
                  onChangeText={setPredictedAway}
                  keyboardType="numeric"
                  textAlign="center"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleBet}>
              <Text style={styles.submitButtonText}>
                {betMutation.isPending ? 'Registrando...' : 'Confirmar Palpite'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.cardLight }]}
              onPress={() => setBetMatch(null)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textMuted }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backText: { color: Colors.primary, fontSize: 16 },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  title: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 4 },
  subtitle: { fontSize: 14, paddingHorizontal: 20, marginBottom: 2 },
  owner: { fontSize: 13, paddingHorizontal: 20, marginBottom: 12 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: { paddingVertical: 10, marginRight: 24 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 15, fontWeight: '600' },
  form: { paddingHorizontal: 20, marginBottom: 16 },
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
    alignItems: 'center',
    marginBottom: 8,
  },
  submitButtonText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
  cancelButton: { borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  cancelButtonText: { fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  team: { fontSize: 15, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  vs: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, paddingHorizontal: 8 },
  date: { fontSize: 12, textAlign: 'center', marginBottom: 6 },
  resultBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  resultText: { color: Colors.white, fontSize: 11, fontWeight: '600' },
  betButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  betButtonText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  alreadyBet: { alignItems: 'center', marginTop: 8 },
  alreadyBetText: { fontSize: 13 },
  scoreForm: {
    flexDirection: 'row',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  scoreSeparator: { fontSize: 18, fontWeight: 'bold' },
  saveButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: { color: Colors.white, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  actionText: { fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  rankingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  medal: { fontSize: 28, width: 40 },
  rankingName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  rankingBets: { fontSize: 12 },
  rankingPoints: { fontSize: 18, fontWeight: 'bold', color: Colors.textMuted },
  rankingPointsFirst: { color: Colors.warning },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, marginBottom: 20 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  scoreTeam: { flex: 1, alignItems: 'center', gap: 8 },
  scoreTeamName: { fontSize: 13, textAlign: 'center' },
});