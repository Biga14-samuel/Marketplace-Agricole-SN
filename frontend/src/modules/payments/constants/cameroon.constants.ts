// @ts-nocheck
// constants/cameroon.constants.ts

/**
 * Constantes spécifiques au Cameroun
 * Données administratives, géographiques, fiscales et culturelles
 */

// ==================== INFORMATIONS GÉNÉRALES ====================
export const COUNTRY_INFO = {
    NOM_FRANCAIS: 'République du Cameroun',
    NOM_ANGLAIS: 'Republic of Cameroon',
    SURNOMS: ['Afrique en miniature', 'Le Triangle National'],
    CAPITALE: {
        NOM: 'Yaoundé',
        COORDONNEES: { LAT: 3.8480, LNG: 11.5021 },
        ALTITUDE: 726
    },
    PLUS_GRANDE_VILLE: {
        NOM: 'Douala',
        COORDONNEES: { LAT: 4.0511, LNG: 9.7679 }
    },
    LANGUES_OFFICIELLES: ['Français', 'Anglais'],
    LANGUES_NATIONALES: [
        'Fulfulde', 'Ewondo', 'Duala', 'Bassa', 'Bamoun',
        'Bulu', 'Pidgin camerounais', 'Arabes tchadien'
    ],
    DEVISE_NATIONALE: 'Paix - Travail - Patrie',
    HYMNE_NATIONAL: 'Ô Cameroun, Berceau de nos Ancêtres',
    FETE_NATIONALE: '20 mai',
    INDEPENDANCE: '1er janvier 1960',
    REUNIFICATION: '1er octobre 1961',
    POPULATION: 28000000,
    SUPERFICIE: 475442, // km²
    DENSITE: 58.9, // hab/km²
    FUSEAU_HORAIRE: 'UTC+1',
    DOMAINE_INTERNET: '.cm',
    CODE_ISO: 'CM',
    CODE_OMC: 'CMR',
    CODE_FIPS: 'CM',
    PIB_NOMINAL: 45000000000, // USD
    PIB_PAR_HABITANT: 1607, // USD
    MONNAIE: 'Franc CFA (XAF)',
    SYMBOLE_MONNAIE: 'FCFA'
} as const;

// ==================== SYMBOLES NATIONAUX ====================
export const NATIONAL_SYMBOLS = {
    DRAPEAU: {
        DESCRIPTION: 'Tricolore vertical vert, rouge, jaune avec une étoile jaune au centre',
        SIGNIFICATION: {
            VERT: 'Forêts du Sud',
            ROUGE: 'Unité et sang versé',
            JAUNE: 'Savanes du Nord et richesse',
            ETOILE: 'Unité du pays'
        },
        ADOPTION: '20 mai 1975'
    },
    ARMORIAL: {
        DESCRIPTION: 'Écu aux couleurs du drapeau avec balance et épée',
        ELEMENTS: [
            'Écu parti de sinople et de gueules',
            'Épée et balance en pal',
            'Fasce d\'or chargée de l\'étoile d\'or',
            'Deux faisceaux de licteur en sautoir',
            'Devise en français et anglais'
        ]
    },
    EMBLEME_FLORAL: 'Bougainvillier',
    EMBLEME_ANIMAL: 'Lion',
    OISEAU_NATIONAL: 'Touraco à huppe blanche',
    ARBRE_NATIONAL: 'Bombax (Fromager)',
    SPORT_NATIONAL: 'Football'
} as const;

