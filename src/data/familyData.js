// Mock data for the family tree demo — modeled on "The Jameel Family" draft chart.
// Structure: each person may have a `spouse` and a `children` array.
// `generation` mirrors the "Family Business Generation N" bands in the source chart.

let uid = 0;
const nextId = () => `p${++uid}`;

const person = (data) => ({
  id: nextId(),
  fullName: null,
  born: null,
  died: null,
  gender: null,
  hasBio: false,
  unverified: false,
  note: null,
  businesses: [],
  children: [],
  spouse: null,
  ...data,
});

// ---- Generation 4 (great-grandchildren) ----

const abirsKids = [
  person({ name: "Rania Tawfeek", born: 1994, gender: "f" }),
  person({ name: "Rasha Tawfeek", born: 1996, gender: "f" }),
  person({ name: "Randa Tawfeek", born: 1999, gender: "f" }),
];

const ghadahsKids = [
  person({ name: "Seifeldin Eladawy", born: 1997, gender: "m" }),
  person({ name: "Farouk Eladawy", born: 2000, gender: "m" }),
  person({ name: "Shahed Eladawy", born: 2005, gender: "f" }),
  person({ name: "Yasmin Eladawy", born: 2009, gender: "f" }),
];

const ihabsKids = [
  person({ name: "Hayat Al Samannoudi", born: 1997, gender: "f" }),
  person({ name: "Dalal Al Samannoudi", born: 1999, gender: "f" }),
  person({ name: "Abdullatif Al Samannoudi", born: 2005, gender: "m" }),
  person({ name: "Noor Al Samannoudi", born: 2007, gender: "f" }),
];

const faisalsKids = [
  person({ name: "Sultanah Al Samannoudi", born: 1998, gender: "f" }),
  person({ name: "Ahmed Al Samannoudi", born: 2001, gender: "m" }),
  person({ name: "Rawah Al Samannoudi", born: 2009, gender: "f" }),
  person({ name: "Mohammed Al Samannoudi", born: 2012, gender: "m" }),
  person({ name: "Maryam Al Samannoudi", born: 2014, gender: "f" }),
  person({ name: "Yousef Al Samannoudi", born: 2018, gender: "m" }),
  person({ name: "Ihab Al Samannoudi Jr.", born: 2023, gender: "m" }),
];

const sarasKids = [
  person({ name: "Hala Al Sawaf", born: 2004, gender: "f" }),
  person({ name: "Mohammed Al Sawaf", born: 2005, gender: "m" }),
  person({ name: "Malak Al Sawaf", born: 2008, gender: "f" }),
  person({ name: "Layan Al Sawaf", born: 2013, gender: "f" }),
  person({
    name: "Asil Amer",
    unverified: true,
    note: "Listed on the source chart as \"Asil Amer ???\" — relationship and spelling unconfirmed.",
  }),
];

const fadysKids = [
  person({ name: "Unnamed child", unverified: true, note: "Marked [NAME] on the source chart — not yet identified." }),
  person({ name: "Unnamed child", unverified: true, note: "Marked [NAME] on the source chart — not yet identified." }),
  person({ name: "Unnamed child", unverified: true, note: "Marked [NAME] on the source chart — not yet identified." }),
];

// ---- Generation 3 (grandchildren) ----

const abir = person({
  name: "Abir Al Samannoudi",
  fullName: "Abir Saifeldin Al Samannoudi",
  born: 1966,
  gender: "f",
  children: abirsKids,
  spouse: person({ name: "Salah Abdulaziz Tawfeek", born: 1966, gender: "m" }),
});

const ghadah = person({
  name: "Ghadah Al Samannoudi",
  fullName: "Ghadah Saif Al Samannoudi",
  born: 1967,
  gender: "f",
  children: ghadahsKids,
  spouse: person({ name: "Yasser Farouk Eladawy", gender: "m" }),
});

const ihab = person({
  name: "Ihab Al Samannoudi",
  fullName: "Ihab Saifeldin Al Samannoudi",
  born: 1968,
  gender: "m",
  hasBio: true,
  businesses: ["alj.com", "communityjameel.org", "artjameel.org"],
  children: ihabsKids,
  spouse: person({ name: "Laila Halawani", fullName: "Laila Ahmed M Halawani", born: 1970, gender: "f" }),
});

