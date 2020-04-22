import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Mapa from '../map/Mapa';
import _ from 'lodash';

export default class PaginaPrincipal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         navigation: null,
      };
   }
   componentDidMount() {
 
   }
   render() {
      const { navigation } = this.props;
      return (
         <View style={styles.container}>
            <Button
               title='Dirección Actual'
               onPress={() => {
                  navigation.navigate('Direcciones');
               }}
            ></Button>
            <Text>Página de Inicio</Text>
         </View>
      );
   }
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
   },
});
