import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button, CheckBox } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export class ItemFactura extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seleccionado: false,
        };
    }
    render() {
        return (

            <View style={styles.fila}>
                <View style={styles.contenido}>
                    <View style={styles.subContenido}>

                        <View style={styles.contenido}>

                            <View style={styles.container}>
                                <Text style={styles.textoNegrita}>
                                    {this.props.factura.alias}
                                </Text>
                            </View>
                            <View style={styles.container}>
                                <Text style={styles.textoNegrita}>
                                    {this.props.factura.tipoDocumento}
                                </Text>
                            </View>
                            <View style={styles.filaFlexEnd}>
                                <Text style={styles.textoNegrita}>Nombre/Razón Social:</Text>
                                <Text style={styles.texto}>
                                    {this.props.factura.nombreCompleto}
                                </Text>
                            </View>
                            <View style={styles.filaFlexEnd}>
                                <Text style={styles.textoNegrita}>Correo:</Text>
                                <Text style={styles.texto}>
                                    {this.props.factura.correo}
                                </Text>
                            </View>
                            <View style={styles.filaFlexEnd}>
                                <Text style={styles.textoNegrita}>Num Documento:</Text>
                                <Text style={styles.texto}>
                                    {this.props.factura.numDocumento}
                                </Text>
                            </View>
                            <View style={styles.filaFlexEnd}>
                                <Text style={styles.textoNegrita}>Teléfono:</Text>
                                <Text style={styles.texto}>
                                    {this.props.factura.telefono}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.checked}>
                    <TouchableHighlight
                        underlayColor="white"
                        onPress={() => {
                            this.props.nav.navigate('EditarDatosFacturacionScreen', {
                                factura: this.props.factura,
                                refrescar: this.props.refrescar
                            });
                        }}>
                        <Icon
                            name="pencil"
                            size={40}
                            color="white"
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => {
                            this.props.fnEliminarFactura(
                                this.props.factura.id
                            );

                        }}>
                        <Icon
                            name="delete"
                            size={40}
                            color="white"
                        />
                    </TouchableHighlight>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'stretch',
        justifyContent: 'center',
        fontWeight: 'bold',
        //backgroundColor: 'red',
    },
    fila: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'orange',
        //borderBottomColor: 'gray',
        //borderBottomWidth: 1,
        marginTop: 10,
        marginLeft: 20,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
    },
    filaFlexEnd: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    contenido: {
        flex: 4,
        alignItems: 'stretch',
        //backgroundColor: 'pink',
    },
    checked: {
        flex: 1,
        //backgroundColor: 'yellow',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'center',
    },
    subContenido: {
        flex: 1,
        flexDirection: 'row',
        //backgroundColor: 'red',
    },
    imagenes: {
        flex: 1,
        //  backgroundColor: 'green',
        alignItems: 'center',
        padding: 20,
    },
    textoNegrita: {
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 0,
        marginLeft: 10,
    },
    texto: {
        fontSize: 15,
        marginTop: 0,
        marginLeft: 10,
    },
    textoNegritaSubrayado: {
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 0,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
});