const faisal = person({
  name: "Faisal Al Samannoudi",
  fullName: "Faisal Saifeldin Al Samannoudi",
  born: 1973,
  gender: "m",
  hasBio: true,
  businesses: ["alj-enterprises.com"],
  children: faisalsKids,
  spouse: person({ name: "Sara Mufti", fullName: "Sara Sami Mufti", born: 1979, gender: "f" }),
});

const hisham = person({
  name: "Hisham J Hamza",
  gender: "m",
  hasBio: true,
  businesses: ["aljhospital.com", "dataocean.com", "najtech.com.sa"],
});

const aladin = person({
  name: "Aladin Hamza",
  gender: "m",
  hasBio: true,
  businesses: ["najtech.com.sa", "aljhospital.com"],
});

const majed = person({
  name: "Majed Hamza",
  gender: "m",
  businesses: ["almukmal.com.sa"],
});

const saraFawaz = person({
  name: "Sara Al Fawaz",
  fullName: "Sara Marwan Al Fawaz",
  born: 1985,
  gender: "f",
  children: sarasKids,
  spouse: person({ name: "Rowaid Al Sawaf", gender: "m", hasBio: true }),
});

const hassan = person({
  name: "Hassan Jameel",
  fullName: "Hassan Mohammed Abdullatif Jameel",
  gender: "m",
  hasBio: true,
  businesses: ["alj.com", "jameelmotors.com", "communityjameel.org"],
});

const husseinJr = person({
  name: "Hussein Jameel",
  fullName: "Hussein Mohammed Abdullatif Jameel",
  gender: "m",
  hasBio: true,
  businesses: ["alj.com", "aljfinance.com", "communityjameel.org", "communityjameelsaudi.org"],
});

const fady = person({
  name: "Fady Jameel",
  fullName: "Fady Mohammed Abdullatif Jameel",
  born: 1976,
  gender: "m",
  hasBio: true,
  businesses: ["alj.com", "communityjameel.org", "artjameel.org"],
  children: fadysKids,
  spouse: person({ name: "Jihan Zahid", fullName: "Jihan Mohamed Y. Zahid", born: 1985, gender: "f" }),
});

const mysterySister = person({
  name: "Unnamed sister",
  gender: "f",
  unverified: true,
  note: "Marked \"[SISTER?]\" on the source chart — identity unconfirmed.",
  businesses: ["haljgroup.com", "hadya.com"],
  spouse: person({
    name: "Unnamed spouse",
    gender: "m",
    unverified: true,
    note: "Recorded only as \"[NAME] Al Haddad\" on the source chart, directly beneath this entry — the marriage itself is not explicitly confirmed.",
    relatedMentions: [{ name: "Osama Saad Al Haddad" }, { name: "Khalid Al-Haddad" }],
  }),
});

// ---- Generation 2 (children of Abdullatif & Nafisa) ----

const hadia = person({
  name: "Hadia Jameel",
  fullName: "Hadia Abdullatif Jameel",
  born: 1941,
  gender: "f",
  children: [abir, ghadah, ihab, faisal],
  spouse: person({
    name: "Saif Al-Din Al Samannoudi",
    fullName: "Saif Al-Din bin Abdul Hamid Al Samannoudi",
    born: 1924,
    gender: "m",
  }),
});

const nagia = person({
  name: "Nagia Jameel",
  fullName: "Nagia Abdullatif Jameel",
  born: 1942,
  gender: "f",
  businesses: ["aljhospital.com", "dataocean.com", "najtech.com.sa"],
  children: [hisham, aladin, majed],
  spouse: person({
    name: "Unnamed spouse",
    gender: "m",
    unverified: true,
    note: "Recorded only as \"[NAME] Hamza\" on the source chart.",
  }),
});

const hayat = person({
  name: "Hayat Jameel",
  fullName: "Hayat Abdullatif Jameel",
  born: 1943,
  gender: "f",
  children: [saraFawaz],
  spouse: person({ name: "Marwan Al Fawaz", fullName: "Marwan Abdualrazaq Al Fawaz", born: 1953, gender: "m" }),
});

