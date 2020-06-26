export const Err1 = 'Correo inválido';
export const Err2 = 'Correo o contraseña incorrecta';
export const Err3 = 'Todos los campos son obligatorios';
export const Err4 = 'Las contraseñas no son iguales';
export const Err5 = 'Error al crear la cuenta, intentelo más tarde';
export const Err6 =
   'Dimensión de contraseña inválida. Ingrese mínimo 6 caracteres';

export const erroresFirebase = new Map();
erroresFirebase.set(
   'auth/email-already-in-use',
   'El correo ingresado ya está siendo utilizado por otro usuario'
);

export const obtenerMensaje = codigoError => {
   let mensaje = erroresFirebase.get(codigoError);
   if (!mensaje) {
      return 'Error en el proceso de registro';
   }
   return mensaje;
};
