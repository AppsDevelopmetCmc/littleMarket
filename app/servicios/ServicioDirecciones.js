import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';
import Geocoder from 'react-native-geocoding';

export const generarDireccion = async (latitud, longitud, fnAsignar) => {
   let response = await Geocoder.from(latitud, longitud);
   let componentes = response.results[0].address_components;
   let direccionName = {};
   if (componentes) {
      for (let i = 0; i < componentes.length; i++) {
         let componente = componentes[i];
         //     console.log('componente', componente);
         for (let j = 0; j < componente.types.length; j++) {
            //     console.log('route', direccionName.route);

            if (componente.types[j] == 'route') {
               if (!direccionName.route) {
                  direccionName.route = componente.short_name;
               }
               if (direccionName.route != componente.short_name) {
                  direccionName.route2 = componente.short_name + '';
               }
            }

            if (componente.types[j] == 'point_of_interest') {
               direccionName.point_of_interest = componente.short_name;
            }
            if (componente.types[j] == 'street_number') {
               direccionName.street_number = componente.short_name;
            }
            if (componente.types[j] == 'sublocality') {
               direccionName.sublocality = componente.short_name;
            }
            if (componente.types[j] == 'locality') {
               direccionName.locality = componente.short_name;
            }
            if (componente.types[j] == 'country') {
               direccionName.country = componente.long_name;
            }
         }
      }
   }
   //point_of_interest, route street_number, sublocality, locality
   //    console.log('direccionX===>', direccionName);
   let nombreDireccion = '';

   if (direccionName) {
      let numeroCalle = direccionName.route + ' ' + direccionName.street_number;
      if (direccionName.route2) {
         numeroCalle =
            direccionName.route +
            ' ' +
            direccionName.street_number +
            ' ' +
            direccionName.route2;
      }
      let resNumeroCalle = numeroCalle.replace(/undefined/gi, '');
      let str =
         direccionName.point_of_interest +
         ', ' +
         resNumeroCalle +
         ', ' +
         direccionName.sublocality +
         ', ' +
         direccionName.locality; /*+
         '-' +
         direccionName.country;*/
      let res = str.replace(/, ,/gi, ',');
      res = str.replace(/ ,/gi, '');
      nombreDireccion = res.replace(/undefined,/gi, '');
   }

   console.log('direccionName===>', nombreDireccion);
   // this.setState({ direccion: nombreDireccion });
   fnAsignar(nombreDireccion, latitud, longitud);
};

export class ServicioDirecciones {
   crear = async (idCliente, direccion) => {
      let id = '';
      await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .add(direccion)
         .then(function (dataDireccion) {
            id = dataDireccion.id;
            global.direccionPedido = direccion;
            global.direccionPedido.id = dataDireccion.id;
            if (global.repintarDireccion) {
               global.repintarDireccion();
            }
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
      return id;
   };

   actualizar = (idCliente, idDireccion, direccion) => {
      global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .doc(idDireccion)
         .update({
            descripcion: direccion.descripcion,
            latitud: direccion.latitud,
            longitud: direccion.longitud,
            tieneCoberturaDireccion: direccion.tieneCoberturaDireccion,
         })
         .then(function () {
            //Alert.alert('Dirección Actualizada');
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
   };
   eliminarDir = (idCliente, idDireccion) => {
      console.log('ELIMINADO...', idCliente, idDireccion);
      global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .doc(idDireccion)
         .delete()
         .then()
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
   };
   buscar = objeto => {
      let indice = -1;
      for (let i = 0; i < global.direcciones.length; i++) {
         if (objeto.id == global.direcciones[i].id) {
            indice = i;
            break;
         }
      }
      return indice;
   };
   actualizarInfo = objeto => {
      let posicion = this.buscar(objeto);
      if (posicion != -1) {
         global.direcciones[posicion] = objeto;
      }
      //console.log('luego de actualizar smo:', global.direcciones);
      //fnRepintar();
   };

   eliminar = objeto => {
      let posicion = this.buscar(objeto);
      if (posicion != -1) {
         global.direcciones.splice(posicion, 1);
      }
   };
   registrarEscuchaDireccion = (idCliente, fnRepintar) => {
      let actualizarInfo = this.actualizarInfo;
      let eliminar = this.eliminar;
      global.fnRepintarDireccion = fnRepintar;
      if (!global.direcciones) {
         global.direcciones = [];
         global.db
            .collection('clientes')
            .doc(idCliente)
            .collection('direcciones')
            .onSnapshot(function (snapShot) {
               snapShot.docChanges().forEach(function (change) {
                  let direccion = change.doc.data();
                  direccion.id = change.doc.id;
                  if (change.type == 'added') {
                     global.direcciones.push(direccion);
                  }
                  if (change.type == 'modified') {
                     actualizarInfo(direccion);
                  }
                  if (change.type == 'removed') {
                     eliminar(direccion);
                  }
               });
               global.fnRepintarDireccion();
            });
      }
   };

   registrarEscuchaMapaDireccion = (idCliente, fnRepintar) => {
      let actualizarInfo = this.actualizarInfo;
      let eliminar = this.eliminar;
      global.fnRepintarDireccion = fnRepintar;
      //   if (!global.direcciones) {
      global.direcciones = [];
      return global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
               let direccion = change.doc.data();
               direccion.id = change.doc.id;
               if (change.type == 'added') {
                  global.direcciones.push(direccion);
                  console.log('***********SE AGREGA DIRECCION ', direccion.id);
               }
               if (change.type == 'modified') {
                  actualizarInfo(direccion);
               }
               if (change.type == 'removed') {
                  eliminar(direccion);
               }
            });
            global.fnRepintarDireccion();
         });
      /* } else {
         global.fnRepintarDireccion();
      }*/
   };

