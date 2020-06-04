import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';

export class ServicioCodigos {

   validarCodigo = async (idCodigo, idMail) => {

      let fechaActual = new Date();

      let respuesta = await global.db
         .collection('codigos')
         .doc(idCodigo)
         .get();

      if (respuesta && respuesta.data()) {
         console.log("Código Correcto")
         let fechaDoc = respuesta.data().fecha_caduca.toDate();
         if (fechaActual.getTime() <= fechaDoc.getTime()) {
            let respuestaUsados = await global.db
               .collection('codigos')
               .doc(idCodigo)
               .collection('usados')
               .doc(idMail)
               .get();
            if (respuestaUsados && respuestaUsados.data()) {
               Alert.alert("No puede usar el código más de una vez")
            }
            else {

               console.log("El código es valido ")
               //Para crear Monedero en el Beneficiario si existe
               if (respuesta.data().beneficiario) {
                  //busco si existe o no el documento
                  let docMonederoBeneficiario = await this.buscarValorMonedero(respuesta.data().beneficiario)
                  if (docMonederoBeneficiario) {
                     //si existe encuentro el valor actual y le sumo el valor del nuevo codigo
                     let valorTotalBeneficiario = parseFloat(docMonederoBeneficiario.valor) + parseFloat(respuesta.data().valor);
                     //Actualizo el valor del monero
                     this.actualizarValorMonedero(respuesta.data().beneficiario, parseFloat(valorTotalBeneficiario))

                  }
                  else {
                     //Si no existe creo primero el monedero para el beneficiario
                     this.crearMonedero(respuesta.data().beneficiario, { valor: parseFloat(respuesta.data().valor) })
                  }
                  //creo la transaccion en el monedero
                  this.crearMonederoTransaccion(respuesta.data().beneficiario,
                     {
                        codigo: idCodigo,
                        fecha: new Date(),
                        valor: parseFloat(respuesta.data().valor),
                        tercero: idMail,
                        tipo: 'I',
                     })
               }
               //Para crear Monedero al usuario actual
               let docUsuario = await this.buscarValorMonedero(global.usuario)
               //Encuentro si existe o no el docuemnto
               if (docUsuario) {
                  //Si existe sumo el valor del docuemnto + el valor del nuevo codigo
                  let valorUsuarioTotal = parseFloat(docUsuario.valor) + parseFloat(respuesta.data().valor);
                  //actualizo el valor del documento
                  this.actualizarValorMonedero(global.usuario, parseFloat(valorUsuarioTotal))
               }
               else {
                  //si no existe creo primero el Documento
                  this.crearMonedero(global.usuario, { valor: parseFloat(respuesta.data().valor) })
               }
               //creo la transaccion de para el usuario loguedao
               this.crearMonederoTransaccion(global.usuario,
                  {
                     codigo: idCodigo,
                     fecha: new Date(),
                     valor: parseFloat(respuesta.data().valor),
                     tipo: 'I',
                  })
               //Ingreso un registro en los codigos ya usados   
               this.crearCodigoUsado(idCodigo, global.usuario, { mail: global.usuario })

            }

         }
         else {
            Alert.alert("Código no vigente")
         }
      } else {
         Alert.alert("Código incorrecto")
      }


   };

   actualizarValorMonedero = (idMail, datoValor) => {
      global.db
         .collection('monederos')
         .doc(idMail)
         .update({
            valor: datoValor,
         })
         .then(function () {
            Alert.alert('Monedero Actualizado');
         })
         .catch(function (error) {
            Alert.alert('error' + error);
         });


   };

   buscarValorMonedero = async (idMail) => {
      //let valorMonedero = 0;
      let monedero = await global.db
         .collection('monederos')
         .doc(idMail)
         .get();
      /* if (monedero && monedero.data()) {
          valorMonedero = monedero.data().valor;
       }*/
      return monedero.data();

   };

   crearMonederoTransaccion = (idMail, transaccion) => {
      global.db.collection("monederos")
         .doc(idMail).collection("transacciones")
         .add(transaccion).then(function () {
            Alert.alert("transacción agregado")
         }).catch(function (error) {
            Alert.alert("error" + error)
         })
   }

   crearMonedero = async (idMail, monedero) => {
      await global.db.collection("monederos")
         .doc(idMail).
         set(monedero)
         .then(function () {
            Alert.alert("Monedero Creado")
         }).catch(function (error) {
            Alert.alert("error" + error)
         })
   };

   crearCodigoUsado = (idCodigo, idMail, codigoUsado) => {
      global.db.collection("codigos")
         .doc(idCodigo).
         collection('usados').
         doc(idMail).
         set(codigoUsado)
         .then(function () {
            console.log('Se creo el dato usado para', codigoUsado)
         }).catch(function (error) {
            Alert.alert("error" + error)
         })
   };

}