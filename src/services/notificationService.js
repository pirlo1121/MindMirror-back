const Subscriber = require('../models/Subscriber');
const { sendEmail } = require('./emailService');

/**
 * Notifica a todos los subscriptores activos sobre un nuevo post publicado.
 * Los correos se envían en segundo plano (fire & forget) para no bloquear la respuesta HTTP.
 *
 * @param {Object} post - El post recién publicado (documento de Mongoose)
 */
const notifyNewPost = async (post) => {
  console.log(`[NotificationService] notifyNewPost llamado para: "${post.title}"`);

  try {
    const subscribers = await Subscriber.find({ status: 'active' });

    if (subscribers.length === 0) {
      console.log('[NotificationService] No hay subscriptores activos para notificar.');
      return;
    }

    console.log(`[NotificationService] ${subscribers.length} subscriptores activos encontrados.`);

    const postUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/posts/${post.slug}`;

    const htmlTemplate = (subscriberName) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px;">
                    <h1 style="color: #333; font-size: 24px; margin: 0 0 8px 0;">
                      ¡Nuevo artículo publicado!
                    </h1>
                    <p style="color: #666; font-size: 14px; margin: 0 0 24px 0;">
                      Hola, <strong>${subscriberName}</strong>
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                    <h2 style="color: #222; font-size: 20px; margin: 0 0 12px 0;">
                      ${post.title}
                    </h2>
                    ${post.excerpt ? `<p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">${post.excerpt}</p>` : ''}
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: #0066cc; border-radius: 6px;">
                          <a href="${postUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold;">
                            Leer artículo
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f8f8f8; padding: 20px 30px;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                      Si ya no deseas recibir estos correos, puedes darte de baja desde tu panel de suscripción.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailPromises = subscribers.map((sub) =>
      sendEmail({
        to: sub.email,
        subject: `Nuevo artículo: ${post.title}`,
        html: htmlTemplate(sub.name),
      })
    );

    await Promise.allSettled(emailPromises);

    console.log(`[NotificationService] Proceso completado para ${subscribers.length} subscriptores.`);
  } catch (error) {
    console.error('[NotificationService] Error al notificar subscriptores:', error.message);
  }
};

module.exports = { notifyNewPost };
