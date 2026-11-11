/**
 * How each client logo is shown on the clients page, the wall and the home
 * strip. The website clients' logos are kept in full colour in
 * /public/logos/colour (made by scripts/whiten-logos.mjs --colour); the
 * Studio image stays as the fallback and is used for anything not listed.
 *
 * scale: size boost for marks that are small inside their image
 * @author Paşa Quliyev — Cradex Agency
 */

interface Entry {
  scale?: number
  /** local colour file, <key>.png in /public/logos/colour */
  colour?: boolean
  /** file name (without .png) when it is not the key */
  file?: string
}

// keyed by the Studio partner id without the "partner-web-" prefix
const WEB: Record<string, Entry> = {
  'agora-az': { colour: true },
  'aletzade-az': { colour: true },
  'amberhotel-az': { colour: true },
  'axis-az': { colour: true },
  'bakinar-az': { colour: true },
  'baku-global-education': { colour: true, scale: 2 },
  'bmwpartsbaku-az': { colour: true, scale: 1.3 },
  'butarentalcars-az': { colour: true },
  'ciao-stellina-resto-pub': { colour: true },
  'cleanbee-az': { colour: true },
  'dentaluxbaku-com': { colour: true },
  'draft-az': { colour: true },
  'elbaer-az': { colour: true },
  'elegancetur-com': { colour: true },
  'executive-baku-resto-pub': { colour: true },
  'flowercleaning-az': { colour: true },
  'geo-travel-az': { colour: true },
  'gitmeklazim-com': { colour: true },
  'goodfinance-az': { colour: true },
  'idealmebel-az': { colour: true },
  'intermet-az': { colour: true },
  'itm-store-mmc': { colour: true },
  'lordconstruction-az': { colour: true },
  'makan-az': { colour: true },
  'megatravel-az': { colour: true, scale: 1.3 },
  'mts-com-az': { colour: true },
  'nesreenmagazine-com': { colour: true },
  'nrjdmc-com': { colour: true },
  'onaktravel-com': { colour: true },
  'orien-travel-mmc': { colour: true },
  'porr-group-insaat-sirk-ti': { colour: true },
  'prime-s-az': { colour: true, scale: 2 },
  'prolineec-az': { colour: true },
  'qualident-com-tr': { colour: true },
  'ramservis-az': { colour: true },
  'rbacademy-az': { colour: true },
  'realdent-az': { colour: true },
  'saatlar-az': { colour: true },
  'sanidez-mmc': { colour: true },
  'seheryeliturizm-net': { colour: true },
  'sibaglobal-com': { colour: true },
  'smartflame-az': { colour: true },
  'stomatoloq-az': { colour: true },
  'unied-az': { colour: true },
  'victorytour-az': { colour: true },
}

// the older partners: their SVGs were drawn white for a dark page, so these
// are the same logos with the white turned to dark ink (colours kept), or the
// real logo read from the client's site
const OTHER: Record<string, Entry> = {
  'partner-p10': { colour: true, file: 'azprint' },
  'partner-p11': { colour: true, file: 'bakstone' },
  'partner-p12': { colour: true, file: 'qafqaz-xaric' },
  'partner-p13': { colour: true, file: 'airtravel' },
  'bc26069f-9457-4dbe-ae63-db0a68ab04dc': { colour: true, file: 'tubadzin' },
  'partner-p15': { colour: true, file: 'mimelon' },
  'partner-p21': { colour: true, file: 'jetprint' },
  'partner-p22': { colour: true, file: 'expargo' },
  'partner-p36': { colour: true, file: 'tertemiz' },
  'partner-p38': { colour: true, file: 'arshin' },
  'partner-p40': { colour: true, file: 'eclatex' },
  'partner-p42': { colour: true, file: 'barami' },
  'partner-p44': { colour: true, file: 'hayatclinic' },
  'partner-p45': { colour: true, file: 'kangoaz' },
  'partner-p14': { colour: true, file: 'abb-bank' },
  'partner-p16': { colour: true, file: 'badamli', scale: 1.5 },
  '0e18bda2-5b3d-4afd-a255-aac83110ae47': { colour: true, file: 'crocusfitness' }, // Crocus Fitness
  'partner-p17': { colour: true, file: 'asel-aqropark', scale: 1.3 }, // Asel Aqropark
  'partner-p39': { colour: true, file: 'avrostore' },
  'partner-p41': { colour: true, file: 'arttower', scale: 1.2 },
  'partner-p43': { colour: true, file: 'decoria' },
}

export interface LogoLook {
  logo?: string
  scale: number
}

export function logoLook(id: string): LogoLook {
  const key = id.replace(/^partner-web-/, '')
  const e = id.startsWith('partner-web-') ? WEB[key] : OTHER[id]
  return {
    logo: e?.colour ? `/logos/colour/${e.file ?? key}.png` : undefined,
    scale: e?.scale ?? 1,
  }
}
