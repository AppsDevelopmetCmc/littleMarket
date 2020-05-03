import React, { useRef } from 'react';
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

export default function IniciaSesion({ navigation }) {
   const toastRef = useRef();

   return (
      <SafeAreaView style={styles.contenedorPagina}>
         <View style={styles.cabecera}>
            <View>
               <Text style={textEstilo(colores.colorBlancoTexto, 18, 'normal')}>
                  Bienvenido
               </Text>
               <Text style={textEstilo(colores.colorBlancoTexto, 25, 'bold')}>
                  Iniciar Sesión
               </Text>
            </View>
            <Image
               source={require('../../../assets/img/LogoBlanco.png')}
            ></Image>
         </View>

         <View style={styles.pie}>
            <ScrollView>
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
               >
                  <Divider style={styles.divide}></Divider>
                  <Text
                     style={textEstilo(colores.colorPrimarioTexto, 15, 'bold')}
                  >
                     o
                  </Text>
                  <Divider style={styles.divide}></Divider>
               </View>
               <View style={styles.socialIconos}>
                  <IniciarSesionFacebook
                     nav={navigation}
                     toastRef={toastRef}
                  ></IniciarSesionFacebook>
                  <IniciaSesionGoogle
                     nav={navigation}
                     toastRef={toastRef}
                  ></IniciaSesionGoogle>
               </View>
            </ScrollView>
         </View>

         {/* Creación de toast con utilizacion de hook de react useRef -- (toastRef) */}
         <Toast
            ref={toastRef}
            position="center"
            opacity={0.8}
            fadeInDuration={800}
            fadeOutDuration={1000}
         ></Toast>
      </SafeAreaView>
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
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 40,
      paddingTop: 30,
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
      marginTop: 30,
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
