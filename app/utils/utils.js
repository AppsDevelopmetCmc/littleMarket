
export class ArregloUtil {
   constructor(arreglo) {
      this.arreglo = arreglo;
   }
   agregar = (objeto, fnRepintar) => {
      this.arreglo.unshift(objeto);
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
export const validarTelefono = (number) => {
   let val = "N";
   if (+number === +number && number.length == 10) {// valida que sea numero
      val = "S";
   } else (
      val = "N"
   )
   return val;

};
export const validarCedula = (number, tipo) => {
   let val = "N";
   if (+number === +number) {// valida que sea numero
      if (tipo == "Ruc" && number.length == 13) {
         val = "S";
      } else if (tipo == "Cédula" && number.length == 10) {
         val = "S";
      } else {
         val = "N";
      }
   } else (
      val = "N"
   )
   return val;

};
