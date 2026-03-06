// ═══════════════════════════════════════════════════════════
// TITANES GRÁFICOS — Constants & Data
// ═══════════════════════════════════════════════════════════

export const COMPANY = {
  name: 'Titanes Gráficos',
  tagline: 'CREAMOS LO QUE IMAGINAS',
  description: 'Soluciones integrales en impresión, corte y producción gráfica profesional',
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
  // ═══ IMPRESIÓN GRAN FORMATO ═══
  {
    name: 'Mimaki JV300 Plus',
    type: 'Impresión Gran Formato',
    spec: 'Ancho: 3.2m | Solvente/Ecosolvente | 1440dpi',
    description: 'Plotter principal de alta velocidad para banners, lonas y vinilos de gran formato.',
  },
  {
    name: 'Mimaki CJV150',
    type: 'Impresión y Corte',
    spec: 'Ancho: 1.6m | Print & Cut Integrado',
    description: 'Impresión y corte integrado para stickers, etiquetas y vinil decorativo.',
  },
  {
    name: 'Mimaki JV150',
    type: 'Impresión Gran Formato',
    spec: 'Ancho: 1.6m | Ecosolvente | Alta Velocidad',
    description: 'Línea secundaria de producción para tirajes continuos y trabajos urgentes.',
  },
  // ═══ IMPRESIÓN UV ═══
  {
    name: 'Mimaki UJF-7151 Plus II',
    type: 'Impresora UV Cama Plana',
    spec: '1440dpi | Rígidos hasta 15cm | CMYK+W',
    description: 'Impresión directa sobre materiales rígidos con curado UV instantáneo.',
  },
  {
    name: 'Mimaki UJV100-160',
    type: 'Impresora UV Roll-to-Roll',
    spec: 'Ancho: 1.6m | UV LED | Tinta Flexible',
    description: 'Impresión UV sobre materiales flexibles: lonas, backlit, vinilos especiales.',
  },
  // ═══ IMPRESIÓN DIGITAL ═══
  {
    name: 'Wiprime',
    type: 'Impresora Digital Offset',
    spec: 'Alta Velocidad | CMYK + Barniz Selectivo',
    description: 'Producción digital de alta calidad para tarjetas, folletos y catálogos.',
  },
  {
    name: 'Impresora Tóner',
    type: 'Impresión Digital',
    spec: 'Formato: A3+ | Tóner Láser | Doble Cara',
    description: 'Producción de tirajes cortos con acabado profesional inmediato.',
  },
  // ═══ SUBLIMACIÓN ═══
  {
    name: 'Calandra Pengda Neumática',
    type: 'Sublimación Industrial',
    spec: 'Tambor de Aceite | 1.7m | Rollo a Rollo',
    description: 'Sublimación industrial para textiles deportivos, telas técnicas y lonas.',
  },
  {
    name: 'Prensa Térmica Plana',
    type: 'Sublimación',
    spec: '40×60cm | Control Digital | 0-250°C',
    description: 'Sublimación pieza a pieza para artículos promocionales, tazas y premios.',
  },
  {
    name: 'Plotter Sublimación',
    type: 'Impresión para Sublimación',
    spec: 'Ancho: 1.6m | Tinta Sublimación | Alta Densidad',
    description: 'Impresión de transfers de sublimación para textiles y superficies rígidas.',
  },
  // ═══ CORTE CNC ═══
  {
    name: 'CNC Cuchilla Oscilatoria',
    type: 'Corte de Precisión',
    spec: 'Área: 1.3×2.5m | Textiles y Flexibles',
    description: 'Corte CNC de alta precisión para materiales flexibles, textiles y foam.',
  },
  {
    name: 'Router CNC 3 Ejes',
    type: 'Corte y Fresado',
    spec: 'Área: 2.4×1.2m | MDF, Acrílico, PVC',
    description: 'Router industrial para corte y fresado de materiales rígidos y corpóreos.',
  },
  {
    name: 'CNC Hermle',
    type: 'Mecanizado Industrial',
    spec: '5 Ejes | Precisión: ±0.01mm | Metales',
    description: 'Centro de mecanizado de precisión industrial para piezas metálicas y moldes.',
  },
  // ═══ LÁSER ═══
  {
    name: 'Láser CO2 150W',
    type: 'Corte y Grabado Láser',
    spec: '150W | Área: 1.3×0.9m | No Metálicos',
    description: 'Corte y grabado láser gran formato para acrílico, MDF y telas.',
  },
  {
    name: 'Láser CO2 80W',
    type: 'Grabado Láser',
    spec: '80W | Área: 0.6×0.4m | Detalle Fino',
    description: 'Grabado de precisión para piezas pequeñas, sellos, trofeos y señalética.',
  },
  {
    name: 'Fibra Láser',
    type: 'Grabado en Metales',
    spec: '50W | Marcado Permanente | Acero/Aluminio',
    description: 'Grabado de alta precisión en metales: placas industriales, trofeos, joyería.',
  },
  // ═══ CORTE Y ACABADO ═══
  {
    name: 'Plotter de Corte Mimaki',
    type: 'Corte de Vinil',
    spec: 'Ancho: 1.4m | Corte de Contorno | Sensor Óptico',
    description: 'Corte de vinil adhesivo, transfer textil y contornos de impresión.',
  },
  {
    name: 'Laminadora Industrial',
    type: 'Laminado',
    spec: 'Ancho: 1.6m | Frío y Caliente | Rollo a Rollo',
    description: 'Laminado protector para impresiones: mate, brillante, texturizado.',
  },
  {
    name: 'Guillotina Industrial',
    type: 'Corte Recto',
    spec: 'Ancho: 1.2m | Programable | Corte Múltiple',
    description: 'Corte recto de precisión para papel, cartón, vinil y materiales delgados.',
  },
  {
    name: 'Dobladora de Acrílico',
    type: 'Termoformado',
    spec: 'Longitud: 1.5m | Resistencia Térmica',
    description: 'Doblado térmico de acrílico para displays, exhibidores y corpóreos.',
  },
  {
    name: 'Soldadora de Lona',
    type: 'Confección',
    spec: 'Alta Frecuencia | Sellado Hermético',
    description: 'Soldadura de lonas para toldos, estructuras publicitarias y carpas.',
  },
  {
    name: 'Compresor Industrial',
    type: 'Neumática',
    spec: '10HP | Secador Integrado | 500L',
    description: 'Suministro de aire comprimido para CNC, calandra y equipos neumáticos.',
  },
]

export const STATS = [
  { value: 5000, suffix: '+', label: 'Proyectos Completados' },
  { value: 12, suffix: '', label: 'Servicios Especializados' },
  { value: 22, suffix: '+', label: 'Máquinas Industriales' },
  { value: 15, suffix: '+', label: 'Años de Experiencia' },
]

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Portafolio', href: '/#portafolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/#contacto' },
]
