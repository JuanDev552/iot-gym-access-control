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

## Autor

Proyecto académico - IoT
