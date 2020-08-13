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
    var solicitud = indexedDB.open('mibase');
    solicitud.addEventListener('error', errores, false);
    solicitud.addEventListener('success', crear, false);
}

function errores(e){
    alert('Error: '+e.code+' '+e.message);
}

function crear(e){
    bd = e.result || e.target.result;
    if(bd.version == '') {
        var solicitud = bd.setVersion('1.0');
        solicitud.addEventListener('error', errores, false);
        solicitud.addEventListener('success', crearbd, false);
    } else { mostrar();
        };
}

function crearbd() {
    var almacen = bd.createObjectStore('peliculas', {keyPath: 'id'});
    almacen.createIndex('BuscarFecha', 'fecha', {unique: false});
}

function agregarobjeto(){
    var clave = document.getElementById('clave').value;
    var titulo = document.getElementById('texto').value;
    var fecha = document.getElementById('fecha').value;
    var transaccion = bd.transaction(['peliculas'], IDBTransaction.READ_WRITE);
    var almacen = transaccion.objectStore('peliculas');
    var solicitud = almacen.add({id: clave, nombre: titulo, fecha: fecha});
    solicitud.addEventListener('success', mostrar, false);
    document.getElementById('clave').value = '';
    document.getElementById('texto').value = '';
    document.getElementById('fecha').value = '';
}

function mostrar() {
    cajadatos.innerHTML = '';
    var transaccion = bd.transaction(['peliculas']);
    var almacen = transaccion.objectStore('peliculas');
    var indice = almacen.index('BuscarFecha');
    var cursor = indice.openCursor(null, IDBCursor.PREV);
    cursor.addEventListener('success', mostrarlista, false);
}

function mostrarlista(e){
    var cursor = e.result || e.target.result;
    if(cursor) {
        cajadatos.innerHTML += '<div>' + cursor.value.id + ' - ' + cursor.value.nombre + ' - ' + cursor.value.fecha + '</div>';
        console.log("pasa por aqui");
        cursor.continue();
    };
}
window.addEventListener("load", iniciar, false);
