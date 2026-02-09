import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { Home, Heart, MessageCircle, User } from 'lucide-react-native';

// Import Screens
import RegisterBasicInfoScreen from './src/screens/RegisterBasicInfoScreen';
import RegisterOTPScreen from './src/screens/RegisterOTPScreen';
import RegisterPhotoScreen from './src/screens/RegisterPhotoScreen';
import RegisterPersonalInfoScreen from './src/screens/RegisterPersonalInfoScreen';
import RegisterHobbiesScreen from './src/screens/RegisterHobbiesScreen';
import RegisterKTPScreen from './src/screens/RegisterKTPScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import PremiumScreen from './src/screens/PremiumScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';

// Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProfileDetail: { profile?: any };
  Premium: undefined;
  ChatRoom: { chatId: string };
};

export type AuthStackParamList = {
  BasicInfo: undefined;
  OTP: { email: string };
  Photo: undefined;
  PersonalInfo: undefined;
  Hobbies: undefined;
  KTP: undefined;
  Success: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  Matches: undefined;
  Messages: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Placeholder Screens
function MatchesScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Matches Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>My Profile Screen</Text>
    </View>
  );
}

function SuccessScreen({ navigation }: any) {
  return (
    <View style={styles.successContainer}>
      <StatusBar style="dark" />
      <View style={styles.successIcon}>
        <Text style={styles.successEmoji}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Pendaftaran Berhasil!</Text>
      <Text style={styles.successText}>
        Akun Anda sedang diverifikasi.{'\n'}
        Kami akan mengirim notifikasi setelah verifikasi selesai.
      </Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.demoText}>Demo: Lanjut ke Home</Text>
      </View>
    </View>
  );
}

// Auth Navigator
function AuthNavigator({ onAuthComplete }: { onAuthComplete: () => void }) {
  const [registrationData, setRegistrationData] = useState<any>({});

  const updateData = (step: string, data: any) => {
    setRegistrationData((prev: any) => ({
      ...prev,
      [step]: data,
    }));
  };

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen name="BasicInfo">
        {({ navigation }) => (
          <RegisterBasicInfoScreen
            onNext={(data) => {
              updateData('basicInfo', data);
              navigation.navigate('OTP', { email: data.email });
            }}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="OTP">
        {({ navigation, route }: any) => (
          <RegisterOTPScreen
            email={route.params?.email || ''}
            onNext={() => navigation.navigate('Photo')}
            onBack={() => navigation.goBack()}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="Photo">
        {({ navigation }) => (
          <RegisterPhotoScreen
            onNext={(data) => {
              updateData('photos', data);
              navigation.navigate('PersonalInfo');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="PersonalInfo">
        {({ navigation }) => (
          <RegisterPersonalInfoScreen
            onNext={(data) => {
              updateData('personalInfo', data);
              navigation.navigate('Hobbies');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="Hobbies">
        {({ navigation }) => (
          <RegisterHobbiesScreen
            onNext={(hobbies, interests) => {
              updateData('hobbies', { hobbies, interests });
              navigation.navigate('KTP');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="KTP">
        {({ navigation }) => (
          <RegisterKTPScreen
            onComplete={() => {
              console.log('Registration Complete:', registrationData);
              navigation.navigate('Success');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="Success">
        {({ navigation }) => (
          <SuccessScreen navigation={navigation} />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

// Main Tab Navigator
function MainTabNavigator({ onNavigate }: { onNavigate: (screen: string, params?: any) => void }) {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <MainTab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      >
        {() => <HomeScreen onNavigate={onNavigate} />}
      </MainTab.Screen>

      <MainTab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarLabel: 'Match',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />

      <MainTab.Screen
        name="Messages"
        options={{
          tabBarLabel: 'Pesan',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      >
        {() => <ChatListScreen onChatPress={(chatId) => console.log('Chat pressed:', chatId)} />}
      </MainTab.Screen>

      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </MainTab.Navigator>
  );
}

// Main App
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileParams, setProfileParams] = useState<any>(null);

  const handleNavigate = (screen: string, params?: any) => {
    if (screen === 'ProfileDetail') {
      setProfileParams(params);
    }
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth">
            {() => (
              <AuthNavigator 
                onAuthComplete={() => setIsAuthenticated(true)} 
              />
            )}
          </RootStack.Screen>
        ) : (
          <>
            <RootStack.Screen name="Main">
              {() => <MainTabNavigator onNavigate={handleNavigate} />}
            </RootStack.Screen>
            <RootStack.Screen 
              name="ProfileDetail" 
              options={{ animation: 'slide_from_bottom' }}
            >
              {({ navigation }) => (
                <ProfileDetailScreen
                  profile={profileParams?.profile}
                  onBack={() => navigation.goBack()}
                  onConnect={() => console.log('Connect pressed')}
                  onMessage={() => console.log('Message pressed')}
                  onBlock={() => console.log('Block pressed')}
                  onReport={() => console.log('Report pressed')}
                />
              )}
            </RootStack.Screen>

            <RootStack.Screen 
              name="Premium" 
              options={{ animation: 'slide_from_bottom' }}
            >
              {({ navigation }) => (
                <PremiumScreen
                  onBack={() => navigation.goBack()}
                  hasBasicSubscription={false}
                />
              )}
            </RootStack.Screen>

            <RootStack.Screen 
              name="ChatRoom" 
              options={{ animation: 'slide_from_right', headerShown: false }}
            >
              {({ navigation, route }: any) => (
                <ChatRoomScreen
                  chatId={route.params?.chatId || '1'}
                  onBack={() => navigation.goBack()}
                  onViewProfile={() => console.log('View profile pressed')}
                />
              )}
            </RootStack.Screen>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#6B7280',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 50,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    padding: 16,
  },
  demoText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});