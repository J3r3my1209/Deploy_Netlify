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
      const body = JSON.parse(event.body);
      if (!body.nombre || !body.email || !body.mensaje) {
        return { statusCode: 400, body: JSON.stringify({ error: "Faltan campos obligatorios" }) };
      }
      const { data, error } = await supabase.from('mensajes').insert([body]).select();
      if (error) throw error;
      return { statusCode: 201, body: JSON.stringify({ ok: true, data: data[0] }) };
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
  }
};