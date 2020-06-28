export const convertirFormaPago = (formaPago) => {
   if (!global.mapFormaPago) {
      global.mapFormaPago = new Map();
      global.mapFormaPago.set('EF', 'EFECTIVO');
      global.mapFormaPago.set('TR', 'TRANSFERENCIA');
      global.mapFormaPago.set('TA', 'TARJETA');
   }
   return global.mapFormaPago.get(formaPago);
};

export const convertirEstadoPago = (formaPago) => {
   if (!global.mapEstadoPago) {
      global.mapEstadoPago = new Map();
      global.mapEstadoPago.set('EF', 'PI');
      global.mapEstadoPago.set('TR', 'CT');
      global.mapEstadoPago.set('TA', 'CT');
   }
   return global.mapEstadoPago.get(formaPago);
};

export const convertirRadioPago = (formaPago) => {
   if (!global.mapRadioPago) {
      global.mapRadioPago = new Map();
      global.mapRadioPago.set('EF', 0);
      global.mapRadioPago.set('TR', 1);
      global.mapRadioPago.set('TA', 2);
   }
   return global.mapRadioPago.get(formaPago)
};
export const convertirFactuacion = (formaPago) => {
   if (!global.mapFormaFact) {
      global.mapFormaFact = new Map();
      global.mapFormaFact.set('CF', '0');
      global.mapFormaFact.set('FA', '1');

   }
   return global.mapFormaFact.get(formaPago);
};
