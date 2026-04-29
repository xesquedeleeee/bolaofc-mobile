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

interface Championship {
  id: string;
  name: string;
  season: string;
  description: string;
}

export default function Championships() {
  const router = useRouter();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [season, setSeason] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get('/championships').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/championships', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['championships'] });
      setShowForm(false);
      setName('');
      setSeason('');
      setDescription('');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível criar o campeonato.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/championships/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['championships'] }),
    onError: () => Alert.alert('Erro', 'Não foi possível deletar o campeonato.'),
  });

  function handleCreate() {
    if (!name || !season) {
      Alert.alert('Atenção', 'Nome e temporada são obrigatórios.');
      return;
    }
    createMutation.mutate({ name, season, description });
  }

  function handleDelete(id: string) {
    Alert.alert('Confirmar', 'Deseja deletar este campeonato?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Campeonatos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? '✕' : '+ Novo'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome do campeonato"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Temporada (ex: 2026)"
            placeholderTextColor={Colors.textMuted}
            value={season}
            onChangeText={setSeason}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição (opcional)"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitButtonText}>
              {createMutation.isPending ? 'Criando...' : 'Criar Campeonato'}
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
            style={styles.card}
            onPress={() => router.push(`/championship/${item.id}`)}
          >
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>Temporada {item.season}</Text>
                {item.description ? (
                  <Text style={styles.cardDescription}>{item.description}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum campeonato cadastrado ainda.</Text>
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  cardDescription: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
  },
  empty: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});