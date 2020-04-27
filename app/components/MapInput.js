import React, { Component } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
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
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

export default class MapInput extends Component {
   render() {
       let mostrar = true;
      return (
<GooglePlacesAutocomplete
            placeholder="Buscar"
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            listViewDisplayed={mostrar}
            fetchDetails={true}
            
      renderDescription={row => row.description}
            onPress={(data, details = null) =>{
                mostrar=false;
                this.props.notificarCambio(details.geometry.location);
            }}
            query={{
               key: 'AIzaSyATppG_lbMSBkBrTI1_T5plpQXhDNuz5mc',
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
