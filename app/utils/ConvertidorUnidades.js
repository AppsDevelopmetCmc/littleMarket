export const convertir = (unidad, cantidad) => {
   if (!global.unidadesSingular) {
      global.unidadesSingular = new Map();
      global.unidadesSingular.set('u', 'unidad');
      global.unidadesSingular.set('lb', 'libra');
      global.unidadesSingular.set('kg', 'kilo');
      global.unidadesSingular.set('ma', 'mano');
      global.unidadesSingular.set('cu', 'cubeta');
      global.unidadesSingular.set('at', 'atado');
      global.unidadesSingular.set('ar', 'arroba');
   }
   if (!global.unidadesPlural) {
      global.unidadesPlural = new Map();
      global.unidadesPlural.set('u', 'unidades');
      global.unidadesPlural.set('lb', 'libras');
      global.unidadesPlural.set('kg', 'kilos');
      global.unidadesPlural.set('ma', 'manos');
      global.unidadesPlural.set('cu', 'cubetas');
      global.unidadesPlural.set('at', 'atados');
      global.unidadesPlural.set('ar', 'arrobas');
   }
   if (cantidad == 1) {
      return cantidad + ' ' + global.unidadesSingular.get(unidad);
   } else {
      return cantidad + ' ' + global.unidadesPlural.get(unidad);
   }
};