const yousuf = person({
  name: "Yousuf Jameel",
  fullName: "Yusuf Abdullatif Jameel",
  born: 1944,
  gender: "m",
  hasBio: true,
  businesses: ["yaljgroup.com", "aljreic.com", "yaladates.com"],
});

const mohammedKbe = person({
  name: "Eng. Mohammed Jameel, KBE",
  fullName: "Mohammed Abdullatif Jameel",
  born: 1955,
  gender: "m",
  hasBio: true,
  businesses: ["alj.com", "communityjameel.org", "communityjameelsaudi.org", "artjameel.org", "bcj.com.sa"],
  children: [hassan, husseinJr, fady, mysterySister],
  spouse: person({
    name: "Unnamed spouse",
    gender: "f",
    unverified: true,
    note: "Recorded only as \"[NAME]\" on the source chart.",
    relatedMentions: [{ name: "Khudr Hussein" }, { name: "Yousef Hussein", hasBio: true }],
  }),
});

const majdi = person({
  name: "Majdi Jameel",
  fullName: "Majdi Abdullatif Jameel",
  born: 1957,
  gender: "m",
  businesses: ["alj-enterprises.com"],
});

// ---- Generation 1 (Abdullatif Jameel & siblings) ----

export const abdullatif = person({
  name: "Abdullatif Jameel",
  fullName: "Abdullatif Hussein Jameel Saaduddin Mohammed Al-Saadi",
  born: 1912,
  died: 1993,
  gender: "m",
  hasBio: true,
  mentionedInBio: [
    "Ghazi Jameel",
    "Faisal Abu Shousha",
    "Mohammed AlHassoun",
    "Ahmed Al-Kaf",
  ],
  children: [hadia, nagia, hayat, yousuf, mohammedKbe, majdi],
  spouse: person({
    name: "Nafisa Shams",
    fullName: "Nafisa Mahmoud Mohammed Shams",
    died: 1981,
    gender: "f",
    businesses: ["nafisashams.com"],
  }),
});

const abdulaziz = person({
  name: "Abdulaziz Jameel",
  gender: "m",
  unverified: true,
  note: "Full name not recorded on the source chart.",
  children: [
    person({ name: "Ghazi Abdulaziz Jameel", gender: "m", unverified: true, note: "Mentioned in the Family Memoirs — relationship to be confirmed." }),
    person({ name: "Ahmed Zuhairi", gender: "m", unverified: true, note: "Mentioned in the Family Memoirs — relationship to be confirmed." }),
    person({
      name: "Ismat Abdel-Samad Nageeb Al-Saadi",
      unverified: true,
      note: "Mentioned in the Family Memoirs — relationship to be confirmed. The chart flags this with a \"Same person?\" query against \"Ismat Al-Saadi\", suggesting these may be a single person recorded twice.",
    }),
  ],
});

const unnamedBrother = person({
  name: "Unnamed brother",
  gender: "m",
  unverified: true,
  note: "Recorded only as \"BROTHER\" on the source chart.",
});

// ---- Generation 0 (family founder) & Generation 1 (origins) ----

const husseinJameelSr = person({
  name: "Hussein Jameel",
  gender: "m",
  unverified: true,
  note: "Recorded only as \"(FULL NAME?)\" with no dates on the source chart.",
  children: [unnamedBrother, abdulaziz, abdullatif],
  spouse: person({
    name: "Maryam Zuhairi",
    died: 1957,
    gender: "f",
    unverified: true,
    note: "Full name marked \"(FULL NAME?)\" on the source chart — only her death year is recorded.",
  }),
});

export const familyRoot = person({
  name: "Mohammed Al-Saadi",
  gender: "m",
  unverified: true,
  note: "Originally Palestinian — sent by the Ottoman authorities to serve as a judge in the Sharia court in what is now Saudi Arabia. Full name and dates marked \"(FULL NAME?)\" / \"(YYYY–YYYY)\" on the source chart.",
  children: [husseinJameelSr],
});

// Generation-3 branches with the most great-grandchildren are collapsed
// by default so the initial tree view isn't overwhelming.
export const defaultCollapsedIds = [abir.id, ghadah.id, ihab.id, faisal.id, saraFawaz.id];

export const legend = {
  bio: "Publicly active in today's businesses or philanthropies — has a full biography on file.",
  unverified: "Name, dates, or relationship not yet confirmed — flagged for research.",
};
