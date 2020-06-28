import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   Image,
   Alert,
   TouchableOpacity,
} from 'react-native';
import { Avatar, CheckBox, Button } from 'react-native-elements';
import * as colores from '../../constants/Colores';

const categorias = [
   { key: 'V', nombre: 'Verduras', nombreAux: 'y Legumbres', nemonico: 'V' },
   { key: 'F', nombre: 'Frutas', nemonico: 'F' },
   { key: 'O', nombre: 'Otros', nemonico: 'O' },
   { key: 'P', nombre: 'Pescado', nemonico: 'P' },
   { key: 'L', nombre: 'Pollo', nemonico: 'L' },
];

/*const colorFondo = colores.colorPrimarioVerde;
const colorSeleccionado = colores.colorOscuroPrimarioVerde;*/

//const colorFondo = colores.colorClaroPrimarioTomate;
const colorSeleccionado = colores.colorPrimarioTomate;
const colorFondo = colores.colorPrimarioTomateRgba;

let categoriasCorta = [];
function recortarLista(key) {
   let posicion = 0;
   let inicio = 0;
   let total = 3;
   let contador = 0;
   for (let i = 0; i < categorias.length; i++) {
      categorias[i].seleccionado = false;
      categorias[i].izquierdo = false;
      categorias[i].derecho = false;
      if (key == categorias[i].key) {
         posicion = i;
         categorias[i].seleccionado = true;
      }
   }
   if (posicion > 0) {
      categorias[posicion - 1].izquierdo = true;
   }
   if (posicion <= categoriasCorta.length) {
      categorias[posicion + 1].derecho = true;
   }
   if (posicion != 0) {
      inicio = posicion - 1;
   }
   if (categorias.length - inicio < total) {
      inicio = total - 1;
   }
   categoriasCorta = [];
   for (let i = inicio; i < categorias.length; i++) {
      contador++;
      categoriasCorta.push(categorias[i]);
      if (contador == total) {
         break;
      }
   }
}
function Botones() {
   recortarLista(global.categoria);
   return categoriasCorta.map(categoria => {
      return (
         <View
            key={categoria.key}
            style={
               categoria.seleccionado
                  ? styles.botonSeleccionado
                  : categoria.izquierdo
                  ? styles.botonIzquierdo
                  : categoria.derecho
                  ? styles.botonDerecho
                  : styles.botonNormal
            }
         >
            <TouchableOpacity
               onPress={() => {
                  global.categoria = categoria.key;
                  global.pintarListaPoductos();
               }}
            >
               <View
                  style={{
                     alignItems: 'center',
                     backgroundColor: categoria.seleccionado
                        ? colorSeleccionado
                        : colorFondo,
                  }}
               >
                  <Text style={{ fontSize: 16 }}>{categoria.nombre}</Text>
               </View>
            </TouchableOpacity>
         </View>
      );
   });
}
export class NavegadorCategorias extends Component {
   render() {
      return (
         <View style={{ flex: 1 }}>
            <View style={styles.botonesSuperior}></View>
            <View style={styles.botonesInferior}></View>
            <View style={styles.contenedorBotones}>
               <Botones></Botones>
            </View>
         </View>
      );
   }
}
const styles = StyleSheet.create({
   botonesSuperior: {
      flex: 1,
      //flexDirection: 'row',
      //height: 20,
      backgroundColor: colorFondo,
      //borderBottomWidth: 2,
   },
   botonesInferior: {
      flex: 3,
      flexDirection: 'row',
      //height: 20,
      backgroundColor: colorSeleccionado,
      borderBottomColor: colorSeleccionado,
      borderBottomWidth: 2,
   },
   botonNormal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: colorFondo,
   },
   botonSeleccionado: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: colorSeleccionado,
      borderTopEndRadius: 10,
      borderTopStartRadius: 10,
   },
   botonIzquierdo: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: colorFondo,
      borderBottomEndRadius: 10,
      marginLeft: 1,
   },
   contenedorBotones: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      //justifyContent: 'center',
      alignItems: 'stretch',
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: colorSeleccionado,
   },
   botonDerecho: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: colorFondo,
      borderBottomStartRadius: 10,
      marginRight: 1,
   },
});
