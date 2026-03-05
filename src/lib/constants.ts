// ═══════════════════════════════════════════════════════════
// TITANES GRÁFICOS — Constants & Data
// ═══════════════════════════════════════════════════════════

export const COMPANY = {
  name: 'Titanes Gráficos',
  tagline: 'CREAMOS LO QUE IMAGINAS',
  description: 'Soluciones integrales en impresión, corte y producción gráfica industrial',
  phone: '+58 412-1234567',
  whatsapp: '584121234567',
  email: 'info@titanesgraficos.com.ve',
  address: 'Zona Industrial, Valencia, Venezuela',
  instagram: '@titanesgraficos',
  website: 'titanesgraficos.com.ve',
  hours: 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 12:00 PM',
}

export const SERVICES = [
  {
    id: 'gran-formato',
    title: 'Impresión Gran Formato',
    shortDesc: 'Banners, vallas, lonas y más con tecnología Mimaki',
    icon: '🖨️',
    details: 'Plotter Mimaki de última generación para banners, vallas publicitarias, lonas, microperforado y señalización de gran tamaño.',
    materials: ['Banner 13oz', 'Lona Frontlit', 'Microperforado', 'Vinil Adhesivo'],
  },
  {
    id: 'impresion-uv',
    title: 'Impresión UV',
    shortDesc: 'Directo sobre rígidos con Mimaki UV',
    icon: '💎',
    details: 'Impresión directa sobre materiales rígidos: acrílico, PVC, MDF, aluminio, vidrio y más.',
    materials: ['Acrílico', 'PVC Espumado', 'MDF', 'Aluminio Compuesto'],
  },
  {
    id: 'digital-offset',
    title: 'Impresión Digital',
    shortDesc: 'Tarjetas, volantes, folletos, catálogos',
    icon: '📄',
    details: 'Producción de material impreso con acabados profesionales para tu marca.',
    materials: ['Cartulina Sulfatada', 'Papel Bond', 'Propalcote', 'Couché'],
  },
  {
    id: 'corte-cnc',
    title: 'Corte CNC',
    shortDesc: 'Precisión industrial en cualquier material',
    icon: '⚙️',
    details: 'Cuchilla oscilatoria y CNC Hermle para corte de precisión en acrílico, MDF, PVC, aluminio y más.',
    materials: ['Acrílico', 'MDF', 'PVC', 'Foam Board'],
  },
  {
    id: 'laser-co2',
    title: 'Grabado Láser CO2',
    shortDesc: 'Corte y grabado en acrílico, MDF, telas',
    icon: '🔥',
    details: 'Máquina láser CO2 para corte y grabado de precisión en materiales no metálicos.',
    materials: ['Acrílico', 'MDF', 'Telas', 'Papel', 'Cuero'],
  },
  {
    id: 'fibra-laser',
    title: 'Fibra Láser',
    shortDesc: 'Grabado permanente en metales',
    icon: '✨',
    details: 'Grabado de fibra láser para metales: acero, aluminio, trofeos, placas industriales.',
    materials: ['Acero Inoxidable', 'Aluminio', 'Cobre', 'Latón'],
  },
  {
    id: 'sublimacion',
    title: 'Sublimación',
    shortDesc: 'Calandra neumática para textiles',
    icon: '👕',
    details: 'Calandra Pengda Neumática con tambor de aceite. Sublimación rollo a rollo para dry fit, lycra, lonas y más.',
    materials: ['Dry Fit', 'Lycra', 'Lona', 'Microdurazno'],
  },
  {
    id: 'rotulado',
    title: 'Rotulado Vehicular',
    shortDesc: 'Wrapping completo, vinilos especiales',
    icon: '🚗',
    details: 'Rotulado vehicular completo con vinilos de alta calidad. Wrapping parcial y total.',
    materials: ['Vinil Polimérico', 'Vinil Cast', 'Microperforado'],
  },
  {
    id: 'tiendas',
    title: 'Remodelación de Tiendas',
    shortDesc: 'Diseño interior y señalética comercial',
    icon: '🏪',
    details: 'Transformamos espacios comerciales con diseño integral, señalética y decoración.',
    materials: ['PVC', 'Acrílico', 'MDF', 'Vinil Decorativo'],
  },
  {
    id: 'fachadas',
    title: 'Fachadas',
    shortDesc: 'Diseño e instalación profesional',
    icon: '🏗️',
    details: 'Diseño e instalación de fachadas comerciales que impactan. Estructura y gráfica.',
    materials: ['Aluminio Compuesto', 'Lona', 'Acrílico', 'LED'],
  },
  {
    id: 'corporeos',
    title: 'Corpóreos',
    shortDesc: 'Letras y logos 3D en cualquier material',
    icon: '🔤',
    details: 'Letras y logos tridimensionales en acrílico, MDF, PVC espumado, aluminio y más.',
    materials: ['Acrílico', 'MDF', 'PVC Espumado', 'Acero'],
  },
  {
    id: 'senaletica',
    title: 'Señalética',
    shortDesc: 'Sistemas de señalización profesional',
    icon: '🪧',
    details: 'Sistemas completos de señalización interior y exterior para espacios comerciales e industriales.',
    materials: ['Acrílico', 'Aluminio', 'PVC', 'Vinil'],
  },
]

