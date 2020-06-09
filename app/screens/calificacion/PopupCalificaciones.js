import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Importacion personalizadas
import * as colores from '../../constants/Colores';
import * as msg from '../../constants/Mensajes';
import { FormCalificaciones } from './FormCalificaciones';
import { FormCalificacionesProductos } from './FormCalificacionesProductos';
import Cargando from '../../components/Cargando';

export function PopupCalificaciones(props) {
   //Constantes
   const varItemDefault = -1;
   const varEstrellaDefault = 4;

   //Variables
   const { isVisible, pedido, cambioVisibleCalifica } = props;
   const [isLoading, setIsLoading] = useState(false);
   const [varPresentacion, setVarPresentacion] = useState(0);
   const [validacionEstrellas, setValidacionEstrellas] = useState();
   // Calificacion Pedido
   const [puntuacionPedido, setPuntuacionPedido] = useState(4);
   const [radio_propsPedio, setRadio_PropsPedido] = useState([]);
   const [quejaPedido, setQuejaPedido] = useState(-1);
   const [detallePedido, setDetallePedido] = useState('');
   // Calificacion  del producto
   const [radio_propsProducto, setRadio_PropsProducto] = useState([]);
   const [puntuacionProducto, setPuntuacionProducto] = useState(4);
   const [quejaProducto, setQuejaProducto] = useState(-1);
   const [detalleProducto, setDetalleProducto] = useState('');

   // se utiliza el useEffect
   useEffect(() => {
      infoIncial();
   }, []);

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
            guardarFirebase();
         }
      } else {
         guardarFirebase();
      }
   };

   const manejoResp = (listaPedidos, listaProductos) => {
      let listaRespuestaPed = [];
      let listaRespuestaProd = [];
      listaPedidos.forEach(elemento => {
         let objetoRespuesta = {};
         let elemt = elemento.split('|');
         objetoRespuesta.value = elemt[0];
         objetoRespuesta.label = elemt[1];
         listaRespuestaPed.push(objetoRespuesta);
      });
      listaProductos.forEach(elemento => {
         let objetoRespuesta = {};
         let elemt = elemento.split('|');
         objetoRespuesta.value = elemt[0];
         objetoRespuesta.label = elemt[1];
         listaRespuestaProd.push(objetoRespuesta);
      });
      setRadio_PropsPedido(listaRespuestaPed);
      setRadio_PropsProducto(listaRespuestaProd);
   };

   const infoIncial = async () => {
      await global.db
         .collection('parametros')
         .doc('calificacion')
         .get()
         .then(doc => {
            if (doc.exists) {
               //  console.log('Document data:', doc.data());
               manejoResp(doc.data().respPedido, doc.data().respProducto);
               setValidacionEstrellas(doc.data().minimo);
            } else {
               console.log('No such document!');
            }
         })
         .catch(error => {
            console.log('Error al obtener el documento:', error);
         });
   };

   const guardarFirebase = async () => {
      setIsLoading(true);
      await global.db
         .collection('asociados')
         .doc(pedido.asociado)
         .collection('pedidos')
         .doc(pedido.id)
         .set({
            califPed: puntuacionPedido,
            detallePed: detallePedido,
            codQuejaPed: quejaPedido,
            califProd: puntuacionProducto,
            detalleProd: detalleProducto,
            codQuejaProd: quejaProducto,
         })
         .then(() => {
            global.db
               .collection('pedidos')
               .doc(pedido.id)
               .update({
                  estado: 'PC',
               })
               .then(() => {
                  cambioVisibleCalifica(!isVisible);
                  setIsLoading(false);
               })
               .catch(error => {
                  console.log(error);
               });
         })
         .catch(error => {
            console.log(error);
         });
   };

   const guardarFirebaseSinCalif = async () => {
      await global.db
         .collection('pedidos')
         .doc(pedido.id)
         .update({
            estado: 'PC',
         })
         .then(() => {
            cambioVisibleCalifica(!isVisible);
         })
         .catch(error => {
            console.log(error);
         });
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
                  idPedido={pedido.orden}
                  validacionEstrellas={validacionEstrellas}
               />
               <View
                  style={{
                     alignItems: 'flex-end',
                     paddingBottom: 20,
                     flexDirection: 'row',
                  }}
               >
                  <Button
                     title="En otro momento"
                     titleStyle={textEstilo(
                        colores.colorPrimarioTomate,
                        15,
                        'normal'
                     )}
                     containerStyle={styles.btnStyles}
                     buttonStyle={styles.btnRegistrarse}
                     onPress={guardarFirebaseSinCalif}
                     icon={
                        <Icon
                           name="arrow-left-bold-circle-outline"
                           size={30}
                           color={colores.colorPrimarioTomate}
                        />
                     }
                  ></Button>
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
                  itemLista={varItemDefault}
                  numeroEstrellas={varEstrellaDefault}
                  idPedido={pedido.orden}
                  validacionEstrellas={validacionEstrellas}
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
               <Cargando
                  text="Gracias por su calificación, estamos guardando su respuesta espere un momento"
                  isVisible={isLoading}
               ></Cargando>
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
