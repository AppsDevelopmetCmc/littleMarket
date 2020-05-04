import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import{ServicioParametros} from '../../servicios/ServicioParametros'
import { ItemDireccion } from './compnentes/ItemDireccion';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export class Direcciones extends Component {
   constructor(props) {
      super(props);
      const { navigation } = props;
      let direcciones = [];
      this.state = {
         listaDirecciones: direcciones,
      };
   }

   componentDidMount() {
      if (global.usuario == null) {
         let user = firebase.auth().currentUser;
         if (user) {
            global.usuario = user.email;
            global.infoUsuario = user.providerData[0];
         }
      }
      let srvDirecciones = new ServicioDirecciones();
      let direcciones = [];
      srvDirecciones.registrarEscuchaDireccionesTodas(
         direcciones,
         this.repintarLista,
         global.usuario
      );
      let parametros=[];
      let srvParametros= new ServicioParametros();
      srvParametros.registrarEscuchaParametrosTodas(parametros,this.obtenerParametros)

   }

   actualizar = direccion => {
      this.props.navigation.navigate('Mapa', {
         origen: 'actualizar',
         direccion: direccion,
      });
   };
   eliminar=(idDireccion)=>
   {
      let servDirecciones=new ServicioDirecciones()
      servDirecciones.eliminar(global.usuario,idDireccion)
   }

   repintarLista = direcciones => {
      this.setState({
         listaDirecciones: direcciones,
      });
   };
   obtenerParametros(parametros)
   {
      global.listaParametros=parametros;
      console.log('parametros'+global.listaParametros)
   }
   render() {
      return (
         <View style={styles.container}>
            <Text>Ingresar Direccion</Text>
            <Text>
               Tiene Cobertura:
               {global.direccionPrincipal != null
                  ? global.direccionPrincipal.tieneCobertura
                     ? 'SI'
                     : 'NO'
                  : 'NO'}
            </Text>
            <Text>
               Dirección Principal:{' '}
               {global.direccionPrincipal != null
                  ? global.direccionPrincipal.descripcion
                  : 'NO TIENE'}
            </Text>
            <Button
               title="Cerrar Sesión"
               onPress={() => {
                  firebase.auth().signOut();
                  console.log('Se cerro sesion');
               }}
            ></Button>

            <View style={styles.cabecera}>
               <Text style={styles.textoNegrita}>LISTA DE DIRECCIONES</Text>
            </View>
            <View style={styles.lista}>
               <FlatList
                  data={this.state.listaDirecciones}
                  renderItem={objeto => {
                     return (
                        <ItemDireccion
                           direccion={objeto.item}
                           fnActualizar={this.actualizar}
                           fnEliminar={this.eliminar}
                        />
                     );
                  }}
                  keyExtractor={objetoCombo => {
                     return objetoCombo.id;
                  }}
               />
            </View>
            <View style={styles.boton}>
               <Button
                  title='Nuevo'
                  onPress={() => {
                     this.props.navigation.navigate('Mapa', {
                        origen: 'nuevo'
                     });
                  }}
               />
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
   },
   fondo: {
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 0,
      width: 200,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
   },
   cabecera: {
      flex: 1,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },
   lista: {
      flex: 8,
   },
   textoNegritaSubrayado: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
   },

   textoNegrita: {
      fontWeight: 'bold',
      fontSize: 17,
      marginTop: 0,
   },
   boton: {
      flex: 2,
      //backgroundColor: 'yellow',
      alignItems: 'center',
   },
});
