import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';
import { ServicioNotificaciones } from '../servicios/ServicioNotificaciones';

export class ServicioCodigos {
   validarPromo = async (codigo, mail, fnFinalizar) => {
      let fechaActual = new Date();
      let respuesta = await global.db.collection('codigos').doc(codigo).get();
      if (respuesta && respuesta.data()) {
         console.log('--CODIGOS-- Código Correcto');
         let { fecha_caduca, tipo, valor, usado, referido } = respuesta.data();
         let fechaCaducidad = fecha_caduca.toDate();
         if (fechaActual.getTime() > fechaCaducidad.getTime()) {
            this.comunicarCodigoIncorrecto(
               'El Código ha expirado',
               fnFinalizar
            );
         } else {
            //CODIGO UNICO SE USA UNA SOLA VEZ
            if (tipo == 'U') {
               console.log('--CODIGOS-- codigoUnico');
               if (usado) {
                  this.comunicarCodigoIncorrecto(
                     'El Código se puede utilizar una sola vez',
                     fnFinalizar
                  );
               } else {
                  console.log('--CODIGOS-- codigoUnico sin usar');
                  this.asignarDescuento(mail, valor, codigo, fnFinalizar);
                  this.actualizarCodigoUsado(codigo);
               }
            } //CODIGO NORMAL SE PUEDE USAR MUCHAS VECES
            else if (tipo == 'N') {
               console.log('--CODIGOS-- codigoNormal');
               let respuestaUsados = await global.db
                  .collection('codigos')
                  .doc(codigo)
                  .collection('usados')
                  .doc(mail)
                  .get();
               if (respuestaUsados && respuestaUsados.data()) {
                  this.comunicarCodigoIncorrecto(
                     'No puede usar el código más de una vez',
                     fnFinalizar
                  );
               } else {
                  this.asignarDescuento(mail, valor, codigo, fnFinalizar);
                  //Ingreso un registro en los codigos ya usados
                  this.crearCodigoUsado(codigo, mail, {
                     mail: mail,
                  });
               }
            } //CODIGO REFERIDO
            else if (tipo == 'R') {
               console.log('--CODIGOS-- codigoReferido');
               //validar si el usuario usó un código de referido
               let referidoUsado = await global.db
                  .collection('codigosReferidos')
                  .doc(mail)
                  .get();
               console.log('--CODIGOS-- referidoUsado', referidoUsado);
               console.log('--CODIGOS-- referidoUsado', referidoUsado.data());

               if (referidoUsado && referidoUsado.data()) {
                  this.comunicarCodigoIncorrecto(
                     'Solo puede ingresar un código de referido',
                     fnFinalizar
                  );
               } else {
                  this.asignarDescuento(mail, valor, codigo, fnFinalizar);
                  //Guardar información de código de referido para premiar al que refirio
                  this.guardarCodigoReferido(codigo, mail, valor, referido);
               }
            } else {
               console.log('--CODIGOS-- Tipo no existe');
               this.comunicarCodigoIncorrecto(
                  'Error al validar el código promocional',
                  fnFinalizar
               );
            }
         }
      } else {
         this.comunicarCodigoIncorrecto(
            'El código ingresado no tiene promoción',
            fnFinalizar
         );
      }
   };

