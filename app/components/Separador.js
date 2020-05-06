import React from 'react';
import { View } from 'react-native';

// Importacion de colores
import * as colores from '../constants/Colores';

export default function Separador(props) {
   const { alto } = props;

   return <View style={{ height: alto, width: alto }}></View>;
}
