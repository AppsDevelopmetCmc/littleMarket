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
      //global.direccionActual = 'Ladrón de Guevara y Toledo';
      const { navigation } = this.props;
      this.setState({
         navigation: navigation,
      });
   }
   mostrarMapa = () => {
      return (
         _.isEmpty(global.direccionActual) && (
            <Mapa
               navigation={this.state.navigation}
            ></Mapa>
         )
      );
   };
   render() {
      const { navigation } = this.props;
      return (
         <View style={styles.container}>
            {this.mostrarMapa()}
            <Button
               title={
                  global.direccionActual
                     ? global.direccionActual
                     : 'Sin Dirección'
               }
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
