/* ══════════════════════════════════════════════════════════
   SIMPOR, Dogs data
   Available dogs (for-sale) and Sold dogs
   Consumed by main.js to render breed showcase, sold grid,
   world map country list, and dog detail modal.
   ══════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* ─── AVAILABLE DOGS (for sale) ─── */
  window.SIMPOR_DOGS = [
    /* GERMAN SHEPHERDS */
    {
      id: 'best-von-simpor',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Best von Simpor',
      sex: 'Male',
      age: '3 yrs',
      purpose: 'Family Protection',
      price: 'On Request',
      cover: 'german shepard/IMG-20230403-WA0000.jpg',
      gallery: [
        'german shepard/IMG-20230403-WA0000.jpg',
        'kucici/maze.jpeg',
        'kucici/g3.jpeg'
      ],
      desc: 'A calm, confident male from proven European working lines. Fully proofed for household life, children, guests, elevators, restaurants, with the ability to switch to full protection on command.',
      specs: {
        Pedigree: 'FCI · SV registered',
        Bloodline: 'European Working Line',
        Titles: 'BH · IGP prep',
        Health: 'HD-A · ED-0',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    },
    {
      id: 'romeo-von-simpor',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Romeo von Simpor',
      sex: 'Male',
      age: '3 yrs',
      purpose: 'Family Protection',
      price: 'On Request',
      cover: 'kucici/Romeo von Simpor.jpg',
      gallery: [
        'kucici/Romeo von Simpor.jpg',
        'kucici/profi.jpg',
        'kucici/pup9.jpg'
      ],
      desc: 'A powerful, socially stable male with excellent nerves and clear head. Ideal companion for a family that also values reliable personal protection.',
      specs: {
        Pedigree: 'FCI · SV registered',
        Bloodline: 'Simpor Working Line',
        Titles: 'BH',
        Health: 'HD-A · ED-0',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    },
    {
      id: 'kostas-timohaus',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Kostas Timo Haus',
      sex: 'Male',
      age: '2.5 yrs',
      purpose: 'Executive Protection',
      price: 'On Request',
      cover: 'german shepard/eksn3.jpg',
      gallery: [
        'german shepard/eksn3.jpg',
        'kucici/g12.jpg',
        'kucici/trening2.jpeg'
      ],
      desc: 'A dark, imposing male built for executive-level personal protection. High drive, obedient, socially stable in high-pressure public environments.',
      specs: {
        Pedigree: 'FCI · SV registered',
        Bloodline: 'Timo Haus lines',
        Titles: 'IGP 1',
        Health: 'HD-A · ED-0',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    },

    /* MALINOIS */
    {
      id: 'ares-malinois',
      breed: 'malinois',
      breedLabel: 'Belgian Malinois',
      name: 'Ares · Malinois',
      sex: 'Male',
      age: '2 yrs',
      purpose: 'K9 · Sport · Personal Protection',
      price: 'On Request',
      cover: 'Malinoa/50.jpg',
      gallery: [
        'Malinoa/50.jpg',
        'kucici/g16.jpeg',
        'kucici/s3.jpg'
      ],
      desc: 'High-drive Belgian Malinois built for serious sport, K9 service, or elite personal protection. Extremely handler-focused with world-class biting technique, for experienced homes only.',
      specs: {
        Pedigree: 'FCI registered',
        Bloodline: 'Belgian Working Line',
        Titles: 'IGP prep · KNPV foundation',
        Health: 'HD-A · ED-0',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    },

    /* DOBERMAN */
    {
      id: 'zeus-simpor-dobermann',
      breed: 'doberman',
      breedLabel: 'Doberman',
      name: 'Zeus · European Dobermann',
      sex: 'Male',
      age: '2.5 yrs',
      purpose: 'Personal Protection · Family',
      price: 'On Request',
      cover: 'doberman/nteam1.jpeg',
      gallery: [
        'doberman/nteam1.jpeg'
      ],
      desc: 'A clean, athletic European Dobermann male with correct temperament, alert and clear-headed with strangers, deeply bonded with his handler, easy in the home. IDC-line breeding, full working titles in progress.',
      specs: {
        Pedigree: 'FCI · IDC lines',
        Bloodline: 'European Working Dobermann',
        Titles: 'BH · IGP 1 prep',
        Health: 'HD-A · ED-0 · Cardio clear · vWD clear',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    },

    /* ROTTWEILER */
    {
      id: 'thor-simpor-rott',
      breed: 'rottweiler',
      breedLabel: 'Rottweiler',
      name: 'Thor · Serbian Rott',
      sex: 'Male',
      age: '3 yrs',
      purpose: 'Property Protection',
      price: 'On Request',
      cover: 'rotweiler/iStock-1497955407.webp',
      gallery: [
        'rotweiler/iStock-1497955407.webp'
      ],
      desc: 'A confident, well-boned Rottweiler male from German working stock. Naturally protective of home and family, socially neutral to strangers, a serious property protection dog with a stable off-switch.',
      specs: {
        Pedigree: 'FCI · ADRK derived',
        Bloodline: 'German Working Line',
        Titles: 'BH · IPO-ZTP prep',
        Health: 'HD-A · ED-0 · Heart clear',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    },

    /* K9, all other working breeds (Labrador, Pointer, etc.) */
    {
      id: 'atlas-working-lab',
      breed: 'k9',
      breedLabel: 'Labrador · K9',
      name: 'Atlas · Working Lab',
      sex: 'Male',
      age: '2 yrs',
      purpose: 'Detection · Family',
      price: 'On Request',
      cover: 'Labrador/Labrador_Retriever_1200x800.jpg',
      gallery: [
        'Labrador/Labrador_Retriever_1200x800.jpg'
      ],
      desc: 'From a British-line working Labrador program. Exceptional nose, endurance, and unshakable friendliness with children, a family dog that can also work in detection and search roles.',
      specs: {
        Pedigree: 'FCI registered',
        Bloodline: 'UK Working Line',
        Titles: 'Obedience trained · Detection foundation',
        Health: 'HD-A · ED-0 · Eyes clear',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    },
    {
      id: 'nero-field-pointer',
      breed: 'k9',
      breedLabel: 'Pointer · K9',
      name: 'Nero · Field Pointer',
      sex: 'Male',
      age: '2 yrs',
      purpose: 'Hunting · Field Trial',
      price: 'On Request',
      cover: 'pointer/german-shorthaired-pointer-standing-in-grassy-field-112124.jpg',
      gallery: [
        'pointer/german-shorthaired-pointer-standing-in-grassy-field-112124.jpg'
      ],
      desc: 'From a proven field-trial pointer line, outstanding scenting ability, wide range, and rock-solid point. Suitable for serious hunters and field-trial handlers alike.',
      specs: {
        Pedigree: 'FCI registered',
        Bloodline: 'European Field Trial',
        Titles: 'Field trained',
        Health: 'HD-A · ED-0',
        Vaccinations: 'Full core, chipped',
        Availability: 'Available for placement'
      }
    }
  ];

  /* ─── SOLD DOGS (recently placed) ─── */
  window.SIMPOR_SOLD = [
    {
      id: 'sold-madrid',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Madrid von Simpor',
      sex: 'Male',
      age: '3 yrs',
      purpose: 'Executive Protection',
      placed: 'Placed 2025 · Germany',
      cover: 'images/Madrid%20von%20Simpor/IMG-20230403-WA0000.jpg',
      gallery: [
        'images/Madrid%20von%20Simpor/IMG-20230403-WA0000.jpg',
        'images/eksn5.jpeg'
      ],
      desc: 'Placed with a private security professional in Munich. Handles crowded public spaces, private residence, and executive travel duties.',
      specs: {
        Placed: '2025',
        Country: 'Germany',
        Handler: 'Private security professional',
        Pedigree: 'FCI · SV registered'
      }
    },
    {
      id: 'sold-paris',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Paris von Simpor',
      sex: 'Male',
      age: '2.5 yrs',
      purpose: 'Family Protection',
      placed: 'Placed 2025 · Slovakia',
      cover: 'images/PARIS VON Simpor/IMG-20230401-WA0043.jpg',
      gallery: [
        'images/PARIS VON Simpor/IMG-20230401-WA0043.jpg',
        'images/eksn1.jpeg'
      ],
      desc: 'Placed with a family in Bratislava, full off-duty stability around children and guests, sharp on command.',
      specs: {
        Placed: '2025',
        Country: 'Slovakia',
        Handler: 'Family with children',
        Pedigree: 'FCI · SV registered'
      }
    },
    {
      id: 'sold-onur',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Onur vom Haus Biffo',
      sex: 'Male',
      age: '3 yrs',
      purpose: 'Personal Protection',
      placed: 'Placed 2024 · South Korea',
      cover: 'images/Onur vom Haus Biffo/nova.jpeg',
      gallery: [
        'images/Onur vom Haus Biffo/nova.jpeg',
        'images/eksn3.jpg'
      ],
      desc: 'Placed with a private client in Seoul. Traveled with quarantine paperwork handled entirely by Simpor.',
      specs: {
        Placed: '2024',
        Country: 'South Korea',
        Handler: 'Private client',
        Pedigree: 'FCI · SV registered'
      }
    },
    {
      id: 'sold-jehu',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Jehu Primo Grande',
      sex: 'Male',
      age: '2 yrs',
      purpose: 'Executive Protection',
      placed: 'Placed 2025 · UAE',
      cover: 'images/Jehu Primo Grande/WhatsApp Image 2026-04-11 at 21.17.08.jpeg',
      gallery: [
        'images/Jehu Primo Grande/WhatsApp Image 2026-04-11 at 21.17.08.jpeg',
        'images/eksn4.jpeg'
      ],
      desc: 'Placed with a client in Dubai. Full heat acclimation and public-environment proofing prior to departure.',
      specs: {
        Placed: '2025',
        Country: 'United Arab Emirates',
        Handler: 'Executive client',
        Pedigree: 'FCI · SV registered'
      }
    },
    {
      id: 'sold-yankee',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Yankee vom Feuermelder',
      sex: 'Male',
      age: '3 yrs',
      purpose: 'Family Protection',
      placed: 'Placed 2024 · Argentina',
      cover: 'images/Yankee vom Feurmelder/WhatsApp Image 2026-04-11 at 21.19.33.jpeg',
      gallery: [
        'images/Yankee vom Feurmelder/WhatsApp Image 2026-04-11 at 21.19.33.jpeg',
        'kucici/n2.jpeg'
      ],
      desc: 'Placed with a family in Buenos Aires. Complete pedigree and health file transferred with the dog.',
      specs: {
        Placed: '2024',
        Country: 'Argentina',
        Handler: 'Family estate',
        Pedigree: 'FCI · SV registered'
      }
    },
    {
      id: 'sold-sport',
      breed: 'gsd',
      breedLabel: 'German Shepherd',
      name: 'Von Simpor · Sport',
      sex: 'Male',
      age: '2 yrs',
      purpose: 'Sport · IGP',
      placed: 'Placed 2024 · Austria',
      cover: 'images/Sport/n1.jpeg',
      gallery: [
        'images/Sport/n1.jpeg',
        'images/Sport/n2.jpeg',
        'images/Sport/n3.jpeg',
        'images/Sport/n4.jpeg'
      ],
      desc: 'Placed with an IGP competitor in Vienna, actively competing on regional and national level.',
      specs: {
        Placed: '2024',
        Country: 'Austria',
        Handler: 'IGP competitor',
        Pedigree: 'FCI · SV registered'
      }
    }
  ];

  /* ─── COUNTRIES SUMMARY (for the map tiles) ─── */
  window.SIMPOR_COUNTRIES = [
    { name: 'Germany',              dogs: 12, flag: '🇩🇪' },
    { name: 'United States',        dogs:  8, flag: '🇺🇸' },
    { name: 'United Arab Emirates', dogs:  6, flag: '🇦🇪' },
    { name: 'Saudi Arabia',         dogs:  5, flag: '🇸🇦' },
    { name: 'Slovakia',             dogs:  5, flag: '🇸🇰' },
    { name: 'Austria',              dogs:  4, flag: '🇦🇹' },
    { name: 'Argentina',            dogs:  4, flag: '🇦🇷' },
    { name: 'South Korea',          dogs:  3, flag: '🇰🇷' },
    { name: 'Switzerland',          dogs:  3, flag: '🇨🇭' },
    { name: 'Australia',            dogs:  3, flag: '🇦🇺' },
    { name: 'Japan',                dogs:  2, flag: '🇯🇵' }
  ];
})();
