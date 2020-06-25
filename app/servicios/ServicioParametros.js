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
      for (let i = 0; i < proximas.length; i++) {
         comboFechas.push({
            label: formatearFechaCompleta(proximas[i]),
            value: proximas[i],
            posicion: i,
         });
      }
      for (const item in horarios) {
         comboHorarios.push({
            label: horarios[item].horario,
            value: horarios[item],
            jornada: horarios[item].jornada,
         });
      }
      fnCargarComboFechas(comboFechas, comboHorarios);
   };

   getObtenerParametroId = async (IdParametro, fnObtenerDato) => {
      let metadata = await global.db
         .collection('parametros')
         .doc(IdParametro)
         .get();
      fnObtenerDato(metadata.data());
   };
   obtenerSecuencial = async () => {
      let metadata = await global.db
         .collection('parametros')
         .doc('secuencial')
         .get();
      return metadata.data().siguiente;
   };

   actualizarSecuencial = actual => {
      global.db
         .collection('parametros')
         .doc('secuencial')
         .set({ siguiente: actual + 1 })
         .then(function () {
            console.log('agregado');
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un error', error);
         });
   };
}