// ==================== RÉGIONS ADMINISTRATIVES ====================
export const REGIONS = {
    ADAMAOUA: {
        NOM: 'Adamaoua',
        CAPITALE: 'Ngaoundéré',
        SUPERFICIE: 63691, // km²
        POPULATION: 1200000,
        DENSITE: 18.8,
        DEPARTEMENTS: 5,
        CODE: 'AD'
    },
    CENTRE: {
        NOM: 'Centre',
        CAPITALE: 'Yaoundé',
        SUPERFICIE: 68953,
        POPULATION: 4100000,
        DENSITE: 59.5,
        DEPARTEMENTS: 10,
        CODE: 'CE'
    },
    EST: {
        NOM: 'Est',
        CAPITALE: 'Bertoua',
        SUPERFICIE: 109011,
        POPULATION: 830000,
        DENSITE: 7.6,
        DEPARTEMENTS: 4,
        CODE: 'ES'
    },
    EXTREME_NORD: {
        NOM: 'Extrême-Nord',
        CAPITALE: 'Maroua',
        SUPERFICIE: 34246,
        POPULATION: 3900000,
        DENSITE: 113.9,
        DEPARTEMENTS: 6,
        CODE: 'EN'
    },
    LITTORAL: {
        NOM: 'Littoral',
        CAPITALE: 'Douala',
        SUPERFICIE: 20239,
        POPULATION: 3500000,
        DENSITE: 172.9,
        DEPARTEMENTS: 4,
        CODE: 'LT'
    },
    NORD: {
        NOM: 'Nord',
        CAPITALE: 'Garoua',
        SUPERFICIE: 65576,
        POPULATION: 2200000,
        DENSITE: 33.5,
        DEPARTEMENTS: 4,
        CODE: 'NO'
    },
    NORD_OUEST: {
        NOM: 'Nord-Ouest',
        CAPITALE: 'Bamenda',
        SUPERFICIE: 17310,
        POPULATION: 1900000,
        DENSITE: 109.8,
        DEPARTEMENTS: 7,
        CODE: 'NW'
    },
    OUEST: {
        NOM: 'Ouest',
        CAPITALE: 'Bafoussam',
        SUPERFICIE: 13872,
        POPULATION: 1900000,
        DENSITE: 136.9,
        DEPARTEMENTS: 8,
        CODE: 'OU'
    },
    SUD: {
        NOM: 'Sud',
        CAPITALE: 'Ebolowa',
        SUPERFICIE: 47110,
        POPULATION: 750000,
        DENSITE: 15.9,
        DEPARTEMENTS: 4,
        CODE: 'SU'
    },
    SUD_OUEST: {
        NOM: 'Sud-Ouest',
        CAPITALE: 'Buea',
        SUPERFICIE: 25410,
        POPULATION: 1500000,
        DENSITE: 59,
        DEPARTEMENTS: 6,
        CODE: 'SW'
    }
} as const;

export type RegionCode = keyof typeof REGIONS;

// ==================== VILLES PRINCIPALES ====================
export const MAJOR_CITIES = {
    DOUALA: {
        NOM: 'Douala',
        REGION: 'Littoral',
        POPULATION: 3500000,
        SUPERFICIE: 210, // km²
        ALTITUDE: 13,
        FONDATION: 1850,
        SURNOMS: ['Capitale économique', 'Porte d\'entrée du Cameroun']
    },
    YAOUNDE: {
        NOM: 'Yaoundé',
        REGION: 'Centre',
        POPULATION: 2800000,
        SUPERFICIE: 180,
        ALTITUDE: 726,
        FONDATION: 1888,
        SURNOMS: ['Cité des sept collines', 'Capitale politique']
    },
    GAROUA: {
        NOM: 'Garoua',
        REGION: 'Nord',
        POPULATION: 600000,
        SUPERFICIE: 45,
        ALTITUDE: 249,
        FONDATION: 1830
    },
    MAROUA: {
        NOM: 'Maroua',
        REGION: 'Extrême-Nord',
        POPULATION: 400000,
        SUPERFICIE: 135,
        ALTITUDE: 384,
        FONDATION: 1800
    },
    BAFOUSSAM: {
        NOM: 'Bafoussam',
        REGION: 'Ouest',
        POPULATION: 350000,
        SUPERFICIE: 50,
        ALTITUDE: 1521,
        FONDATION: 1907
    },
    BAMENDA: {
        NOM: 'Bamenda',
        REGION: 'Nord-Ouest',
        POPULATION: 450000,
        SUPERFICIE: 30,
        ALTITUDE: 1614,
        FONDATION: 1902
    },
    NGAOUNDERE: {
        NOM: 'Ngaoundéré',
        REGION: 'Adamaoua',
        POPULATION: 250000,
        SUPERFICIE: 110,
        ALTITUDE: 1212,
        FONDATION: 1835
    },
    BERTOUA: {
        NOM: 'Bertoua',
        REGION: 'Est',
        POPULATION: 250000,
        SUPERFICIE: 100,
        ALTITUDE: 656,
        FONDATION: 1927
    },
    BUEA: {
        NOM: 'Buea',
        REGION: 'Sud-Ouest',
        POPULATION: 200000,
        SUPERFICIE: 870,
        ALTITUDE: 1000,
        FONDATION: 1858
    },
    EBOLOWA: {
        NOM: 'Ebolowa',
        REGION: 'Sud',
        POPULATION: 180000,
        SUPERFICIE: 20,
        ALTITUDE: 636,
        FONDATION: 1891
    }
} as const;

