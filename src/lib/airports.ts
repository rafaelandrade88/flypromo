export interface Airport {
  iata: string
  city: string
  name: string
  country: string
  keywords?: string[] // termos alternativos de busca
}

export const AIRPORTS: Airport[] = [
  // ─── Brasil ───────────────────────────────────────────────────────────────
  { iata: 'GRU', city: 'São Paulo', name: 'Aeroporto Internacional de Guarulhos', country: 'BR', keywords: ['guarulhos', 'sp', 'sao paulo'] },
  { iata: 'CGH', city: 'São Paulo', name: 'Aeroporto de Congonhas', country: 'BR', keywords: ['congonhas', 'sp', 'sao paulo'] },
  { iata: 'VCP', city: 'Campinas', name: 'Aeroporto Internacional de Viracopos', country: 'BR', keywords: ['viracopos', 'campinas'] },
  { iata: 'GIG', city: 'Rio de Janeiro', name: 'Aeroporto Internacional do Galeão', country: 'BR', keywords: ['galeao', 'rio', 'rj'] },
  { iata: 'SDU', city: 'Rio de Janeiro', name: 'Aeroporto Santos Dumont', country: 'BR', keywords: ['santos dumont', 'rio', 'rj'] },
  { iata: 'BSB', city: 'Brasília', name: 'Aeroporto Internacional de Brasília', country: 'BR', keywords: ['brasilia', 'df', 'distrito federal'] },
  { iata: 'SSA', city: 'Salvador', name: 'Aeroporto Internacional Dep. Luís Eduardo Magalhães', country: 'BR', keywords: ['salvador', 'bahia', 'ba'] },
  { iata: 'FOR', city: 'Fortaleza', name: 'Aeroporto Internacional Pinto Martins', country: 'BR', keywords: ['fortaleza', 'ceara', 'ce'] },
  { iata: 'REC', city: 'Recife', name: 'Aeroporto Internacional dos Guararapes', country: 'BR', keywords: ['recife', 'pernambuco', 'pe', 'guararapes'] },
  { iata: 'BEL', city: 'Belém', name: 'Aeroporto Internacional Val-de-Cans', country: 'BR', keywords: ['belem', 'para', 'pa', 'val de cans'] },
  { iata: 'MAO', city: 'Manaus', name: 'Aeroporto Internacional Eduardo Gomes', country: 'BR', keywords: ['manaus', 'amazonas', 'am'] },
  { iata: 'POA', city: 'Porto Alegre', name: 'Aeroporto Internacional Salgado Filho', country: 'BR', keywords: ['porto alegre', 'rio grande do sul', 'rs', 'salgado filho'] },
  { iata: 'CWB', city: 'Curitiba', name: 'Aeroporto Internacional Afonso Pena', country: 'BR', keywords: ['curitiba', 'parana', 'pr', 'afonso pena'] },
  { iata: 'FLN', city: 'Florianópolis', name: 'Aeroporto Internacional Hercílio Luz', country: 'BR', keywords: ['florianopolis', 'santa catarina', 'sc', 'floripa', 'hercilio luz'] },
  { iata: 'NAT', city: 'Natal', name: 'Aeroporto Internacional São Gonçalo do Amarante', country: 'BR', keywords: ['natal', 'rio grande do norte', 'rn', 'sao goncalo'] },
  { iata: 'MCZ', city: 'Maceió', name: 'Aeroporto Internacional Zumbi dos Palmares', country: 'BR', keywords: ['maceio', 'alagoas', 'al', 'zumbi'] },
  { iata: 'AJU', city: 'Aracaju', name: 'Aeroporto Internacional Santa Maria', country: 'BR', keywords: ['aracaju', 'sergipe', 'se'] },
  { iata: 'JPA', city: 'João Pessoa', name: 'Aeroporto Internacional Presidente Castro Pinto', country: 'BR', keywords: ['joao pessoa', 'paraiba', 'pb', 'jp'] },
  { iata: 'THE', city: 'Teresina', name: 'Aeroporto Internacional Senador Petrônio Portela', country: 'BR', keywords: ['teresina', 'piaui', 'pi'] },
  { iata: 'SLZ', city: 'São Luís', name: 'Aeroporto Internacional Marechal Cunha Machado', country: 'BR', keywords: ['sao luis', 'maranhao', 'ma'] },
  { iata: 'CGR', city: 'Campo Grande', name: 'Aeroporto Internacional de Campo Grande', country: 'BR', keywords: ['campo grande', 'mato grosso do sul', 'ms'] },
  { iata: 'CGB', city: 'Cuiabá', name: 'Aeroporto Internacional Marechal Rondon', country: 'BR', keywords: ['cuiaba', 'mato grosso', 'mt', 'rondon'] },
  { iata: 'VIX', city: 'Vitória', name: 'Aeroporto de Vitória – Eurico de Aguiar Salles', country: 'BR', keywords: ['vitoria', 'espirito santo', 'es'] },
  { iata: 'UDI', city: 'Uberlândia', name: 'Aeroporto Internacional de Uberlândia', country: 'BR', keywords: ['uberlandia', 'minas gerais', 'mg'] },
  { iata: 'CNF', city: 'Belo Horizonte', name: 'Aeroporto Internacional Tancredo Neves', country: 'BR', keywords: ['belo horizonte', 'confins', 'minas gerais', 'mg', 'tancredo neves'] },
  { iata: 'PLU', city: 'Belo Horizonte', name: 'Aeroporto da Pampulha', country: 'BR', keywords: ['belo horizonte', 'pampulha', 'mg'] },
  { iata: 'GYN', city: 'Goiânia', name: 'Aeroporto Internacional Santa Genoveva', country: 'BR', keywords: ['goiania', 'goias', 'go'] },
  { iata: 'PMW', city: 'Palmas', name: 'Aeroporto de Palmas', country: 'BR', keywords: ['palmas', 'tocantins', 'to'] },
  { iata: 'PVH', city: 'Porto Velho', name: 'Aeroporto Internacional Governador Jorge Teixeira', country: 'BR', keywords: ['porto velho', 'rondonia', 'ro'] },
  { iata: 'RBR', city: 'Rio Branco', name: 'Aeroporto Internacional Plácido de Castro', country: 'BR', keywords: ['rio branco', 'acre', 'ac'] },
  { iata: 'MCP', city: 'Macapá', name: 'Aeroporto Internacional de Macapá', country: 'BR', keywords: ['macapa', 'amapa', 'ap'] },
  { iata: 'BVB', city: 'Boa Vista', name: 'Aeroporto Internacional Atlas Brasil Cantanhede', country: 'BR', keywords: ['boa vista', 'roraima', 'rr'] },
  { iata: 'IOS', city: 'Ilhéus', name: 'Aeroporto Jorge Amado', country: 'BR', keywords: ['ilheus', 'bahia', 'ba', 'jorge amado'] },
  { iata: 'NVT', city: 'Navegantes', name: 'Aeroporto Internacional de Navegantes', country: 'BR', keywords: ['navegantes', 'santa catarina', 'sc', 'balneario camboriu', 'itajai'] },
  { iata: 'JOI', city: 'Joinville', name: 'Aeroporto Lauro Carneiro de Loyola', country: 'BR', keywords: ['joinville', 'santa catarina', 'sc'] },
  { iata: 'LDB', city: 'Londrina', name: 'Aeroporto Internacional de Londrina', country: 'BR', keywords: ['londrina', 'parana', 'pr'] },
  { iata: 'MAB', city: 'Marabá', name: 'Aeroporto de Marabá', country: 'BR', keywords: ['maraba', 'para', 'pa'] },
  { iata: 'IMP', city: 'Imperatriz', name: 'Aeroporto de Imperatriz', country: 'BR', keywords: ['imperatriz', 'maranhao', 'ma'] },
  { iata: 'STM', city: 'Santarém', name: 'Aeroporto de Santarém', country: 'BR', keywords: ['santarem', 'para', 'pa'] },
  { iata: 'PMG', city: 'Ponta Porã', name: 'Aeroporto de Ponta Porã', country: 'BR', keywords: ['ponta pora', 'mato grosso do sul', 'ms'] },
  { iata: 'XAP', city: 'Chapecó', name: 'Aeroporto Municipal de Chapecó', country: 'BR', keywords: ['chapeco', 'santa catarina', 'sc'] },
  { iata: 'FEN', city: 'Fernando de Noronha', name: 'Aeroporto de Fernando de Noronha', country: 'BR', keywords: ['fernando de noronha', 'noronha', 'pe'] },
  { iata: 'QCJ', city: 'Botucatu', name: 'Aeroporto de Botucatu', country: 'BR', keywords: ['botucatu', 'sao paulo', 'sp'] },
  { iata: 'SOD', city: 'Sorocaba', name: 'Aeroporto Estadual de Sorocaba', country: 'BR', keywords: ['sorocaba', 'sao paulo', 'sp'] },
  { iata: 'RIA', city: 'Santa Maria', name: 'Aeroporto Base Aérea de Santa Maria', country: 'BR', keywords: ['santa maria', 'rio grande do sul', 'rs'] },
  { iata: 'PNZ', city: 'Petrolina', name: 'Aeroporto Senador Nilo Coelho', country: 'BR', keywords: ['petrolina', 'pernambuco', 'pe'] },

  // ─── América do Sul ───────────────────────────────────────────────────────
  { iata: 'EZE', city: 'Buenos Aires', name: 'Aeroporto Internacional Ministro Pistarini', country: 'AR', keywords: ['buenos aires', 'argentina', 'ezeiza'] },
  { iata: 'AEP', city: 'Buenos Aires', name: 'Aeroporto Jorge Newbery', country: 'AR', keywords: ['buenos aires', 'argentina', 'aeroparque'] },
  { iata: 'SCL', city: 'Santiago', name: 'Aeroporto Internacional Comodoro Arturo Merino Benítez', country: 'CL', keywords: ['santiago', 'chile'] },
  { iata: 'LIM', city: 'Lima', name: 'Aeroporto Internacional Jorge Chávez', country: 'PE', keywords: ['lima', 'peru'] },
  { iata: 'BOG', city: 'Bogotá', name: 'Aeroporto Internacional El Dorado', country: 'CO', keywords: ['bogota', 'colombia', 'eldorado'] },
  { iata: 'MVD', city: 'Montevidéu', name: 'Aeroporto Internacional de Carrasco', country: 'UY', keywords: ['montevideu', 'montevideo', 'uruguai', 'uruguay'] },
  { iata: 'ASU', city: 'Assunção', name: 'Aeroporto Internacional Silvio Pettirossi', country: 'PY', keywords: ['assuncao', 'asuncion', 'paraguai', 'paraguay'] },
  { iata: 'GYE', city: 'Guayaquil', name: 'Aeroporto Internacional José Joaquín de Olmedo', country: 'EC', keywords: ['guayaquil', 'equador', 'ecuador'] },
  { iata: 'UIO', city: 'Quito', name: 'Aeroporto Internacional Mariscal Sucre', country: 'EC', keywords: ['quito', 'equador', 'ecuador'] },
  { iata: 'CCS', city: 'Caracas', name: 'Aeroporto Internacional Simón Bolívar', country: 'VE', keywords: ['caracas', 'venezuela'] },
  { iata: 'VVI', city: 'Santa Cruz de la Sierra', name: 'Aeroporto Internacional Viru Viru', country: 'BO', keywords: ['santa cruz', 'bolivia'] },
  { iata: 'CUZ', city: 'Cusco', name: 'Aeroporto Internacional Alejandro Velasco Astete', country: 'PE', keywords: ['cusco', 'cuzco', 'peru', 'machu picchu'] },

  // ─── América do Norte ─────────────────────────────────────────────────────
  { iata: 'MIA', city: 'Miami', name: 'Aeroporto Internacional de Miami', country: 'US', keywords: ['miami', 'florida', 'eua', 'usa'] },
  { iata: 'JFK', city: 'Nova York', name: 'Aeroporto Internacional John F. Kennedy', country: 'US', keywords: ['nova york', 'new york', 'jfk', 'eua', 'usa'] },
  { iata: 'EWR', city: 'Nova York', name: 'Aeroporto Internacional Newark Liberty', country: 'US', keywords: ['nova york', 'new york', 'newark', 'eua', 'usa'] },
  { iata: 'LAX', city: 'Los Angeles', name: 'Aeroporto Internacional de Los Angeles', country: 'US', keywords: ['los angeles', 'la', 'california', 'eua', 'usa'] },
  { iata: 'ORD', city: 'Chicago', name: "Aeroporto Internacional O'Hare", country: 'US', keywords: ['chicago', 'illinois', 'ohare', 'eua', 'usa'] },
  { iata: 'ATL', city: 'Atlanta', name: 'Aeroporto Internacional Hartsfield-Jackson', country: 'US', keywords: ['atlanta', 'georgia', 'eua', 'usa'] },
  { iata: 'DFW', city: 'Dallas', name: 'Aeroporto Internacional Dallas/Fort Worth', country: 'US', keywords: ['dallas', 'fort worth', 'texas', 'eua', 'usa'] },
  { iata: 'IAH', city: 'Houston', name: 'Aeroporto Internacional George Bush', country: 'US', keywords: ['houston', 'texas', 'eua', 'usa'] },
  { iata: 'BOS', city: 'Boston', name: 'Aeroporto Internacional Logan', country: 'US', keywords: ['boston', 'massachusetts', 'eua', 'usa'] },
  { iata: 'SFO', city: 'San Francisco', name: 'Aeroporto Internacional de San Francisco', country: 'US', keywords: ['san francisco', 'california', 'eua', 'usa'] },
  { iata: 'MCO', city: 'Orlando', name: 'Aeroporto Internacional de Orlando', country: 'US', keywords: ['orlando', 'florida', 'disney', 'eua', 'usa'] },
  { iata: 'FLL', city: 'Fort Lauderdale', name: 'Aeroporto Internacional Fort Lauderdale-Hollywood', country: 'US', keywords: ['fort lauderdale', 'florida', 'eua', 'usa'] },
  { iata: 'YYZ', city: 'Toronto', name: 'Aeroporto Internacional Pearson', country: 'CA', keywords: ['toronto', 'canada', 'pearson'] },
  { iata: 'YUL', city: 'Montreal', name: 'Aeroporto Internacional Pierre Elliott Trudeau', country: 'CA', keywords: ['montreal', 'canada', 'trudeau'] },
  { iata: 'MEX', city: 'Cidade do México', name: 'Aeroporto Internacional Benito Juárez', country: 'MX', keywords: ['cidade do mexico', 'ciudad de mexico', 'mexico', 'cdmx'] },
  { iata: 'CUN', city: 'Cancún', name: 'Aeroporto Internacional de Cancún', country: 'MX', keywords: ['cancun', 'mexico', 'cancun'] },

  // ─── Europa ───────────────────────────────────────────────────────────────
  { iata: 'LIS', city: 'Lisboa', name: 'Aeroporto Humberto Delgado', country: 'PT', keywords: ['lisboa', 'lisbon', 'portugal'] },
  { iata: 'OPO', city: 'Porto', name: 'Aeroporto Francisco Sá Carneiro', country: 'PT', keywords: ['porto', 'portugal'] },
  { iata: 'MAD', city: 'Madri', name: 'Aeroporto Adolfo Suárez Madrid-Barajas', country: 'ES', keywords: ['madri', 'madrid', 'espanha', 'spain', 'barajas'] },
  { iata: 'BCN', city: 'Barcelona', name: 'Aeroporto Barcelona-El Prat', country: 'ES', keywords: ['barcelona', 'espanha', 'spain', 'el prat'] },
  { iata: 'CDG', city: 'Paris', name: 'Aeroporto Charles de Gaulle', country: 'FR', keywords: ['paris', 'franca', 'france', 'charles de gaulle'] },
  { iata: 'ORY', city: 'Paris', name: 'Aeroporto de Orly', country: 'FR', keywords: ['paris', 'franca', 'france', 'orly'] },
  { iata: 'LHR', city: 'Londres', name: 'Aeroporto de Heathrow', country: 'GB', keywords: ['londres', 'london', 'inglaterra', 'uk', 'heathrow'] },
  { iata: 'LGW', city: 'Londres', name: 'Aeroporto de Gatwick', country: 'GB', keywords: ['londres', 'london', 'gatwick', 'uk'] },
  { iata: 'FRA', city: 'Frankfurt', name: 'Aeroporto Internacional de Frankfurt', country: 'DE', keywords: ['frankfurt', 'alemanha', 'germany'] },
  { iata: 'MUC', city: 'Munique', name: 'Aeroporto Internacional de Munique', country: 'DE', keywords: ['munique', 'munich', 'alemanha', 'germany'] },
  { iata: 'AMS', city: 'Amsterdã', name: 'Aeroporto de Schiphol', country: 'NL', keywords: ['amsterdam', 'amsterda', 'holanda', 'netherlands', 'schiphol'] },
  { iata: 'FCO', city: 'Roma', name: 'Aeroporto Leonardo da Vinci', country: 'IT', keywords: ['roma', 'rome', 'italia', 'italy', 'fiumicino'] },
  { iata: 'MXP', city: 'Milão', name: 'Aeroporto Internacional Malpensa', country: 'IT', keywords: ['milao', 'milan', 'milano', 'italia', 'italy', 'malpensa'] },
  { iata: 'ZRH', city: 'Zurique', name: 'Aeroporto de Zurique', country: 'CH', keywords: ['zurique', 'zurich', 'suica', 'switzerland'] },
  { iata: 'GVA', city: 'Genebra', name: 'Aeroporto Internacional de Genebra', country: 'CH', keywords: ['genebra', 'geneva', 'suica', 'switzerland'] },
  { iata: 'VIE', city: 'Viena', name: 'Aeroporto Internacional de Viena', country: 'AT', keywords: ['viena', 'vienna', 'austria'] },
  { iata: 'BRU', city: 'Bruxelas', name: 'Aeroporto de Bruxelas', country: 'BE', keywords: ['bruxelas', 'brussels', 'belgica', 'belgium'] },
  { iata: 'CPH', city: 'Copenhague', name: 'Aeroporto de Copenhague', country: 'DK', keywords: ['copenhague', 'copenhagen', 'dinamarca', 'denmark'] },
  { iata: 'ARN', city: 'Estocolmo', name: 'Aeroporto de Arlanda', country: 'SE', keywords: ['estocolmo', 'stockholm', 'suecia', 'sweden', 'arlanda'] },
  { iata: 'OSL', city: 'Oslo', name: 'Aeroporto de Gardermoen', country: 'NO', keywords: ['oslo', 'noruega', 'norway'] },
  { iata: 'HEL', city: 'Helsinque', name: 'Aeroporto de Helsinque-Vantaa', country: 'FI', keywords: ['helsinque', 'helsinki', 'finlandia', 'finland'] },
  { iata: 'ATH', city: 'Atenas', name: 'Aeroporto Internacional Eleftherios Venizelos', country: 'GR', keywords: ['atenas', 'athens', 'grecia', 'greece'] },
  { iata: 'IST', city: 'Istambul', name: 'Aeroporto Internacional de Istambul', country: 'TR', keywords: ['istambul', 'istanbul', 'turquia', 'turkey'] },

  // ─── Caribe ───────────────────────────────────────────────────────────────
  { iata: 'PUJ', city: 'Punta Cana', name: 'Aeroporto Internacional de Punta Cana', country: 'DO', keywords: ['punta cana', 'republica dominicana', 'dominican republic'] },
  { iata: 'SDQ', city: 'Santo Domingo', name: 'Aeroporto Internacional Las Américas', country: 'DO', keywords: ['santo domingo', 'republica dominicana'] },
  { iata: 'HAV', city: 'Havana', name: 'Aeroporto Internacional José Martí', country: 'CU', keywords: ['havana', 'cuba'] },
  { iata: 'NAS', city: 'Nassau', name: 'Aeroporto Internacional Lynden Pindling', country: 'BS', keywords: ['nassau', 'bahamas'] },
  { iata: 'MBJ', city: 'Montego Bay', name: 'Aeroporto Internacional Sangster', country: 'JM', keywords: ['montego bay', 'jamaica'] },

  // ─── África ───────────────────────────────────────────────────────────────
  { iata: 'LOS', city: 'Lagos', name: 'Aeroporto Internacional Murtala Muhammed', country: 'NG', keywords: ['lagos', 'nigeria'] },
  { iata: 'JNB', city: 'Joanesburgo', name: 'Aeroporto Internacional O. R. Tambo', country: 'ZA', keywords: ['joanesburgo', 'johannesburg', 'africa do sul', 'south africa'] },
  { iata: 'CPT', city: 'Cidade do Cabo', name: 'Aeroporto Internacional da Cidade do Cabo', country: 'ZA', keywords: ['cidade do cabo', 'cape town', 'africa do sul'] },
  { iata: 'LUN', city: 'Luanda', name: 'Aeroporto Internacional Quatro de Fevereiro', country: 'AO', keywords: ['luanda', 'angola'] },

  // ─── Ásia / Oceania ───────────────────────────────────────────────────────
  { iata: 'DXB', city: 'Dubai', name: 'Aeroporto Internacional de Dubai', country: 'AE', keywords: ['dubai', 'emirados arabes', 'uae'] },
  { iata: 'DOH', city: 'Doha', name: 'Aeroporto Internacional Hamad', country: 'QA', keywords: ['doha', 'qatar'] },
  { iata: 'NRT', city: 'Tóquio', name: 'Aeroporto Internacional de Narita', country: 'JP', keywords: ['toquio', 'tokyo', 'japao', 'japan', 'narita'] },
  { iata: 'HND', city: 'Tóquio', name: 'Aeroporto Internacional de Haneda', country: 'JP', keywords: ['toquio', 'tokyo', 'japao', 'japan', 'haneda'] },
  { iata: 'PEK', city: 'Pequim', name: 'Aeroporto Internacional Capital de Pequim', country: 'CN', keywords: ['pequim', 'beijing', 'china'] },
  { iata: 'PVG', city: 'Xangai', name: 'Aeroporto Internacional de Pudong', country: 'CN', keywords: ['xangai', 'shanghai', 'china', 'pudong'] },
  { iata: 'HKG', city: 'Hong Kong', name: 'Aeroporto Internacional de Hong Kong', country: 'HK', keywords: ['hong kong'] },
  { iata: 'SIN', city: 'Singapura', name: 'Aeroporto de Changi', country: 'SG', keywords: ['singapura', 'singapore', 'changi'] },
  { iata: 'BKK', city: 'Bangkok', name: 'Aeroporto Internacional Suvarnabhumi', country: 'TH', keywords: ['bangkok', 'tailandia', 'thailand'] },
  { iata: 'SYD', city: 'Sydney', name: 'Aeroporto Internacional de Kingsford Smith', country: 'AU', keywords: ['sydney', 'australia'] },
  { iata: 'MEL', city: 'Melbourne', name: 'Aeroporto Internacional de Melbourne', country: 'AU', keywords: ['melbourne', 'australia'] },
  { iata: 'AKL', city: 'Auckland', name: 'Aeroporto Internacional de Auckland', country: 'NZ', keywords: ['auckland', 'nova zelandia', 'new zealand'] },
]

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function searchAirports(query: string, limit = 8): Airport[] {
  const q = normalize(query.trim())
  if (!q) return []

  const results: Array<{ airport: Airport; score: number }> = []

  for (const airport of AIRPORTS) {
    let score = 0
    const iata = airport.iata.toLowerCase()
    const city = normalize(airport.city)
    const name = normalize(airport.name)
    const keywords = (airport.keywords ?? []).map(normalize)

    // Código IATA exato
    if (iata === q) { score = 100; }
    // Código IATA começa com
    else if (iata.startsWith(q)) { score = 90; }
    // Cidade começa com
    else if (city.startsWith(q)) { score = 80; }
    // Cidade contém
    else if (city.includes(q)) { score = 70; }
    // Keyword começa com
    else if (keywords.some(k => k.startsWith(q))) { score = 60; }
    // Nome do aeroporto contém
    else if (name.includes(q)) { score = 50; }
    // Keyword contém
    else if (keywords.some(k => k.includes(q))) { score = 40; }

    if (score > 0) results.push({ airport, score })
  }

  return results
    .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city))
    .slice(0, limit)
    .map(r => r.airport)
}
