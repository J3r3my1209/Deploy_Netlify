const { createClient } = require('@supabase/supabase-js');

// Inicialización estándar sin configuraciones extra que causen conflictos de esquema
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
    // Manejo de preflight CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS" } };
    }

    try {
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            
            // Usamos una referencia a la tabla sin prefijos de esquema
            // Si esto sigue fallando, es un problema de caché en Supabase
            const { data, error } = await supabase
                .from('mensajes')
                .insert([body]);

            if (error) {
                console.error("ERROR DE SUPABASE:", error);
                return { 
                    statusCode: 400, 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ error: error.message, code: error.code }) 
                };
            }
            return { 
                statusCode: 201, 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ok: true }) 
            };
        }
        return { statusCode: 405, body: "Método no permitido" };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.toString() }) };
    }
};