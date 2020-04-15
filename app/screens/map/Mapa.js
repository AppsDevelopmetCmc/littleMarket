import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Modal, Alert,} from 'react-native';
import { Button } from 'react-native-elements';

export default class Mapa extends Component {
   constructor (props){
      super(props);
      this.state = {
         modalVisible: true
      }
   }
  
	componentDidMount() {


   }

   render (){
      const { navigation } = this.props;
      return (
         <View style={[styles.container]}>
         <Modal
           animationType="slide"
           transparent={true}
           visible={this.state.modalVisible}
           onRequestClose={() => {
             Alert.alert('Modal has been closed.');
           }}
           style={{backgroundColor:'rgb(32,32,32,0.7)'}}
           >
           <View style={{ marginTop: 22 }}>
             <View>
               <Text>Hello World!</Text>
   
               <TouchableHighlight
                 onPress={() => {
                   this.setState({modalVisible: !this.state.modalVisible});
                 }}>
                 <Text>Hide Modal</Text>
               </TouchableHighlight>
             </View>
           </View>
         </Modal>
       
         </View>
   
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
});
