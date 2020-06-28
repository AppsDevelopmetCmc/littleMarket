import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Alert } from 'react-native';

// Importacion de colores
import * as colores from '../../constants/Colores';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Separador from '../../components/Separador';
import { ServicioCodigos } from '../../servicios/ServicioCodigos';
import { ServicioMonederos } from '../../servicios/ServicioMonederos';
import Cargando from '../../components/Cargando';
import { transformDinero } from '../../utils/Validaciones';

export function Monedero(props) {
   const { navigation } = props;

   const [valorMonedero, setValorMonedero] = useState(0);
   const [codigoDesc, setCodigoDesc] = useState('');
   const [mostrarCargando, setMostrarCargando] = useState(false);
   const [renderMonedero, setRenderMonedero] = useState(false);
   const input = React.createRef();

   //Logs
   console.log('valorMonedero', valorMonedero);
   //    console.log('codigoDesc', codigoDesc);
   //    console.log('mostrarCargando', mostrarCargando);
   //    console.log('Props monedero', props);
   useEffect(() => {
      traeInformacionMonedero();
      input.current.clear();
   }, [renderMonedero]);

   const traeInformacionMonedero = async () => {
      let documento = {};
      await global.db
         .collection('monederos')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (doc.data()) {
               documento = doc.data();
               setValorMonedero(documento.valor);
            } else {
               setValorMonedero(0);
            }
         })
         .catch(err => {
            console.log('Error firebase', err);
         });
   };
   const finalizarCodigo = mensaje => {
      console.log('Finaliza Monedero');

      if (mensaje) {
         Alert.alert('Información', mensaje);
         //setValorMonedero(valorMonedero);
         setRenderMonedero(!renderMonedero);
      }
      setMostrarCargando(false);
   };

   const enviarCodigo = () => {
      let srvCodigos = new ServicioCodigos();
      let validar = true;
      setMostrarCargando(true);
      if (codigoDesc == '' || codigoDesc == undefined) {
         console.log('No ha ingresado ningun codigo');
         Alert.alert('Información', 'No ha ingresado ningún código');
         validar = false;
      }
      if (validar) {
         srvCodigos.validarCodigo(codigoDesc, global.usuario, finalizarCodigo);
         input.current.clear();
      } else {
         setMostrarCargando(false);
         input.current.clear();
      }
   };

   const disSeparador = 45;
   return (
      <SafeAreaView style={styles.contenedorPagina}>
         <View style={styles.cabecera}>
            <Icon
               raised
               name="arrow-left"
               size={25}
               color={colores.colorBlanco}
               onPress={() => {
                  navigation.goBack();
                  setRenderMonedero(!renderMonedero);
               }}
            />
            <Text style={textEstilo(colores.colorBlancoTexto, 22, 'bold')}>
               Mis Promociones
            </Text>
         </View>
         <View style={styles.pie}>
            <View style={styles.contenedorTitulo}>
               <Text style={textEstilo(colores.colorOscuroTexto, 18, 'bold')}>
                  Código
               </Text>
               <View style={styles.lineaSeparador}></View>
            </View>
            <View style={styles.contendedorCodigo}>
               <Input
                  ref={input}
                  placeholder="Ingrese su código promocional"
                  containerStyle={styles.containerStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  inputStyle={styles.inputStyle}
                  labelStyle={textEstilo(
                     colores.colorOscuroTexto,
                     14,
                     'normal'
                  )}
                  onChange={e => {
                     setCodigoDesc(e.nativeEvent.text);
                  }}
                  autoCapitalize="characters"
               />
               <Button
                  title={'Enviar'}
                  titleStyle={textEstilo(colores.colorBlancoTexto, 15, 'bold')}
                  buttonStyle={styles.buttonStyle}
                  onPress={enviarCodigo}
               ></Button>
            </View>
            <Separador alto={10}></Separador>
            <View style={styles.contenedorTitulo}>
               <Text style={textEstilo(colores.colorOscuroTexto, 15, 'normal')}>
                  Ingresa tu código y obten beneficios en tus compras
               </Text>
            </View>
            <Separador alto={disSeparador}></Separador>
            <View style={styles.contenedorTitulo}>
               <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 18, 'bold')}
                     >
                        Beneficio
                     </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                     <Text
                        style={textEstilo(colores.colorOscuroTexto, 18, 'bold')}
                     >
                        {'USD ' + transformDinero(valorMonedero)}
                     </Text>
                  </View>
               </View>
               <View style={styles.lineaSeparador}></View>
            </View>
            <View style={styles.contenedorTitulo}>
               <Text style={textEstilo(colores.colorOscuroTexto, 15, 'normal')}>
                  {'Usted tiene USD ' +
                     transformDinero(valorMonedero) +
                     ' para usar en su próxima compra'}
               </Text>
            </View>
            <Separador alto={disSeparador}></Separador>
            <View style={styles.contenedorTitulo}>
               <Text style={textEstilo(colores.colorOscuroTexto, 18, 'bold')}>
                  Como Obtenerlos
               </Text>
               <View style={styles.lineaSeparador}></View>
            </View>
            <View style={styles.contenedorTitulo}>
               <Text style={textEstilo(colores.colorOscuroTexto, 15, 'normal')}>
                  Para obtener tus códigos debes:
               </Text>
            </View>

            <View style={styles.contenedorTitulo}>
               <Text style={textEstilo(colores.colorOscuroTexto, 15, 'normal')}>
                  {
                     '* Realizar compras en nuestra aplicación \n* Seguirnos en nuestras redes sociales \n* Estar atentos a concursos y promociones \n* Revisar sus notificaciones \n* Referir a un amigo'
                  }
               </Text>
            </View>
         </View>
         <Cargando
            text="Validando Código Promocional"
            isVisible={mostrarCargando}
         />
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
   overlay: {
      height: 150,
      width: '65%',
      backgroundColor: colores.colorBlanco,
      borderRadius: 15,
   },
   view: {
      flex: 1,
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
   },
   text: {
      color: colores.colorClaroPrimarioTomate,
      fontWeight: '900',
      // textTransform: 'uppercase',
      marginTop: 30,
      fontSize: 15,
   },
   cabecera: {
      backgroundColor: colores.colorPrimarioVerde,
      paddingHorizontal: 25,
      paddingTop: 30,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
   },
   contenedorPagina: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
      backgroundColor: colores.colorPrimarioVerde,
   },
   pie: {
      flex: 4,
      backgroundColor: colores.colorBlanco,
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      paddingHorizontal: 15,
      marginTop: 30,
      paddingTop: 20,
   },
   containerStyle: {
      marginVertical: 2,
      width: 250,
   },
   inputContainerStyle: { borderColor: colores.colorBlanco },
   inputStyle: {
      fontSize: 15,
      borderRadius: 5,
      backgroundColor: colores.colorBlancoTexto,
      paddingLeft: 10,
      borderWidth: 1,
      borderColor: colores.colorPrimarioTomate,
   },
   inputStyleContenedor: {
      padding: 0,
      marginTop: 0,
   },
   contendedorCodigo: {
      flexDirection: 'row',
   },
   lineaSeparador: {
      width: '100%',
      borderBottomWidth: 1,
      borderColor: colores.colorClaroPrimario,
      marginBottom: 15,
      paddingVertical: 5,
   },
   contenedorTitulo: {
      paddingHorizontal: 10,
   },
   buttonStyle: {
      backgroundColor: colores.colorPrimarioTomate,
      borderRadius: 5,
   },
});
