import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export function Direcciones(props) {
   const { navigation } = props;

   return (
      <View style={styles.container}>
         <Text>Ingresar Direccion</Text>
         <Text>
            Tiene Cobertura:
            {global.direccionPrincipal != null
               ? global.direccionPrincipal.tieneCobertura
                  ? 'SI'
                  : 'NO'
               : 'NO'}
         </Text>
         <Text>
            Dirección Principal:{' '}
            {global.direccionPrincipal != null
               ? global.direccionPrincipal.descripcion
               : 'NO TIENE'}
         </Text>


         <Button
            title="Ir a mapa"
            onPress={() => {
               navigation.navigate('Mapa');
            }}
         ></Button>
         <Text>LISTA DE DIRECCIONES</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
