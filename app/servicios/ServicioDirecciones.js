import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';

export class ServicioDirecciones {
   crear = (idCliente, direccion) => {
      global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .add(direccion)
         .then(function () {
            Alert.alert('Direccion Agregado');
         })
         .catch(function (error) {
            Alert.alert('error' + error);
         });
   };

   actualizar = (idCLiente, idDireccion, direccion) => {
      global.db
         .collection('clientes')
         .doc(idCLiente)
         .collection('direcciones')
         .doc(idDireccion)
         .update({
            descripcion: direccion.descripcion,
            latitud: direccion.latitud,
            longitud: direccion.longitud,
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

   tieneCobertura = async (idCliente, fnRecuperarCobertura) => {
      console.log('consulta tiene cobertura:' + idCliente);
      let respuesta = await global.db
         .collection('clientes')
         .doc(idCliente)
         .collection('direcciones')
         .where('tieneCoberturaDireccion', '==', 'S')
         .get();

      if (respuesta && respuesta.docs && respuesta.docs.length > 0) {
         global.activarCobertura();
      } else {
         console.log('no tiene cobertura');
      }
      fnRecuperarCobertura(true);
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
}
