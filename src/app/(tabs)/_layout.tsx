import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="social" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
