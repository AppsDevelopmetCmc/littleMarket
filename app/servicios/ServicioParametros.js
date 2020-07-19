import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';

export const obtenerImagenBienvenida = async callback => {
   let metadata = await global.db
      .collection('parametros')
      .doc('bienvenida')
      .get();
   callback(metadata.data().imagen);
};
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
         });
      }
      for (const item in horarios) {
         console.log('label', horarios[item].horario);
         console.log('value', horarios[item]);
         console.log('fecha', horarios[item].fecha);
         console.log('estado', horarios[item].estado);
         comboHorarios.push({
            label: horarios[item].horario,
            value: horarios[item],
            fecha: horarios[item].fecha,
            estado: horarios[item].estado,
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

   obtenerVersion = async fnObtenerDato => {
      let metadata = await global.db
         .collection('parametros')
         .doc('version')
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
            console.log(' actualizarSecuencial agregado');
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un error', error);
         });
   };

   obtenerNumeroWhatssap = async () => {
      global.db
         .collection('parametros')
         .doc('general')
         .get()
         .then(doc => {
            console.log('doc', doc.data());
            global.numWhatssap = doc.data().numero;
         });
   };
}
