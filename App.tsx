import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppModeProvider } from './src/context/AppModeContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { LayoutDashboard, Sprout, BrainCircuit, BellRing, User } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Pages
import Login from './src/pages/Login';
import ForgotPassword from './src/pages/ForgotPassword';
import Overview from './src/pages/Overview';
import GreenhouseRouter from './src/pages/GreenhouseRouter';
import SmartRouter from './src/pages/SmartRouter';
import AlertsRouter from './src/pages/AlertsRouter';
import Profile from './src/pages/Profile';
import DataEntry from './src/pages/DataEntry';
import DataTrace from './src/pages/DataTrace';
import FertilizerRecord from './src/pages/FertilizerRecord';
import CarbonFootprint from './src/pages/CarbonFootprint';
import Settings from './src/pages/Settings';
import Help from './src/pages/Help';
import About from './src/pages/About';
import QuickIrrigation from './src/pages/QuickIrrigation';
import DeviceSettings from './src/pages/DeviceSettings';
import AiChat from './src/pages/AiChat';

// Types
import { AppRoute } from './src/types';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      id="MainTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopColor: '#f3f4f6',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#059669', // emerald-600
        tabBarInactiveTintColor: '#9ca3af', // gray-400
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ color, focused }) => {
          let Icon: any = LayoutDashboard;
          if (route.name === AppRoute.OVERVIEW) Icon = LayoutDashboard;
          else if (route.name === AppRoute.GREENHOUSE) Icon = Sprout;
          else if (route.name === AppRoute.SMART) Icon = BrainCircuit;
          else if (route.name === AppRoute.ALERTS) Icon = BellRing;
          else if (route.name === AppRoute.PROFILE) Icon = User;
          
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 12, marginTop: focused ? -4 : 0 }}>
               <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ); 
        },
      })}
    >
      <Tab.Screen name={AppRoute.OVERVIEW} component={Overview} options={{ title: '总览' }} />
      <Tab.Screen name={AppRoute.GREENHOUSE} component={GreenhouseRouter} options={{ title: '大棚' }} />
      <Tab.Screen name={AppRoute.SMART} component={SmartRouter} options={{ title: '智能' }} />
      <Tab.Screen name={AppRoute.ALERTS} component={AlertsRouter} options={{ title: '告警' }} />
      <Tab.Screen name={AppRoute.PROFILE} component={Profile} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppModeProvider>
          <NavigationContainer>
            <Stack.Navigator 
              id="RootStack"
              initialRouteName={AppRoute.LOGIN}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name={AppRoute.LOGIN} component={Login} />
              <Stack.Screen name={AppRoute.FORGOT_PASSWORD} component={ForgotPassword} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name={AppRoute.DATA_ENTRY} component={DataEntry} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.DATA_TRACE} component={DataTrace} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.FERTILIZER_RECORD} component={FertilizerRecord} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.CARBON_FOOTPRINT} component={CarbonFootprint} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.SETTINGS} component={Settings} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.HELP} component={Help} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.ABOUT} component={About} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.QUICK_IRRIGATION} component={QuickIrrigation} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.DEVICE_SETTINGS} component={DeviceSettings} options={{ presentation: 'modal' }} />
              <Stack.Screen name={AppRoute.AI_CHAT} component={AiChat} options={{ presentation: 'modal' }} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="dark" />
        </AppModeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;