// ==================== CODES POSTAUX ====================
export const POSTAL_CODES = {
    // Par région
    ADAMAOUA: '00226',
    CENTRE: '00237',
    EST: '00224',
    EXTREME_NORD: '00229',
    LITTORAL: '00235',
    NORD: '00227',
    NORD_OUEST: '00233',
    OUEST: '00231',
    SUD: '00239',
    SUD_OUEST: '00232',

    // Villes principales
    DOUALA: '00235',
    YAOUNDE: '00237',
    GAROUA: '00227',
    MAROUA: '00229',
    BAFOUSSAM: '00231',
    BAMENDA: '00233',
    NGAOUNDERE: '00226',
    BERTOUA: '00224',
    BUEA: '00232',
    EBOLOWA: '00239',
    KRIBI: '00238',
    LIMBE: '00234',
    KUMBA: '00236',
    DSCHANG: '00230',
    FOUMBAN: '00228',
    KONDOA: '00225'
} as const;

// ==================== OPÉRATEURS DE TÉLÉCOMMUNICATIONS ====================
export const TELECOM_OPERATORS = {
    MTN: {
        NOM: 'MTN Cameroon',
        SIEGE: 'Douala',
        LANCEMENT: 2000,
        PART_DE_MARCHE: 50, // %
        PREFIXES: ['6', '65', '66', '67', '68', '69'],
        SERVICES: ['Mobile Money', 'Internet mobile', 'Téléphonie']
    },
    ORANGE: {
        NOM: 'Orange Cameroon',
        SIEGE: 'Douala',
        LANCEMENT: 1999,
        PART_DE_MARCHE: 45,
        PREFIXES: ['7', '77', '78', '79'],
        SERVICES: ['Orange Money', 'Internet mobile', 'Téléphonie']
    },
    NEXTTEL: {
        NOM: 'Viettel Cameroon (Nexttel)',
        SIEGE: 'Yaoundé',
        LANCEMENT: 2014,
        PART_DE_MARCHE: 5,
        PREFIXES: ['62', '63'],
        SERVICES: ['Téléphonie', 'Internet mobile']
    },
    CAMTEL: {
        NOM: 'Camtel Cameroon',
        SIEGE: 'Yaoundé',
        LANCEMENT: 1998,
        PART_DE_MARCHE: 0, // Opérateur fixe
        PREFIXES: ['22', '23', '24', '233'],
        SERVICES: ['Téléphonie fixe', 'Internet fixe', 'Fibre optique']
    }
} as const;

export type TelecomOperator = keyof typeof TELECOM_OPERATORS;

// ==================== BANQUES ET INSTITUTIONS FINANCIÈRES ====================
export const BANKS = {
    // Banques commerciales
    UBA: {
        NOM: 'United Bank for Africa Cameroon',
        CODE: '10002',
        SWIFT: 'UNAFCMCX',
        SIEGE: 'Douala',
        FONDATION: 1974
    },
    ECOBANK: {
        NOM: 'Ecobank Cameroon',
        CODE: '10005',
        SWIFT: 'ECOCCMCX',
        SIEGE: 'Douala',
        FONDATION: 1989
    },
    BICEC: {
        NOM: 'BICEC (BNP Paribas)',
        CODE: '10003',
        SWIFT: 'BICECMCX',
        SIEGE: 'Douala',
        FONDATION: 1974
    },
    SOCIETE_GENERALE: {
        NOM: 'Société Générale Cameroon',
        CODE: '10001',
        SWIFT: 'SGCMCMCX',
        SIEGE: 'Douala',
        FONDATION: 1962
    },
    BGFI: {
        NOM: 'BGFI Bank Cameroon',
        CODE: '10004',
        SWIFT: 'BGFICMCX',
        SIEGE: 'Douala',
        FONDATION: 2000
    },
    CBC: {
        NOM: 'Commercial Bank of Cameroon',
        CODE: '10006',
        SWIFT: 'CBCMCMCX',
        SIEGE: 'Douala',
        FONDATION: 1997
    },
    NFC: {
        NOM: 'National Financial Credit Bank',
        CODE: '10007',
        SWIFT: 'NFCCMCX',
        SIEGE: 'Yaoundé',
        FONDATION: 2004
    },
    CITIBANK: {
        NOM: 'Citibank Cameroon',
        CODE: '10008',
        SWIFT: 'CITICMCX',
        SIEGE: 'Douala',
        FONDATION: 1970
    },

    // Banques de microfinance
    EXPRESS_UNION: {
        NOM: 'Express Union',
        TYPE: 'Microfinance',
        SIEGE: 'Yaoundé',
        FONDATION: 1993
    },
    CAMPOST: {
        NOM: 'Campost',
        TYPE: 'Services postaux financiers',
        SIEGE: 'Yaoundé'
    }
} as const;

