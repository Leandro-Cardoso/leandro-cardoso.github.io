import { mountTemplate, loadJSON } from '../../js/loader.js';
import { render as renderExpertise } from '../../components/expertise/expertise.js';
import { render as renderTechnologies } from '../../components/technologies/technologies.js';
import { render as renderCertifications } from '../../components/certifications/certifications.js';
import { render as renderSoftSkills } from '../../components/soft-skills/soft-skills.js';
import { render as renderExperiences } from '../../components/experiences/experiences.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './views/about/about.html', './views/about/about.css');

  const aboutData = await loadJSON('./data/about.json');

  const avatarImg = target.querySelector('#about-avatar');
  if (avatarImg && aboutData.avatar) {
    avatarImg.src = aboutData.avatar;
    avatarImg.alt = aboutData.name;
  }

  target.querySelector('#about-name').textContent = aboutData.name;
  target.querySelector('#about-role-title').textContent = aboutData.title;
  target.querySelector('#about-subtitle').textContent = aboutData.subtitle;

  target.querySelector('#bio-heading').textContent = aboutData.bio.heading;
  
  const bioContainer = target.querySelector('#bio-paragraphs');
  bioContainer.innerHTML = '';
  aboutData.bio.paragraphs.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    bioContainer.appendChild(p);
  });

  await Promise.all([
    renderExpertise(target.querySelector('#about-expertise-slot')),
    renderTechnologies(target.querySelector('#about-technologies-slot')),
    renderCertifications(target.querySelector('#about-certifications-slot')),
    renderSoftSkills(target.querySelector('#about-soft-skills-slot')),
    renderExperiences(target.querySelector('#about-experiences-slot'))
  ]);
}
