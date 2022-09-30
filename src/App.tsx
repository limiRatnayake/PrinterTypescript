import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {createRef} from 'react';
import {HomeScreen} from './HomeScreen';
import {FindPrinter} from './FindPrinter';


export const navigationRef = createRef<any>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

 const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'Printer Demo',
          }}
        />
        <Stack.Screen
          name="Find"
          options={{
            headerTitle: 'Find Printer',
          }}
          component={FindPrinter}
        />
        {/* <Stack.Screen
          name="Sunmi"
          options={{
            headerTitle: 'Sunmi Printer',
          }}
          component={SunmiScreen}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App
