import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import { Rating } from 'react-native-elements';
import RadioForm, {
   RadioButton,
   RadioButtonInput,
   RadioButtonLabel,
} from 'react-native-simple-radio-button';

// Importacion de colores
import * as colores from '../../constants/Colores';
import * as msg from '../../constants/Mensajes';

export function AsociadoCalifica(props) {
   const { isVisible, pedido, cambioVisibleCalifica } = props;
   const [puntuacion, setPuntuacion] = useState(4);
   const [radio_props, setRadio_Props] = useState([
      { label: 'No cumplio las medidas de bioseguridad', value: 0 },
      { label: 'Hora de entrega atrasada', value: 1 },
      { label: 'No respeto a su cliente', value: 2 },
      { label: 'Otra', value: 3 },
   ]);

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

            <View style={{ paddingVertical: 25 }}>
               {puntuacion <= 3.5 && (
                  <View
                     style={{
                        borderWidth: 1,
                        paddingVertical: 10,
                        borderRadius: 15,
                        alignContent: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 15,
                     }}
                  >
                     <RadioForm
                        radio_props={radio_props}
                        initial={0}
                        formHorizontal={false}
                        labelHorizontal={true}
                        buttonColor={colores.colorPrimarioTomate}
                        selectedButtonColor={colores.colorPrimarioVerde}
                        buttonSize={15}
                        buttonOuterSize={25}
                        animation={true}
                        onPress={value => {
                           console.log(value);
                        }}
                        wrapStyle={styles.contenedorWrap}
                     />
                  </View>
               )}
            </View>
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
   contenedorViews: { paddingVertical: 10 },
   contenedorWrap: { marginVertical: 5 },
});
