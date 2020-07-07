import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';
import { ServicioNotificaciones } from '../servicios/ServicioNotificaciones';

export class ServicioCodigos {
   validarCodigo = async (idCodigo, idMail, fnFinalizar) => {
      let fechaActual = new Date();

      let respuesta = await global.db.collection('codigos').doc(idCodigo).get();

      if (respuesta && respuesta.data()) {
         console.log('Código Correcto');
         let fechaDoc = respuesta.data().fecha_caduca.toDate();
         if (fechaActual.getTime() <= fechaDoc.getTime()) {
            let respuestaUsados = await global.db
               .collection('codigos')
               .doc(idCodigo)
               .collection('usados')
               .doc(idMail)
               .get();
            if (respuestaUsados && respuestaUsados.data()) {
               Alert.alert(
                  'Información',
                  'No puede usar el código más de una vez'
               );
               fnFinalizar();
            } else {
               console.log('El código es valido ');
               //Para crear Monedero en el Beneficiario si existe

               if (respuesta.data().beneficiario) {
                  //busco si existe o no el documento
                  let docMonederoBeneficiario = await this.buscarValorMonedero(
                     respuesta.data().beneficiario
                  );
                  if (docMonederoBeneficiario) {
                     //si existe encuentro el valor actual y le sumo el valor del nuevo codigo
                     let valorTotalBeneficiario =
                        parseFloat(docMonederoBeneficiario.valor) +
                        parseFloat(respuesta.data().valor);
                     //Actualizo el valor del monero
                     this.actualizarValorMonedero(
                        respuesta.data().beneficiario,
                        parseFloat(valorTotalBeneficiario),
                        fnFinalizar,
                        respuesta.data().valor
                     );
                  } else {
                     //Si no existe creo primero el monedero para el beneficiario
                     this.crearMonedero(respuesta.data().beneficiario, {
                        valor: parseFloat(respuesta.data().valor),
                     });
                  }

                  //creo la transaccion en el monedero
                  this.crearMonederoTransaccion(respuesta.data().beneficiario, {
                     codigo: idCodigo,
                     fecha: new Date(),
                     valor: parseFloat(respuesta.data().valor),
                     tercero: idMail,
                     tipo: 'I',
                  });
                  //creo Notificacion para el beneficiario
                  let srvNotificaion = new ServicioNotificaciones();
                  let numeroActual = await srvNotificaion.buscarNumeroNotificacion(
                     respuesta.data().beneficiario
                  );
                  let numerototalBeneficiario = parseInt(numeroActual + 1);
                  srvNotificaion.crearNotificaciones(
                     respuesta.data().beneficiario,
                     {
                        numero: numerototalBeneficiario,
                     },
                     {
                        mensaje:
                           'Ha Ganado $ ' +
                           parseFloat(respuesta.data().valor) +
                           ' por ingresar el código ' +
                           idCodigo,
                        fecha: new Date(),
                     }
                  );
               }
               //Para crear Monedero al usuario actual
               let docUsuario = await this.buscarValorMonedero(global.usuario);
               //Encuentro si existe o no el docuemnto
               if (docUsuario) {
                  //Si existe sumo el valor del docuemnto + el valor del nuevo codigo
                  let valorUsuarioTotal =
                     parseFloat(docUsuario.valor) +
                     parseFloat(respuesta.data().valor);
                  //actualizo el valor del documento
                  this.actualizarValorMonedero(
                     global.usuario,
                     parseFloat(valorUsuarioTotal),
                     fnFinalizar,
                     respuesta.data().valor
                  );
               } else {
                  //si no existe creo primero el Documento
                  this.crearMonedero(
                     global.usuario,
                     {
                        valor: parseFloat(respuesta.data().valor),
                     },
                     fnFinalizar
                  );
               }
               //creo la transaccion de para el usuario loguedao
               this.crearMonederoTransaccion(global.usuario, {
                  codigo: idCodigo,
                  fecha: new Date(),
                  valor: parseFloat(respuesta.data().valor),
                  tipo: 'I',
               });
               //Ingreso un registro en los codigos ya usados
               this.crearCodigoUsado(idCodigo, global.usuario, {
                  mail: global.usuario,
               });

               //creo Notificacion para el usuario  logueado
               let srvNotificaion = new ServicioNotificaciones();
               let numeroActualLogueado = await srvNotificaion.buscarNumeroNotificacion(
                  global.usuario
               );
               let numeroTotalLogueado = parseInt(numeroActualLogueado + 1);
               srvNotificaion.crearNotificaciones(
                  global.usuario,
                  {
                     numero: numeroTotalLogueado,
                  },
                  {
                     mensaje:
                        'Ha Ganado $ ' +
                        parseFloat(respuesta.data().valor) +
                        ' por ingresar el código ' +
                        idCodigo,
                     fecha: new Date(),
                  }
               );
            }
         } else {
            Alert.alert('Información', 'Código no vigente');
            fnFinalizar();
         }
      } else {
         Alert.alert(
            'Información',
            'El Código ingresado no tiene ninguna promoción'
         );
         fnFinalizar();
      }
   };

   actualizarValorMonedero = (idMail, datoValor, finalizar, valorGanado) => {
      global.db
         .collection('monederos')
         .doc(idMail)
         .update({
            valor: datoValor,
         })
         .then(function () {
            finalizar(
               'Ha ganado USD ' +
                  parseFloat(valorGanado).toFixed(2) +
                  ' para usar en su compra'
            );
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
   };

   buscarValorMonedero = async idMail => {
      //let valorMonedero = 0;
      let monedero = await global.db.collection('monederos').doc(idMail).get();
      /* if (monedero && monedero.data()) {
          valorMonedero = monedero.data().valor;
       }*/
      return monedero.data();
   };

   crearMonederoTransaccion = (idMail, transaccion) => {
      global.db
         .collection('monederos')
         .doc(idMail)
         .collection('transacciones')
         .add(transaccion)
         .then(function () {
            //Alert.alert('transacción ');
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
   };

   crearMonedero = async (idMail, monedero, finalizar) => {
      await global.db
         .collection('monederos')
         .doc(idMail)
         .set(monedero)
         .then(function () {
            finalizar();
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', +error);
         });
   };

   crearCodigoUsado = (idCodigo, idMail, codigoUsado) => {
      global.db
         .collection('codigos')
         .doc(idCodigo)
         .collection('usados')
         .doc(idMail)
         .set(codigoUsado)
         .then(function () {
            console.log('Se creo el dato usado para', codigoUsado);
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
   };
}
