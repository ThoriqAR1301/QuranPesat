import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Beranda" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="quran"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📖" label="Al-Quran" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="artikel"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📰" label="Artikel" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚙️" label="Pengaturan" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🤖" label="AI" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.light,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
});