
import firebase from 'firebase'
import '@firebase/firestore';
import { ArregloUtil } from '../utils/utils';
import {Alert} from 'react-native'
import "@firebase/storage";


export class ServicioPrecios{
    constructor(){
        if (global.firebaseRegistered != true) {
            global.firebaseConfig = {
                apiKey: "AIzaSyCuPTN-HQyPxrLUr40Bl2nmX5PqNCUVnJg",
                authDomain: "little-market-dev-377b6.firebaseapp.com",
                databaseURL: "https://little-market-dev-377b6.firebaseio.com",
                projectId: "little-market-dev-377b6",
                storageBucket: "little-market-dev-377b6.appspot.com",
                messagingSenderId: "549900659572",
                appId: "1:549900659572:web:ce8621915b320376469a21"
            };
            firebase.initializeApp(firebaseConfig);
            global.db = firebase.firestore();
            global.firebaseRegistered=true;
            global.storage = firebase.storage();

        }
    }

    crearProductoPrecio=(producto)=>{
        global.db.collection("productos").doc(producto.id).collection("precios").doc(producto.idPrecio).set(producto).then(function () {
            Alert.alert("Precio agregado")
        }).catch(function (error) {
            Alert.alert("error" + error)
        })
    }
   
    eliminar = (producto) => {
        global.db.collection("productos").doc(producto.id).collection("precios").doc(producto.idPrecio).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }
    actualizar=(producto)=>{
        global.db.collection("productos").doc(producto.id).collection("precios").doc(producto.idPrecio).update(
            {
                /*precio:producto.id
                unidad:
                cantidad:
                id: 1 lb*/
            }
        ).then(function () {
            Alert.alert("actualizado")
        }
        ).catch(function (error) {
            Alert.alert("error" + error)
        }
        );
    }
    registrarEscuchaTodas = (arreglo, fnRepintar, idProducto) => {
        let arregloUtil=new ArregloUtil(arreglo);
        global.db.collection("productos").doc(idProducto).collection("precios").onSnapshot(
            function (snapShot) {
                snapShot.docChanges().forEach(
                    function (change) {
                        if (change.type == 'added' ) {
                            arregloUtil.agregar(change.doc.data(),fnRepintar);
                        }
                        if (change.type == 'modified') {
                            arregloUtil.actualizar(change.doc.data(),fnRepintar);
                        }
                        if (change.type == 'removed') {
                            arregloUtil.eliminar(change.doc.data(),fnRepintar);
                        }
                    }
                )

            }
        );
    }

}