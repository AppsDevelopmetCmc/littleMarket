import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';

export class ServicioParametros {
   registrarEscuchaParametrosTodas = (arreglo, fnObtener) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db.collection('parametros').onSnapshot(function (snapShot) {
         snapShot.docChanges().forEach(function (change) {
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

   obtenerParamsFechas = async fnCargarComboFechas => {
      let respuesta = await global.db
         .collection('parametros')
         .doc('fechas')
         .get();
      let comboFechas = [];
      let comboHorarios = [];
      let proximas = respuesta.data().proximas;
      let horarios = respuesta.data().horarios;
      console.log('tamanio:', proximas.length);
      for (let i = 0; i < proximas.length; i++) {
         comboFechas.push({
            label: formatearFechaCompleta(proximas[i]),
            value: proximas[i],
         });
      }
      for (let i = 0; i < horarios.length; i++) {
         comboHorarios.push({
            label: horarios[i],
            value: horarios[i],
         });
      }
      fnCargarComboFechas(comboFechas, comboHorarios);
      console.log('parametros', respuesta.data());
   };
}