// ==================== FISCALITÉ CAMEROUNAISE ====================
export const TAXATION = {
    // Taxe sur la Valeur Ajoutée (TVA)
    TVA: {
        TAUX_NORMAL: 19.25, // %
        TAUX_REDUIT: 9.75,
        TAUX_SUPER_REDUIT: 5.5,
        TAUX_ZERO: 0,
        SEUIL_EXONERATION: 50000000, // FCFA (chiffre d'affaires annuel)
        CODE_CGI: 'Article 293'
    },

    // Impôt sur le Revenu des Personnes Physiques (IRPP)
    IRPP: {
        TRANCHES: [
            { LIMITE: 2000000, TAUX: 0 }, // 0-2M FCFA
            { LIMITE: 3000000, TAUX: 10 }, // 2-3M FCFA
            { LIMITE: 5000000, TAUX: 15 }, // 3-5M FCFA
            { LIMITE: 10000000, TAUX: 20 }, // 5-10M FCFA
            { LIMITE: Infinity, TAUX: 25 } // >10M FCFA
        ],
        ABATTEMENT: 20 // % pour frais professionnels
    },

    // Impôt sur les Sociétés (IS)
    IS: {
        TAUX_NORMAL: 33, // %
        TAUX_REDUIT: 25, // Pour les PME
        TAUX_AGRICOLE: 15,
        MINIMUM_FORFAITAIRE: 1000000 // FCFA
    },

    // Autres taxes
    TAXES: {
        DROITS_DOUANE: 30, // % en moyenne
        TAXE_COMMUNALE: 10,
        CONTRIBUTION_SOCIALE: 4.2,
        TAXE_SPECIFIQUE: 2.5
    }
} as const;

// ==================== INDICATIFS TÉLÉPHONIQUES ====================
export const PHONE_CODES = {
    INTERNATIONAL: '+237',
    NATIONAL: '237',
    URGENCES: {
        POLICE: '117',
        POMPIERS: '118',
        SAMU: '119',
        GENDARMERIE: '117'
    },
    OPERATEURS: {
        MTN: ['6', '65', '66', '67', '68', '69'],
        ORANGE: ['7', '77', '78', '79'],
        NEXTTEL: ['62', '63'],
        CAMTEL: ['22', '23', '24', '233']
    },
    FORMATS: {
        LOCAL: '2X XX XX XX', // Fixe
        MOBILE: '6X XX XX XX' // Mobile
    }
} as const;

// ==================== FÊTES ET JOURS FÉRIÉS ====================
export const PUBLIC_HOLIDAYS = {
    // Fêtes fixes
    JOUR_DE_LAN: { DATE: '01/01', NOM: 'Jour de l\'An' },
    FETE_DU_TRAVAIL: { DATE: '01/05', NOM: 'Fête du Travail' },
    FETE_NATIONALE: { DATE: '20/05', NOM: 'Fête Nationale' },
    FETE_DE_LA_JEUNESSE: { DATE: '11/02', NOM: 'Fête de la Jeunesse' },
    ASSOMPTION: { DATE: '15/08', NOM: 'Assomption' },
    NOEL: { DATE: '25/12', NOM: 'Noël' },

    // Fêtes religieuses mobiles
    VENDREDI_SAINT: { TYPE: 'RELIGIEUX', NOM: 'Vendredi Saint' },
    LUNDI_DE_PAQUES: { TYPE: 'RELIGIEUX', NOM: 'Lundi de Pâques' },
    ASCENSION: { TYPE: 'RELIGIEUX', NOM: 'Ascension' },
    LUNDI_DE_PENTECOTE: { TYPE: 'RELIGIEUX', NOM: 'Lundi de Pentecôte' },
    AID_EL_FITR: { TYPE: 'RELIGIEUX', NOM: 'Fin du Ramadan' },
    AID_EL_ADHA: { TYPE: 'RELIGIEUX', NOM: 'Fête du Mouton' }
} as const;

