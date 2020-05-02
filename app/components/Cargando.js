import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements';

// Importacion de colores
import * as colores from '../constants/Colores';

export default function Cargando(props) {
   const { isVisible, text } = props;

   return (
      <Overlay
         isVisible={isVisible}
         windowBackgroundColor="rgba(255,255,255,0.3)"
         overlayBackgroundColor="transparent"
         overlayStyle={styles.overlay}
      >
         <View style={styles.view}>
            <ActivityIndicator
               size="large"
               color={colores.colorOscuroPrimarioTomate}
            />
            {text && <Text style={styles.text}>{text}</Text>}
         </View>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   overlay: {
      height: 150,
      width: '65%',
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
   },
   view: {
      flex: 1,
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
   },
   text: {
      color: colores.colorClaroPrimarioTomate,
      fontWeight: '900',
      // textTransform: 'uppercase',
      marginTop: 30,
      fontSize: 15,
   },
});
