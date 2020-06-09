import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { validarTelefono, validarCedula } from '../../utils/utils.js';
import RNPickerSelect from 'react-native-picker-select';

// Importación de los colores
import * as colores from '../../constants/Colores';

// Importacion de la cabecera personalizada
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';

// Importacion de separador de divs
import Separador from '../../components/Separador';

export default function DatosFacturacion(props) {
   const { navigation } = props;
   const [nombreUsuario, setNombreUsuario] = useState(
      global.appUsuario.nombreCompleto
   );
   let datos = [
      { label: 'Cédula', value: 'Cédula' },
      { label: 'Ruc', value: 'Ruc' },
   ];
   const [documentoSeleccionado, setdocumentoSeleccionado] = useState('');
   const [correoUsuario, setcorreoUsuario] = useState(global.appUsuario.id);
   const [cedulaUsuario, setcedulaUsuario] = useState(global.appUsuario.cedula);
   const [telefonoUsuario, settelefonoUsuario] = useState(
      global.appUsuario.telefonoCliente
   );
   const [tipoDocumento, settipoDocumento] = useState(datos);
   const [alias, setalias] = useState('');

   // Variables de validacion
   const [nombreValidacion, setnombreValidacion] = useState('');
   const [cedulaValidacion, setCedulaValidacion] = useState('');
   const [telefonoValidacion, setTelefonoValidacion] = useState('');
   const [aliasValidacion, setAliasValidacion] = useState('');
   const [
      documentoSeleccionadoValidacion,
      setDocumentoSeleccionadoValidacion,
   ] = useState('');
   const requerido = 'Campo requerido *';
   const fonoInvalido = 'Número  incorrecto';

   const actualizaInfo = () => {
      if (
         !nombreUsuario ||
         !cedulaUsuario ||
         !telefonoUsuario ||
         !alias ||
         !documentoSeleccionado
      ) {
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
         if (!alias) {
            setAliasValidacion(requerido);
         } else {
            setAliasValidacion('');
         }

         if (
            !documentoSeleccionado &&
            documentoSeleccionadoValidacion != null
         ) {
            setDocumentoSeleccionadoValidacion(requerido);
            Alert.alert('Ingrese Tipo de Documento');
         } else {
            setDocumentoSeleccionadoValidacion('');
         }
         if (!telefonoUsuario) {
            setTelefonoValidacion(requerido);
         } else {
            setTelefonoValidacion('');
         }
      } else {
         let validaTele = validarTelefono(telefonoUsuario);
         let validaDocumento = validarCedula(
            cedulaUsuario,
            documentoSeleccionado
         );
         if (validaTele == 'S') {
            if (validaDocumento == 'S') {
               global.db
                  .collection('clientes')
                  .doc(correoUsuario)
                  .collection('factura')
                  .add({
                     tipoDocumento: documentoSeleccionado,
                     numDocumento: cedulaUsuario,
                     alias: alias,
                     nombreCompleto: nombreUsuario,
                     correo: correoUsuario,
                     telefono: telefonoUsuario,
                  })
                  .then(regresoPagina)
                  .catch(error => {
                     console.log(error);
                  });
               props.route.params.refrescar();
               setCedulaValidacion('');
               setTelefonoValidacion('');
            } else {
               setCedulaValidacion(fonoInvalido);
            }
         } else {
            setTelefonoValidacion(fonoInvalido);
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
   };
   return (
      <SafeAreaView style={styles.contenedorPagina}>
         <View style={styles.cabecera}>
            <Text style={textEstilo(colores.colorBlancoTexto, 24, 'bold')}>
               Datos Facturación
            </Text>
            <Text style={textEstilo(colores.colorBlancoTexto, 18, 'bold')}>
               Yappando
            </Text>
         </View>
         <View style={styles.pie}>
            <KeyboardAwareScrollView>
               <RNPickerSelect
                  onValueChange={value => console.log(value)}
                  items={tipoDocumento}
                  errorMessage={documentoSeleccionadoValidacion}
                  value={documentoSeleccionado}
                  style={pickerSelectStyles}
                  placeholder={{
                     label: 'Elija Tipo de Documento*',
                     value: null,
                  }}
                  onValueChange={value => {
                     setdocumentoSeleccionado(value);
                  }}
               />

               <Separador alto={15}></Separador>
               {documentoSeleccionado == 'Ruc' ? (
                  <Input
                     // TO DO : validar que sean solo numeros
                     placeholder="Ingrese número de documento"
                     containerStyle={styles.estiloContenedor1}
                     inputContainerStyle={styles.estiloInputContenedor}
                     inputStyle={styles.estiloInput}
                     label="Número de Documento*"
                     keyboardType="numeric"
                     maxLength={13}
                     errorMessage={cedulaValidacion}
                     labelStyle={textEstilo(
                        colores.colorOscuroTexto,
                        15,
                        'normal'
                     )}
                     onChange={e => {
                        const ra = /^[0-9]+$/;
                        if (ra.test(e.nativeEvent.text)) {
                           setcedulaUsuario(e.nativeEvent.text);
                           setCedulaValidacion('');
                        } else {
                           setCedulaValidacion(fonoInvalido);
                        }
                     }} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
                  ></Input>
               ) : (
                  <Input
                     // TO DO : validar que sean solo numeros
                     placeholder="Ingrese número de documento"
                     containerStyle={styles.estiloContenedor1}
                     inputContainerStyle={styles.estiloInputContenedor}
                     inputStyle={styles.estiloInput}
                     label="Número de Documento*"
                     keyboardType="numeric"
                     maxLength={10}
                     errorMessage={cedulaValidacion}
                     labelStyle={textEstilo(
                        colores.colorOscuroTexto,
                        15,
                        'normal'
                     )}
                     onChange={e => {
                        const ra = /^[0-9]+$/;
                        if (ra.test(e.nativeEvent.text)) {
                           setcedulaUsuario(e.nativeEvent.text);
                           setCedulaValidacion('');
                        } else {
                           setCedulaValidacion(fonoInvalido);
                        }
                     }} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
                  ></Input>
               )}

               <Separador alto={15}></Separador>
               <Input
                  placeholder="Alias"
                  containerStyle={styles.estiloContenedor1}
                  inputContainerStyle={styles.estiloInputContenedor}
                  inputStyle={styles.estiloInput}
                  label="Alias *"
                  errorMessage={aliasValidacion}
                  labelStyle={textEstilo(
                     colores.colorOscuroTexto,
                     15,
                     'normal'
                  )}
                  onChange={e => setalias(e.nativeEvent.text)} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
               ></Input>
               <Separador alto={15}></Separador>
               <Input
                  // TO DO : validar que sean solo letras / quitar espacios en blanco
                  placeholder="Ingrese Nombre / Razón Social"
                  containerStyle={styles.estiloContenedor1}
                  inputContainerStyle={styles.estiloInputContenedor}
                  inputStyle={styles.estiloInput}
                  label="Nombre / Razón Social *"
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
                  }} // Con nativeEvent se ingresa a obtener el elemento del texto por SyntheticEvent
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
            </KeyboardAwareScrollView>
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
const pickerSelectStyles = StyleSheet.create({
   inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
   inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
});
const styles = StyleSheet.create({
   contenedorPagina: { flex: 1, backgroundColor: colores.colorPrimarioVerde },
   cabecera: {
      flex: 1,
      backgroundColor: colores.colorPrimarioVerde,
      paddingLeft: 40,
      paddingTop: 10,
   },
   pie: {
      flex: 6,
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
