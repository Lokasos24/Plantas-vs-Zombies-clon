🧟 JS-Plants vs Zombies Clone (Vanilla Engine)
Este es un clon técnico de las mecánicas base de Plants vs Zombies, desarrollado en JavaScript Vanilla (sin motores externos como Phaser o Unity).

🤖 El Rol de la IA y la Orquestación
Este proyecto fue desarrollado bajo una metodología de Arquitectura Dirigida por el Humano y Ejecución Asistida por IA.

Mi Rol: Diseñé la arquitectura de clases, definí el flujo de datos entre los managers (Entity, Economy, Grid, UI) y tomé todas las decisiones de lógica de juego (detección por filas, estados de los zombies, etc.).

Rol de la IA: Actuó como mi "brazo ejecutor" y asistente de diseño, generando el boilerplate del código y resolviendo algoritmos específicos bajo mis instrucciones detalladas (prompts técnicos).

🚀 Desafíos Técnicos Superados
Sistema de Coordenadas: Implementación de un Grid lógico para separar la visualización (Canvas) de la lógica de ocupación.

Gestión de Memoria: Ciclo de vida de entidades con limpieza automática de objetos "muertos" para evitar fugas de memoria.

IA de Enemigos: Sistema de estados para zombies (Caminando -> Detectando Obstáculo -> Atacando).

Dificultad Dinámica: Algoritmo de spawn con tiempo decreciente basado en el progreso del jugador.

🛠️ Tecnologías
JavaScript (ES6+)

HTML5 Canvas API

CSS3