const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('mensajes').select('*');
    return { statusCode: 200, body: JSON.stringify({ data, error }) };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { data, error } = await supabase.from('mensajes').insert([body]);
      
      if (error) throw error;
      
      return { statusCode: 201, body: JSON.stringify({ message: "Éxito" }) };
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, body: "Método no permitido" };
};