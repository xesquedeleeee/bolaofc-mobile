import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 

} from 'react-native'; 

import { useQuery } from '@tanstack/react-query'; 
import api from '../../src/services/api'; 
import { Colors } from '../../constants/theme'; 

interface RankingItem { 
  user: { 
    id: string; 
    name: string; 
    email: string; 
  }; 
  totalPoints: number; 
  totalBets: number; 
} 
export default function Ranking() { 
  const { data, isLoading } = useQuery({ 
    queryKey: ['ranking'], 
    queryFn: () => api.get('/bets/ranking').then((r) => r.data), 
  }); 
  const medals = ['🥇', '🥈', '🥉']; 

  if (isLoading) { 

    return ( 
      <View style={styles.centered}> 
        <ActivityIndicator color={Colors.warning} size="large" /> 
      </View> 
    ); 
  } 
  return ( 

    <View style={styles.container}> 

      <Text style={styles.title}>🏅 Ranking Geral</Text> 

  

      <FlatList 

        data={data} 

        keyExtractor={(item) => item.user.id} 

        contentContainerStyle={styles.list} 

        renderItem={({ item, index }: { item: RankingItem; index: number }) => ( 

          <View style={[styles.card, index === 0 && styles.cardFirst]}> 

            <Text style={styles.medal}> 

              {medals[index] || `${index + 1}.`} 

            </Text> 

            <View style={styles.info}> 

              <Text style={styles.name}>{item.user.name}</Text> 

              <Text style={styles.bets}>{item.totalBets} palpites</Text> 

            </View> 

            <Text style={[styles.points, index === 0 && styles.pointsFirst]}> 

              {item.totalPoints} pts 

            </Text> 
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

  title: { 

    fontSize: 24, 
    fontWeight: 'bold', 
    color: Colors.text, 
    paddingHorizontal: 20, 
    marginBottom: 20, 
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
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
  }, 
  cardFirst: { 
    borderColor: Colors.warning, 
    backgroundColor: '#1c1a0f', 
  }, 

  medal: { 
    fontSize: 28, 
    width: 40, 
  }, 

  info: { 
    flex: 1, 
  }, 
  name: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginBottom: 2, 
  }, 
  bets: { 
    fontSize: 12, 
    color: Colors.textMuted, 
  }, 
  points: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.textMuted, 
  }, 
  pointsFirst: { 
    color: Colors.warning, 
  }, 
  empty: { 
    color: Colors.textMuted, 
    textAlign: 'center', 
    marginTop: 40, 
    fontSize: 14, 
  }, 
}); 