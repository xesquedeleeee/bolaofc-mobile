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



export default function Bets() {

    const qc = useQueryClient();

    const [showForm, setShowForm] = useState(false);

    const [matchId, setMatchId] = useState('');

    const [predictedHome, setPredictedHome] = useState('');

    const [predictedAway, setPredictedAway] = useState('');



    const { data, isLoading } = useQuery({

        queryKey: ['bets'],

        queryFn: () => api.get('/bets').then((r) => r.data),

    });



    const createMutation = useMutation({

        mutationFn: (data: any) => api.post('/bets', data),

        onSuccess: () => {

            qc.invalidateQueries({ queryKey: ['bets'] });

            setShowForm(false);

            setMatchId('');

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

        if (!matchId || predictedHome === '' || predictedAway === '') {

            Alert.alert('Atenção', 'Preencha todos os campos.');

            return;

        }

        createMutation.mutate({

            matchId,

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

                    <TextInput

                        style={styles.input}

                        placeholder="ID da Partida"

                        placeholderTextColor={Colors.textMuted}

                        value={matchId}

                        onChangeText={setMatchId}

                    />

                    <View style={styles.scoreRow}>

                        <TextInput

                            style={[styles.input, styles.scoreInput]}

                            placeholder="Gols Casa"

                            placeholderTextColor={Colors.textMuted}

                            value={predictedHome}

                            onChangeText={setPredictedHome}

                            keyboardType="numeric"

                        />

                        <Text style={styles.scoreSeparator}>x</Text>

                        <TextInput

                            style={[styles.input, styles.scoreInput]}

                            placeholder="Gols Fora"

                            placeholderTextColor={Colors.textMuted}

                            value={predictedAway}

                            onChangeText={setPredictedAway}

                            keyboardType="numeric"

                        />

                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
                        <Text style={styles.submitButtonText}>
                            {createMutation.isPending ? 'Registrando...' : 'Registrar Palpite'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <FlatList

                data={data}

                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }: { item:Bet}) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.matchInfo}>
                                {item.match
                                    ? `${item.match.homeTeam} vs ${item.match.awayTeam}`
                                    : `Partida #${item.matchId.slice(0, 8)}...`}
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
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    scoreInput: {
        flex: 1,
        textAlign: 'center',
    },
    scoreSeparator: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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