export const MACHINES = [
  {
    name: 'Mimaki Gran Formato',
    type: 'Plotter de Impresión',
    spec: 'Ancho máx: 3.2m | Solvente/Ecosolvente',
    description: 'Impresión de alta velocidad para banners, lonas y vinilos de gran formato.',
  },
  {
    name: 'Mimaki UV',
    type: 'Impresora UV Cama Plana',
    spec: 'Resolución: 1440dpi | Rígidos hasta 10cm',
    description: 'Impresión directa sobre materiales rígidos con curado UV instantáneo.',
  },
  {
    name: 'Wiprime',
    type: 'Impresora Digital',
    spec: 'Digital de Alta Velocidad | CMYK + Barniz',
    description: 'Producción digital de alta calidad para tirajes cortos y medios.',
  },
  {
    name: 'Calandra Pengda',
    type: 'Sublimación Neumática',
    spec: 'Tambor de Aceite | 1.7m Ancho | Rollo a Rollo',
    description: 'Sublimación industrial para textiles deportivos, telas y lonas.',
  },
  {
    name: 'CNC Cuchilla Oscilatoria',
    type: 'Corte de Precisión',
    spec: 'Área: 1.3×2.5m | Textiles y Flexibles',
    description: 'Corte CNC de alta precisión para materiales flexibles y textiles.',
  },
  {
    name: 'CNC Hermle',
    type: 'Mecanizado Industrial',
    spec: '5 Ejes | Precisión: ±0.01mm',
    description: 'Centro de mecanizado de precisión industrial para materiales rígidos.',
  },
  {
    name: 'Láser CO2',
    type: 'Corte y Grabado',
    spec: '150W | Área: 1.3×0.9m | No Metálicos',
    description: 'Corte y grabado láser para acrílico, MDF, telas y papel.',
  },
  {
    name: 'Fibra Láser',
    type: 'Grabado en Metales',
    spec: '50W | Marcado permanente | Metales',
    description: 'Grabado de alta precisión en acero, aluminio, trofeos y placas.',
  },
]

export const STATS = [
  { value: 5000, suffix: '+', label: 'Proyectos Completados' },
  { value: 12, suffix: '', label: 'Servicios Especializados' },
  { value: 8, suffix: '', label: 'Máquinas Industriales' },
  { value: 15, suffix: '+', label: 'Años de Experiencia' },
]

export const NAV_LINKS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Maquinaria', href: '#maquinaria' },
  { label: 'Contacto', href: '#contacto' },
]
