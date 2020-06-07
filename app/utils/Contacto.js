import { Linking, Alert, Platform } from 'react-native';

export const callNumber = phone => {
   let phoneNumber = phone;
   if (Platform.OS !== 'android') {
       console.log(Platform.OS);
      phoneNumber = `telprompt:${phone}`;
   } else {
      phoneNumber = `tel:${phone}`;
   }

            return Linking.openURL(phoneNumber);

};
