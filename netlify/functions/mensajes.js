const { createClient } = require('@supabase/supabase-js');

// Verificación rápida para evitar fallos de inicio
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

exports.handler = async (event) => {
    // 1. Manejo de peticiones CORS (necesario para fetch desde el navegador)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
            }
        };
    }

    try {
        // 2. Lógica para POST (Insertar)
        if (event.httpMethod === 'POST') {
            if (!event.body) throw new Error("Cuerpo de la petición vacío");
            const body = JSON.parse(event.body);
            
            const { data, error } = await supabase
                .from('mensajes')
                .insert([body])
                .select(); // .select() es importante para recibir la confirmación

            if (error) throw error;

            return {
                statusCode: 201,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ok: true, data: data[0] })
            };
        }

        // 3. Lógica para GET (Leer)
        if (event.httpMethod === 'GET') {
            const { data, error } = await supabase
                .from('mensajes')
                .select('*')
                .order('created_at', { ascending: false }); // Asegúrate de que tengas una columna 'created_at'

            if (error) throw error;

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ok: true, data: data })
            };
        }

        return { statusCode: 405, body: "Método no permitido" };

    } catch (err) {
        // Log detallado para ver en el panel de Netlify
        console.error("Error en función:", err);
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: err.message })
        };
    }
};