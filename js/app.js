import { TourEngine } from './tour-engine.js';
import { CotizaFlowVertical } from './verticals/cotizaflow.js';
import { ServiciosVertical } from './verticals/servicios.js';
import { RetailVertical } from './verticals/retail.js';

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

  botReply(text, delay = 500, callback = null) {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'msg-bubble msg-in p-3 rounded-2xl flex items-center gap-1.5 self-start shadow-sm';
    typingIndicator.innerHTML = '<div class="dot-flashing"></div>';
    this.messagesContainer.appendChild(typingIndicator);
    this.scrollToBottom();

    setTimeout(() => {
      typingIndicator.remove();
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble msg-in p-3 rounded-2xl text-xs sm:text-sm self-start shadow-sm whitespace-pre-line';
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
      b.className = 'quick-reply-btn py-2 px-3 rounded-xl text-xs font-semibold text-left shadow-sm';
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
    link.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square mr-1"></i> ${label}`;

    container.appendChild(link);
    this.messagesContainer.appendChild(container);
    this.scrollToBottom();
  }
}

// Inicialización de la Aplicación
document.addEventListener('DOMContentLoaded', () => {
  const tour = new TourEngine();
  const chat = new ChatEngine();

  const verticals = {
    cotizaflow: new CotizaFlowVertical(chat, tour),
    servicios: new ServiciosVertical(chat, tour),
    retail: new RetailVertical(chat, tour)
  };

  let activeVertical = verticals.cotizaflow;
  activeVertical.start();

  // Selector de Tabs
  const tabs = {
    cotizaflow: document.getElementById('btn-cotizaflow'),
    servicios: document.getElementById('btn-servicios'),
    retail: document.getElementById('btn-retail')
  };

  function switchTab(selectedKey) {
    Object.keys(tabs).forEach(key => {
      if (key === selectedKey) {
        tabs[key].className = 'nav-tab active px-3 py-2 rounded-lg transition-all text-white bg-emerald-600 flex items-center gap-2';
      } else {
        tabs[key].className = 'nav-tab px-3 py-2 rounded-lg transition-all text-slate-400 hover:text-white flex items-center gap-2';
      }
    });

    activeVertical = verticals[selectedKey];
    activeVertical.start();
  }

  tabs.cotizaflow.addEventListener('click', () => switchTab('cotizaflow'));
  tabs.servicios.addEventListener('click', () => switchTab('servicios'));
  tabs.retail.addEventListener('click', () => switchTab('retail'));

  // Manejo de Input de texto
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
});
