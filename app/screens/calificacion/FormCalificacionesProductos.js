import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Rating } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';

// Importacion de colores
import * as colores from '../../constants/Colores';

export function FormCalificacionesProductos(props) {
   const {
      radio_props,
      setDetalle,
      setPuntuacion,
      setQueja,
      puntuacion,
      titulo,
      subTitulo,
      parrafo,
      placeholderComentario,
      idPedido,
      itemLista,
      numeroEstrellas,
      validacionEstrellas,
   } = props;

   // Metodo que calcula el valor de las strellas
   const ratingCompleted = rating => {
      setPuntuacion(rating);
   };

   // Metodo que saca el valor seleccionado de la lista de detalles
   const codigoDetalle = value => {
      setQueja(value);
   };

   return (
      <View style={{ flex: 1 }}>
         <ScrollView
            style={{ flex: 1 }}
            animation={true}
            contentContainerStyle={{ paddingVertical: 50 }}
         >
            <View style={styles.view}>
               <View style={styles.contenedorViews}>
                  <Text style={styles.estiloTextoTitulo}>{titulo}</Text>
               </View>
               <View style={styles.contenedorViews}>
                  <Text style={styles.estiloTextoSubTitulo}>{subTitulo}</Text>
                  {/* <Text style={styles.estiloTextoSubTitulo}>{idPedido}</Text> */}
               </View>
               <View style={styles.contenedorViews}>
                  <Text style={styles.estiloTextoParrafo}>{parrafo}</Text>
               </View>
               <View style={styles.contenedorViews}>
                  <Rating
                     type="custom"
                     styles={styles.puntuacionEstilo}
                     imageSize={30}
                     startingValue={numeroEstrellas}
                     fractions={2}
                     ratingColor={colores.colorPrimarioAmarillo}
                     onFinishRating={ratingCompleted}
                  ></Rating>
               </View>

               <View style={{ paddingVertical: 25 }}>
                  {puntuacion <= validacionEstrellas && (
                     <View
                        style={{
                           paddingVertical: 10,
                           borderRadius: 15,
                           alignContent: 'center',
                           justifyContent: 'center',
                           paddingHorizontal: 15,
                        }}
                     >
                        <RadioForm
                           radio_props={radio_props}
                           initial={itemLista}
                           formHorizontal={false}
                           labelHorizontal={true}
                           buttonColor={colores.colorPrimarioTomate}
                           selectedButtonColor={colores.colorPrimarioTomate}
                           buttonSize={10}
                           buttonOuterSize={20}
                           animation={true}
                           onPress={codigoDetalle}
                           wrapStyle={styles.contenedorWrap}
                        />
                     </View>
                  )}
               </View>
               <View
                  style={{
                     width: '100%',
                     borderWidth: 1,
                     borderColor: colores.colorClaroTexto,
                     paddingVertical: 10,
                     borderRadius: 5,
                     alignContent: 'center',
                     justifyContent: 'center',
                     paddingHorizontal: 10,
                     paddingBottom: 30,
                  }}
               >
                  <Text
                     style={{
                        borderBottomWidth: 1,
                        marginBottom: 5,
                        fontWeight: 'bold',
                        borderColor: colores.colorClaroTexto,
                     }}
                  >
                     Comentarios / Observaciones
                  </Text>
                  <TextInput
                     multiline={true}
                     placeholder={placeholderComentario}
                     onChangeText={text => setDetalle(text)}
                  />
               </View>
            </View>
         </ScrollView>
      </View>
   );
}

const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   view: {
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
   },
   estiloTextoTitulo: {
      color: colores.colorPrimarioTomate,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 17,
   },
   estiloTextoParrafo: {
      color: colores.colorOscuroTexto,
      fontWeight: 'normal',
      fontSize: 13,
   },
   contenedorViews: { paddingVertical: 10, alignItems: 'center' },
   contenedorWrap: { marginVertical: 5 },

   estiloTextoSubTitulo: {
      color: colores.colorOscuroTexto,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 10,
   },
});
