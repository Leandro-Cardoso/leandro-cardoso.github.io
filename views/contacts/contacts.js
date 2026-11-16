import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './views/contacts/contacts.html', './views/contacts/contacts.css');

  const data = await loadJSON('./data/contacts.json');

  target.querySelector('#contacts-title').textContent = data.title;
  target.querySelector('#contacts-subtitle').textContent = data.subtitle;

  if (data.location) {
    const locBadge = target.querySelector('#contacts-location-badge');
    locBadge.textContent = `📍 ${data.location}`;
    locBadge.style.display = 'inline-flex';
  }

  const channelsList = target.querySelector('#contacts-channels-list');
  channelsList.innerHTML = '';

  // 1. Renderiza o E-mail profissional
  if (data.email) {
    channelsList.appendChild(createChannelElement({
      name: 'E-mail Profissional',
      description: data.email,
      svg: getSvgIcon('email'),
      url: `mailto:${data.email}`,
      actionText: 'Enviar E-mail ↗'
    }));
  }

  // 2. Renderiza o Telefone
  if (data.phone) {
    channelsList.appendChild(createChannelElement({
      name: 'Telefone Principal',
      description: data.phone,
      svg: getSvgIcon('phone'),
      url: `tel:${data.phone.replace(/\D/g, '')}`,
      actionText: 'Ligar ↗'
    }));
  }

  // 3. Renderiza as redes sociais do JSON (GitHub, LinkedIn, WhatsApp)
  if (data.socials && Array.isArray(data.socials)) {
    data.socials.forEach(s => {
      let svgType = 'globe';
      const nameLower = (s.name || '').toLowerCase();
      
      if (nameLower.includes('github')) svgType = 'github';
      else if (nameLower.includes('linkedin')) svgType = 'linkedin';
      else if (nameLower.includes('whatsapp')) svgType = 'whatsapp';

      channelsList.appendChild(createChannelElement({
        name: s.name,
        description: s.description || 'Acessar canal',
        svg: getSvgIcon(svgType),
        url: s.url,
        actionText: 'Visitar ↗'
      }));
    });
  }
}

function createChannelElement({ name, description, svg, url, actionText }) {
  const a = document.createElement('a');
  a.className = 'contact-channel-btn';
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';

  a.innerHTML = `
    <div class="channel-info">
      <div class="channel-icon-box">${svg}</div>
      <div class="channel-text">
        <span class="channel-name">${name}</span>
        <span class="channel-desc">${description}</span>
      </div>
    </div>
    <span class="channel-action">${actionText}</span>
  `;

  return a;
}

function getSvgIcon(type) {
  const icons = {
    github: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    
    linkedin: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    
    whatsapp: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    
    email: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    
    phone: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    
    globe: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
  };

  return icons[type] || icons.globe;
}
