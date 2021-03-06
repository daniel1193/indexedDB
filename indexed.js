var db
function iniciar(){
    cajadatos=document.getElementById('cajadatos');
    var boton=document.getElementById('grabar');

    boton.addEventListener('click', agregarobjeto, false);
    if('webkitIndexedDB' in window){
        window.indexedDB=window.IndexedDB;
        window.IDBTransaction=window.IDBTransaction;
        window.IDBKeyRange=window.IDBKeyRange;
        window.IDBCursor=window.IDBCursor;
        } else if ('mozIndexedDB' in window) {
            window.indexedDB=window.mozIndexedDB;
            };
    if (indexedDB){
      var request = indexedDB.open('mibase', 1);
      request.onsuccess = () =>{
        db = request.result
        console.log('OPEN', db);
        mostrar()
      }
      request.onupgradeneeded = () =>{
        db = request.result
        console.log('CREATE', db);
        const objectStore = db.createObjectStore('peliculas', {keyPath: 'id'})
        objectStore.createIndex('BuscarFecha', 'fecha', {unique: false});
      }
      request.onerror = (error) =>{
        console.log('ERROR', error);
      }
    }

}

function errores(e){
    alert('Error: '+e.code+' '+e.message);
}


function agregarobjeto(){
    var clave = document.getElementById('clave').value;
    var titulo = document.getElementById('texto').value;
    var fecha = document.getElementById('fecha').value;
    var transaccion = db.transaction(['peliculas'], 'readwrite');
    var almacen = transaccion.objectStore('peliculas');
    var solicitud = almacen.add({id: clave, nombre: titulo, fecha: fecha});
    solicitud.addEventListener('success', mostrar, false);
    document.getElementById('clave').value = '';
    document.getElementById('texto').value = '';
    document.getElementById('fecha').value = '';
}

function mostrar() {

    cajadatos.innerHTML = '';

    var transaccion = db.transaction(['peliculas'], 'readwrite');
    var almacen = transaccion.objectStore('peliculas');
    var indice = almacen.index('BuscarFecha');
    var cursor = indice.openCursor(null, IDBCursor.PREV);
    cursor.addEventListener('success', mostrarlista, false);
}

function mostrarlista(e){
    var cursor = e.result || e.target.result;
    if(cursor) {
        cajadatos.innerHTML += '<div>' + cursor.value.id + ' - ' + cursor.value.nombre + ' - ' + cursor.value.fecha + '</div>';
        cursor.continue();
    };
}
window.addEventListener("load", iniciar, false);
