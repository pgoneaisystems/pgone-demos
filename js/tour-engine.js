export class TourEngine {
  constructor() {
    this.enabled = true;
    this.currentStep = 0;

    this.dom = {
      tag: document.getElementById('tour-step-tag'),
      title: document.getElementById('tour-title'),
      desc: document.getElementById('tour-desc'),
      metric: document.getElementById('tour-metric-text'),
      toggleBtn: document.getElementById('tour-toggle'),
      toggleDot: document.getElementById('tour-toggle-dot'),
      panel: document.getElementById('tour-panel')
    };

    this.initToggle();
  }

  initToggle() {
    this.dom.toggleBtn.addEventListener('click', () => {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.dom.toggleBtn.classList.remove('bg-slate-700');
        this.dom.toggleBtn.classList.add('bg-emerald-600');
        this.dom.toggleDot.classList.add('translate-x-6');
        this.dom.panel.classList.remove('opacity-40');
      } else {
        this.dom.toggleBtn.classList.add('bg-slate-700');
        this.dom.toggleBtn.classList.remove('bg-emerald-600');
        this.dom.toggleDot.classList.remove('translate-x-6');
        this.dom.panel.classList.add('opacity-40');
      }
    });
  }

  showStep({ tag = "Paso", title, desc, metric }) {
    if (!this.enabled) return;

    if (this.dom.tag) this.dom.tag.textContent = tag;
    if (this.dom.title) this.dom.title.textContent = title;
    if (this.dom.desc) this.dom.desc.textContent = desc;
    if (this.dom.metric && metric) this.dom.metric.textContent = metric;
  }
}
