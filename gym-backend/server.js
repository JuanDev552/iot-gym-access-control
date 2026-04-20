const mqtt = require('mqtt');
const mongoose = require('mongoose');

/** * 1. CONFIGURACIÓN DE BASE DE DATOS (MongoDB Atlas) */ 
const mongoURI = 'mongodb+srv://harrison_admin:11052005@unimodulo-api.mruhxb0.mongodb.net/GymDB?retryWrites=true&w=majority&appName=unimodulo-api';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

const socioSchema = new mongoose.Schema({
    rfid: String,
    nombre: String,
    estado: String
});

const Socio = mongoose.model('Socio', socioSchema, 'socios');

/**
 * 2. MQTT (AHORA LOCAL - DOCKER)
 */
//const client = mqtt.connect('mqtt://broker.hivemq.com');

const client = mqtt.connect('mqtt://broker.hivemq.com:1883', {
    clientId: 'backend_' + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

const TOPIC_ACCESO = 'gym/puerta/acceso';
const TOPIC_COMANDO = 'gym/puerta/comando';
const TOPIC_DASHBOARD = 'gym/dashboard/nombre';
const TOPIC_LOGS = 'gym/dashboard/logs';

client.on('connect', () => {
    console.log('✅ Conectado a MQTT (Mosquitto)');
    client.subscribe(TOPIC_ACCESO);
});

/**
 * 3. LÓGICA
 */
client.on('message', async (topic, message) => {

    client.on('message', (topic, message) => {
        console.log(`📨 Mensaje recibido [${topic}]: ${message.toString()}`);
    });
    
    if (topic === TOPIC_ACCESO) {
        const idRecibido = message.toString().trim();

        console.log(`📇 ID detectado: ${idRecibido}`);

        try {
            const socio = await Socio.findOne({ rfid: idRecibido });

            if (socio) {
                if (socio.estado === 'activo') {
                    console.log('🔓 ACCESO CONCEDIDO');
                    client.publish(TOPIC_LOGS, `✅ ${socio.nombre}`);
                    client.publish(TOPIC_DASHBOARD, socio.nombre);
                    client.publish(TOPIC_COMANDO, 'OPEN');
                } 
                else if (socio.estado === 'vencido') {
                    console.log('⚠️ DENEGADO (deuda)');
                    client.publish(TOPIC_DASHBOARD, `DEUDOR: ${socio.nombre}`);
                } 
                else {
                    console.log('❌ INACTIVO');
                    client.publish(TOPIC_DASHBOARD, `INACTIVO: ${socio.nombre}`);
                }
            } else {
                console.log('🚨 NO REGISTRADO');
                client.publish(TOPIC_DASHBOARD, 'DESCONOCIDO');
            }
        } catch (error) {
            console.error('❌ Error BD:', error);
        }
    }
});