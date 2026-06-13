const { createClient } = require('@supabase/supabase-js');

// Configura estas variables en Netlify (Site Settings > Environment Variables)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async function(event, context) {
  if (event.httpMethod === "GET") {
    const { data, error } = await supabase.from('mensajes').select('*').order('fecha', { ascending: false });
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ ok: true, data }) };
  }

 if (event.httpMethod === "POST") {
    try {
        console.log("Cuerpo recibido:", event.body); // Log para ver qué llega
        const body = JSON.parse(event.body);
        
        const { data, error } = await supabase.from('mensajes').insert([body]).select();
        
        if (error) {
            console.error("Error de Supabase:", error); // Esto aparecerá en los Logs de Netlify
            return { 
                statusCode: 400, 
                body: JSON.stringify({ mensaje_error: error.message, detalles: error.details }) 
            };
        }
        return { statusCode: 201, body: JSON.stringify({ ok: true, data: data[0] }) };
    } catch (err) {
        console.error("Error de parsing:", err);
        return { statusCode: 400, body: JSON.stringify({ mensaje_error: "Error en el formato JSON", detalles: err.message }) };
    }
}
};