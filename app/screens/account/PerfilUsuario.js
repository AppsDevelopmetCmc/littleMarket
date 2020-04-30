import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import * as firebase from 'firebase';

// Importación de los colores
import * as colores from '../../constants/Colores';

export default function PerfilUsuario(props) {
   const [nombreUsuario, setNombreUsuario] = useState(
      global.infoUsuario.displayName
   );
   const [correoUsuario, setcorreoUsuario] = useState(global.infoUsuario.email);
   const [cedulaUsuario, setcedulaUsuario] = useState('');
   const [telefonoUsuario, settelefonoUsuario] = useState(
      global.infoUsuario.phoneNumber
   );

   const { navigation } = props;

   const cambiarAvatar = () => {
      console.log('Estas cambiando el avatar');
   };

   return (
      <View style={styles.container}>
         <Avatar
            rounded
            size="large"
            showEditButton
            onEditPress={cambiarAvatar}
            containerStyle={styles.estiloAvatar}
            source={{
               uri: global.infoUsuario.photoURL
                  ? global.infoUsuario.photoURL
                  : 'https://api.adorable.io/avatars/150/abott@adorable.png',
            }}
         ></Avatar>

         <Input
            // TO DO : validar que sean solo letras / quitar espacios en blanco
            placeholder="Ingrese su Nombre y Apellido"
            containerStyle={styles.estiloContenedor1}
            inputContainerStyle={styles.estiloInputContenedor}
            inputStyle={styles.estiloInput}
            label="Nombre y Apellido *"
            labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
            onChange={e => setNombreUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
         >
            {nombreUsuario}
         </Input>
         <Input
            placeholder="yappando@mail.com"
            containerStyle={styles.estiloContenedor1}
            inputContainerStyle={styles.estiloInputContenedor}
            inputStyle={styles.estiloInput}
            label="Correo *"
            labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
            onChange={e => setcorreoUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
            disabled="true"
         >
            {correoUsuario}
         </Input>
         <Input
            // TO DO : validar que sean solo numeros
            placeholder="Ingrese su cédula"
            containerStyle={styles.estiloContenedor1}
            inputContainerStyle={styles.estiloInputContenedor}
            inputStyle={styles.estiloInput}
            label="Cédula *"
            labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
            onChange={e => setcedulaUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
         ></Input>
         <Input
            // TO DO : validar que sean solo numeros
            placeholder="Ingrese su número teléfonico"
            containerStyle={styles.estiloContenedor1}
            inputContainerStyle={styles.estiloInputContenedor}
            inputStyle={styles.estiloInput}
            label="Teléfono *"
            labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
            onChange={e => settelefonoUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
         >
            {telefonoUsuario}
         </Input>
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
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   estiloAvatar: { marginRight: 20 },
});