   getValidarCoberturaGlobal = async idCliente => {
      let coberturaGlobalDireccion = false;
      let coleccion = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .get();
      let documentos = coleccion.docs;
      for (let i = 0; i < documentos.length; i++) {
         if (documentos[i].data().tieneCoberturaDireccion !== undefined) {
            if (documentos[i].data().tieneCoberturaDireccion === 'S') {
               coberturaGlobalDireccion = true;

               break;
            }
         }
      }
      console.log('coberturaGlobalDireccion' + coberturaGlobalDireccion);
      return coberturaGlobalDireccion;
   };

   tieneCobertura = async idCliente => {
      console.log('consulta tiene cobertura:' + idCliente);
      let respuesta = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .where('tieneCoberturaDireccion', '==', 'S')
         .get();

      if (respuesta && respuesta.docs && respuesta.docs.length > 0) {
         global.activarCobertura(true);
      } else {
         global.activarCobertura(false);
      }
   };

   recuperarPrincipal = async (idCliente, fnRefrescarDireccion) => {
      let respuesta = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .where('principal', '==', 'S')
         .get();
      if (respuesta && respuesta.docs && respuesta.docs.length > 0) {
         global.direccionPedido = respuesta.docs[0].data();
         global.direccionPedido.id = respuesta.docs[0].id;
         console.log('direccion pedido:', global.direccionPedido);
         fnRefrescarDireccion();
      } else {
         console.log('no tiene cobertura');
      }
   };

   /*getTieneCobertura = async (idCliente, fnRepintarDireccion) => {
      let respuesta = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         //.where('tieneCoberturaDireccion', '==', 'S')
         .get();
      let listaDirecciones = [];
      if (respuesta.docs && respuesta.docs.length > 0) {
         for (let i = 0; i < respuesta.docs.length; i++) {
            let direccion = [];
            direccion = respuesta.docs[i].data();
            direccion.id = respuesta.docs[i].id;
            listaDirecciones.push(direccion);
         }
      } else {
         console.log('No tiene Direccciones');
      }
      fnRepintarDireccion(listaDirecciones);
   };*/

   guardarReferencia = (idCliente, idDireccion, referenciaDireccion) => {
      global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .doc(idDireccion)
         .update({
            referencia: referenciaDireccion.referencia,
            alias: referenciaDireccion.alias,
            principal: referenciaDireccion.principal,
         })
         .then(function () {
            // Alert.alert('Datos de Referencia Actualizado');
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
   };

   guardarDataReferencia = async (
      idCliente,
      idDireccion,
      referenciaDireccion
   ) => {
      console.log('Entra a actualizar');
      console.log(idCliente);
      console.log(idDireccion);
      await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .doc(idDireccion)
         .update({
            descripcion: referenciaDireccion.descripcion,
            referencia: referenciaDireccion.referencia,
            principal: referenciaDireccion.principal,
            latitud: referenciaDireccion.latitud,
            longitud: referenciaDireccion.longitud,
         })
         .then(function () {
            // Alert.alert('Datos de Referencia Actualizado');
            console.log('Datos de Referencia Actualizado');
         })
         .catch(function (error) {
            console.log('Error Datos de Referencia Actualizado');
            Alert.alert('Se ha producido un Error', error);
         });
   };

   actualizarPrincipalTodosNo = async idCliente => {
      let respuesta = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .where('principal', '==', 'S')
         .get();
      if (respuesta.docs && respuesta.docs.length > 0) {
         for (let i = 0; i < respuesta.docs.length; i++) {
            await global.db
               .collection('clientes')
               .doc(idCliente)
               .collection('direcciones')
               .doc(respuesta.docs[i].id)
               .update({
                  principal: 'N',
               })
               .then(function () {
                  //console.log('Dirección principal Actualizado');
               })
               .catch(function (error) {
                  Alert.alert('Se ha producido un Error', error);
               });
         }
      }
   };

   obtenerDirecciones = async (idCliente,fnValidar) => {

      let respuesta = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .get();
         let tieneDireccion=false;
      if (respuesta.docs && respuesta.docs.length > 0) {
         for (let i = 0; i <respuesta.docs.length; i++) {
            if (respuesta.docs[i].data().tieneCoberturaDireccion !== undefined) {
               if (respuesta.docs[i].data().tieneCoberturaDireccion === 'S') {
                  global.direccionPedido=respuesta.docs[i].data();
                  global.direccionPedido.id=respuesta.docs[i].id
                  let tieneDireccion=true;
                  break;
               }               
            }
         }

         if(tieneDireccion==false)
         {
            global.direccionPedido=respuesta.docs[0].data();
            global.direccionPedido.id=respuesta.docs[0].id
         }
      }else
      {
         fnValidar()
      }
      

   };

}
