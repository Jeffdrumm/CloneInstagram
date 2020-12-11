import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Feed from './src/pages/Feed';

const TelaDeSelecao = (props) => {
  const Stack = createStackNavigator();
   switch (props.type) {
    case 1:
  return (        
      <View style={styles.container}>            
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Feed">
          <Stack.Screen name="Feed" component={Feed} />
        </Stack.Navigator>
        </NavigationContainer>
      </View>   
  )
  case 2:
  return (
  <>
     <h1> chegou aq </h1>
  </>
  )  
 }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',   
    
  },
  linetext:{       
    fontFamily: "Time News Romam",
    flexDirection: 'row',     
    fontSize: '30px',
    paddingLeft: 20,
    flex: 7,    
},   
});
export default TelaDeSelecao