export class ArregloUtil {
   constructor(arreglo) {
      this.arreglo = arreglo;
   }
   agregar = (objeto, fnRepintar) => {
      this.arreglo.push(objeto);
      fnRepintar(this.arreglo);
   };
   buscar = objeto => {
      let indice = -1;
      for (let i = 0; i < this.arreglo.length; i++) {
         if (objeto.id == this.arreglo[i].id) {
            indice = i;
            break;
         }
      }
      return indice;
   };
   actualizar = (objeto, fnRepintar) => {
      let posicion = this.buscar(objeto, this.arreglo);
      if (posicion != -1) {
         this.arreglo[posicion] = objeto;
      }
      fnRepintar(this.arreglo);
   };
   eliminar = (objeto, fnRepintar) => {
      let posicion = this.buscar(objeto, this.arreglo);
      if (posicion != -1) {
         this.arreglo.splice(posicion, 1);
      }
      fnRepintar(this.arreglo);
   };
}

export const buscar = objeto => {
   let indice = -1;
   for (let i = 0; i < global.items.length; i++) {
      if (objeto.id == global.items[i].id) {
         indice = i;
         break;
      }
   }
   return indice;
};
export const actualizar = (objeto, fnRepintar) => {
   let posicion = buscar(objeto);
   if (posicion != -1) {
      global.items[posicion] = objeto;
   }
   console.log('luego de actualizar smo:', global.items);
   fnRepintar();
};

export const eliminar = (objeto, fnRepintar) => {
   let posicion = buscar(objeto);
   if (posicion != -1) {
      global.items.splice(posicion, 1);
   }
   fnRepintar();
};
