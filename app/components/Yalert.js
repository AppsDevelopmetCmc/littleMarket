import React, { Component } from 'react';
import {
   StyleSheet,
   View,
   Text,
   ActivityIndicator,
   Alert,
   Button,
} from 'react-native';
import { Overlay } from 'react-native-elements';

// Importacion de colores
import * as colores from '../constants/Colores';
import { TouchableOpacity } from 'react-native';

export class Yalert extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      let colorFondo = 'rgba(255,255,255)';
      const { mensaje, visible, cerrar, titulo } = this.props;
      return (
         <Overlay
            isVisible={visible}
            //windowBackgroundColor={colorFondo}
            //overlayBackgroundColor={colorFondo}
            overlayStyle={styles.overlay}
         >
            <View
               style={{
                  //backgroundColor: 'blue',
                  flex: 1,
               }}
            >
               <View
                  style={{
                     //backgroundColor: 'red',
                     flex: 1,
                  }}
               >
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                     {titulo}
                  </Text>
               </View>
               <View
                  style={{
                     // backgroundColor: 'red',
                     flex: 2,
                     justifyContent: 'center',
                     //alignItems: 'center',
                  }}
               >
                  <Text>{mensaje}</Text>
               </View>
               <View
                  style={{
                     // backgroundColor: 'pink',
                     flex: 1,
                     justifyContent: 'center',
                  }}
               >
                  <TouchableOpacity
                     onPress={() => {
                        console.log('CERRAR');
                        cerrar();
                     }}
                  >
                     <View
                        style={{
                           alignItems: 'flex-end',
                           justifyContent: 'center',
                        }}
                     >
                        <Text style={styles.text}>OK</Text>
                     </View>
                  </TouchableOpacity>
               </View>
            </View>
         </Overlay>
      );
   }
}

const styles = StyleSheet.create({
   overlay: {
      height: 200,
      width: '80%',
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
      padding: 20,
   },
   view: {
      flex: 1,
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
   },
   text: {
      color: colores.colorPrimarioTomate,
      fontWeight: 'bold',
   },
});
