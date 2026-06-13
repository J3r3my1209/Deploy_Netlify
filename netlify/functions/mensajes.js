const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
    // 1. Verificación básica: ¿Llegó algo?
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo de la petición vacío" }) };
    }

    try {
        const body = JSON.parse(event.body);
        
        // 2. Intentar insertar en Supabase
        const { data, error } = await supabase
            .from('mensajes')
            .insert([body]);

        if (error) {
            // Esto nos dirá SI ES UN PROBLEMA DE RLS O DE BASE DE DATOS
            return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
        }

        return { statusCode: 200, body: JSON.stringify({ mensaje: "Guardado" }) };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: e.toString() }) };
    }
};