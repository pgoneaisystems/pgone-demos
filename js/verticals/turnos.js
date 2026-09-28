export class TurnosVertical {
  constructor(chatEngine, tourEngine) {
    this.chat = chatEngine;
    this.tour = tourEngine;
    this.step = 'MENU';
    this.collected = {
      servicio: '',
      preferencia: '',
      nombre: '',
      contacto: ''
    };
  }

  start() {
    this.step = 'MENU';
    this.chat.clear();
    this.chat.setHeader({
      avatar: 'ST',
      name: 'Studio & Barbería (Demo)',
      status: 'en línea (24/7)'
    });

    this.tour.showStep({
      tag: "Paso 1: Recepción Ligera",
      title: "Atención Automatizada para Locales",
      desc: "Resuelve las 3 preguntas diarias que hacen los clientes en redes sin necesidad de contratar software pesado ni bases de datos costosas.",
      metric: "Respuestas al instante en redes sociales"
    });

    const bienvenida = "¡Hola! 👋 Te damos la bienvenida a *Studio Urbano*.\n\nElegí una opción para ayudarte al instante:";

    this.chat.botReply(bienvenida, 400, () => {
      this.chat.renderQuickReplies([
        { label: "💈 Servicios & Precios", action: () => this.showPrecios() },
        { label: "📍 Ubicación & Horarios", action: () => this.showUbicacion() },
        { label: "📅 Consultar Turno", action: () => this.iniciarTurno() }
      ]);
    });
  }

  showPrecios() {
    this.chat.userSend("💈 Servicios & Precios");

    this.tour.showStep({
      tag: "Carta de Servicios",
      title: "Transparencia de Precios",
      desc: "Evita perder tiempo respondiendo precios uno por uno en comentarios o mensajes directos.",
      metric: "Filtro automático de consultas de precio"
    });

    const texto = "💈 *SERVICIOS Y TARIFAS VIGENTES*\n\n✂️ *Corte Clásico / Fade:* $ 12.000\n🧔 *Corte + Perfilado de Barba:* $ 16.500\n🎨 *Colorimetría / Platinado:* desde $ 28.000\n✨ *Perfilado y Limpieza Facial:* $ 9.500\n\nTodos los servicios incluyen lavado y producto de peinado profesional.\n\n¿Querés reservar un lugar?";

    this.chat.botReply(texto, 500, () => {
      this.chat.renderQuickReplies([
        { label: "📅 Consultar Disponibilidad", action: () => this.iniciarTurno() },
        { label: "🔙 Volver al Menú", action: () => this.start() }
      ]);
    });
  }

  showUbicacion() {
    this.chat.userSend("📍 Ubicación & Horarios");

    this.tour.showStep({
      tag: "Información del Local",
      title: "Dirección y Horarios Claros",
      desc: "Ubicación y horarios siempre disponibles para que los clientes sepan exactamente cuándo pasar.",
      metric: "Atención comercial constante"
    });

    const texto = "📍 *DÓNDE ESTAMOS*\nAv. Santa Fe 3240, Palermo, CABA.\n(A dos cuadras de Estación Bulnes - Línea D)\n\n🕒 *HORARIOS DE ATENCIÓN*\n• Martes a Sábados: 10:00 a 20:00 hs.\n• Domingos y Lunes: Cerrado.\n\n¿Te gustaría consultar por un turno?";

    this.chat.botReply(texto, 500, () => {
      this.chat.renderQuickReplies([
        { label: "📅 Consultar Disponibilidad", action: () => this.iniciarTurno() },
        { label: "🔙 Volver al Menú", action: () => this.start() }
      ]);
    });
  }

  iniciarTurno() {
    this.step = 'ASK_SERVICIO';
    this.chat.userSend("📅 Consultar Turno");

    this.tour.showStep({
      tag: "Paso 2: Captura de Preferencia",
      title: "Preferencia de Servicio y Día",
      desc: "El cliente indica qué se quiere hacer y qué franja le queda cómoda.",
      metric: "Lead calificado sin fricción"
    });

    this.chat.botReply("¡Genial! ¿Qué servicio te gustaría realizarte y qué día o franja horaria preferís? (Ej: Corte y barba, este viernes por la tarde)", 500);
  }

  handleInput(text) {
    const val = text.trim();
    if (!val) return;

    if (this.step === 'ASK_SERVICIO') {
      this.collected.preferencia = val;
      this.step = 'ASK_NOMBRE';
      this.chat.userSend(val);

      this.tour.showStep({
        tag: "Paso 3: Contacto Directo",
        title: "Toma de Nombre y Teléfono",
        desc: "Datos indispensables para confirmar la agenda.",
        metric: "Cero formularios engorrosos"
      });

      this.chat.botReply("¿A nombre de quién agendamos la consulta? (Nombre y apellido)", 500);
      return;
    }

    if (this.step === 'ASK_NOMBRE') {
      this.collected.nombre = val;
      this.step = 'ASK_CONTACTO';
      this.chat.userSend(val);
      this.chat.botReply("¿A qué número de WhatsApp te confirmamos el horario exacto disponible? (Ej: 11 5555-8888)", 500);
      return;
    }

    if (this.step === 'ASK_CONTACTO') {
      this.collected.contacto = val;
      this.step = 'FINALIZADO';
      this.chat.userSend(val);

      this.tour.showStep({
        tag: "Paso 4: Notificación al Negocio",
        title: "Lead en el Bolsillo del Dueño",
        desc: "Se notifica al local con un enlace wa.me ya listo para responder con un solo toque y confirmar el horario exacto.",
        metric: "Confirmación en 5 segundos sin CRM complejo"
      });

      const confirmacion = `✅ ¡Solicitud registrada, ${this.collected.nombre}!\n\n📋 *Detalle del pedido:*\n• Preferencia: ${this.collected.preferencia}\n• Contacto: ${this.collected.contacto}\n\nEn instantes revisamos la agenda y te confirmamos el horario disponible directamente por WhatsApp. ¡Gracias! ✨`;

      this.chat.botReply(confirmacion, 600, () => {
        const respuestaWhatsapp = `https://wa.me/?text=${encodeURIComponent(`Hola ${this.collected.nombre}, me contacto de Studio Urbano sobre tu consulta para: ${this.collected.preferencia}. ¿Te queda cómodo a las 16:30 hs?`)}`;
        this.chat.renderActionLink("Responder al Cliente con Turno (Vista Local)", respuestaWhatsapp);
      });
    }
  }
}
