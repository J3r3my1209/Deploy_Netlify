const { createClient } = require('@supabase/supabase-js');

// 1. Inicialización segura del cliente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno: SUPABASE_URL o SUPABASE_KEY");
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

exports.handler = async (event) => {
  // 2. Cabeceras para evitar problemas de CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    // 3. Manejo de POST (Insertar)
    if (event.httpMethod === 'POST') {
      if (!event.body) throw new Error("Cuerpo de la petición vacío");
      const body = JSON.parse(event.body);
      
      const { data, error } = await supabase
        .from('public.mensajes')
        .insert([body])
        .select();

      if (error) throw error;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true, data: data[0] })
      };
    }

    // 4. Manejo de GET (Leer)
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('public.mensajes')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, data: data })
      };
    }

    return { statusCode: 405, headers, body: "Método no permitido" };

  } catch (err) {
    console.error("Error en función:", err);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};