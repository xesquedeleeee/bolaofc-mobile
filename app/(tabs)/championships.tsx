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
import { useRouter } from 'expo-router';
import { useState } from 'react';
import api from '../../src/services/api';
import { Colors } from '../../constants/theme';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { Trophy, Trash2, X, UserPlus, LogOut } from 'lucide-react-native';
import useAuthStore from '../../src/store/authStore';

interface Championship {
  id: string;
  name: string;
  season: string;
  description: string;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
}

export default function Championships() {
  const router = useRouter();
  const qc = useQueryClient();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get('/championships').then((r) => r.data),
  });

  const { data: myLeagues } = useQuery({
    queryKey: ['my-leagues'],
    queryFn: () => api.get('/championships/my-leagues').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/championships', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['championships'] });
      qc.invalidateQueries({ queryKey: ['my-leagues'] });
      setShowForm(false);
      setName('');
      setSeason('');
      setDescription('');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível criar a liga.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/championships/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['championships'] });
      qc.invalidateQueries({ queryKey: ['my-leagues'] });
    },
    onError: () => Alert.alert('Erro', 'Não foi possível deletar a liga.'),
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => api.post(`/championships/${id}/join`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['championships'] });
      qc.invalidateQueries({ queryKey: ['my-leagues'] });
      Alert.alert('Sucesso', 'Você entrou na liga!');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível entrar na liga.'),
  });

  const leaveMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/championships/${id}/leave`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['championships'] });
      qc.invalidateQueries({ queryKey: ['my-leagues'] });
      Alert.alert('Sucesso', 'Você saiu da liga.');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível sair da liga.'),
  });

  function handleCreate() {
    if (!name || !season) {
      Alert.alert('Atenção', 'Nome e temporada são obrigatórios.');
      return;
    }
    createMutation.mutate({ name, season, description });
  }

  function handleDelete(id: string) {
    Alert.alert('Confirmar', 'Deseja deletar esta liga?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  }

  function handleJoin(id: string) {
    Alert.alert('Entrar na Liga', 'Deseja entrar nesta liga?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Entrar', onPress: () => joinMutation.mutate(id) },
    ]);
  }

  function handleLeave(id: string) {
    Alert.alert('Sair da Liga', 'Deseja sair desta liga?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => leaveMutation.mutate(id) },
    ]);
  }

  const myLeagueIds = new Set((myLeagues || []).map((l: any) => l.id));
  const isOwner = (item: Championship) => item.userId === user?.id;
  const isMember = (item: Championship) => myLeagueIds.has(item.id);

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
          <Text style={[styles.title, { color: colors.text }]}>Ligas</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <X color={Colors.white} size={18} />
          ) : (
            <Text style={styles.addButtonText}>+ Nova</Text>
          )}
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Nome da liga"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Temporada (ex: 2026)"
            placeholderTextColor={colors.textMuted}
            value={season}
            onChangeText={setSeason}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Descrição (opcional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitButtonText}>
              {createMutation.isPending ? 'Criando...' : 'Criar Liga'}
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
            style={[styles.card, { backgroundColor: colors.card, borderColor: isOwner(item) ? Colors.primary : colors.border }]}
            onPress={() => router.push(`/championship/${item.id}`)}
          >
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  {isOwner(item) && (
                    <View style={styles.ownerBadge}>
                      <Text style={styles.ownerBadgeText}>Dono</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  Temporada {item.season}
                </Text>
                {item.user && (
                  <Text style={[styles.cardOwner, { color: colors.textMuted }]}>
                    👤 {item.user.name}
                  </Text>
                )}
              </View>
              <View style={styles.cardActions}>
                {isOwner(item) ? (
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.actionButton}
                  >
                    <Trash2 color={Colors.danger} size={20} />
                  </TouchableOpacity>
                ) : isMember(item) ? (
                  <TouchableOpacity
                    onPress={() => handleLeave(item.id)}
                    style={styles.actionButton}
                  >
                    <LogOut color={colors.textMuted} size={20} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleJoin(item.id)}
                    style={styles.joinButton}
                  >
                    <UserPlus color={Colors.white} size={16} />
                    <Text style={styles.joinButtonText}>Entrar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Nenhuma liga cadastrada ainda.
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  cardOwner: {
    fontSize: 12,
    marginTop: 2,
  },
  cardActions: {
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  joinButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  joinButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  ownerBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ownerBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});