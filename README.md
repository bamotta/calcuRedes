# calcuRedes

# Sesión 1 Cálculo del tipo de Red 13/05/2025

## Resumen
- En esta sesión hemos implementado los diferentes objetivos que se proponían al principio de la sesión. En primer lugar hemos creado el formulario y lo hemos formatizado con CSS. En segundo lugar hemos empezado a trabajar en el Script para desarrollar las comprobaciones requeridas. Comenzamos por la validación de los octetos y dando el estilo que se apunta en la actividad extra, rojo en caso de ser inválido y verde en caso contrario. A continuación hemos ido realizando las subsiguientes comprobaciones que versaban sobre el tipo de máscara, el tipo de red y las clase a la que pertenece la IP introducida por el usuario. Finalizamos la sesión con un nombre para la aplicación.

## Dificultades encontradas
- Tuvimos problemas para que iniciara la comprobación de los inputs.

## Soluciones aplicadas
- Se resolvió añadiendo un eventListener al objeto window para que nada más cargue la página empiece con las comprobaciones.

## Fuentes consultadas
- Apuntes vistos en clases anteriores
- https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions
- https://es.stackoverflow.com/questions/20484/c%C3%B3mo-eliminar-los-botones-de-un-input-number
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
- https://fontawesome.com/kits

## Decisiones técnicas
- Aspecto de la página.
- Lógica del Script.
- Estructura de la web.

## Ideas de mejora futura
- Corregir algunos aspectos del script para que la funcionalidad sea más eficiente.
- arreglar favicon



# Sesión 2 Cálculo del tipo de Red 14/05/2025

## Resumen
- En esta sesión hemos implementado los diferentes objetivos que se proponían al principio de la sesión. Lo primero que hemos hecho ha sido sustituir los 4 inputs en un unico input y que se realizara la Validacion de dicho input luego hemos añadido al resumen las partes adicionales que nos han dado hoy y hemos hecho que se vean en decimal y luego en Binario cuando es posible.

## Dificultades encontradas
- Al añadir algunas funciones y darle al boton de calcular no nos mostraba los resultados.

## Soluciones aplicadas
- Fav icon arreglado*
- Hicimos una revision del codigo y arreglamos el problema

## Fuentes consultadas
- Apuntes vistos en clases anteriores
- https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions
- https://es.stackoverflow.com/questions/20484/c%C3%B3mo-eliminar-los-botones-de-un-input-number
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
- https://fontawesome.com/kits

## Decisiones técnicas
- Hemos decidio hacer que el Extra que nos pedian hoy: (diferenciar mediante colores la parte de red y la parte de host en la dirección IP.) hacer que directamente lea bit por bit la subnet.

## Ideas de mejora futura
- comprobar que con mascaras mixtas funciona correctamente el colorizeNet.


# Sesión 3 Máscara de red personalizada 15/05/2025

## Resumen
- En esta sesión hemos implementado los diferentes objetivos que se proponían al principio de la sesión. Lo primero que hemos hecho ha sido añadir el input para la máscara personalizada, teniendo en cuenta que si no ponemos ninguna elegirá la máscara por defecto d la clase y que se escojan máscaras válidas para cada clase. Se ha actualizado la información de la red, añadiendo: número de subredes, host minimo y máximo y la dirección IP en formato hexadecimal. De la parte extra hemos decidido hacer la parte de los colores de la dirección IP en binario, separando por red, subred y host y seleccionar por defecto la IP pública del usuario.

## Dificultades encontradas
- Al añadir algunas funciones y darle al boton de calcular no nos mostraba los resultados.

## Soluciones aplicadas
- Implementación de cambios en el showResults para que no muestre nada si es una ip invalida.

## Fuentes consultadas
- Apuntes vistos en clases anteriores
- https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions
- https://es.stackoverflow.com/questions/20484/c%C3%B3mo-eliminar-los-botones-de-un-input-number
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
- https://es.stackoverflow.com/questions/67217/obtener-ip-de-cliente-desde-javascript-o-jquery

## Decisiones técnicas
- Hemos decidio hacer implementar la función extra de poner por defecto la ip pública real del usuario para agilizar la experiencia de uso.

## Ideas de mejora futura
- ¿Añadir el botón de la IP local?




# Sesión 4 Subredes

## Resumen
- En esta sesión hemos implementado los diferentes objetivos que se proponían al principio de la sesión. Lo primero que hemos hecho ha sido añadir el input para la nueva máscara personalizada, añadiendo las subredes y su información. 

## Dificultades encontradas
- Adaptar el código al nuevo input
- Funcionalidad de las clases E y D

## Soluciones aplicadas
- Revisión de los alerts y donde estaban colocados
- Revision de codigo y restructuración

## Fuentes consultadas
- Apuntes vistos en clases anteriores
- https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions
- https://es.stackoverflow.com/questions/20484/c%C3%B3mo-eliminar-los-botones-de-un-input-number
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-style

## Decisiones técnicas
- Añadimos las subredes en un nuevo div debajo del general para que se consulten las subredes si se quiere, pero que resalte la información de la red introducida.

## Ideas de mejora futura
