import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import { Button } from 'react-native-elements';
import * as colores from '../../constants/Colores';


export class ResponsabilidadSocial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: null,
        };
    }
    componentDidMount() {

    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../../assets/NuevoSplash.png')}
                    style={styles.imgInicio}
                >
                    <View style={{ flex: 4 }}></View>
                    <View style={styles.containerRow}>
                        <Text>Responsabilidad Social</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.colorPrimarioVerde,
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        // backgroundColor: 'blue',
        alignItems: 'center',
    },
    imgInicio: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        paddingBottom: 100,
        backgroundColor: colores.colorPrimarioVerde,
    },
    contenedorLogo: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    estiloBoton: {
        backgroundColor: colores.colorPrimarioTomate,
        width: 130,
        height: 45,
        borderRadius: 10,
    },
    estiloTitulo: { color: colores.colorBlancoTexto },
});
