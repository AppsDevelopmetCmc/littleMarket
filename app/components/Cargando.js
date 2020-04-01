import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements';

export default function Cargando(props) {
   const { isVisible, text } = props;

   return (
      <Overlay
         isVisible={isVisible}
         windowBackgroundColor="rgba(0,0,0,.5)"
         overlayBackgroundColor="transparent"
         overlayStyle={styles.overlay}
      >
         <View style={styles.view}>
            <ActivityIndicator size="large" color="#00a680" />
            {text && <Text style={styles.text}>{text}</Text>}
         </View>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   overlay: {
      height: 100,
      width: 200,
      backgroundColor: '#fff',
      borderColor: '#00a680',
      borderWidth: 2,
      borderRadius: 10,
   },
   view: {
      flex: 1,
      alignItems: 'center',
      alignContent: 'center',
   },
   text: {
      color: '#00a680',
      textTransform: 'uppercase',
   },
});
