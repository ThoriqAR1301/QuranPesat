import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  primary: '#5B7FA6',
  text: {
    light: '#BBBBBB',
  },
  white: '#FFFFFF',
  border: '#E8E3D8',
};

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  iconName: IoniconsName;
  label: string;
  focused: boolean;
}

function TabIcon({ iconName, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={iconName}
        size={22}
        color={focused ? Colors.primary : Colors.text.light}
      />
      <Text
        style={[styles.tabLabel, focused && styles.tabLabelActive]}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
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
            <TabIcon
              iconName={focused ? 'home' : 'home-outline'}
              label="Beranda"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="quran"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName={focused ? 'book' : 'book-outline'}
              label="Al-Quran"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="artikel"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName={focused ? 'newspaper' : 'newspaper-outline'}
              label="Artikel"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName={focused ? 'settings' : 'settings-outline'}
              label="Pengaturan"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ai"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName={focused ? 'sparkles' : 'sparkles-outline'}
              label="AI"
              focused={focused}
            />
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
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.light,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
});