import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';

export class ServicioParametros {

   registrarEscuchaParametrosTodas = (arreglo, fnObtener) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db
         .collection('parametros')
         .onSnapshot(function(snapShot) {
            snapShot.docChanges().forEach(function(change) {
               let parametros=change.doc.data();
               parametros.id=change.doc.id;
               if (change.type == 'added') {
                  arregloUtil.agregar(parametros, fnObtener);
               }
               if (change.type == 'modified') {
                  arregloUtil.actualizar(parametros, fnObtener);
               }
               if (change.type == 'removed') {
                  arregloUtil.eliminar(parametros, fnObtener);
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
            let parametros = [];
            for (let i = 0; i < documentos.length; i++) {
               parametros.push(documentos[i].data());
               fnObtener(parametros);
            }
         })
         .catch(function(error) {
            console.log('Error getting document:', error);
         });
   };
   
}
