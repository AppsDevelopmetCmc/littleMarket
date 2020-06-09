import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { call } from 'react-native-reanimated';

export class CargarImagen extends Component {
   constructor() {
      super();
      this.state = {
         imagen: '',
      };
   }
   componentDidMount() {
      if (this.props.route.params && this.props.route.params.imagen) {
         this.setState({ imagen: this.props.route.params.imagen });
      }
   }
   render() {
      return (
         <View>
            {this.state.imagen ? (
               <Avatar
                  source={{
                     uri: this.state.imagen,
                  }}
                  icon={{ name: 'home' }}
                  size="xlarge"
                  containerStyle={{ backgroundColor: 'gray' }}
               ></Avatar>
            ) : (
               <Avatar
                  title="NA"
                  icon={{ name: 'home' }}
                  size="xlarge"
                  containerStyle={{ backgroundColor: 'gray' }}
               ></Avatar>
            )}

            <Button
               title="Seleccione Imagen"
               onPress={() => {
                  this.abrirImagen();
               }}
            />
            <Button
               title="Cargar Imagen"
               onPress={() => {
                  this.cargarImagen();
               }}
            />
         </View>
      );
   }
   abrirImagen = async () => {
      let permissionResult;
      try {
         permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
      } catch (err) {
         Alert.alert('error');
      }
      if (permissionResult.granted === false) {
         Alert.alert('Información','Permission to access camera roll is required!');
         return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!pickerResult.cancelled) {
         console.log('URI:', pickerResult.uri);
         this.setState({ imagen: pickerResult.uri });
      }
   };

   cargarImagen = () => {
      console.log('entra a cargarImagen');
      this.uriToBlob(this.state.imagen, async blob => {
         console.log('entra a callback');
         const nombreArchivo = new Date().getTime();
         try {
            let snapshot = await global.storage
               .ref()
               .child('/imagenes/' + nombreArchivo)
               .put(blob);
            this.obtenerUrlDescarga(nombreArchivo);
         } catch (error) {
            console.log('error', error);
         }
      });
   };
   obtenerUrlDescarga = async nombreArchivo => {
      let urlDescarga = await global.storage
         .refFromURL(
            'gs://little-market-dev-377b6.appspot.com/imagenes/' + nombreArchivo
         )
         .getDownloadURL();
      // this.props.route.params.callback(urlDescarga);
      global.transferencia = urlDescarga;
   };

   uriToBlob = (dataUrl, callback) => {
      let req = new XMLHttpRequest();
      req.open('GET', dataUrl, true);
      req.responseType = 'blob';
      req.onload = () => {
         callback(req.response);
      };
      req.onerror = error => {
         console.log('error', error);
      };
      req.send(null);
   };
}
