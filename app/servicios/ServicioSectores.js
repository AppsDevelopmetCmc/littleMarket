import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';
import { ServicioNotificaciones } from '../servicios/ServicioNotificaciones';

const URLSECTOR = 'https://us-central1-little-market-dev-377b6.cloudfunctions.net/sectorPoligono?latitud='
export class ServicioSectores {

    consultarSector = async (lat, long) => {
        console.log("Ingresa a consultar el servicio ASIGNAR SECTOR")
        let response = await fetch(
            URLSECTOR + '' + lat + '&longitud=' + long);
        let trama = await response.json();
        console.log('trama 1', trama)
        return trama;

    }

}