   aplicarDescuentoReferido = async mail => {
      console.log('--Aplicar DescuentoReferido ', mail);
      let respuestaReferido = await global.db
         .collection('codigosReferidos')
         .doc(mail)
         .get();
      if (
         respuestaReferido &&
         respuestaReferido.data() &&
         !respuestaReferido.data().usado
      ) {
         console.log('Encuentra codigoReferidos');
         let { codigo, refiere, valor } = respuestaReferido.data();
         this.asignarDescuento(refiere, valor, codigo, null, mail);
         global.db
            .collection('codigosReferidos')
            .doc(mail)
            .update({ usado: true });
      } else {
         console.log('no encuentra codigoReferidos');
      }
   };
   actualizarCodigoUsado = codigo => {
      global.db.collection('codigos').doc(codigo).update({ usado: true });
   };
   asignarDescuento = async (
      mail,
      valorPremio,
      codigo,
      finalizar,
      ingresaReferido
   ) => {
      console.log('--CODIGOS-- asigna Descuento');
      //Consultar el valor actual del monedero
      let monedero = await this.buscarValorMonedero(mail);
      //Encuentro si existe o no el monedero
      if (monedero) {
         console.log('---CODIGOS-- modifica Monedero');
         //Si existe sumo el valor del monedero + el valor del nuevo codigo
         let valorUsuarioTotal =
            parseFloat(monedero.valor) + parseFloat(valorPremio);
         //actualizo el valor del monedero
         this.actualizarValorMonedero(mail, parseFloat(valorUsuarioTotal));
      } else {
         console.log('---CODIGOS-- crea monedero');
         //si no existe creo primero el Documento
         this.crearMonedero(mail, {
            valor: parseFloat(valorPremio),
            valorDescuento: 0,
         });
      }
      if (finalizar != null) {
         console.log('---CODIGOS-- mensaje finalizar');
         finalizar(
            'Ha Ganado $ ' +
               parseFloat(valorPremio) +
               ' para usar en su próxima compra'
         );
      } else {
         console.log('---CODIGOS-- no tiene finalizar');
      }
      if (ingresaReferido) {
         this.enviarNotificacionReferido(
            mail,
            valorPremio,
            codigo,
            ingresaReferido
         );
      } else {
         this.enviarNotificacion(mail, valorPremio, codigo);
      }
   };
   enviarNotificacion = async (mail, valorPremio, codigo) => {
      console.log('---CODIGOS-- enviaNotificacion');
      //creo Notificacion para el usuario  logueado
      let srvNotificaion = new ServicioNotificaciones();
      let numeroActualLogueado = await srvNotificaion.buscarNumeroNotificacion(
         mail
      );
      let numeroTotalLogueado = parseInt(numeroActualLogueado + 1);
      srvNotificaion.crearNotificaciones(
         mail,
         {
            numero: numeroTotalLogueado,
         },
         {
            mensaje:
               'Ha Ganado $ ' +
               parseFloat(valorPremio) +
               ' por ingresar el código ' +
               codigo,
            fecha: new Date(),
            estado: 'V',
            tipo: 'N',
            favorita: 'N',
         }
      );
   };

   enviarNotificacionReferido = async (
      mail,
      valorPremio,
      codigo,
      ingresaReferido
   ) => {
      console.log('---CODIGOS-- enviaNotificacion REFERIDO ', ingresaReferido);
      //creo Notificacion para el usuario  logueado
      let srvNotificaion = new ServicioNotificaciones();
      let numeroActualLogueado = await srvNotificaion.buscarNumeroNotificacion(
         mail
      );
      let numeroTotalLogueado = parseInt(numeroActualLogueado + 1);
      srvNotificaion.crearNotificaciones(
         mail,
         {
            numero: numeroTotalLogueado,
         },
         {
            mensaje:
               'Ha Ganado $ ' +
               parseFloat(valorPremio) +
               ' gracias al usuario ' +
               ingresaReferido +
               ' que ha comprado usando su Código ' +
               codigo,
            fecha: new Date(),
            estado: 'V',
            tipo: 'N',
            favorita: 'N',
         }
      );
   };
   comunicarCodigoIncorrecto = (mensaje, fnFinalizar) => {
      Alert.alert('Información', mensaje);
      fnFinalizar();
   };
   guardarCodigoReferido = (idCodigo, mail, valor, referido, fnFinalizar) => {
      global.db.collection('codigosReferidos').doc(mail).set({
         codigo: idCodigo,
         valor: valor,
         refiere: referido,
         usado: false,
      });
   };
   // Validacion de codigo promocional
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
                        valorDescuento: 0,
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
                        estado: 'V',
                        tipo: 'N',
                        favorita: 'N',
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
                     parseFloat(valorUsuarioTotal)
                  );
               } else {
                  //si no existe creo primero el Documento
                  this.crearMonedero(global.usuario, {
                     valor: parseFloat(respuesta.data().valor),
                     valorDescuento: 0,
                  });
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
                     estado: 'V',
                     tipo: 'N',
                     favorita: 'N',
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

   actualizarValorMonedero = (idMail, datoValor) => {
      global.db.collection('monederos').doc(idMail).update({
         valor: datoValor,
      });
   };

   buscarValorMonedero = async idMail => {
      let monedero = await global.db.collection('monederos').doc(idMail).get();
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

   crearMonedero = (idMail, monedero) => {
      global.db.collection('monederos').doc(idMail).set(monedero);
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
