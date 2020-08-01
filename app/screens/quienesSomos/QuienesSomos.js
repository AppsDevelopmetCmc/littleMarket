import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text,ScrollView } from 'react-native';
import { Button, Icon  } from 'react-native-elements';
import * as colores from '../../constants/Colores';
import CabeceraPersonalizada from '../../components/CabeceraPersonalizada';
import { SafeAreaView } from 'react-native-safe-area-context';

export class QuienesSomos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: null,
        };
    }
    componentDidMount() { }
    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <CabeceraPersonalizada
                    iconoComponente={
                        <Icon
                            name="arrow-left"
                            type="material-community"
                            color={colores.colorBlanco}
                            size={24}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    }
                ></CabeceraPersonalizada>
                <View style={styles.cabecera}>
                    <View>
                        <Text
                            style={textEstilo(colores.colorBlancoTexto, 22, 'bold')}
                        >
                            Quienes Somos
                  </Text>

                    </View>
                </View>
                <View style={styles.pie}>
                <ScrollView>
               <View >
                  
                    <Text style={styles.texto}>
                        Queremos compartir nuestra historia en un par de líneas.
                        
                    </Text>
                    <Text style={styles.texto}>
                    Antes que nada y de forma general,
                    </Text>
                    <Text style={styles.textoc}>
                    Somos una aplicación móvil que facilita tu compra de frutas, verduras y otros productos exclusivos y los lleva con responsabilidad a la puerta de tu hogar.      
                    </Text>
                    <Text style={styles.texto}>
                    En la pandemia COVID-19, un grupo de desarrolladores encerrados y frente a sus computadores, se preguntaron, ¿y si mejoramos la experiencia del cliente al comprar sus frutas y verduras con servicio a domicilio?, empezó el brainstorming, y salieron más interrogantes, objetivos y proyecciones. Sabíamos que todo nuestro equipo técnico podía desarrollar esta solución desde el computador, pero necesitábamos la estrategia en marketing, ventas y la experiencia logística en el negocio de frutas y verduras, así que sumamos a todo el equipo YAPPANDO a estos expertos.   
                    </Text>
                    <Text style={styles.texto}>
                    Así entonces dijimos; si nosotros desarrollamos una solución que brinde, buen servicio, calidad, seguridad sanitaria, precio justo, tranquilidad, y, ADEMÁS, apoye a la economía generando empleo a entregadores, proveedores de alimentos, personal administrativo, ¿será atractivo para el cliente?
                    </Text>
                    <Text style={styles.texto}>
                     Entre todas estas ideas, cuando pensábamos en el nombre y la propuesta para el cliente, quisimos que sientas y trasladamos la experiencia de ir al mercado o frutería donde siempre a más de tu compra te obsequian una YAPA. Es ahí donde estos dos términos se unen y sale a la luz YAPPANDO, tu yapa a través de una app. 
                    </Text>
                    <Text style={styles.texto}>
                     Alguien recordó que hay una fundación que pese a tener el apoyo de algunas instituciones y personas, en esta pandemia les hace falta alimentos. Entonces se nos ocurrió poner a disposición de nuestros clientes el donar su Yapa a estos niños por medio de la aplicación. 
                    </Text>
                    <Text style={styles.texto}>
                     Gracias por permitirnos crecer junto a ti y generar más fuentes de sustento para varias familias. 
                    </Text>
           </View>
           </ScrollView>

                </View>

            </SafeAreaView>
        );
    }
}
const textEstilo = (color, tamaño, tipo) => {
    return {
        color: color,
        fontSize: tamaño,
        fontWeight: tipo,
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.colorPrimarioVerde,
    },
    cabecera: {
        backgroundColor: colores.colorPrimarioVerde,
        paddingHorizontal: 30,
        paddingVertical: 20,
        // paddingTop: 30,
    },
  texto:{
  paddingBottom:5,
  paddingTop:5,
  fontSize:16,
  textAlign: "justify",

  },
  textoc:{
    paddingBottom:5,
    paddingTop:5,
    fontSize:16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: "justify",
    },
   
    
   
    pie: {
        flex: 4,
        backgroundColor: colores.colorBlanco,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        paddingHorizontal: 40,
        marginTop: 30,
     },
    estiloTitulo: { color: colores.colorBlancoTexto },
});
