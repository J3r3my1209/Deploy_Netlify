const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS" } };
    }

    try {
        if (event.httpMethod === 'DELETE') {
            const id = event.queryStringParameters.id;
            const { error } = await supabase.from('mensajes').delete().eq('id', id);
            if (error) throw error;
            return { statusCode: 200, body: JSON.stringify({ ok: true }) };
        }

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            const { data, error } = await supabase.from('mensajes').insert([body]).select();
            if (error) throw error;
            return { statusCode: 201, body: JSON.stringify({ ok: true, data: data[0] }) };
        }

        if (event.httpMethod === 'GET') {
            const { data, error } = await supabase.from('mensajes').select('*').order('id', { ascending: false });
            if (error) throw error;
            return { statusCode: 200, body: JSON.stringify({ data }) };
        }

    } catch (err) {
        return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
};