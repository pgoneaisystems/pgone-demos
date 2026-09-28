export class ServiciosVertical {
  constructor(chatEngine, tourEngine) {
    this.chat = chatEngine;
    this.tour = tourEngine;
    this.step = 'INIT';
    this.collected = {
      especialidad: '',
      zona: '',
      urgencia: ''
    };
  }

  start() {
    this.step = 'INIT';
    this.chat.clear();
    this.chat.setHeader({
      avatar: 'SH',
      name: 'Servicios Express 24hs',
      status: 'en línea (Guardia)'
    });

    this.tour.showStep({
      tag: "Paso 1: Triaje Automático",
      title: "Clasificación de Emergencias",
      desc: "El bot clasifica el oficio y valida si se trata de una urgencia 24hs o un turno programado.",
      metric: "Triaje automático en <5 segundos"
    });

    this.chat.botReply("¡Hola! Bienvenido al centro de atención técnica y emergencias del hogar. 🔧", 400, () => {
      this.chat.botReply("¿Qué tipo de servicio técnico estás necesitando?", 500, () => {
        this.chat.renderQuickReplies([
          { label: "⚡ Electricidad", action: () => this.selectEspecialidad('Electricidad') },
          { label: "💧 Plomería / Gas", action: () => this.selectEspecialidad('Plomería / Gas') },
          { label: "🔑 Cerrajería 24hs", action: () => this.selectEspecialidad('Cerrajería') }
        ]);
      });
    });
  }

  selectEspecialidad(esp) {
    this.collected.especialidad = esp;
    this.chat.userSend(esp);

    this.tour.showStep({
      tag: "Paso 2: Segmentación Geográfica",
      title: "Validación de Cobertura",
      desc: "Verifica que el pedido esté dentro del radio operativo de la guardia antes de comprometer recursos.",
      metric: "0 visitas fuera de zona"
    });

    this.chat.botReply(`Excelente. Para enviarte un especialista en ${esp}, indicame tu zona de residencia:`, 500, () => {
      this.chat.renderQuickReplies([
        { label: "CABA (Centro/Norte)", action: () => this.selectZona('CABA') },
        { label: "GBA Sur", action: () => this.selectZona('GBA Sur') },
        { label: "GBA Norte", action: () => this.selectZona('GBA Norte') }
      ]);
    });
  }

  selectZona(zona) {
    this.collected.zona = zona;
    this.chat.userSend(zona);

    this.tour.showStep({
      tag: "Paso 3: Nivel de Prioridad",
      title: "Despacho Inmediato vs Turno",
      desc: "Calcula el valor base de la visita técnica según el nivel de urgencia del cliente.",
      metric: "Tarifas de guardia transparentes"
    });

    this.chat.botReply("¿Requerís una guardia de urgencia inmediata o coordinar un turno programado?", 500, () => {
      this.chat.renderQuickReplies([
        { label: "🚨 Urgencia Inmediata (Hoy)", action: () => this.confirmarOrden('Urgencia 24hs', '$ 18.000') },
        { label: "📅 Turno Programado", action: () => this.confirmarOrden('Programado', '$ 12.000') }
      ]);
    });
  }

  confirmarOrden(tipo, arancel) {
    this.collected.urgencia = tipo;
    this.chat.userSend(tipo);

    this.tour.showStep({
      tag: "Paso 4: Notificación a Guardia",
      title: "Orden Despachada",
      desc: "Se genera el número de solicitud y se alerta al técnico de guardia con los detalles exactos.",
      metric: "Asignación de técnico inmediata"
    });

    this.chat.botReply(
      `✅ *Solicitud de Visita Técnica Registrada*\n\n📋 *Detalles del Servicio:*\n• Rubro: ${this.collected.especialidad}\n• Zona: ${this.collected.zona}\n• Modalidad: ${tipo}\n• Arancel base visita: ${arancel}\n\nUn técnico de guardia ha sido alertado para coordinar el arribo.`,
      700
    );
  }

  handleInput(text) {
    if (!text.trim()) return;
    this.chat.userSend(text);
    this.chat.botReply("Por favor seleccioná una de las opciones disponibles en pantalla para agilizar la asignación técnica.", 400);
  }
}
