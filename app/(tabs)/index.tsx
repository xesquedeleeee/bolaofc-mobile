import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import useAuthStore from '../../src/store/authStore';

export default function Home() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/(auth)/login');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name} 👋</Text>
          <Text style={styles.subtitle}>Bem-vindo ao BolãoFC!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerEmoji}>🏆</Text>
        <Text style={styles.bannerTitle}>BolãoFC</Text>
        <Text style={styles.bannerSubtitle}>
          Faça seus palpites e dispute com seus amigos!
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/championships')}
        >
          <Text style={styles.cardEmoji}>🏆</Text>
          <Text style={styles.cardTitle}>Campeonatos</Text>
          <Text style={styles.cardSubtitle}>Ver todos os campeonatos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/bets')}
        >
          <Text style={styles.cardEmoji}>🎯</Text>
          <Text style={styles.cardTitle}>Palpites</Text>
          <Text style={styles.cardSubtitle}>Registre seus palpites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/ranking')}
        >
          <Text style={styles.cardEmoji}>🏅</Text>
          <Text style={styles.cardTitle}>Ranking</Text>
          <Text style={styles.cardSubtitle}>Veja a classificação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/sobre')}
        >
          <Text style={styles.cardEmoji}>ℹ️</Text>
          <Text style={styles.cardTitle}>Sobre</Text>
          <Text style={styles.cardSubtitle}>Sobre o app</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  bannerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: '47%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});