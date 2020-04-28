import React, { useRef } from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   Text,
   Image,
   SafeAreaView,
} from 'react-native';
import { Divider, Button } from 'react-native-elements';

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
            <Text style={textEstilo(colores.whiteColor, 18, 'normal')}>
               Bienvenido
            </Text>
            <Text style={textEstilo(colores.whiteColor, 25, 'bold')}>
               Iniciar Sesión
            </Text>
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
                  <Text style={textEstilo('#333333', 15, 'bold')}>o</Text>
                  <Divider style={styles.divide}></Divider>
               </View>
               <IniciarSesionFacebook
                  nav={navigation}
                  toastRef={toastRef}
               ></IniciarSesionFacebook>
               <IniciaSesionGoogle
                  nav={navigation}
                  toastRef={toastRef}
               ></IniciaSesionGoogle>
            </ScrollView>
         </View>

         {/* Creación de toast con utilizacion de hook de react useRef -- (toastRef) */}
         <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
      </SafeAreaView>
   );
}

function CrearUsuario(props) {
   const {} = props;
   return <Text style={styles.textRegistro}>¿No tienes una cuenta?</Text>;
}

const border = color => {
   return { borderColor: color, borderWidth: 2 };
};
const textEstilo = (color, tamaño, tipo) => {
   return {
      color: color,
      fontSize: tamaño,
      fontWeight: tipo,
   };
};

const styles = StyleSheet.create({
   contenedorPagina: { flex: 1, backgroundColor: colores.primaryColor },
   cabecera: {
      backgroundColor: colores.primaryColor,
      paddingHorizontal: 40,
      paddingTop: 30,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.whiteColor,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      marginTop: 30,
   },
   logo: { width: '100%', height: 150, marginTop: 60 },
   textRegistro: { marginTop: 15, marginEnd: 10, marginRight: 10 },
   divide: {
      backgroundColor: '#000',
      width: '42%',
      height: 1,
   },
});
