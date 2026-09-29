import { TourEngine } from './tour-engine.js';
import { CotizaFlowVertical } from './verticals/cotizaflow.js';
import { ServiciosVertical } from './verticals/servicios.js';
import { TurnosVertical } from './verticals/turnos.js';

class ChatEngine {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.avatarEl = document.getElementById('bot-avatar');
    this.nameEl = document.getElementById('bot-name');
    this.statusEl = document.getElementById('bot-status');
  }

  clear() {
    this.messagesContainer.innerHTML = '';
  }

  setHeader({ avatar, name, status }) {
    if (this.avatarEl) this.avatarEl.textContent = avatar;
    if (this.nameEl) this.nameEl.textContent = name;
    if (this.statusEl) this.statusEl.textContent = status;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  userSend(text) {
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble msg-out p-3 rounded-2xl text-xs sm:text-sm self-end shadow-sm';
    bubble.textContent = text;
    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  botReply(text, delay = 400, callback = null) {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'msg-bubble msg-in p-3 rounded-2xl flex items-center gap-1.5 self-start shadow-sm';
    typingIndicator.innerHTML = '<div class="dot-flashing"></div>';
    this.messagesContainer.appendChild(typingIndicator);
    this.scrollToBottom();

    setTimeout(() => {
      typingIndicator.remove();
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble msg-in p-3 rounded-2xl text-xs sm:text-sm self-start shadow-sm whitespace-pre-line leading-relaxed';
      bubble.innerHTML = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
      this.messagesContainer.appendChild(bubble);
      this.scrollToBottom();
      if (callback) callback();
    }, delay);
  }

  renderQuickReplies(buttons) {
    const container = document.createElement('div');
    container.className = 'flex flex-col gap-2 my-2 w-full max-w-[85%] self-start';

    buttons.forEach(btn => {
      const b = document.createElement('button');
      b.className = 'quick-reply-btn py-2 px-3 rounded-xl text-xs font-semibold text-left shadow-sm border border-emerald-500/40 bg-[#202c33] text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all';
      b.textContent = btn.label;
      b.onclick = () => {
        container.remove();
        btn.action();
      };
      container.appendChild(b);
    });

    this.messagesContainer.appendChild(container);
    this.scrollToBottom();
  }

  renderActionLink(label, url) {
    const container = document.createElement('div');
    container.className = 'my-2 w-full max-w-[85%] self-start';

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wide shadow-md transition-all';
    link.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square mr-1.5"></i> ${label}`;

    container.appendChild(link);
    this.messagesContainer.appendChild(container);
    this.scrollToBottom();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tour = new TourEngine();
  const chat = new ChatEngine();

  const verticals = {
    cotizaflow: new CotizaFlowVertical(chat, tour),
    servicios: new ServiciosVertical(chat, tour),
    turnos: new TurnosVertical(chat, tour)
  };

  const tabs = {
    cotizaflow: document.getElementById('btn-cotizaflow'),
    servicios: document.getElementById('btn-servicios'),
    turnos: document.getElementById('btn-turnos')
  };

  const navTabsContainer = document.getElementById('nav-tabs');
  const brandTitle = document.getElementById('brand-title');
  const brandSubtitle = document.getElementById('brand-subtitle');

  function switchTab(selectedKey) {
    Object.keys(tabs).forEach(key => {
      if (tabs[key]) {
        if (key === selectedKey) {
          tabs[key].className = 'nav-tab active px-3 py-2 rounded-lg transition-all text-white bg-emerald-600 flex items-center gap-2';
        } else {
          tabs[key].className = 'nav-tab px-3 py-2 rounded-lg transition-all text-slate-400 hover:text-white flex items-center gap-2';
        }
      }
    });

    activeVertical = verticals[selectedKey];
    activeVertical.start();
  }

  // Leer parámetro URL para aislamiento
  const urlParams = new URLSearchParams(window.location.search);
  const paramVertical = urlParams.get('vertical');

  let activeVertical = verticals.cotizaflow;

  if (paramVertical && verticals[paramVertical]) {
    // Si viene aislado por link: Ocultamos el selector de pestañas
    if (navTabsContainer) navTabsContainer.style.display = 'none';

    if (paramVertical === 'cotizaflow') {
      brandTitle.textContent = "CotizaFlow";
      brandSubtitle.textContent = "Demo Comercial Interactiva";
    } else if (paramVertical === 'servicios') {
      brandTitle.textContent = "Maestranza";
      brandSubtitle.textContent = "Demo de Atención y Presupuestos";
    } else if (paramVertical === 'turnos') {
      brandTitle.textContent = "Velvet Agenda";
      brandSubtitle.textContent = "Demo de Agendamiento Ágil";
    }

    activeVertical = verticals[paramVertical];
    activeVertical.start();
  } else {
    // Modo Showroom General
    activeVertical.start();

    if (tabs.cotizaflow) tabs.cotizaflow.addEventListener('click', () => switchTab('cotizaflow'));
    if (tabs.servicios) tabs.servicios.addEventListener('click', () => switchTab('servicios'));
    if (tabs.turnos) tabs.turnos.addEventListener('click', () => switchTab('turnos'));
  }

  // Manejo del Input y Envío
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  function handleSend() {
    const val = userInput.value.trim();
    if (!val) return;
    userInput.value = '';
    activeVertical.handleInput(val);
  }

  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  const backBtn = document.getElementById('chat-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      activeVertical.start();
    });
  }
});
