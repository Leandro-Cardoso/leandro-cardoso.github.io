import { mountTemplate } from '../../js/loader.js';
import { render as renderBioProfile } from '../../components/bio-profile/bio-profile.js';
import { render as renderExpertise } from '../../components/expertise/expertise.js';
import { render as renderTechnologies } from '../../components/technologies/technologies.js';
import { render as renderCertifications } from '../../components/certifications/certifications.js';
import { render as renderSoftSkills } from '../../components/soft-skills/soft-skills.js';
import { render as renderExperiences } from '../../components/experiences/experiences.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './views/about/about.html', './views/about/about.css');

  await Promise.all([
    renderBioProfile(target.querySelector('#about-bio-profile-slot')),
    renderExpertise(target.querySelector('#about-expertise-slot')),
    renderTechnologies(target.querySelector('#about-technologies-slot')),
    renderCertifications(target.querySelector('#about-certifications-slot')),
    renderSoftSkills(target.querySelector('#about-soft-skills-slot')),
    renderExperiences(target.querySelector('#about-experiences-slot'))
  ]);
}
