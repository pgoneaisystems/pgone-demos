export class CotizaFlowVertical {
  constructor(chatEngine, tourEngine) {
    this.chat = chatEngine;
    this.tour = tourEngine;
    this.step = 'INIT';
    this.collected = {
      nombre: 'Demo User',
      telefono: '+5491100000000',
      origen: '',
      destino: '',
      fecha: '',
      pasajeros: '1'
    };
  }

  start() {
    this.step = 'INIT';
    this.chat.clear();
    this.chat.setHeader({
      avatar: 'CF',
      name: 'CotizaFlow Demo',
      status: 'en línea (24/7)'
    });

    this.tour.showStep({
      tag: "Paso 1: Bienvenida Comercial",
      title: "Recepción Inmediata 24/7",
      desc: "El cliente inicia la interacción en la línea comercial. El bot responde al segundo con las opciones de flota y cotización.",
      metric: "0 segundos de demora de respuesta"
    });

    this.chat.botReply("¡Hola! Te damos la bienvenida a PG-ONE Traslados Ejecutivos. 🚗", 400, () => {
      this.chat.botReply("¿En qué te podemos ayudar hoy?", 500, () => {
        this.chat.renderQuickReplies([
          { label: "Cotizar Viaje a Medida", action: () => this.handleAction('COTIZAR') },
          { label: "Ver Categorías de Flota", action: () => this.handleAction('FLOTA') }
        ]);
      });
    });
  }

  handleAction(action) {
    if (action === 'FLOTA') {
      this.tour.showStep({
        tag: "Catálogo de Flota",
        title: "Exhibición de Unidades",
        desc: "El bot exhibe la flota sin intervención humana, filtrando dudas frecuentes.",
        metric: "Ahorro del 60% de mensajes repetitivos"
      });

      this.chat.userSend("Ver Categorías de Flota");
      this.chat.botReply("Contamos con 3 categorías disponibles:\n\n• Sedan Ejecutivo (hasta 3 pax)\n• Camioneta Utilitaria (hasta 6 pax)\n• Minivan Corporativa (hasta 12 pax)", 600, () => {
        this.chat.renderQuickReplies([
          { label: "Cotizar Viaje a Medida", action: () => this.handleAction('COTIZAR') }
        ]);
      });
      return;
    }

    if (action === 'COTIZAR') {
      this.step = 'ASK_ORIGEN';
      this.chat.userSend("Cotizar Viaje a Medida");

      this.tour.showStep({
        tag: "Paso 2: Captura Determinística",
        title: "Toma de Parámetros",
        desc: "El sistema pide de forma guiada los datos esenciales para cotizar sin omitir nada.",
        metric: "100% de datos validados para el operador"
      });

      this.chat.botReply("Excelente. ¿Desde qué dirección o punto inicias el traslado? (Ej: Ezeiza Terminal A)", 500);
    }
  }

  handleInput(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (this.step === 'ASK_ORIGEN') {
      this.collected.origen = trimmed;
      this.step = 'ASK_DESTINO';
      this.chat.userSend(trimmed);
      this.chat.botReply("Perfecto. ¿Hacia qué punto o dirección vas? (Ej: Obelisco, CABA)", 500);
      return;
    }

    if (this.step === 'ASK_DESTINO') {
      this.collected.destino = trimmed;
      this.step = 'ASK_FECHA';
      this.chat.userSend(trimmed);
      this.chat.botReply("Entendido. ¿Para qué fecha y horario estimas el viaje? (Ej: Mañana 15:30 hs)", 500);
      return;
    }

    if (this.step === 'ASK_FECHA') {
      this.collected.fecha = trimmed;
      this.step = 'DISPATCH';
      this.chat.userSend(trimmed);

      this.tour.showStep({
        tag: "Paso 3: Cableado Transaccional",
        title: "Disparo al Centro de Operaciones",
        desc: "Se procesa el trayecto, se notifica al canal interno de reservas vía Webhook real de Make y se deja listo el cotizador web precargado.",
        metric: "Cotización armada en menos de 10 segundos"
      });

      this.chat.botReply("Procesando tu solicitud y enviando la ficha a nuestro centro de reservas...", 600, () => {
        this.triggerRealMakeWebhook();
      });
    }
  }

  async triggerRealMakeWebhook() {
    const webhookUrl = "https://hook.us2.make.com/zrv1bm3anqobw8u7q89dhqti4sk3bcd8";
    const payload = {
      nombre: this.collected.nombre,
      telefono: this.collected.telefono,
      origen: this.collected.origen,
      destino: this.collected.destino,
      fecha_hora: this.collected.fecha,
      pasajeros: this.collected.pasajeros,
      source: "pgone-demos-showroom"
    };

    try {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors"
      });
    } catch (err) {
      console.warn("Disparo offline o bloqueado por CORS:", err);
    }

    const queryParams = new URLSearchParams({
      origen: this.collected.origen,
      destino: this.collected.destino,
      fecha: this.collected.fecha,
      nombre: this.collected.nombre,
      telefono: this.collected.telefono
    }).toString();

    const cotizadorUrl = `https://cotizaflow-chi.vercel.app/cotizador.html?${queryParams}`;

    this.chat.botReply(
      `✅ ¡Datos recibidos con éxito!\n\n📋 *Resumen de la consulta:*\n• Origen: ${this.collected.origen}\n• Destino: ${this.collected.destino}\n• Fecha: ${this.collected.fecha}\n\nNuestro operador ya recibió la ficha en la guardia de reservas y te contactará con el presupuesto formal.`,
      800,
      () => {
        this.chat.renderActionLink("Abrir Cotizador Precargado (Vista Operador)", cotizadorUrl);
      }
    );
  }
}
