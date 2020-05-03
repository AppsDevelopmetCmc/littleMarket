export const consultarInformacion = async mail => {
   console.log('usuario.mail', mail);
   let usuario = await global.db
      .collection('infoApp')
      .doc('clientes')
      .collection('infoUsuario')
      .doc(mail)
      .get();

   if (usuario.exists) {
      console.log('usuario.doc', usuario);
      global.appUsuario = usuario.data();
      console.log('InfoUsuario', global.appUsuario);
   }
};
