import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { ServicioDirecciones } from '../../servicios/ServicioDirecciones';
import{ServicioParametros} from '../../servicios/ServicioParametros'
import { ItemDireccion } from './compnentes/ItemDireccion';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as colores from '../../constants/Colores'


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

   validarCoberturaGlobalDireccion=async()=>
   {
      let servDirecciones=new ServicioDirecciones();
      let coberturaDireccion=await servDirecciones.getValidarCoberturaGlobal(global.usuario);
      if(coberturaDireccion==true)
      {
         console.log('cobertura Global 0 '+ global.tieneCobertura);
        global.tieneCobertura=true;
        console.log('cobertura Global 1 '+ global.tieneCobertura);
      }
      else{
         Alert.alert('Ninguna de las Direcciones Ingresadas tiene Cobertura')
      }

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
               buttonStyle={styles.btnRegistrarse}
                  title='Nuevo'
                  onPress={() => {
                     this.props.navigation.navigate('Mapa', {
                        origen: 'nuevo'
                     });
                  }}
                  icon={
                     <Icon
                        name="map-plus"
                        size={25}
                        color="white"
                        style={styles.iconoStilos}
                     />
                  }
               />
            </View>
            <Button
               buttonStyle={styles.btnContinuar}
                  title='Continuar'
                  onPress={() => {
                        this.validarCoberturaGlobalDireccion();
                  }}
               />

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
   btnRegistrarse: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 200,
      height: 45,
      borderRadius: 25,
      marginBottom: 50,
   },
   btnContinuar: {
      backgroundColor: colores.colorPrimarioTomate,
      width: 200,
      height: 45,
      borderRadius: 25,
      marginBottom: 50,
   },
   iconoStilos: { alignItems: 'center' },
   
});
