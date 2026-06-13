const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event, context) => {
  // Manejo de CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }

  try {
    // Lógica para POST
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { data, error } = await supabase.from('mensajes').insert([body]).select();
      if (error) throw error;
      return { statusCode: 201, body: JSON.stringify({ ok: true, data: data[0] }) };
    }

    // Lógica para GET
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('mensajes').select('*');
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ ok: true, data }) };
    }
  } catch (err) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: err.message || "Error desconocido en el servidor" }) 
    };
  }
};