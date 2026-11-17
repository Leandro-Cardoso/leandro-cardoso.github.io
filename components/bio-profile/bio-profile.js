import { mountTemplate, loadJSON } from '../../js/loader.js';
import { render as renderEducation } from '../education/education.js';
import { render as renderLanguages } from '../languages/languages.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './components/bio-profile/bio-profile.html', './components/bio-profile/bio-profile.css');

  const bioData = await loadJSON('./data/bio-profile.json');

  // Preenche foto e identidade
  const avatarImg = target.querySelector('#bio-avatar');
  if (avatarImg && bioData.avatar) {
    avatarImg.src = bioData.avatar;
    avatarImg.alt = bioData.name;
  }

  target.querySelector('#bio-name').textContent = bioData.name;
  target.querySelector('#bio-role-title').textContent = bioData.title;
  target.querySelector('#bio-subtitle').textContent = bioData.subtitle;

  // Preenche narrativa de engenharia
  target.querySelector('#bio-heading').textContent = bioData.bio.heading;

  const bioContainer = target.querySelector('#bio-paragraphs');
  bioContainer.innerHTML = '';
  (bioData.bio.paragraphs || []).forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    bioContainer.appendChild(p);
  });

  // Renderiza Formações Acadêmicas e Idiomas dentro do mesmo painel
  await Promise.all([
    renderEducation(target.querySelector('#bio-education-slot')),
    renderLanguages(target.querySelector('#bio-languages-slot'))
  ]);
}
