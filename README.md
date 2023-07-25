<h1>Clases con ECMAScript y ECMAScript avanzado</h1>

Se creará una instancia de la clase <strong>“ProductManager”</strong>
Se llamará <strong>“getProducts”</strong> recién creada la instancia, debe devolver un arreglo vacío [ ]

Se llamará al método “addProduct” con los campos:

- <strong><p>title: “producto prueba”,</p></strong>
- <strong><p>description:”Este es un producto prueba”,</p></strong>
- <strong><p>price:200,</p></strong>
- <strong><p>thumbnail:”Sin imagen”,</p></strong>
- <strong><p>code:”abc123”,</p></strong>
- <strong><p>stock:25,</p></strong>

El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE.

Se llamará el método <strong>“getProducts”</strong> nuevamente, esta vez debe aparecer el producto recién agregado.

Se llamará al método <strong>“addProduct”</strong> con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

Se evaluará que <strong>“getProductById”</strong> devuelva error si no encuentra el producto o el producto en caso de encontrarlo.

Se llamará al método <strong>“updateProduct”</strong> y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.

Se llamará al método <strong>“deleteProduct”</strong>, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
