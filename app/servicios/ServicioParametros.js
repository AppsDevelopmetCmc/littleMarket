import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';

export class ServicioParametros {
   registrarEscuchaParametrosTodas = (arreglo, fnObtener) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db.collection('parametros').onSnapshot(function(snapShot) {
         snapShot.docChanges().forEach(function(change) {
            let parametros = change.doc.data();
            parametros.id = change.doc.id;
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

   getRegistrarParametrosTodas = async () => {
      let coleccion = await global.db.collection('parametros').get();
      let documentos = coleccion.docs;
      let listaParametros = [];
      for (let i = 0; i < documentos.length; i++) {
         listaParametros.push(documentos[i].data());
      }

      global.parametros = listaParametros;
   };

   getObtenerParametroId = async (IdParametro,fnObtenrDato) => {
      let metadata = await global.db.collection('parametros').doc(IdParametro).get();
      fnObtenrDato(metadata.data());
   };
}
