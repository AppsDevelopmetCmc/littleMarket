import { StyleSheet } from 'react-native';
import * as colores from '../constants/Colores';
const TAMANIO_TEXTO_BOTONES = 13;
const TAMANIO_TEXTO_INSTRUCCION = 13;
const TAMANIO_TITULO = 24;
export const textos = StyleSheet.create({
   botonBlanco: {
      color: colores.colorOscuroTexto,
      fontSize: TAMANIO_TEXTO_BOTONES,
      //fontWeight: 'bold',
   },
   botonBlancoTomate: {
      color: colores.colorPrimarioTomate,
      fontSize: TAMANIO_TEXTO_BOTONES,
      //fontWeight: 'bold',
   },
   titulo: {
      color: colores.colorBlancoTexto,
      fontSize: TAMANIO_TITULO,
      fontWeight: 'bold',
   },
   instruccion: {
      color: colores.colorOscuroTexto,
      fontSize: TAMANIO_TEXTO_INSTRUCCION,
   },
});
export const botones = StyleSheet.create({
   blanco: {
      backgroundColor: colores.colorBlanco,
      height: 40,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
   },
   blancoRight: {
      backgroundColor: colores.colorBlanco,
      height: 50,
      alignItems: 'center',
      //justifyContent: 'flex-end',
      padding: 0,
     // marginRight: 5,
     // marginLeft: 5,
   },

   blancoLeft: {
      backgroundColor: colores.colorBlanco,
      height: 50,
      alignItems: 'center',
      //justifyContent: 'flex-start',
      padding: 0,
     // marginLeft: 5,
      marginRight: 50,
   },
});
