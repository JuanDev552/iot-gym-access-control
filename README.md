<<<<<<< HEAD
# Sistema IoT de Control de Acceso Inteligente para Gimnasio

## Descripción

Sistema IoT que permite controlar el acceso a un gimnasio mediante tarjetas RFID, validación en base de datos y monitoreo en tiempo real.

El sistema garantiza funcionamiento incluso sin internet gracias a procesamiento local y sincronización posterior.

---

## Arquitectura

* ESP32 (Edge)
* Backend Node.js
* Base de datos MongoDB
* Comunicación MQTT
* Node-RED (visualización)
* Docker (contenedorización)

---

## Tecnologías

* ESP32 → C++ (Arduino)
* Backend → Node.js
* Base de datos → MongoDB
* Comunicación → MQTT (Mosquitto / HiveMQ)
* Dashboard → Node-RED
* Contenedores → Docker

---

## Flujo del sistema

1. Usuario pasa tarjeta RFID
2. ESP32 envía ID por MQTT
3. Backend valida en MongoDB
4. Si es válido:

   * Se abre el torniquete
   * Se envía información al dashboard
5. Node-RED muestra estado en tiempo real

---

## Tópicos MQTT

* `gym/puerta/acceso`
* `gym/puerta/comando`
* `gym/dashboard/nombre`
* `gym/dashboard/logs`

---

## Ejecución con Docker

```bash
docker compose up -d
```

---

## Health Check

```bash
docker compose ps
```

---

## Dashboard

Accede en:

```
http://localhost:1880/ui
```

---

## Prueba del sistema

En Wokwi:

* Presionar `a` → acceso permitido
* Presionar `b` → acceso denegado

---

## Características

* ✔ Control de acceso inteligente
* ✔ Procesamiento local (Edge Computing)
* ✔ Comunicación en tiempo real (MQTT)
* ✔ Alta disponibilidad
* ✔ Dashboard en vivo

---
## ADRs 
ADR 01: Selección de Base de Datos (NoSQL vs. SQL)

• Contexto: El sistema debe almacenar perfiles de socios y registros de acceso que
pueden variar en estructura con el tiempo (por ejemplo, añadir biometría o
diferentes niveles de membresía).

• Decisión: Se elige MongoDB Atlas (NoSQL) en lugar de una base de datos SQL
tradicional.

• Justificación: Las bases de datos NoSQL ofrecen un esquema flexible,
permitiendo evolucionar los datos del socio sin migraciones complejas. Además,
MongoDB facilita la escalabilidad horizontal y el manejo de grandes volúmenes de
registros de acceso (logs) que no requieren relaciones complejas.

• Consecuencia: Mayor velocidad de desarrollo e iteración, aunque se debe manejar
la consistencia de los datos a nivel de aplicación (Node-RED).

ADR 02: Protocolo de Comunicación (MQTT vs. HTTP)
• Contexto: El hardware (ESP32) opera en un entorno de internet inestable y debe
responder casi instantáneamente para no generar filas en el torniquete.

• Decisión: Implementar el protocolo MQTT sobre el patrón Pub/Sub.

• Justificación: A diferencia de HTTP, MQTT es un protocolo ligero y de bajo
overhead. Mantiene una conexión persistente que consume menos energía y ancho
de banda, ideal para dispositivos IoT que deben enviar mensajes pequeños de forma
frecuente.

• Consecuencia: Reducción drástica de la latencia y mayor estabilidad en conexiones
débiles, aunque requiere la gestión de un Broker externo.

ADR 03: Orquestador de Lógica (Node-RED vs. Código Nativo en Servidor)

• Contexto: Se requiere un motor de reglas para validar socios y un dashboard para
que la administración vea los ingresos en tiempo real.

• Decisión: Uso de Node-RED como backend principal.

• Justificación: Node-RED permite un desarrollo visual rápido y una integración
nativa con protocolos IoT y bases de datos. Facilita la creación de flujos lógicos
complejos y dashboards funcionales sin la sobrecarga de configurar un servidor
desde cero.

• Consecuencia: Agilidad en la implementación de la lógica de negocio, aunque se
debe monitorear el rendimiento del entorno Node.js bajo alta carga.

ADR 04: Estrategia de Resiliencia (Caché Local en ESP32)

• Contexto: La evaluación del sistema identificó que una falla en la red bloquea
totalmente el acceso al gimnasio (punto único de falla).

• Decisión: Implementar un mecanismo de Caché Local en la memoria del ESP32.

• Justificación: Almacenar los IDs de los socios más frecuentes localmente permite
que el sistema tome decisiones de apertura de forma autónoma ante la ausencia de
internet. Se prioriza la Disponibilidad sobre la Consistencia inmediata.

• Consecuencia: El sistema es resiliente a caídas de red, mejorando la experiencia del
usuario, con el compromiso de que los logs se sincronicen posteriormente con
MongoDB.

ADR 05: Uso de Node-RED vs. Frontend Personalizado

• Contexto: El proyecto requería una interfaz de monitoreo en tiempo real y control
manual para un sistema de acceso, con un tiempo de desarrollo limitado y un
enfoque en la funcionalidad IoT.

• Decisión: Se optó por utilizar Node-RED Dashboard en lugar de desarrollar un
Frontend desde cero (con Frameworks como React o Angular).

• Justificación: Node-RED permite una integración nativa y visual con protocolos de
hardware (MQTT), reduciendo drásticamente el tiempo de desarrollo y eliminando
la complejidad de gestionar manualmente el estado de los sockets y el diseño de la
interfaz.
---

## Autores

Juan Andrés Guzmán Holguín
Harrison Estiven Paternina Rojas

