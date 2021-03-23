Buscaminas serverless inspirado en el clásico de Windows 95.

La app se compone de dos partes: el frontend (carpeta client) realiza el dibujado del tablero, permite guardar y luego retomar un juego almacenando el estado actual, y captura las acciones del usuario. Estas son enviadas a una función lambda implementada en AWS (carpeta server) la cual recibe el estado actual del tablero y la acción del usuario, ejecuta la lógica y retorna al frontend el nuevo estado del juego con los cambios apropiados.

El estilado fue utilizando de base el tema de Bootstrap [Windows 95 UI Kit](https://github.com/themesberg/windows-95-ui-kit). El componente de lambda fue realizado con el framework [Serverless](https://www.serverless.com) para más facilidad en su configuración e instalación. Se incluyen algunas pruebas para la lógica del backend implementadas con [Jest](https://jestjs.io).


## Cómo jugarlo

La interfaz de usuario puede correrse simplemente abriendo el archivo `index.html` con cualquier navegador. Por defecto utiliza un backend ya funcionando en AWS, dicho endpoint puede cambiarse manualmente editando la primera línea del archivo `index.js`.

Para correr una instancia propia de la función lambda, primero es necesario situarse en la carpeta `server` e instalar las dependencias:
```
cd server
npm install
```

Una vez que las dependencias están instaladas, se debe [configurar Serverless según nuestras credenciales de AWS](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) y luego iniciar sesión ejecutando `serverless login`.
Luego toca editar el archivo `serverless.yml` reemplazando los valores por el nombre que le querramos dar a nuestra app y servicio, y también reemplazando el item `profile` por el perfil que creamos previamente en Serverless.

Terminada la configuración podemos realizar el deploy con `serverless deploy`, dicho comando al finalizar nos mostrará por consola la ruta en la que se instaló nuestra API y ese mismo valor es el que debemos ingresar en el frontend para completar el setup.
