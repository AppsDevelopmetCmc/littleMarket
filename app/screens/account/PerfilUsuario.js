import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importación de los colores
import * as colores from '../../constants/Colores';

// Importacion de la cabecera personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';

// Importacion de separador de divs
import Separador from '../../components/Separador';

export default function PerfilUsuario(props) {
   const { navigation } = props;
   const [nombreUsuario, setNombreUsuario] = useState(
      global.appUsuario.nombreCompleto
   );
   const [correoUsuario, setcorreoUsuario] = useState(global.appUsuario.id);
   const [cedulaUsuario, setcedulaUsuario] = useState(global.appUsuario.cedula);
   const [telefonoUsuario, settelefonoUsuario] = useState(
      global.appUsuario.telefono
   );

   // Variables de validacion
   const [nombreValidacion, setnombreValidacion] = useState('');
   const [cedulaValidacion, setCedulaValidacion] = useState('');
   const [telefonoValidacion, setTelefonoValidacion] = useState('');

   const requerido = 'Campo requerido *';

   const actualizaInfo = () => {
      if (!nombreUsuario || !cedulaUsuario || !telefonoUsuario) {
         if (!nombreUsuario) {
            setnombreValidacion(requerido);
         } else {
            setnombreValidacion('');
         }
         if (!cedulaUsuario) {
            setCedulaValidacion(requerido);
         } else {
            setCedulaValidacion('');
         }
         if (!telefonoUsuario) {
            setTelefonoValidacion(requerido);
         } else {
            setTelefonoValidacion('');
         }
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
            <Text style={textEstilo(colores.colorBlancoTexto, 30, 'bold')}>
               Perfil
            </Text>
            <Text style={textEstilo(colores.colorBlancoTexto, 20, 'bold')}>
               Yappando
            </Text>
         </View>

         <View style={styles.pie}>
            <Input
               placeholder="yappando@mail.com"
               containerStyle={styles.estiloContenedor1}
               inputContainerStyle={styles.estiloInputContenedor}
               inputStyle={styles.estiloInput}
               label="Correo *"
               labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
               onChange={e => setcorreoUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
               disabled={true}
            >
               {correoUsuario}
            </Input>
            <Separador alto={15}></Separador>
            <Input
               // TO DO : validar que sean solo letras / quitar espacios en blanco
               placeholder="Ingrese su Nombre y Apellido"
               containerStyle={styles.estiloContenedor1}
               inputContainerStyle={styles.estiloInputContenedor}
               inputStyle={styles.estiloInput}
               label="Nombre y Apellido *"
               errorMessage={nombreValidacion}
               labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
               onChange={e => setNombreUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
            >
               {nombreUsuario}
            </Input>
            <Separador alto={15}></Separador>

            <Input
               // TO DO : validar que sean solo numeros
               placeholder="Ingrese su cédula"
               containerStyle={styles.estiloContenedor1}
               inputContainerStyle={styles.estiloInputContenedor}
               inputStyle={styles.estiloInput}
               label="Cédula *"
               keyboardType="numeric"
               maxLength={10}
               errorMessage={cedulaValidacion}
               labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
               onChange={e => setcedulaUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
            ></Input>
            <Separador alto={15}></Separador>
            <Input
               // TO DO : validar que sean solo numeros
               placeholder="Ingrese su número teléfonico"
               containerStyle={styles.estiloContenedor1}
               inputContainerStyle={styles.estiloInputContenedor}
               inputStyle={styles.estiloInput}
               label="Teléfono celular *"
               keyboardType="numeric"
               maxLength={10}
               errorMessage={telefonoValidacion}
               labelStyle={textEstilo(colores.colorOscuroTexto, 15, 'normal')}
               onChange={e => settelefonoUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
            >
               {telefonoUsuario}
            </Input>
            <Separador alto={15}></Separador>
            <Button
               title="Guardar"
               titleStyle={textEstilo(colores.colorBlancoTexto, 15, 'bold')}
               containerStyle={styles.btnStyles}
               buttonStyle={styles.btnGuardar}
               onPress={actualizaInfo}
            ></Button>
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
   cabecera: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
      paddingLeft: 40,
      paddingTop: 10,
   },
   pie: {
      flex: 5,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      paddingTop: 50,
   },
   estiloContenedor1: {
      width: '100%',
      padding: 0,
      margin: 0,
   },
   estiloInputContenedor: {
      padding: 0,
      height: 40,
   },
   estiloInput: { fontSize: 15 },
   btnStyles: {
      marginTop: 50,
      width: '100%',
      height: 40,
   },
   btnGuardar: {
      paddingHorizontal: 40,
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 25,
   },
});
