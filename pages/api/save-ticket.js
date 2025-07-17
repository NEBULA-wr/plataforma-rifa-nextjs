// pages/api/save-ticket.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, phone, ticketNumber } = req.body;

  if (!name || !email || !phone || !ticketNumber) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  try {
    // La restricción UNIQUE en la DB ya previene duplicados.
    // La llamada a la API insertará el ticket o fallará si ya existe.
    // No necesitamos una verificación previa aquí.

    const { data, error } = await supabaseAdmin
      .from('tickets') // <-- CORREGIDO: tabla 'tickets'
      .insert([
        {
          ticket_number: ticketNumber,      // <-- CORREGIDO: columna 'ticket_number'
          owner_name: name,                 // <-- CORREGIDO: columna 'owner_name'
          owner_email: email,               // <-- CORREGIDO: columna 'owner_email'
          owner_phone: phone,               // <-- CORREGIDO: columna 'owner_phone'
        },
      ])
      .select()
      .single();

    if (error) {
      // Si el error es por la restricción de unicidad, enviamos un mensaje claro.
      if (error.code === '23505') { // Código de error de PostgreSQL para violación de unicidad
        return res.status(409).json({ error: `El boleto #${ticketNumber} ya fue vendido.` });
      }
      throw error; // Para cualquier otro error
    }

    res.status(200).json({ message: 'Boleto registrado', ticket: data });
  } catch (error) {
    console.error('Error en API save-ticket:', error);
    res.status(500).json({ error: error.message || 'Error al guardar el boleto.' });
  }
}