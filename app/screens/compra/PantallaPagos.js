import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Button, FlatList, Picker } from 'react-native';
import { WebView } from 'react-native-webview'

export class PantallaPagos extends Component {
   constructor(props) {
      super(props);
      this.url = this.props.route.params.url;

   }

   render() {
      return (
         <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: this.url}}
        />
        </View>
      );
      
    }

} 

const styles = StyleSheet.create({
   container: {
      flex: 1,
      //backgroundColor: '#fff',
      backgroundColor: 'skyblue',
      alignItems: 'stretch',
      justifyContent: 'center',
   },
   headline: {
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 0,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
   },
   icon: {
      marginRight: 10,
   },
});
