import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useThemeColors } from "../../src/hooks/useThemeColors";
import { Home, Trophy, Target, Medal } from "lucide-react-native";

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="championships"
        options={{
          title: "Campeonatos",
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="bets"
        options={{
          title: "Palpites",
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color, size }) => <Medal color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
