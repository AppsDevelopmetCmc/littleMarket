import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';

export class ServicioCobertura {

   registrarEscuchaCoberturaTodas = (arreglo, fnObtener) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db
         .collection('coberturas')
         .onSnapshot(function(snapShot) {
            snapShot.docChanges().forEach(function(change) {
               let coberturas=change.doc.data();
               coberturas.id=change.doc.id;
               if (change.type == 'added') {
                  arregloUtil.agregar(coberturas, fnObtener);
               }
               if (change.type == 'modified') {
                  arregloUtil.actualizar(coberturas, fnObtener);
               }
               if (change.type == 'removed') {
                  arregloUtil.eliminar(coberturas, fnObtener);
               }
            });
         });
   };

   getRegistrarParametrosTodas = async(fnObtener) => {

      global.db
         .collection('parametros')
         .get()
         .then(async function(coleccion) {
            let documentos = coleccion.docs;
            let coberturas = [];
            for (let i = 0; i < documentos.length; i++) {
               coberturas.push(documentos[i].data());
               fnObtener(coberturas);
            }
         })
         .catch(function(error) {
            console.log('Error getting document:', error);
         });
   };
   
}
