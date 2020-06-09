import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';
import { ServicioNotificaciones } from '../servicios/ServicioNotificaciones';

const URLYAPAS = 'https://us-central1-little-market-dev-377b6.cloudfunctions.net/consultarYapas?monto='
const URLYAPAS1='https://us-central1-little-market-dev-377b6.cloudfunctions.net/helloWorld?mail=';
export class ServicioYapas {

   conusultarYapas = async(monto) => {
      console.log("Ingresa a consultar el servicio conusultarYapas")
      let response = await fetch(
         URLYAPAS +
            '' +
            monto 
      );
       let trama = await response.json();
       console.log('trama 1',trama)
      return trama;

   }

   conusultarYapas1 = async(monto,fnConsultarYapa) => {
      console.log("Ingresa a consultar el servicio conusultarYapas")
      let response = await fetch(
         URLYAPAS +
            '' +
            monto 
      );
       let trama = await response.json();
       console.log('trama',trama)
       fnConsultarYapa(trama)

   }

}