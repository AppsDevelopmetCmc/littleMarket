export class ServicioReferidos {
    generarNumeroCodigo = async mail => {
        console.log('Ingresa a generar Codigo');
        let codigo = '';
        codigo = 'YPP' + mail;
        return codigo
        //fn(codigo);
    };
    crearCodigo = (idMail, codigo) => {

        global.db
            .collection('clientes')
            .doc(idMail)
            .update({
                codigo: codigo,

            })
            .then(function () {
                //Alert.alert('transacción ');
            })
            .catch(function (error) {
                Alert.alert('Se ha producido un Error', error);
            });
    };

}