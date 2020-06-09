import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

// Importación de los colores
import * as colores from '../../constants/Colores';

// Importacion de la cabecera personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';

// Importacion de separador de divs
import Separador from '../../components/Separador';

// Importacion de Toas
import Toast from 'react-native-easy-toast';

export default function PerfilUsuario(props) {
   const toastRef = useRef();

   const { navigation } = props;
   const [nombreUsuario, setNombreUsuario] = useState(
      global.appUsuario.nombreCompleto
   );
   const [correoUsuario, setcorreoUsuario] = useState(global.appUsuario.id);
   const [telefonoUsuario, settelefonoUsuario] = useState(
      global.appUsuario.telefonoCliente
   );

   // Variables de validacion
   const [nombreValidacion, setnombreValidacion] = useState('');
   const [telefonoValidacion, setTelefonoValidacion] = useState('');

   // Actualización
   const [actualizaUsuario, setActualizaUsuario] = useState(false);

   const requerido = 'Campo requerido *';
   const fonoInvalido = 'Número celular invalido';

   useEffect(() => {
      setnombreValidacion('');
      setTelefonoValidacion('');
      traeInformacion();
   }, [actualizaUsuario]);

   const traeInformacion = () => {
      let documento = {};
      global.db
         .collection('clientes')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (doc.data()) {
               documento = doc.data();
               setNombreUsuario(documento.nombreCompleto);
               settelefonoUsuario(documento.telefonoCliente);
               global.appUsuario.telefonoCliente = documento.telefonoCliente;
            }
         })
         .catch(err => {
            console.log('Error firebase', err);
         });
   };
   const actualizaInfo = () => {
      if (!nombreUsuario || !telefonoUsuario) {
         if (!nombreUsuario) {
            setnombreValidacion(requerido);
         } else {
            setnombreValidacion('');
         }
         if (!telefonoUsuario) {
            setTelefonoValidacion(requerido);
         } else {
            setTelefonoValidacion('');
         }
      } else {
         setnombreValidacion('');
         setTelefonoValidacion('');
         if (telefonoUsuario.length != 10) {
            setTelefonoValidacion(fonoInvalido);
         } else {
            setnombreValidacion('');

            setTelefonoValidacion('');
            global.appUsuario.nombreCompleto = nombreUsuario;
            global.appUsuario.telefonoCliente = telefonoUsuario;
            global.db
               .collection('clientes')
               .doc(correoUsuario)
               .update({
                  nombreCompleto: nombreUsuario,
                  telefonoCliente: telefonoUsuario,
               })
               .then(regresoPagina)
               .catch(error => {
                  console.log(error);
               });
         }
      }
   };

   const regresoPagina = () => {
      Alert.alert(
         '',
         'Información guardada con éxito',
         [
            {
               text: 'OK',
               onPress: () => navigation.goBack(),
            },
         ],
         { cancelable: false }
      );
      if (global.repintarUsuario) {
         global.repintarUsuario();
      }
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
                  onPress={() => {
                     setActualizaUsuario(!actualizaUsuario);
                     navigation.goBack();
                  }}
               />
            }
         ></CabeceraPersonalizada>
         <View style={styles.cabecera}>
            <View>
               <Text style={textEstilo(colores.colorBlancoTexto, 30, 'bold')}>
                  Perfil
               </Text>
               <Text style={textEstilo(colores.colorBlancoTexto, 20, 'bold')}>
                  Yappando
               </Text>
            </View>
         </View>
         <View style={styles.pie}>
            <ScrollView keyboardShouldPersistTaps="always">
               <View style={styles.container}>
                  <Input
                     placeholder="yappando@mail.com"
                     containerStyle={styles.estiloContenedor1}
                     inputContainerStyle={styles.estiloInputContenedor}
                     inputStyle={styles.estiloInput}
                     label="Correo *"
                     labelStyle={textEstilo(
                        colores.colorOscuroTexto,
                        15,
                        'normal'
                     )}
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
                     labelStyle={textEstilo(
                        colores.colorOscuroTexto,
                        15,
                        'normal'
                     )}
                     onChange={e => setNombreUsuario(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
                  >
                     {nombreUsuario}
                  </Input>
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
                     labelStyle={textEstilo(
                        colores.colorOscuroTexto,
                        15,
                        'normal'
                     )}
                     onChange={e => {
                        const re = /^[0-9]+$/;
                        if (re.test(e.nativeEvent.text)) {
                           settelefonoUsuario(e.nativeEvent.text);
                           setTelefonoValidacion('');
                        } else {
                           setTelefonoValidacion(fonoInvalido);
                        }
                     }}
                     // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
                  >
                     {telefonoUsuario}
                  </Input>
                  <Separador alto={15}></Separador>
               </View>
               <Button
                  title="Guardar"
                  titleStyle={textEstilo(colores.colorBlancoTexto, 15, 'bold')}
                  containerStyle={styles.btnStyles}
                  buttonStyle={styles.btnGuardar}
                  onPress={actualizaInfo}
               ></Button>
            </ScrollView>
         </View>
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
   container: {
      flex: 1,
      paddingTop: 50,
   },
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 30,
      // paddingTop: 30,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      paddingHorizontal: 40,
      marginTop: 30,
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
