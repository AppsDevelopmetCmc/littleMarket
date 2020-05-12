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
