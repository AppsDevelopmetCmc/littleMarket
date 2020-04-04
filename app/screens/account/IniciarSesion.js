import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { Divider, Button } from 'react-native-elements';
import { withNavigation } from '@react-navigation/native';

export default function IniciaSesion() {
   return (
      <ScrollView>
         <Image
            source={require('../../../assets/img/logo.png')}
            style={styles.logo}
            resizeMode="contain"
         ></Image>
         <View style={styles.container}>
            <Text>Form inicia sesion</Text>
            <Text>Crear acontandor...</Text>
         </View>
         <Divider style={styles.divide}></Divider>
         <View style={styles.container}>
            <Text>Login Facebook</Text>
         </View>
      </ScrollView>
   );
}

function CrearUsuario(props) {
   const {} = props;
   return <Text style={styles.textRegistro}>¿No tienes una cuenta?</Text>;
}

const styles = StyleSheet.create({
   container: {
      marginRight: 40,
      marginLeft: 40,
   },
   logo: { width: '100%', height: 150, marginTop: 150 },
   textRegistro: { marginTop: 15, marginEnd: 10, marginRight: 10 },
   divide: { backgroundColor: '#000', margin: 40 },
});
