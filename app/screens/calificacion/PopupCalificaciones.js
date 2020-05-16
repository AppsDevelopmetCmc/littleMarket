import React, { useState, useEffect } from 'react';
import {
   StyleSheet,
   View,
   Text,
   ActivityIndicator,
   TextInput,
   ScrollView,
   Alert,
} from 'react-native';
import { Overlay, Button, Input } from 'react-native-elements';
import { Rating } from 'react-native-elements';
import RadioForm, {
   RadioButton,
   RadioButtonInput,
   RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Importacion de colores
import * as colores from '../../constants/Colores';
import * as msg from '../../constants/Mensajes';

// importacion navegacion
import { FormCalificaciones } from './FormCalificaciones';
import { FormCalificacionesProductos } from './FormCalificacionesProductos';

export function PopupCalificaciones(props) {
   const { isVisible, pedido, cambioVisibleCalifica } = props;
   const [varPresentacion, setVarPresentacion] = useState(0);
   const varItemDefault = -1;
   const varEstrellaDefault = 4;
   // Calificacion Pedido
   const [puntuacionPedido, setPuntuacionPedido] = useState(4);
   const [radio_propsPedio, setRadio_PropsPedido] = useState([
      { label: 'No cumplio las medidas de bioseguridad', value: 0 },
      { label: 'Hora de entrega atrasada', value: 1 },
      { label: 'No respeto a su cliente', value: 2 },
      { label: 'Otra', value: 3 },
   ]);

   const [quejaPedido, setQuejaPedido] = useState(-1);
   const [detallePedido, setDetallePedido] = useState('');

   // Calificacion  del producto
   const [radio_propsProducto, setRadio_PropsProducto] = useState([
      { label: 'El producto esta pasado', value: 0 },
      { label: 'El producto no esta sanitizado', value: 1 },
      { label: 'No es lo que esperaba del producto', value: 2 },
      { label: 'Otra', value: 3 },
   ]);
   const [puntuacionProducto, setPuntuacionProducto] = useState(4);
   const [quejaProducto, setQuejaProducto] = useState(-1);
   const [detalleProducto, setDetalleProducto] = useState('');

   console.log('------------------------------------------');
   console.log('calificación Pedido', puntuacionPedido);
   console.log('queja codigo', quejaPedido);
   console.log('detalle', detallePedido);
   console.log('------------------------------------------');
   console.log('calificación Producto', puntuacionProducto);
   console.log('queja codigo producto', quejaProducto);
   console.log('detalle producto', detalleProducto);

   // Metodo que valida el cambio de pantalla
   const validacionSiguiente = () => {
      if (puntuacionPedido < 3.5) {
         if (quejaPedido == -1) {
            Alert.alert('Debe seleccionar una razón');
         } else {
            setVarPresentacion(1);
         }
      } else {
         setVarPresentacion(1);
      }
   };

   const validacionSalir = () => {
      if (puntuacionProducto < 3.5) {
         if (quejaProducto == -1) {
            Alert.alert('Debe seleccionar una razón');
         } else {
            cambioVisibleCalifica(!isVisible);
         }
      } else {
         cambioVisibleCalifica(!isVisible);
      }
   };

   return (
      <Overlay
         isVisible={isVisible}
         windowBackgroundColor="rgba(0,0,0,0.75)"
         overlayBackgroundColor="transparent"
         overlayStyle={styles.overlay}
      >
         {varPresentacion == 0 ? (
            <View style={{ flex: 1 }}>
               <FormCalificaciones
                  setPuntuacion={setPuntuacionPedido}
                  radio_props={radio_propsPedio}
                  setQueja={setQuejaPedido}
                  setDetalle={setDetallePedido}
                  puntuacion={puntuacionPedido}
                  titulo={'Califica tu Pedido'}
                  parrafo={msg.msg3}
                  placeholderComentario={'El pedido estuvo perfecto'}
                  itemLista={varItemDefault}
                  numeroEstrellas={varEstrellaDefault}
               />
               <View style={{ alignItems: 'flex-end', paddingBottom: 20 }}>
                  <Button
                     title="Siguiente"
                     titleStyle={textEstilo(
                        colores.colorPrimarioTomate,
                        15,
                        'normal'
                     )}
                     containerStyle={styles.btnStyles}
                     buttonStyle={styles.btnRegistrarse}
                     onPress={validacionSiguiente}
                     icon={
                        <Icon
                           name="arrow-right-bold-circle-outline"
                           size={30}
                           color={colores.colorPrimarioTomate}
                        />
                     }
                     iconRight
                  ></Button>
               </View>
            </View>
         ) : (
            <View style={{ flex: 1 }}>
               <FormCalificacionesProductos
                  setPuntuacion={setPuntuacionProducto}
                  radio_props={radio_propsProducto}
                  setQueja={setQuejaProducto}
                  setDetalle={setDetalleProducto}
                  puntuacion={puntuacionProducto}
                  titulo={'Califica tu Producto'}
                  parrafo={msg.msg4}
                  placeholderComentario={'El producto estuvo perfecto'}
               />
               <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                  <Button
                     title="Finalizar"
                     titleStyle={textEstilo(
                        colores.colorPrimarioTomate,
                        15,
                        'normal'
                     )}
                     containerStyle={styles.btnStyles}
                     buttonStyle={styles.btnRegistrarse}
                     onPress={validacionSalir}
                  ></Button>
               </View>
            </View>
         )}
      </Overlay>
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
   overlay: {
      width: '90%',
      height: '90%',
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
   },
   view: {
      flex: 1,
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
   },
   estiloTextoTitulo: {
      color: colores.colorPrimarioTomate,
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
   btnStyles: {
      marginTop: 50,
      width: '50%',
      height: 40,
      alignItems: 'center',
   },
   btnRegistrarse: {
      padding: 10,
      backgroundColor: colores.colorBlanco,
      borderRadius: 25,
   },
});
