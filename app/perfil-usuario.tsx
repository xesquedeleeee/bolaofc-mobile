import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit2, Lock, Trash2, LogOut, ChevronRight } from "lucide-react-native";
import { Colors } from "../constants/theme";
import { useThemeColors } from "../src/hooks/useThemeColors";
import useAuthStore from "../src/store/authStore";
import api from "../src/services/api";

export default function PerfilUsuario() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, logout, setAuth, accessToken, refreshToken } = useAuthStore();

  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newName, setNewName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => api.put("/users/me", { name }),
    onSuccess: (res) => {
      setAuth(
        res.data.data ?? { ...user!, name: newName },
        accessToken!,
        refreshToken!,
      );
      setEditingName(false);
      Alert.alert("Sucesso", "Nome atualizado!");
    },
    onError: () => Alert.alert("Erro", "Não foi possível atualizar o nome."),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: any) => api.put("/users/me/password", data),
    onSuccess: () => {
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Sucesso", "Senha atualizada!");
    },
    onError: () =>
      Alert.alert(
        "Erro",
        "Não foi possível atualizar a senha. Verifique a senha atual.",
      ),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => api.delete("/users/me"),
    onSuccess: () => {
      logout();
      router.replace("/(auth)/login");
    },
    onError: () => Alert.alert("Erro", "Não foi possível deletar a conta."),
  });

  function handleUpdateName() {
    if (!newName.trim()) {
      Alert.alert("Atenção", "O nome não pode ser vazio.");
      return;
    }
    updateNameMutation.mutate(newName.trim());
  }

  function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Atenção", "A nova senha e a confirmação não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Atenção", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    updatePasswordMutation.mutate({ currentPassword, newPassword });
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Deletar conta",
      "Tem certeza? Esta ação é irreversível e todos os seus dados serão perdidos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => deleteAccountMutation.mutate(),
        },
      ],
    );
  }

  function handleLogout() {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: Colors.primary }]}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textMuted }]}>
          {user?.email}
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => {
            setEditingName(!editingName);
            setEditingPassword(false);
          }}
        >
          <View style={styles.cardRowLeft}>
            <Edit2 color={Colors.primary} size={18} />
            <Text style={[styles.cardRowText, { color: colors.text }]}>
              Editar nome
            </Text>
          </View>
          <ChevronRight color={colors.textMuted} size={18} />
        </TouchableOpacity>

        {editingName && (
          <View style={styles.formInline}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Novo nome"
              placeholderTextColor={colors.textMuted}
              value={newName}
              onChangeText={setNewName}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUpdateName}
              disabled={updateNameMutation.isPending}
            >
              {updateNameMutation.isPending ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Salvar nome</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => {
            setEditingPassword(!editingPassword);
            setEditingName(false);
          }}
        >
          <View style={styles.cardRowLeft}>
            <Lock color={Colors.primary} size={18} />
            <Text style={[styles.cardRowText, { color: colors.text }]}>
              Alterar senha
            </Text>
          </View>
          <ChevronRight color={colors.textMuted} size={18} />
        </TouchableOpacity>

        {editingPassword && (
          <View style={styles.formInline}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Senha atual"
              placeholderTextColor={colors.textMuted}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
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
              placeholder="Nova senha"
              placeholderTextColor={colors.textMuted}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
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
              placeholder="Confirmar nova senha"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUpdatePassword}
              disabled={updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Salvar senha</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.card,
          styles.cardRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={handleLogout}
      >
        <View style={styles.cardRowLeft}>
          <LogOut color={Colors.warning} size={18} />
          <Text style={[styles.cardRowText, { color: Colors.warning }]}>
            Sair da conta
          </Text>
        </View>
        <ChevronRight color={colors.textMuted} size={18} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.card,
          styles.cardRow,
          { backgroundColor: colors.card, borderColor: Colors.danger },
        ]}
        onPress={handleDeleteAccount}
        disabled={deleteAccountMutation.isPending}
      >
        <View style={styles.cardRowLeft}>
          <Trash2 color={Colors.danger} size={18} />
          <Text style={[styles.cardRowText, { color: Colors.danger }]}>
            Deletar conta
          </Text>
        </View>
        {deleteAccountMutation.isPending ? (
          <ActivityIndicator color={Colors.danger} size="small" />
        ) : (
          <ChevronRight color={Colors.danger} size={18} />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  backButton: { marginBottom: 24 },
  backText: { fontSize: 16 },
  avatarContainer: { alignItems: "center", marginBottom: 32 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: "bold", color: Colors.white },
  userName: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  userEmail: { fontSize: 14 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardRowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardRowText: { fontSize: 15, fontWeight: "500" },
  formInline: { marginTop: 16 },
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
  submitButtonText: { color: Colors.white, fontWeight: "600", fontSize: 15 },
});
