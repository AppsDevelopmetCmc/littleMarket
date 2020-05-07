import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Avatar, Input, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as firebase from 'firebase';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';

// Importación de los colores
import * as colores from '../../constants/Colores';

export function MenuPersonalizado() {
   return (
      <SafeAreaView>
         <Text>Drawer</Text>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   cabeceraContenedor: {
      flexDirection: 'row',
      height: 50,
   },
});
