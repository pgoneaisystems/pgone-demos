export class CotizaFlowVertical {
  constructor(chatEngine, tourEngine) {
    this.chat = chatEngine;
    this.tour = tourEngine;
    this.step = 'MENU';
    this.collected = {
      nombre: '',
      telefono: '',
      email: '',
      origen: '',
      destino: '',
      fecha: '',
      pasajeros_equipaje: ''
    };
  }

  start() {
    this.step = 'MENU';
    this.chat.clear();
    this.chat.setHeader({
      avatar: 'CF',
      name: 'CotizaFlow Test',
      status: 'en línea (24/7)'
    });

    this.tour.showStep({
      tag: "Paso 1: Bienvenida Comercial",
      title: "Recepción y Separación de Canales",
      desc: "El asistente recibe al pasajero en la línea comercial. Si ya es cliente frecuente, lo deriva al canal de reservas. Si es nuevo, presenta opciones claras.",
      metric: "Atención comercial inmediata 24/7"
    });

    const bienvenida = "Gracias por comunicarte con NOMBRE DE LA EMPRESA\n\nSi ya sos cliente, comunicate al WhatsApp de reservas +5491149365273, que está disponible las 24 hs, todos los días.\n\nSi es la primera vez que te contactás con nosotros, elegí una opción para comenzar:";

    this.chat.botReply(bienvenida, 400, () => {
      this.chat.renderQuickReplies([
        { label: "Servicios y Flota", action: () => this.handleMenuChoice('SERVICIOS_FLOTA') },
        { label: "Tarifas Promo", action: () => this.handleMenuChoice('TARIFAS_PROMO') },
        { label: "Cotizar Traslado", action: () => this.handleMenuChoice('COTIZAR') }
      ]);
    });
  }

  handleMenuChoice(choice) {
    if (choice === 'SERVICIOS_FLOTA') {
      this.chat.userSend("Servicios y Flota");
      this.tour.showStep({
        tag: "Catálogo Institucional",
        title: "Presentación de Servicios y Flota",
        desc: "El cliente consulta las prestaciones y categorías de vehículos sin requerir tiempo de un operador.",
        metric: "Filtro automático de consultas frecuentes"
      });

      this.chat.botReply("Conocé un poco más sobre nosotros:", 400, () => {
        this.chat.renderQuickReplies([
          { label: "Servicios", action: () => this.showServiciosDetalle() },
          { label: "Nuestra Flota", action: () => this.showFlotaDetalle() }
        ]);
      });
      return;
    }

    if (choice === 'TARIFAS_PROMO') {
      this.chat.userSend("Tarifas Promo");
      this.tour.showStep({
        tag: "Tarifas Fijas",
        title: "Corredores Frecuentes",
        desc: "Respuestas directas con precios de referencia para traslados hacia aeropuertos y terminales.",
        metric: "Transparencia tarifaria automática"
      });

      this.chat.botReply("Conocé nuestros destinos frecuentes con tarifas fijas promocionales, exclusivas para nuestros clientes:", 400, () => {
        this.chat.renderQuickReplies([
          { label: "Aeropuertos", action: () => this.showPromoAeropuertos() },
          { label: "Terminales de Micros", action: () => this.showPromoMicros() },
          { label: "Terminales Fluviales", action: () => this.showPromoFluviales() }
        ]);
      });
      return;
    }

    if (choice === 'COTIZAR') {
      this.iniciarFlujoCotizacion();
    }
  }

  showServiciosDetalle() {
    this.chat.userSend("Servicios");
    const texto = "✈️ *SERVICIOS | TRASLADOS EJECUTIVOS*\n\nBrindamos soluciones de movilidad corporativa y traslados privados con guardia activa las 24 horas, los 365 días del año.\n\n✈️ *Aeropuertos (Ezeiza y Aeroparque):*\nRecepción personalizada en hall de arribos con cartel nominativo o logo de empresa, y monitoreo satelital de vuelos en tiempo real.\n\n🏙️ *City Tours & Jornadas Corporativas:*\nCircuitos turísticos exclusivos y traslados punto a punto para eventos corporativos o delegaciones numerosas.\n\n🌐 *Staff Bilingüe & Calificado:*\nConductores profesionales bilingües y guías de turismo certificados para traslados ejecutivos e internacionales.\n\n🛡️ *Seguridad & Asistencia VIP:*\nMonitoreo y comunicación constante con cada unidad, con posibilidad de asistencia VIP en pista y hall de terminal.";

    this.chat.botReply(texto, 500, () => {
      this.chat.renderQuickReplies([
        { label: "🚗 Cotizar un Traslado", action: () => this.iniciarFlujoCotizacion() },
        { label: "🔙 Volver al Menú", action: () => this.start() }
      ]);
    });
  }

  showFlotaDetalle() {
    this.chat.userSend("Nuestra Flota");
    const texto = "🚗 *NUESTRA FLOTA | TRASLADOS EJECUTIVOS*\n\nUnidades modernas, climatizadas y habilitadas bajo estrictas normas de seguridad para garantizar traslados puntuales y confortables.\n\n• *Categoría Standard* (Hasta 3 pasajeros)\nModelos: Fiat Cronos, Chevrolet Prisma, Renault Logan o similar.\nIdeal para traslados urbanos diarios y conexiones rápidas a aeropuertos.\n\n• *Categoría Monovolumen / Utilitaria* (Capacidad extra)\nModelos: Chevrolet Spin, Peugeot Partner, Renault Kangoo o similar.\nExcelente espacio para valijas grandes, compras o traslados con canil.\n\n• *Categoría Ejecutiva* (Confort superior)\nModelos: Toyota Corolla, Nissan Sentra, Volkswagen Virtus o similar.\nDistinción, espacio interior y confort de marcha para traslados corporativos.\n\n• *Categoría Ejecutiva VIP / Híbrida* (Alta gama)\nModelos: Toyota Corolla Híbrido, Toyota Corolla Cross Híbrido o similar.\nEl estándar más alto en silencio de marcha, tecnología y sustentabilidad.\n\n• *Servicios Grupales & Delegaciones*\nUtilitarios ejecutivos: Hyundai H1, Mercedes-Benz Vito.\nVans corporativas: Mercedes-Benz Sprinter (15 y 19 plazas).\nMedia y gran capacidad: Minibús de 24 plazas y Buses ejecutivos de 45 plazas.\n\n¿Qué unidad se adapta mejor a tu viaje?";

    this.chat.botReply(texto, 500, () => {
      this.chat.renderQuickReplies([
        { label: "🚗 Cotizar un Traslado", action: () => this.iniciarFlujoCotizacion() },
        { label: "🔙 Volver al Menú", action: () => this.start() }
      ]);
    });
  }

  showPromoAeropuertos() {
    this.chat.userSend("Aeropuertos");
    const texto = "✈️ *TARIFAS FIJAS | CONEXIONES AEROPUERTOS*\n\nValores de referencia en unidades Categoría Standard (hasta 3 pasajeros con equipaje de mano).\n\n• *Aeroparque Jorge Newbery (AEP):*\n- Corredor Norte (P. Madero, Centro, Recoleta, Palermo, Belgrano, Núñez): $35.000\n- Resto de CABA:$ 40.000\n\n• *Aeropuerto Internacional Ezeiza (EZE):*\n- Tarifa única desde cualquier punto de CABA: $ 73.000 (+ peajes)\n\n• *Aeropuerto Internacional San Fernando (SADF):*\n- Desde Belgrano / Núñez: $50.000 (+ peajes)\n- Desde Microcentro:$ 68.000 (+ peajes)\n\n📌 *Nota:* Si necesitas que te busquemos en un aeropuerto, consultá por nuestros servicios especiales que incluyen: seguimiento de vuelos y recepción de pasajeros en el hall con cartel identificatorio.";

    this.chat.botReply(texto, 500, () => {
      this.chat.renderQuickReplies([
        { label: "🚗 Cotizar un Traslado", action: () => this.iniciarFlujoCotizacion() },
        { label: "🔙 Volver al Menú", action: () => this.start() }
      ]);
    });
  }

  showPromoMicros() {
    this.chat.userSend("Terminales de Micros");
    const texto = "🚌 *TARIFAS FIJAS | TERMINALES DE ÓMNIBUS*\n\nTraslados urbanos en unidades Categoría Standard (hasta 3 pasajeros con equipaje).\n\n• *Terminal de Retiro:*\n- Desde Microcentro / Centro: $24.000\n- Desde el resto de CABA:$ 45.000\n\n• *Terminal de Liniers:*\n- Desde zonas aledañas (Oeste CABA): $24.000\n- Desde Microcentro, Palermo o Belgrano:$ 45.000 (+ peajes)\n\n• *Terminal Dellepiane:*\n- Desde zonas aledañas (Sur CABA): $24.000\n- Desde Microcentro, Palermo o Belgrano:$ 45.000 (+ peajes)\n\n📌 *Nota:* Tarifa punto a punto directa sin paradas intermedias.";

    this.chat.botReply(texto, 500, () => {
      this.chat.renderQuickReplies([
        { label: "🚗 Cotizar un Traslado", action: () => this.iniciarFlujoCotizacion() },
        { label: "🔙 Volver al Menú", action: () => this.start() }
      ]);
    });
  }

  showPromoFluviales() {
    this.chat.userSend("Terminales Fluviales");
    const texto = "🚢 *TARIFAS FIJAS | PUERTO & CRUCEROS*\n\nConexiones hacia terminales fluviales y de cruceros internacionales (Buquebus, Colonia Express y Terminal de Cruceros Quinquela Martín)\n\n• *Desde Microcentro / Retiro / San Telmo:*\n- Tarifa plana: $24.000\n\n• *Desde el resto de CABA:*\n- Tarifa plana:$ 45.000\n\n📌 *Nota:* Para traslados con gran volumen de valijas, recomendamos consultar por nuestra categoría Monovolumen / Utilitaria.";

    this.chat.botReply(texto, 500, () => {
      this.chat.renderQuickReplies([
        { label: "🚗 Cotizar un Traslado", action: () => this.iniciarFlujoCotizacion() },
        { label: "🔙 Volver al Menú", action: () => this.start() }
      ]);
    });
  }

  iniciarFlujoCotizacion() {
    this.step = 'ASK_ORIGEN';
    this.chat.userSend("Cotizar Traslado");

    this.tour.showStep({
      tag: "Paso 2: Captura Estructurada",
      title: "Recopilación de Variables",
      desc: "El asistente solicita ordenadamente origen, destino, fecha, pasajeros, celular y nombre. Todo lo que el operador necesita sin repreguntar.",
      metric: "100% de datos requeridos validados"
    });

    this.chat.botReply("¡Perfecto! Para cotizar tu traslado en el acto, te voy a pedir unos datos básicos.\n\n📍 Indicanos el origen del traslado (Ej: Av. de los Incas 5449 CABA, Alto Palermo Shopping, San Isidro 1142 Turdera, etc)", 500);
  }

  handleInput(text) {
    const val = text.trim();
    if (!val) return;

    if (this.step === 'ASK_ORIGEN') {
      this.collected.origen = val;
      this.step = 'ASK_DESTINO';
      this.chat.userSend(val);
      this.chat.botReply("🏁 Indicanos ahora el destino de tu viaje (Ej: Aeroparque Jorge Newbery, Sheraton Retiro, Av. Hipólito Yrigoyen 9400 Lanús Este, etc)", 500);
      return;
    }

    if (this.step === 'ASK_DESTINO') {
      this.collected.destino = val;
      this.step = 'ASK_FECHA';
      this.chat.userSend(val);
      this.chat.botReply("🗓️ ¿Para qué fecha y en qué horario precisás el traslado? (Ej: 25/10 a las 14:30 hs o Mañana 08 AM)", 500);
      return;
    }

    if (this.step === 'ASK_FECHA') {
      this.collected.fecha = val;
      this.step = 'ASK_PASAJEROS';
      this.chat.userSend(val);
      this.chat.botReply("👥 ¿Cantidad de pasajeros y equipaje? (Ej: 2 pasajeros y 2 valijas medianas, 1 pasajero sin valijas, etc)", 500);
      return;
    }

    if (this.step === 'ASK_PASAJEROS') {
      this.collected.pasajeros_equipaje = val;
      this.step = 'ASK_WHATSAPP';
      this.chat.userSend(val);
      this.chat.botReply("📱 ¿A qué número de WhatsApp podemos enviarte la cotización? (Ej: 11 2345-6789)", 500);
      return;
    }

    if (this.step === 'ASK_WHATSAPP') {
      this.collected.telefono = val;
      this.step = 'ASK_EMAIL';
      this.chat.userSend(val);
      this.chat.botReply("📧 Indicanos tu mail por favor", 500);
      return;
    }

    if (this.step === 'ASK_EMAIL') {
      this.collected.email = val;
      this.step = 'ASK_NOMBRE';
      this.chat.userSend(val);
      this.chat.botReply("👤 ¿A nombre de quién registramos la solicitud? (Nombre y apellido)", 500);
      return;
    }

    if (this.step === 'ASK_NOMBRE') {
      this.collected.nombre = val;
      this.step = 'FINALIZADO';
      this.chat.userSend(val);

      this.tour.showStep({
        tag: "Paso 3: Disparo y Despacho",
        title: "Ficha Enviada al Operador",
        desc: "Se pausa la atención automática temporalmente. Los datos ingresan directamente al sistema de despacho de la guardia de reservas junto con el enlace al cotizador web.",
        metric: "Presupuesto formal en < 10 segundos"
      });

      const confirmacion = `✅ ¡Solicitud recibida con éxito, ${this.collected.nombre}!\n\n📍 Recorrido: ${this.collected.origen} ➔ ${this.collected.destino}\n🗓️ Fecha y horario: ${this.collected.fecha}\n👥 Pasajeros y equipaje: ${this.collected.pasajeros_equipaje}\n\nEn instantes, un operador de nuestra central de Reservas te enviará la cotización solicitada.\n\n¡Muchas gracias por elegir NOMBRE DE LA EMPRESA! 🚗`;

      this.chat.botReply(confirmacion, 600, () => {
        this.triggerRealMakeWebhook();
      });
    }
  }

  async triggerRealMakeWebhook() {
    const webhookUrl = "https://hook.us2.make.com/zrv1bm3anqobw8u7q89dhqti4sk3bcd8";
    const payload = {
      nombre: this.collected.nombre,
      telefono: this.collected.telefono,
      email: this.collected.email,
      origen: this.collected.origen,
      destino: this.collected.destino,
      fecha_hora: this.collected.fecha,
      pasajeros: this.collected.pasajeros_equipaje,
      source: "pgone-demos-showroom"
    };

    try {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors"
      });
    } catch (e) {
      console.warn("Disparo offline o CORS:", e);
    }

    // Parámetros canónicos leídos por cotizador.html: name, phone, email, service, notes
    const recorridoCompleto = `${this.collected.origen} a ${this.collected.destino}`;
    const notasDetalle = `Fecha/Hora: ${this.collected.fecha} | Pasajeros/Equipaje: ${this.collected.pasajeros_equipaje}`;

    const queryParams = new URLSearchParams({
      name: this.collected.nombre,
      phone: this.collected.telefono,
      email: this.collected.email,
      service: recorridoCompleto,
      notes: notasDetalle
    }).toString();

    const cotizadorUrl = `https://cotizaflow-chi.vercel.app/cotizador.html?${queryParams}`;

    this.chat.renderActionLink("Abrir Cotizador Precargado (Vista Operador)", cotizadorUrl);
  }
}