// ==================== UNITÉS DE MESURE LOCALES ====================
export const LOCAL_MEASURES = {
    // Unités de surface
    SUPERFICIE: {
        HECTARE: 10000, // m²
        ARE: 100, // m²
        "PARCEL_A_CACAO": 4000, // m² environ
        "PARCEL_A_CAFE": 2500 // m² environ
    },

    // Unités de volume
    VOLUME: {
        BIDON: 20, // litres (bidon d'huile)
        BASSINE: 10, // litres
        SEAU: 5 // litres
    },

    // Unités de poids
    POIDS: {
        SAC_DE_RIZ: 50, // kg
        SAC_DE_CACAO: 65, // kg
        SAC_DE_CAFE: 60, // kg
        PANIER: 5 // kg (environ)
    },

    // Unités monétaires informelles
    ARGOT_MONETAIRE: {
        BILLET: 10000, // FCFA
        MACHETTE: 5000, // FCFA
        "MILLE": 1000, // FCFA
        "CINQ_CENTS": 500 // FCFA
    }
} as const;

// ==================== CODES ADMINISTRATIFS ====================
export const ADMINISTRATIVE_CODES = {
    // Codes régionaux
    REGION_CODES: {
        'AD': 'Adamaoua',
        'CE': 'Centre',
        'ES': 'Est',
        'EN': 'Extrême-Nord',
        'LT': 'Littoral',
        'NO': 'Nord',
        'NW': 'Nord-Ouest',
        'OU': 'Ouest',
        'SU': 'Sud',
        'SW': 'Sud-Ouest'
    },

    // Codes départements
    DEPARTMENT_CODES: [
        'DJA-ET-LOBO', 'HAUTE-SANAGA', 'LEKIE', 'MBAM-ET-INOUBOU',
        'MBAM-ET-KIM', 'MEFOU-ET-AFAMBA', 'MEFOU-ET-AKONO', 'Mfoundi',
        'NYONG-ET-KELLE', 'NYONG-ET-MFOUNDI', 'NYONG-ET-SOO'
    ],

    // Codes communes
    COMMUNE_TYPES: {
        'CU': 'Communauté Urbaine',
        'CD': 'Commune d\'Arrondissement',
        'CR': 'Commune Rurale',
        'CV': 'Commune Ville'
    }
} as const;

// ==================== INFRASTRUCTURES IMPORTANTES ====================
export const INFRASTRUCTURE = {
    // Ports
    PORTS: {
        PORT_DE_DOUALA: {
            NOM: 'Port Autonome de Douala',
            TYPE: 'Port en eau profonde',
            TRAFIC: 12000000, // tonnes/an
            SURFACE: 260 // hectares
        },
        PORT_DE_KRIBI: {
            NOM: 'Port en Eau Profonde de Kribi',
            TYPE: 'Port minéralier et pétrolier',
            TRAFIC: 5000000,
            SURFACE: 26000
        }
    },

    // Aéroports
    AIRPORTS: {
        AEROPORT_DE_DOUALA: {
            NOM: 'Aéroport International de Douala',
            CODE_IATA: 'DLA',
            CODE_OACI: 'FKKD',
            PASSAGERS: 2000000 // par an
        },
        AEROPORT_DE_YAOUNDE: {
            NOM: 'Aéroport International de Yaoundé-Nsimalen',
            CODE_IATA: 'NSI',
            CODE_OACI: 'FKYS',
            PASSAGERS: 500000
        }
    },

    // Barrages hydroélectriques
    BARRAGES: {
        BARRAGE_DE_LAGDO: {
            NOM: 'Barrage de Lagdo',
            PUISSANCE: 72, // MW
            RIVIERE: 'Bénoué'
        },
        BARRAGE_DE_MEMVE_ELE: {
            NOM: 'Barrage de Memve\'ele',
            PUISSANCE: 201,
            RIVIERE: 'Ntem'
        }
    }
} as const;

