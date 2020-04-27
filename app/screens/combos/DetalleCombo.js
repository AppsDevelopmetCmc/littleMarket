import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export class DetalleCombo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         cantidad: '0',
      };
   }
   render() {
      let combo = this.props.route.params.combo;
      return (
         <View style={styles.container}>
            <View>
               <Text>prueba</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
               <Button
                  icon={
                     <Icon
                        name="arrow-right-bold-circle"
                        size={20}
                        color="white"
                     />
                  }
               />
               <TextInput
                  value={this.state.cantidad}
                  onChangeText={text => {
                     this.setState({ cantidad: text });
                  }}
                  style={{ textAlign: 'right' }}
               />

               <Button
                  icon={
                     <Icon
                        name="arrow-right-bold-circle"
                        size={20}
                        color="white"
                     />
                  }
               />
            </View>

            <Button title="Agregar" />
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 80,
   },
   cantidad: {
      flex: 1,
      backgroundColor: 'blue',
      flexDirection: 'row',
      justifyContent: 'center',
   },
   elemento: {
      flex: 1,
      alignItems: 'center',
   },
   caja: {
      flex: 5,
      width: 60,
      textAlign: 'right',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
   },
});
