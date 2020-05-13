import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import { Rating } from 'react-native-elements';
import CheckboxGroup from 'react-native-checkbox-group';

// Importacion de colores
import * as colores from '../../constants/Colores';
import * as msg from '../../constants/Mensajes';

export function AsociadoCalifica(props) {
   const { isVisible, pedido, cambioVisibleCalifica } = props;
   const [puntuacion, setPuntuacion] = useState(4);

   console.log('pedido', pedido);

   // Metodo que calcula el valor de las strellas
   const ratingCompleted = rating => {
      console.log('Rating is: ' + rating);
      setPuntuacion(rating);
   };

   return (
      <Overlay
         isVisible={isVisible}
         windowBackgroundColor="rgba(0,0,0,0.75)"
         overlayBackgroundColor="transparent"
         overlayStyle={styles.overlay}
      >
         <View style={styles.view}>
            <View style={styles.contenedorViews}>
               <Text style={styles.estiloTextoTitulo}>
                  {'Califica tu Pedido'}
               </Text>
            </View>
            <View style={styles.contenedorViews}>
               <Text style={styles.estiloTextoParrafo}>{msg.msg3}</Text>
            </View>
            <View style={styles.contenedorViews}>
               <Rating
                  styles={styles.puntuacionEstilo}
                  imageSize={30}
                  startingValue={4}
                  fractions={2}
                  ratingColor={colores.colorPrimarioTomate}
                  onFinishRating={ratingCompleted}
               ></Rating>
            </View>
         </View>
         <View style={{ paddingVertical: 50 }}>
            {puntuacion <= 3.5 && (
               <View style={{ borderWidth: 1, height: 200 }}>
                  <CheckboxGroup
                     callback={selected => {
                        console.log(selected);
                     }}
                     iconColor={'#00a2dd'}
                     iconSize={30}
                     checkedIcon="ios-checkbox-outline"
                     uncheckedIcon="ios-square-outline"
                     checkboxes={[
                        {
                           label: 'primero', // label for checkbox item
                           value: 1, // selected value for item, if selected, what value should be sent?
                           selected: true, // if the item is selected by default or not.
                        },
                        {
                           label: 'segundo',
                           value: 2,
                        },
                     ]}
                     labelStyle={{
                        color: '#333',
                        paddingHorizontal: 50,
                     }}
                     rowStyle={{
                        flexDirection: 'row',
                     }}
                     rowDirection={'column'}
                  />
               </View>
            )}
         </View>

         <Button
            title="Salir"
            onPress={() => {
               cambioVisibleCalifica(!isVisible);
            }}
         ></Button>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   overlay: {
      width: '90%',
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
   },
   view: {
      flex: 1,
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
   },
   estiloTextoTitulo: {
      color: colores.colorClaroPrimarioTomate,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 14,
   },
   estiloTextoParrafo: {
      color: colores.colorOscuroTexto,
      fontWeight: 'normal',
      fontSize: 13,
   },
   puntuacionEstilo: {},
   contenedorViews: { paddingVertical: 10 },
});