// ==================== CODES LÉGAUX ET RÉGLEMENTAIRES ====================
export const LEGAL_CODES = {
    // Codes d'identification
    IDENTIFICATION: {
        CNI: {
            FORMAT: 'Lettre + 7 chiffres',
            EXEMPLE: 'A1234567',
            AGE_MINIMUM: 16
        },
        PASSEPORT: {
            FORMAT: '9 caractères alphanumériques',
            VALIDITE: 5 // années
        },
        NIU: {
            FORMAT: 'M + 9 chiffres',
            SIGNIFICATION: 'Numéro d\'Identification Unique'
        }
    },

    // Codes de commerce
    COMMERCE: {
        RC: {
            FORMAT: 'RC/[VILLE]/[ANNEE]/[LETTRE]/[NUMERO]',
            EXEMPLE: 'RC/DOUALA/2023/B/12345'
        },
        CC: {
            FORMAT: 'CC/[NUMERO]',
            SIGNIFICATION: 'Compte Contribuable'
        }
    },

    // Réglementation
    REGULATIONS: {
        OHADA: 'Droit des affaires harmonisé',
        CIMA: 'Assurances',
        COBAC: 'Banques',
        ARMP: 'Marchés publics'
    }
} as const;

// ==================== CULTURE ET TRADITIONS ====================
export const CULTURE = {
    // Éthnies principales
    ETHNIES: [
        { NOM: 'Bamiléké', REGION: 'Ouest', POPULATION: 4000000 },
        { NOM: 'Bassa', REGION: 'Littoral', POPULATION: 3000000 },
        { NOM: 'Béti', REGION: 'Centre', POPULATION: 2500000 },
        { NOM: 'Foulbé', REGION: 'Nord', POPULATION: 3500000 },
        { NOM: 'Duala', REGION: 'Littoral', POPULATION: 1000000 }
    ],

    // Traditions culinaires
    CUISINE: {
        PLATS_TYPIQUES: [
            'Ndolé',
            'Poulet DG',
            'Sanga',
            'Koki',
            'Eru',
            'Achu',
            'Nkui',
            'Kondrè'
        ],
        BOISSONS: [
            'Vin de palme',
            'Sha',
            'Foléré',
            'Ginger beer'
        ]
    },

    // Arts et artisanat
    ARTISANAT: {
        TAPISSERIE: 'Tapis de Foumban',
        POTERIE: 'Poterie de Bandjoun',
        SCULPTURE: 'Masques bamilékés',
        TISSAGE: 'Tissu Ndop'
    },

    // Musique et danse
    MUSIQUE: {
        GENRES: [
            'Makossa',
            'Bikutsi',
            'Assiko',
            'Bend skin',
            'Ndombolo'
        ],
        ARTISTES_CELEBRES: [
            'Manu Dibango',
            'Petit Pays',
            'Longue Longue',
            'Charlotte Dipanda'
        ]
    }
} as const;

// ==================== FONCTIONS UTILITAIRES ====================
/**
 * Vérifie si un numéro de téléphone est valide pour le Cameroun
 */
export function isValidCameroonPhoneNumber(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');

    // Format international
    if (cleanPhone.startsWith('237') && cleanPhone.length === 12) {
        const localNumber = cleanPhone.substring(3);
        return isValidLocalPhoneNumber(localNumber);
    }

    // Format local
    if (cleanPhone.length === 9) {
        return isValidLocalPhoneNumber(cleanPhone);
    }

    return false;
}

/**
 * Vérifie un numéro local
 */
function isValidLocalPhoneNumber(phone: string): boolean {
    // Vérifie les préfixes d'opérateurs
    const prefixes = [
        ...PHONE_CODES.OPERATEURS.MTN,
        ...PHONE_CODES.OPERATEURS.ORANGE,
        ...PHONE_CODES.OPERATEURS.NEXTTEL,
        ...PHONE_CODES.OPERATEURS.CAMTEL
    ];

    return prefixes.some(prefix => phone.startsWith(prefix));
}

/**
 * Obtient l'opérateur d'un numéro de téléphone
 */
export function getPhoneOperator(phone: string): TelecomOperator | null {
    const cleanPhone = phone.replace(/\D/g, '');
    let localNumber = cleanPhone;

    if (cleanPhone.startsWith('237')) {
        localNumber = cleanPhone.substring(3);
    }

    if (localNumber.length !== 9) return null;

    for (const [operator, data] of Object.entries(TELECOM_OPERATORS)) {
        if (data.PREFIXES.some(prefix => localNumber.startsWith(prefix))) {
            return operator as TelecomOperator;
        }
    }

    return null;
}

