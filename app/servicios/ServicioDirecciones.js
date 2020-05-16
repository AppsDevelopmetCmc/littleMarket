import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';

export class ServicioDirecciones {
   crear = async (idCliente, direccion) => {
      let id = '';
      await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .add(direccion)
         .then(async function (dataDireccion) {
            Alert.alert('Direccion1 Agregado');
            id = dataDireccion.id;
         })
         .catch(function (error) {
            Alert.alert('error' + error);
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
            Alert.alert('Direccion Actualizado');
         })
         .catch(function (error) {
            Alert.alert('error' + error);
         });
   };
   eliminar = (idCliente, idDireccion) => {
      global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .doc(idDireccion)
         .delete()
         .then(function () {
            Alert.alert('Direccion Eliminada');
         })
         .catch(function (error) {
            Alert.alert('error' + error);
         });
   };

   registrarEscuchaDireccionesTodas = (arreglo, fnRepintar, idCliente) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
               let direccion = change.doc.data();
               direccion.id = change.doc.id;
               if (change.type == 'added') {
                  arregloUtil.agregar(direccion, fnRepintar);
               }
               if (change.type == 'modified') {
                  arregloUtil.actualizar(direccion, fnRepintar);
               }
               if (change.type == 'removed') {
                  arregloUtil.eliminar(direccion, fnRepintar);
               }
            });
         });
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
         console.log('direccion pedido:', global.direccionPedido);
         fnRefrescarDireccion();
      } else {
         console.log('no tiene cobertura');
      }
   };

   getTieneCobertura = async (idCliente, fnRepintarDireccion) => {
      let respuesta = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .where('tieneCoberturaDireccion', '==', 'S')
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
         console.log('No tiene Direcciones con Cobertura');
      }
      fnRepintarDireccion(listaDirecciones);
   };

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
            Alert.alert('Direccion Actualizado');
         })
         .catch(function (error) {
            Alert.alert('error' + error);
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
                  console.log('Direccion principal Actualizado');
               })
               .catch(function (error) {
                  Alert.alert('error' + error);
               });
         }
      }
   };
}
