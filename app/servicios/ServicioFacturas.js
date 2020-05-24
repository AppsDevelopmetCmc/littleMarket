import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';

export class ServicioFacturas {

    eliminarComboProducto = (idCombo, idProd) => {
        global.db
            .collection('combos')
            .doc(idCombo)
            .collection('productosCombo')
            .doc(idProd)
            .delete()
            .then(function () {
                console.log('Document successfully deleted!');
            })
            .catch(function (error) {
                console.error('Error removing document: ', error);
            });
    };

    eliminarFactura = (id) => {
        global.db
            .collection('clientes')
            .doc(global.appUsuario.id)
            .collection('factura')
            .doc(id)
            .delete()
            .then(function () {
                //Alert.alert('eliminando item');
            })
            .catch(function (error) {
                Alert.alert('Error ' + error.message);
            });
    };
    actualizarFactura = (objeto, id) => {
        global.db
            .collection('clientes')
            .doc(global.appUsuario.id)
            .collection('factura')
            .doc(id)
            .update({
                alias: objeto.alias,
                correo: objeto.correo,
                nombreCompleto: objeto.nombreCompleto,
                numDocumento: objeto.numDocumento,
                telefono: objeto.telefono,
                tipoDocumento: objeto.tipoDocumento
            })
            .then(function () {
                //  Alert.alert('Combo Actualizado');
            })
            .catch(function (error) {
                Alert.alert('error' + error);
            });
    };

    registrarEscuchaTodas = (arreglo, fnRepintar) => {
        let arregloUtil = new ArregloUtil(arreglo);
        global.db.collection('combos').onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
                if (change.type == 'added') {
                    arregloUtil.agregar(change.doc.data(), fnRepintar);
                }
                if (change.type == 'modified') {
                    arregloUtil.actualizar(change.doc.data(), fnRepintar);
                }
                if (change.type == 'removed') {
                    arregloUtil.eliminar(change.doc.data(), fnRepintar);
                }
            });
        });
    };

    /*recuperarFacturas = (arreglo, fnRepintar) => {
        let arregloUtil = new ArregloUtil(arreglo);
        global.db
            .collection('clientes')
            .doc(global.appUsuario.id)
            .collection('factura')
            .onSnapshot(function (snapShot) {
                snapShot.docChanges().forEach(function (change) {
                    let combos = change.doc.data();
                    combos.id = change.doc.id;
                    if (change.type == 'added') {
                        arregloUtil.agregar(combos, fnRepintar);
                    }
                    if (change.type == 'modified') {
                        arregloUtil.actualizar(combos, fnRepintar);
                    }
                    if (change.type == 'removed') {
                        arregloUtil.eliminar(combos, fnRepintar);
                    }
                });
            });
    };*/
    recuperarFacturas = async (fnRepintar) => {
        global.db
            .collection('clientes')
            .doc(global.appUsuario.id)
            .collection('factura')
            .get()
            .then(async function (coleccionfacturas) {
                let documentos = coleccionfacturas.docs;

                let facturas = [];
                for (let i = 0; i < documentos.length; i++) {
                    let obj = {
                        id: coleccionfacturas.docs[i].id,
                        alias: documentos[i].data().alias,
                        correo: documentos[i].data().correo,
                        nombreCompleto: documentos[i].data().nombreCompleto,
                        numDocumento: documentos[i].data().numDocumento,
                        telefono: documentos[i].data().telefono,
                        tipoDocumento: documentos[i].data().tipoDocumento
                    }

                    facturas.push(obj);
                }
                fnRepintar(facturas);
            })
            .catch(function (error) {
                Alert.alert('Error catch-->' + error);

            });
    };



}
