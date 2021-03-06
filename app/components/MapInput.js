import React, { Component } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {apiKeyMaps} from '../utils/ApiKey';
import { Text, Image, Alert } from 'react-native';

const palette = {
    primary: {
        main: '#FF5A5F',
        contrastText: '#ffffff'
    },
    secondary: {
        main: '#006c70',
        contrastText: '#ffffff'
       
    },

    dark:{
        main:'#000000',
        contrastText: '#ffffff',
        lightDark: "#353535",
        metalblue:"#3E4A63"
    },
    grayScale:{
        gray100:"#FAFAFA",
        gray200:"#F5F5F5",
        gray300:"#ECECEC",
       
    }
}

export default class MapInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrarLista: true
        };
     }
   render() {
       const direccion = this.props.direccion;
       this.locationRef && this.locationRef.setAddressText(direccion);
      return (
<GooglePlacesAutocomplete
            ref = {(ref) => {this.locationRef = ref}}
            placeholder="Buscar"
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            listViewDisplayed={this.state.mostrarLista}
            fetchDetails={true}
            renderDescription={row => {row.description}}
            getDefaultValue={() => {
                this.setState({mostrarLista: false}); 
                return direccion;
            }} 
            onPress={(data, details = null) =>{
                this.setState({mostrarLista: false})
                let localizacion = { coord: details.geometry.location, descripcion: details.formatted_address}
                this.props.notificarCambio(localizacion);
            }}
            query={{
               key: {apiKeyMaps},
               language: 'es-419'
            }}
            GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: ['formatted_address','geometry'],
              }}
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                types: 'locality',
              }}
              filterReverseGeocodingByTypes={[
                'street_address',
                'locality',
                'administrative_area_level_3',
              ]}
            nearbyplacesAPI='GoogleReverseGeocoding'
            debounce = {200}
            styles={{
                container: {
                    position: 'absolute',
                    top: Platform.select({ ios: 20, android: 10 }),
                    width: '100%'
                },
                textInputContainer: {
                    marginHorizontal: 10,
                    flex: 1,
                    backgroundColor: 'transparent',
                    height: 44,
                    borderTopWidth: 0,
                    borderBottomWidth: 0
                },
                textInput: {
                    height: 44,
                    margin: 0,
                    padding: 0,
                    borderRadius: 9,
                    elevation: 5, // Shadow android
                    shadowColor: palette.dark.main, // Shadow ios
                    shadowOpacity: 0.1, // Shadow ios
                    shadowOffset: { x: 0, y: 0 }, // Shadow ios
                    shadowRadius: 15,  // Shadow ios
                    borderWidth: 1,
                    borderColor: palette.grayScale.gray100,
                    fontSize: 14
                },
                listView: {
                    marginHorizontal: 20,
                    borderWidth: 1,
                    borderColor: palette.grayScale.gray100,
                    backgroundColor: palette.primary.contrastText,
                    elevation: 5,
                    shadowColor: palette.dark.main, // Shadow ios
                    shadowOpacity: 0.1, // Shadow ios
                    shadowOffset: { x: 0, y: 0 }, // Shadow ios
                    shadowRadius: 15,  // Shadow ios
                    marginTop: 10
                },
                description: {
                    fontSize: 14
                },
                row: {
                    padding: 10,
                    height: 48
                }
            }}
            
         />
      );
   }
}
