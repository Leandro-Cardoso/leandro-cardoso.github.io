import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './views/contacts/contacts.html', './views/contacts/contacts.css');

  const [data, iconsData] = await Promise.all([
    loadJSON('./data/contacts.json'),
    loadJSON('./data/icons.json')
  ]);

  const contactIcons = iconsData.contacts || {};

  target.querySelector('#contacts-title').textContent = data.title;
  target.querySelector('#contacts-subtitle').textContent = data.subtitle;

  if (data.location) {
    const locBadge = target.querySelector('#contacts-location-badge');
    locBadge.textContent = `📍 ${data.location}`;
    locBadge.style.display = 'inline-flex';
  }

  const channelsList = target.querySelector('#contacts-channels-list');
  channelsList.innerHTML = '';

  // 1. E-mail profissional
  if (data.email) {
    channelsList.appendChild(createChannelElement({
      name: 'E-mail Profissional',
      description: data.email,
      svg: contactIcons.email || '',
      url: `mailto:${data.email}`,
      actionText: 'Enviar E-mail ↗'
    }));
  }

  // 2. Telefone principal
  if (data.phone) {
    channelsList.appendChild(createChannelElement({
      name: 'Telefone Principal',
      description: data.phone,
      svg: contactIcons.phone || '',
      url: `tel:${data.phone.replace(/\D/g, '')}`,
      actionText: 'Ligar ↗'
    }));
  }

  // 3. Redes sociais do JSON (GitHub, LinkedIn, WhatsApp)
  if (Array.isArray(data.socials)) {
    data.socials.forEach(s => {
      let iconKey = 'globe';
      const nameLower = (s.name || '').toLowerCase();

      if (nameLower.includes('github')) iconKey = 'github';
      else if (nameLower.includes('linkedin')) iconKey = 'linkedin';
      else if (nameLower.includes('whatsapp')) iconKey = 'whatsapp';

      channelsList.appendChild(createChannelElement({
        name: s.name,
        description: s.description || 'Acessar canal',
        svg: contactIcons[iconKey] || contactIcons.globe || '',
        url: s.url,
        actionText: 'Abrir ↗'
      }));
    });
  }

  // 4. Mapa com marcador da localização
  const mapLocation = data.location || 'Saquarema, RJ, Brasil';
  const mapCard = target.querySelector('#contacts-map-card');
  const mapIframe = target.querySelector('#contacts-map-iframe');
  const mapLabel = target.querySelector('#contacts-map-label');

  if (mapCard && mapIframe) {
    mapLabel.textContent = `📍 ${mapLocation}`;
    mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    mapCard.style.display = 'flex';
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
