import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { Divider, Button } from 'react-native-elements';

import IniciaSesionForm from '../account/form/IniciaSesionForm';
import IniciarSesionFacebook from '../account/IniciarSesionFacebook';

// Importacion de Toas
import Toast from 'react-native-easy-toast';

export default function IniciaSesion({ navigation }) {
   const toastRef = useRef();

   return (
      <ScrollView>
         <Image
            source={require('../../../assets/img/logo.png')}
            style={styles.logo}
            resizeMode="contain"
         ></Image>
         <View style={styles.container}>
            <IniciaSesionForm
               nav={navigation}
               toastRef={toastRef}
            ></IniciaSesionForm>
         </View>
         <Divider style={styles.divide}></Divider>
         <View style={styles.container}>
            <IniciarSesionFacebook
               nav={navigation}
               toastRef={toastRef}
            ></IniciarSesionFacebook>
         </View>
         {/* Creación de toast con utilizacion de hook de react useRef -- (toastRef) */}
         <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
      </ScrollView>
   );
}

function CrearUsuario(props) {
   const {} = props;
   return <Text style={styles.textRegistro}>¿No tienes una cuenta?</Text>;
}

const styles = StyleSheet.create({
   container: {
      marginRight: 20,
      marginLeft: 20,
   },
   logo: { width: '100%', height: 150, marginTop: 150 },
   textRegistro: { marginTop: 15, marginEnd: 10, marginRight: 10 },
   divide: { backgroundColor: '#000', margin: 40 },
});
