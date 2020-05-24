export const formatearFechaCompleta = fecha => {
   let objetoFecha = new Date(fecha); //ISO yyyy-mm-dd
   console.log('objetoFechaISO antes', objetoFecha);
   let anio = objetoFecha.getFullYear();
   let mes = objetoFecha.getMonth();
   let diaSemana = objetoFecha.getDay();
   let diaMes = objetoFecha.getDate();
   let fechaFormateada =
      obtenerDia(diaSemana) +
      ' ' +
      diaMes +
      ' de ' +
      obtenerMes(mes) +
      ' de ' +
      anio;
   console.log('Fecha formateada', fechaFormateada);
   return fechaFormateada;
};
export const formatearFechaISO = date => {
   let dd = date.getDate();
   let mm = date.getMonth() + 1;
   let yy = date.getFullYear();
   if (dd < 10) {
      dd = '0' + dd;
   }
   if (mm < 10) {
      mm = '0' + mm;
   }

   return yy + '-' + mm + '-' + dd;
};
export const obtenerHoraActual = fecha => {
   let horas = fecha.getHours();
   let minutos = fecha.getMinutes();
   let condicion = 'am';
   
   if (horas < 10) {
      horas = '0' + horas;
   } else {
      if(horas > 12){
        horas = horas === 12 ? horas : horas-12;
        condicion ='pm';
      }
   }
   if (minutos < 10) {
      minutos = '0' + minutos;
   }

   return '' + horas +':'+ minutos +' '+ condicion;
};
const obtenerMes = mes => {
   let meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
   ];
   return meses[mes];
};
const obtenerDia = diaSemana => {
   let dias = [
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
      'Domingo',
   ];
   return dias[diaSemana];
};
