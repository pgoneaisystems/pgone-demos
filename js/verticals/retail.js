export class RetailVertical {
  constructor(chatEngine, tourEngine) {
    this.chat = chatEngine;
    this.tour = tourEngine;
  }

  start() {
    this.chat.clear();
    this.chat.setHeader({
      avatar: 'RP',
      name: 'Showroom Digital - Retail Pass',
      status: 'en línea (Catálogo Vivo)'
    });

    this.tour.showStep({
      tag: "Paso 1: Catálogo Automatizado",
      title: "Consulta de Stock en Tiempo Real",
      desc: "El cliente consulta disponibilidad sin intermediarios y reserva unidades exclusivas antes de ir al local.",
      metric: "Conversión de chat a visita física"
    });

    this.chat.botReply("¡Hola! Te damos la bienvenida a nuestro Showroom exclusivo. 🛍️", 400, () => {
      this.chat.botReply("¿Qué artículo te gustaría consultar o reservar para retiro en tienda?", 500, () => {
        this.chat.renderQuickReplies([
          { label: "👟 Sneakers Urban Pro", action: () => this.reservarArticulo('Sneakers Urban Pro', '$ 89.000') },
          { label: "🧥 Parka Impermeable", action: () => this.reservarArticulo('Parka Impermeable', '$ 115.000') }
        ]);
      });
    });
  }

  reservarArticulo(producto, precio) {
    this.chat.userSend(`Consultar ${producto}`);

    this.tour.showStep({
      tag: "Paso 2: Emisión Determinística",
      title: "Pase Digital de Retiro",
      desc: "El sistema bloquea la unidad y genera una credencial única con código alfanumérico para validar en mostrador.",
      metric: "Cero overbooking de stock"
    });

    const passCode = 'PAS-' + Math.floor(100000 + Math.random() * 900000);

    this.chat.botReply(`¡Tenemos stock disponible de *${producto}*! (${precio})`, 500, () => {
      this.chat.botReply(
        `🎟️ *PASE DIGITAL DE RETIRO GENERADO*\n\nCódigo: *${passCode}*\nEstado: Confirmado (48hs de validez)\nSucursal: Showroom Palermo Soho\n\nPresentá este código en caja para acceder al retiro inmediato de tu unidad.`,
        700
      );
    });
  }

  handleInput(text) {
    if (!text.trim()) return;
    this.chat.userSend(text);
    this.chat.botReply("Por favor utilizá los botones interactivos del catálogo para reservar tu pase.", 400);
  }
}
