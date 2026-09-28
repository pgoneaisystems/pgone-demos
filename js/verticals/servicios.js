export class ServiciosVertical {
  constructor(chatEngine, tourEngine) {
    this.chat = chatEngine;
    this.tour = tourEngine;
    this.step = 'MENU';
    this.collected = {
      consulta: '',
      nombre: '',
      domicilio: '',
      contacto: ''
    };
  }

  start() {
    this.step = 'MENU';
    this.chat.clear();
    this.chat.setHeader({
      avatar: 'EL',
      name: 'Electricista López (Demo)',
      status: 'en línea (24/7)'
    });

    this.tour.showStep({
      tag: "Paso 1: Bienvenida Comercial",
      title: "Atención Inmediata para Profesionales",
      desc: "El cliente es recibido por un asistente que filtra dudas de servicios o inicia directamente la toma del pedido sin esperas.",
      metric: "Cero llamadas perdidas por estar trabajando"
    });

    const bienvenida = "¡Hola! 👋 Soy el asistente virtual de Electricista López.\n\n¿En qué te puedo ayudar hoy?";

    this.chat.botReply(bienvenida, 400, () => {
      this.chat.renderQuickReplies([
        { label: "📋 Servicios", action: () => this.showServicios() },
        { label: "💰 Solicitar presupuesto", action: () => this.iniciarPresupuesto() }
      ]);
    });
  }

  showServicios() {
    this.chat.userSend("📋 Servicios");

    this.tour.showStep({
      tag: "Catálogo de Oficios",
      title: "Detalle de Prestaciones",
      desc: "Muestra claramente qué trabajos realiza el profesional, evitando consultas por rubros no atendidos.",
      metric: "100% de consultas filtradas por especialidad"
    });

    const textoServicios = "Estos son los servicios que ofrecemos:\n\n🔧 *INSTALACIONES*\n➔ Tomacorrientes y llaves\n➔ Cableado nuevo\n➔ Tableros eléctricos\n\n💡 *ILUMINACIÓN*\n➔ Luminarias LED\n➔ Apliques y spots\n➔ Iluminación exterior\n\n🛠️ *REPARACIONES*\n➔ Cortocircuitos\n➔ Térmicas y disyuntores\n➔ Puesta a tierra\n\n🚨 *URGENCIAS 24/7*\nAtendemos emergencias todos los días.\n\n¿Cómo querés avanzar?";

    this.chat.botReply(textoServicios, 500, () => {
      this.chat.renderQuickReplies([
        { label: "💰 Pedir presupuesto", action: () => this.iniciarPresupuesto() },
        { label: "🔙 Volver al menú", action: () => this.start() }
      ]);
    });
  }

  iniciarPresupuesto() {
    this.step = 'ASK_CONSULTA';
    this.chat.userSend("💰 Solicitar presupuesto");

    this.tour.showStep({
      tag: "Paso 2: Captura del Trabajo",
      title: "Toma Precisa del Problema",
      desc: "El asistente solicita al cliente que explique el problema con claridad para que el profesional calcule materiales y tiempo antes de ir.",
      metric: "Información técnica completa antes de visitar"
    });

    const promptConsulta = "💰 *Presupuesto sin cargo*\n\nContanos qué necesitás en un solo mensaje. Cuanto más detalle, más preciso será el presupuesto.\n\n📝 Escribí tu consulta a continuación: (escribí todo en una sola oración, separada por una coma. Ejemplo: \"Cambio de tomacorrientes, instalación de disyuntor\")";

    this.chat.botReply(promptConsulta, 500);
  }

  handleInput(text) {
    const val = text.trim();
    if (!val) return;

    if (this.step === 'ASK_CONSULTA') {
      this.collected.consulta = val;
      this.step = 'ASK_NOMBRE';
      this.chat.userSend(val);

      this.tour.showStep({
        tag: "Paso 3: Identificación del Cliente",
        title: "Datos de Contacto Directo",
        desc: "Se recaban los datos personales y de ubicación física del trabajo para coordinar la visita.",
        metric: "Ficha ordenada y lista para agendar"
      });

      this.chat.botReply("Ahora necesitamos algunos datos para que el profesional te contacte.\n\n👉 ¿Cuál es tu nombre completo?", 500);
      return;
    }

    if (this.step === 'ASK_NOMBRE') {
      this.collected.nombre = val;
      this.step = 'ASK_DOMICILIO';
      this.chat.userSend(val);
      this.chat.botReply("Perfecto. Ahora decime:\n\n📍 ¿Cuál es el domicilio donde realizaremos el trabajo?\n\nEjemplo: \"Av. Rivadavia 1234, CABA\"", 500);
      return;
    }

    if (this.step === 'ASK_DOMICILIO') {
      this.collected.domicilio = val;
      this.step = 'ASK_CONTACTO';
      this.chat.userSend(val);
      this.chat.botReply("📱 ¿A qué número de WhatsApp podemos enviarte la cotización? (Ej: 11 2345-6789)", 500);
      return;
    }

    if (this.step === 'ASK_CONTACTO') {
      this.collected.contacto = val;
      this.step = 'FINALIZADO';
      this.chat.userSend(val);

      this.tour.showStep({
        tag: "Paso 4: Notificación y Cierre",
        title: "Alerta Inmediata al Técnico",
        desc: "Se pausa la atención automática y se despacha la orden completa al canal del profesional con botón directo para responder.",
        metric: "Cierre de orden en segundos"
      });

      const confirmacion = `✅ ¡Solicitud recibida con éxito, ${this.collected.nombre}!\n\n📋 *Resumen de tu pedido:*\n• Consulta: ${this.collected.consulta}\n• Domicilio: ${this.collected.domicilio}\n• Contacto: ${this.collected.contacto}\n\nVamos a preparar tu presupuesto y te lo enviamos a la brevedad.\n\n¡Gracias por confiar en nosotros! ⚡`;

      this.chat.botReply(confirmacion, 600, () => {
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`Hola ${this.collected.nombre}, me contacto de Electricista López respecto a tu presupuesto para: ${this.collected.consulta}`)}`;
        this.chat.renderActionLink("Contactar al Cliente vía WhatsApp (Vista Técnico)", whatsappLink);
      });
    }
  }
}