/**
 * Formate un numéro de téléphone camerounais
 */
export function formatCameroonPhoneNumber(phone: string, format: 'INTERNATIONAL' | 'LOCAL' = 'INTERNATIONAL'): string {
    const cleanPhone = phone.replace(/\D/g, '');

    if (format === 'INTERNATIONAL') {
        if (cleanPhone.startsWith('237') && cleanPhone.length === 12) {
            return `+${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6, 9)} ${cleanPhone.substring(9)}`;
        }

        if (cleanPhone.length === 9) {
            return `+237 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
        }
    } else {
        if (cleanPhone.length === 9) {
            return `${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
        }

        if (cleanPhone.startsWith('237') && cleanPhone.length === 12) {
            return cleanPhone.substring(3);
        }
    }

    return phone;
}

/**
 * Obtient les informations d'une région par son code
 */
export function getRegionByCode(code: string): typeof REGIONS[keyof typeof REGIONS] | null {
    const regionEntry = Object.entries(REGIONS).find(([_, region]) => region.CODE === code);
    return regionEntry ? regionEntry[1] : null;
}

/**
 * Obtient le code postal d'une ville
 */
export function getPostalCode(city: string): string | null {
    const cityUpper = city.toUpperCase().replace(/\s/g, '_');

    for (const [key, value] of Object.entries(POSTAL_CODES)) {
        if (key === cityUpper || key === cityUpper + '_CITY') {
            return value as string;
        }
    }

    return null;
}

/**
 * Calcule l'impôt sur le revenu selon les tranches camerounaises
 */
export function calculateIncomeTax(annualIncome: number): {
    tax: number;
    brackets: Array<{ min: number; max: number; rate: number; amount: number }>;
} {
    const brackets = TAXATION.IRPP.TRANCHES;
    let remainingIncome = annualIncome;
    let totalTax = 0;
    const bracketDetails = [];

    for (let i = 0; i < brackets.length; i++) {
        const bracket = brackets[i];
        const prevBracket = i > 0 ? brackets[i - 1] : { LIMITE: 0 };

        const bracketMin = prevBracket.LIMITE;
        const bracketMax = bracket.LIMITE;
        const bracketWidth = bracketMax - bracketMin;

        if (remainingIncome <= 0) break;

        const taxableInBracket = Math.min(remainingIncome, bracketWidth);
        const taxInBracket = (taxableInBracket * bracket.TAUX) / 100;

        totalTax += taxInBracket;
        bracketDetails.push({
            min: bracketMin,
            max: bracketMax === Infinity ? '∞' : bracketMax,
            rate: bracket.TAUX,
            amount: taxInBracket
        });

        remainingIncome -= taxableInBracket;
    }

    // Application de l'abattement pour frais professionnels
    const deductible = (annualIncome * TAXATION.IRPP.ABATTEMENT) / 100;
    const netTax = Math.max(0, totalTax - deductible / 10); // Simplification

    return {
        tax: Math.round(netTax),
        brackets: bracketDetails
    };
}

/**
 * Valide un numéro de CNI camerounaise
 */
export function validateCNI(cniNumber: string): boolean {
    // Format: 1 lettre + 7 chiffres
    const regex = /^[A-Z]\d{7}$/;
    return regex.test(cniNumber.toUpperCase());
}

/**
 * Génère un numéro de NIU fictif pour tests
 */
export function generateTestNIU(): string {
    const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `M${randomDigits}`;
}

// ==================== EXPORT DES CONSTANTES ====================
export default {
    // Constantes
    COUNTRY_INFO,
    NATIONAL_SYMBOLS,
    REGIONS,
    MAJOR_CITIES,
    POSTAL_CODES,
    TELECOM_OPERATORS,
    BANKS,
    TAXATION,
    PHONE_CODES,
    PUBLIC_HOLIDAYS,
    LOCAL_MEASURES,
    ADMINISTRATIVE_CODES,
    INFRASTRUCTURE,
    LEGAL_CODES,
    CULTURE,

    // Fonctions utilitaires
    isValidCameroonPhoneNumber,
    getPhoneOperator,
    formatCameroonPhoneNumber,
    getRegionByCode,
    getPostalCode,
    calculateIncomeTax,
    validateCNI,
    generateTestNIU
};

// ==================== TYPES ====================
// Ré-exporter les types pour une utilisation facile
export type {
    RegionCode,
    TelecomOperator
};