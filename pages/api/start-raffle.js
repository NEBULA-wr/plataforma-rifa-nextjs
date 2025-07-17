// pages/api/start-raffle.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      console.log('API Error: Contraseña incorrecta.');
      return res.status(401).json({ error: 'Contraseña de administrador incorrecta' });
    }

    const { data: currentStatus, error: statusError } = await supabaseAdmin
      .from('raffle_status')
      .select('status')
      .eq('id', 1)
      .single();

    if (statusError) {
      console.error('API Error: No se pudo leer el estado de la rifa.', statusError);
      return res.status(500).json({ error: 'Error al leer el estado de la rifa. ¿Existe la fila con id=1?' });
    }

    if (currentStatus.status === 'finished') {
      console.log('API Info: La rifa ya ha sido finalizada.');
      return res.status(409).json({ error: 'La rifa ya ha sido finalizada.' });
    }

    const { data: tickets, error: ticketsError } = await supabaseAdmin.from('tickets').select('*');
      
    if (ticketsError || !tickets || tickets.length === 0) {
      console.log('API Info: No se encontraron boletos para sortear.');
      return res.status(404).json({ error: 'No se encontraron boletos para la rifa.' });
    }

    const winnerIndex = Math.floor(Math.random() * tickets.length);
    const winner = tickets[winnerIndex];

    console.log(`API Info: Ganador seleccionado. Ticket ID: ${winner.id}`);

    // ¡EL PASO MÁS IMPORTANTE!
    // Esto dispara el evento de tiempo real para todos los clientes.
    const { error: updateError } = await supabaseAdmin
      .from('raffle_status')
      .update({ 
        status: 'finished', 
        winner_ticket_id: winner.id,
        updated_at: new Date() 
      })
      .eq('id', 1);

    if (updateError) {
      console.error('API Error: ¡FALLÓ LA ACTUALIZACIÓN EN LA BASE DE DATOS!', updateError);
      return res.status(500).json({ error: 'Error CRÍTICO al guardar el ganador en la base de datos.' });
    }

    console.log('API Success: La rifa se ha iniciado y el ganador se ha guardado correctamente.');
    res.status(200).json({ message: 'Rifa iniciada y ganador seleccionado!', winner: winner });

  } catch (error) {
    console.error('API Error: Ocurrió un error inesperado.', error);
    res.status(500).json({ error: error.message || 'Ocurrió un error inesperado en el servidor.' });
  }
}