import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import Screens
import RegisterBasicInfoScreen from './src/screens/RegisterBasicInfoScreen';
import RegisterOTPScreen from './src/screens/RegisterOTPScreen';
import RegisterPhotoScreen from './src/screens/RegisterPhotoScreen';
import RegisterPersonalInfoScreen from './src/screens/RegisterPersonalInfoScreen';
import RegisterHobbiesScreen from './src/screens/RegisterHobbiesScreen';
import RegisterKTPScreen from './src/screens/RegisterKTPScreen';

export type RootStackParamList = {
  BasicInfo: undefined;
  OTP: { email: string };
  Photo: undefined;
  PersonalInfo: undefined;
  Hobbies: undefined;
  KTP: undefined;
  Success: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Success Screen Component
function SuccessScreen({ navigation }: any) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <StatusBar style="dark" />
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}>
        <span style={{ fontSize: 50 }}>✓</span>
      </div>
      <h1 style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
      }}>
        Pendaftaran Berhasil!
      </h1>
      <p style={{
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Akun Anda sedang diverifikasi.{'\n'}
        Kami akan mengirim notifikasi setelah verifikasi selesai.
      </p>
      <button
        onClick={() => navigation.replace('BasicInfo')}
        style={{
          backgroundColor: '#10B981',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 'bold',
        }}>
          Kembali ke Awal
        </span>
      </button>
    </div>
  );
}

export default function App() {
  const [registrationData, setRegistrationData] = useState<any>({});

  const updateData = (step: string, data: any) => {
    setRegistrationData((prev: any) => ({
      ...prev,
      [step]: data,
    }));
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="BasicInfo"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="BasicInfo">
          {({ navigation }) => (
            <RegisterBasicInfoScreen
              onNext={(data) => {
                updateData('basicInfo', data);
                navigation.navigate('OTP', { email: data.email });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="OTP">
          {({ navigation, route }: any) => (
            <RegisterOTPScreen
              email={route.params?.email || ''}
              onNext={() => navigation.navigate('Photo')}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Photo">
          {({ navigation }) => (
            <RegisterPhotoScreen
              onNext={(data) => {
                updateData('photos', data);
                navigation.navigate('PersonalInfo');
              }}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PersonalInfo">
          {({ navigation }) => (
            <RegisterPersonalInfoScreen
              onNext={(data) => {
                updateData('personalInfo', data);
                navigation.navigate('Hobbies');
              }}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Hobbies">
          {({ navigation }) => (
            <RegisterHobbiesScreen
              onNext={(hobbies, interests) => {
                updateData('hobbies', { hobbies, interests });
                navigation.navigate('KTP');
              }}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="KTP">
          {({ navigation }) => (
            <RegisterKTPScreen
              onComplete={() => {
                console.log('Registration Complete:', registrationData);
                navigation.navigate('Success');
              }}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
