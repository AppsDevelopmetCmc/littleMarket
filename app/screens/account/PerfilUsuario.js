import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';

// Importación de los colores
import * as colores from '../../constants/Colores';

// Importacion de la cabecera personalizada
import CabeceraPersonalizada from '../account/form/CabeceraPersonalizada';

export default function PerfilUsuario(props) {
   const { navigation } = props;

   const [informacionUsuario, setinformacionUsuario] = useState('');

   const [nombreUsuario, setNombreUsuario] = useState(
      global.appUsuario.nombreCompleto
   );
   const [correoUsuario, setcorreoUsuario] = useState(global.appUsuario.id);
   const [cedulaUsuario, setcedulaUsuario] = useState(global.appUsuario.cedula);
   const [telefonoUsuario, settelefonoUsuario] = useState(
      global.appUsuario.telefono
   );

   const actualizaInfo = () => {
      if (
         !nombreUsuario ||
         !correoUsuario ||
         !cedulaUsuario ||
         !telefonoUsuario
      ) {
         console.log('Campos obligatorios');
      } else {
         global.db
            .collection('infoApp')
            .doc('clientes')
            .collection('infoUsuario')
            .doc(correoUsuario)
            .update({
               cedula: cedulaUsuario,
               nombreCompleto: nombreUsuario,
               telefono: telefonoUsuario,
            })
            .then(regresoPagina)
            .catch(error => {
               console.log(error);
            });
      }
   };

   const regresoPagina = () => {
      navigation.goBack();
   };
   return (
      <SafeAreaView style={styles.contenedorPagina}>
         <CabeceraPersonalizada
            iconoComponente={
               <Icon
                  name="arrow-left"
                  type="material-community"
                  color={colores.colorBlanco}
                  size={24}
                  onPress={regresoPagina}
               />
            }
         ></CabeceraPersonalizada>
         <View style={styles.cabecera}>
            <Avatar
               rounded
               size="xlarge"
               containerStyle={styles.estiloAvatar}
               source={{
                  uri: global.appUsuario.imagen
                     ? global.appUsuario.imagen
                     : 'https://api.adorable.io/avatars/150/abott@adorable.png',
               }}
            ></Avatar>
         </View>

         <View style={styles.pie}>
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
            <Button title="Guardar" onPress={actualizaInfo}></Button>
         </View>
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
   estiloAvatar: { marginRight: 20 },
   cabecera: {
      flex: 2,
      backgroundColor: colores.colorPrimarioVerde,
      paddingTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      paddingTop: 50,
   },
   cabeceraContenedor: {
      flexDirection: 'row',
      height: 50,
      borderWidth: 1,
   },
   cabeceraBoton: {
      flex: 1,
      borderColor: 'red',
      borderWidth: 1,
      justifyContent: 'center',
   },
   cabeceraTitulo: {
      flex: 1.5,
      justifyContent: 'center',
      borderColor: 'red',
      borderWidth: 1,
   },
   cabeceraIcon: {
      flex: 1,
      borderColor: 'red',
      borderWidth: 1,
   },
});
