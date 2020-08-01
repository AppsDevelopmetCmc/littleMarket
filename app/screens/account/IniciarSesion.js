import React, { useRef, useState } from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   Text,
   Image,
   SafeAreaView,
} from 'react-native';
import { Divider } from 'react-native-elements';

import IniciaSesionForm from '../account/form/IniciaSesionForm';
import IniciarSesionFacebook from '../account/IniciarSesionFacebook';
import IniciaSesionGoogle from '../account/IniciaSesionGoogle';

// Importacion de Toas
import Toast from 'react-native-easy-toast';

//Importacion de los colores
import * as colores from '../../constants/Colores';
import { Yalert } from '../../components/Yalert';
export default function IniciaSesion({ navigation }) {
   const toastRef = useRef();
   const [mostrarYalert, setMostrarYalert] = useState(false);
   const [titulo, setTitulo] = useState(false);
   const [mensaje, setMensaje] = useState(false);

   const mostrarError = (titulo, mensaje) => {
      setMostrarYalert(true);
      setTitulo(titulo);
      setMensaje(mensaje);
   };
   const cerrarYalert = () => {
      setMostrarYalert(false);
   };
   if (global.mailVerificado === false && global.usuario) {
      global.mailVerificado = true;
      mostrarError(
         'Información',
         'Verifique su correo electrónico ' + global.usuario + ' para continuar'
      );
   }
   global.refrescarInicioSesion = () => {
      setMostrarYalert(true);
   };
   return (
      <View style={styles.contenedorPagina}>
         <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.cabecera}>
               <View>
                  <Text
                     style={textEstilo(colores.colorBlancoTexto, 18, 'normal')}
                  >
                     Bienvenido
                  </Text>
                  <Text
                     style={textEstilo(colores.colorBlancoTexto, 25, 'bold')}
                  >
                     Iniciar Sesión
                  </Text>
               </View>
               <Image
                  source={require('../../../assets/img/LogoBlanco.png')}
               ></Image>
            </View>

            <View style={[styles.pie, { transform: [{ translateY: -30 }] }]}>
               <IniciaSesionForm
                  nav={navigation}
                  toastRef={toastRef}
               ></IniciaSesionForm>
               <View
                  style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginTop: 40,
                  }}
               ></View>
            </View>
            <Yalert
               titulo={titulo}
               mensaje={mensaje}
               visible={mostrarYalert}
               cerrar={cerrarYalert}
            ></Yalert>
         </ScrollView>
         {/* Creación de toast con utilizacion de hook de react useRef -- (toastRef) */}
         <Toast
            ref={toastRef}
            position="center"
            opacity={0.8}
            fadeInDuration={800}
            fadeOutDuration={1000}
         ></Toast>
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
   contenedorPagina: { flex: 1, backgroundColor: colores.colorBlanco },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
      paddingBottom: 60,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
   },
   divide: {
      backgroundColor: colores.colorPrimarioTexto,
      width: '42%',
      height: 1,
   },
   socialIconos: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
   },
});
