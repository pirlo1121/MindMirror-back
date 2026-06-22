const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('../models/Post');
const User = require('../models/User');
const slugify = require('slugify');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const posts = [
  // ─── PUBLISHED POSTS ─────────────────────────────────────────────
  {
    title: 'Guía Completa de JavaScript Moderno: ES2024',
    slug: 'guia-completa-javascript-moderno-es2024',
    excerpt: 'Descubre las nuevas características de ECMAScript 2024 y cómo aplicarlas en tus proyectos para escribir código más limpio y eficiente.',
    coverImage: 'https://i.pinimg.com/736x/d4/a8/a7/d4a8a731460cbf6d0b07d0e86550cd43.jpg',
    status: 'published',
    tags: ['javascript', 'es2024', 'programacion'],
    content: [
      { type: 'paragraph', content: 'JavaScript no deja de evolucionar. Cada año, ECMAScript nos trae nuevas funcionalidades que hacen que nuestro código sea más expresivo, seguro y fácil de mantener. En esta guía recorreremos las novedades más impactantes de ES2024.' },
      { type: 'heading', content: 'GroupBy y Object.groupBy', level: 2 },
      { type: 'paragraph', content: 'Una de las adiciones más esperadas es el método Object.groupBy, que permite agrupar elementos de un array según una función de callback. Olvídate de implementar este patrón manualmente.' },
      { type: 'quote', content: 'El código limpio no se escribe, se reescribe. La evolución de JavaScript nos acerca cada vez más a ese ideal.' },
      { type: 'list', items: ['GroupBy para arrays', 'Promise.withResolvers', 'Decoradores nativos', 'Mejoras en RegExp'] },
      { type: 'paragraph', content: 'Estas características ya están disponibles en los navegadores modernos y en Node.js 22+. No esperes más para adoptarlas.' },
    ]
  },
  {
    title: '10 Hábitos Diarios para Desarrolladores Productivos',
    slug: '10-habitos-diarios-desarrolladores-productivos',
    excerpt: 'Pequeños cambios en tu rutina diaria pueden multiplicar tu productividad como desarrollador. Aquí tienes 10 hábitos respaldados por la ciencia.',
    coverImage: 'https://i.pinimg.com/1200x/4d/60/a0/4d60a06516c0ab9e1df256b08ae9f79b.jpg',
    status: 'published',
    tags: ['productividad', 'carrera', 'habitos'],
    content: [
      { type: 'paragraph', content: 'La productividad no se trata de trabajar más horas, sino de trabajar mejor. Tras años de experimentación y estudio, estos son los hábitos que realmente marcan la diferencia.' },
      { type: 'heading', content: 'Los 10 Hábitos Esenciales', level: 2 },
      { type: 'list', items: ['Planifica el día la noche anterior', 'Bloquea 2 horas de trabajo profundo sin interrupciones', 'Revisa tu código antes del primer café', 'Escribe tests antes del código (TDD)', 'Toma descansos de 5 minutos cada hora', 'Lee código de otros desarrolladores', 'Documenta mientras programas, no después', 'Mantén un diario de aprendizaje', 'Haz ejercicio al mediodía', 'Revisa y reflexiona cada viernes'] },
      { type: 'image', imageUrl: '/images/deep-work.jpg' },
      { type: 'heading', content: 'El Poder del Trabajo Profundo', level: 3 },
      { type: 'paragraph', content: 'Cal Newport popularizó el concepto de "trabajo profundo": la capacidad de concentrarse sin distracciones en tareas cognitivamente exigentes. Para un desarrollador, esto significa bloques de 90-120 minutos sin Slack, email ni redes sociales.' },
      { type: 'quote', content: 'La clave no es priorizar lo que está en tu agenda, sino programar tus prioridades.' },
    ]
  },
  {
    title: 'Arquitectura Limpia en Node.js: Del Caos al Orden',
    slug: 'arquitectura-limpia-nodejs-caos-orden',
    excerpt: 'Aprende a estructurar tus aplicaciones Node.js siguiendo los principios de Clean Architecture para que sean mantenibles, testables y escalables.',
    coverImage: '/images/clean-arch.jpg',
    status: 'published',
    tags: ['nodejs', 'arquitectura', 'clean-architecture'],
    content: [
      { type: 'paragraph', content: 'Todos hemos heredado un código espagueti que da miedo tocar. La Clean Architecture de Robert C. Martin nos ofrece una hoja de ruta para evitarlo. Pero, ¿cómo se aplica realmente en Node.js?' },
      { type: 'heading', content: 'Los Cuatro Niveles', level: 2 },
      { type: 'list', items: ['Entidades (Domain) — Reglas de negocio puras', 'Casos de Uso (Application) — Orquestación de la lógica', 'Adaptadores (Interface) — Puertos y controladores', 'Infraestructura (External) — DB, APIs, servicios externos'] },
      { type: 'image', imageUrl: '/images/clean-arch-diagram.jpg' },
      { type: 'paragraph', content: 'La regla de oro: las dependencias apuntan hacia adentro. El dominio nunca debe depender de Express, MongoDB ni de ningún framework externo.' },
      { type: 'heading', content: 'Ejemplo Práctico en TypeScript', level: 3 },
      { type: 'paragraph', content: 'Imagina un caso de uso "CrearUsuario". El controlador recibe el request, lo pasa al caso de uso, y este última valida reglas de negocio antes de llamar al repositorio. Simple, limpio, testeable.' },
      { type: 'quote', content: 'Una buena arquitectura permite retrasar decisiones importantes. No necesitas saber si usarás PostgreSQL o MongoDB hasta el último momento.' },
    ]
  },
  {
    title: 'El Arte del Diseño UX: Principios que Todo Dev Debería Conocer',
    slug: 'arte-diseno-ux-principios-dev-deberia-conocer',
    excerpt: 'No necesitas ser diseñador para crear interfaces que enamoren. Estos principios de UX te ayudarán a tomar mejores decisiones en tus proyectos.',
    coverImage: 'https://i.pinimg.com/736x/a3/cb/70/a3cb7074acab2df566ca7ca0089f5883.jpg',
    status: 'published',
    tags: ['ux', 'diseno', 'frontend'],
    content: [
      { type: 'paragraph', content: 'Durante años pensé que el diseño era responsabilidad de los diseñadores. Hasta que entendí que como desarrollador, cada componente que creo es una decisión de UX.' },
      { type: 'heading', content: 'Principios Fundamentales', level: 2 },
      { type: 'list', items: ['Ley de Fitts: los elementos importantes deben ser grandes y estar cerca', 'Ley de Hick: a más opciones, más tiempo para decidir', 'Efecto Von Restorff: lo diferente se recuerda más', 'Regla 80/20: el 80% del uso viene del 20% de las funciones'] },
      { type: 'image', imageUrl: '/images/ux-principles.jpg' },
      { type: 'quote', content: 'El mejor diseño es el que menos se nota. Un buen UX desaparece para que el usuario se concentre en lo que realmente importa.' },
      { type: 'heading', content: 'De la Teoría a la Práctica', level: 2 },
      { type: 'paragraph', content: 'Aplica estos principios en tu próximo PR: reduce el número de clicks, usa micro-interacciones para dar feedback, y sobre todo, prueba con usuarios reales desde el primer prototipo.' },
    ]
  },

  // ─── DRAFT POSTS ─────────────────────────────────────────────────
  {
    title: 'Introducción a la Computación Cuántica para Programadores',
    slug: 'introduccion-computacion-cuantica-programadores',
    excerpt: 'La computación cuántica promete revolucionar la tecnología. En este artículo desmitificamos los conceptos básicos desde la perspectiva de un desarrollador.',
    coverImage: '/images/quantum.jpg',
    status: 'draft',
    tags: ['cuantica', 'futuro', 'computacion'],
    content: [
      { type: 'paragraph', content: 'Qubits, superposición, entrelazamiento... suena a ciencia ficción, pero la computación cuántica ya es una realidad. Grandes empresas como IBM, Google y Microsoft tienen ordenadores cuánticos funcionando.' },
      { type: 'heading', content: '¿Qué es un Qubit?', level: 2 },
      { type: 'paragraph', content: 'A diferencia del bit clásico que solo puede ser 0 o 1, un qubit puede estar en superposición: una combinación probabilística de ambos estados simultáneamente. Esto permite realizar múltiples cálculos en paralelo.' },
      { type: 'image', imageUrl: '/images/qubit-bloch.jpg' },
      { type: 'heading', content: 'Algoritmos Cuánticos Famosos', level: 2 },
      { type: 'list', items: ['Algoritmo de Shor — Factorización de números grandes', 'Algoritmo de Grover — Búsqueda en bases de datos no ordenadas', 'Algoritmo de Deutsch-Jozsa — Distinción de funciones'] },
      { type: 'quote', content: 'La naturaleza no es clásica. Si quieres simularla, necesitas mecánica cuántica.' },
      { type: 'paragraph', content: 'Este artículo sigue en desarrollo. Faltan secciones sobre Qiskit y cómo empezar a programar en simuladores cuánticos.' },
    ]
  },
  {
    title: 'Sistema de Diseño con Web Components: Guía Paso a Paso',
    slug: 'sistema-diseno-web-components-guia',
    excerpt: 'Construye tu propio sistema de diseño reutilizable usando la potencia nativa de los Web Components. Sin frameworks, sin dependencias pesadas.',
    coverImage: 'https://i.pinimg.com/736x/b6/11/26/b6112646389afdd713a63b57b7e45703.jpg',
    status: 'draft',
    tags: ['web-components', 'diseno', 'frontend'],
    content: [
      { type: 'paragraph', content: 'Los Web Components han madurado. Con Custom Elements, Shadow DOM y CSS Custom Properties, hoy podemos crear bibliotecas de componentes que funcionan en cualquier framework.' },
      { type: 'heading', content: 'Arquitectura del Sistema', level: 2 },
      { type: 'list', items: ['Design Tokens — colores, tipografía, espaciado', 'Componentes Atómicos — botones, inputs, etiquetas', 'Componentes Moleculares — cards, modales, formularios', 'Componentes Organismo — headers, footers, layouts'] },
      { type: 'image', imageUrl: '/images/atomic-design.jpg' },
      { type: 'heading', content: 'Creando Nuestro Primer Componente', level: 3 },
      { type: 'paragraph', content: 'Usaremos la API de Custom Elements v1. Cada componente extiende HTMLElement y define su propio template mediante innerHTML o un elemento <template>.' },
      { type: 'quote', content: 'Un buen sistema de diseño no solo unifica la UI, sino que crea un lenguaje compartido entre diseñadores y desarrolladores.' },
    ]
  },
  {
    title: 'Desplegando una API Serverless con Cloudflare Workers',
    slug: 'desplegando-api-serverless-cloudflare-workers',
    excerpt: 'Aprende a desplegar APIs ultrarrápidas en el edge de Cloudflare Workers. Menos latency, más escalabilidad y sin servidores que administrar.',
    coverImage: 'https://i.pinimg.com/736x/b6/11/26/b6112646389afdd713a63b57b7e45703.jpg',
    status: 'draft',
    tags: ['serverless', 'cloudflare', 'api'],
    content: [
      { type: 'paragraph', content: 'Cloudflare Workers ejecuta tu código en más de 300 ciudades alrededor del mundo. Tu API responde desde el datacenter más cercano al usuario. El resultado: latencias mínimas y escalabilidad prácticamente infinita.' },
      { type: 'heading', content: 'Ventajas frente a AWS Lambda', level: 2 },
      { type: 'list', items: ['Latencia ultrabaja gracias a la red global de Cloudflare', 'Sin cold starts significativos', 'Precios predecibles y generosos (100k requests/día gratis)', 'Integración nativa con KV, R2, D1 y Workers AI'] },
      { type: 'image', imageUrl: '/images/workers-edge.jpg' },
      { type: 'heading', content: 'Ejemplo: API REST con Hono', level: 3 },
      { type: 'paragraph', content: 'Hono es un framework ultraligero para el edge. Con pocas líneas tienes una API REST con routing, validación y middleware funcionando en Workers.' },
      { type: 'paragraph', content: 'Artículo pendiente de revisión técnica. Faltan capturas de pantalla del dashboard y el tutorial de deploy con Wrangler.' },
    ]
  },
  {
    title: 'El Futuro del Desarrollo Web en 2025: Tendencias y Predicciones',
    slug: 'futuro-desarrollo-web-2025-tendencias-predicciones',
    excerpt: 'Análisis de las tendencias que definirán el desarrollo web en 2025: AI generativa, WebGPU, assasembly en el frontend y más.',
    coverImage: 'https://i.pinimg.com/736x/b6/11/26/b6112646389afdd713a63b57b7e45703.jpg',
    status: 'draft',
    tags: ['tendencias', '2025', 'futuro'],
    content: [
      { type: 'paragraph', content: 'Cada año el ecosistema web se transforma. 2025 no será la excepción. Estas son las tendencias que, según nuestro análisis, dominarán el panorama.' },
      { type: 'heading', content: 'Tendencias Clave', level: 2 },
      { type: 'list', items: ['AI integrada en el flujo de desarrollo (copilots, generación de UI)', 'WebGPU como estándar para gráficos y ML en el navegador', 'Componentes web nativos ganando terreno frente a frameworks pesados', 'Edge computing como la norma para APIs y renderizado'] },
      { type: 'image', imageUrl: '/images/trends-2025.jpg' },
      { type: 'quote', content: 'La mejor manera de predecir el futuro es construirlo. Como desarrolladores, tenemos el poder de dar forma a lo que viene.' },
      { type: 'heading', content: 'El Auge de la AI Generativa', level: 3 },
      { type: 'paragraph', content: 'Herramientas como GitHub Copilot y Cursor ya son parte del día a día. Pero en 2025 veremos una integración mucho más profunda: generación de componentes completos a partir de descripciones en lenguaje natural.' },
      { type: 'paragraph', content: 'Artículo en borrador — sección de conclusiones pendiente de escribir.' },
    ]
  }
];

const importData = async () => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      console.error('No hay usuarios en la base de datos. Ejecuta primero: npm run seed');
      process.exit(1);
    }

    const admin = users.find(u => u.role === 'admin');
    const normal = users.find(u => u.role === 'user');
    console.log('user admins....', admin)

    await Post.deleteMany();

    // const postsWithAuthors = posts.map((post, index) => ({
    //   ...post,
    //   author: index % 2 === 0 ? admin._id : normal._id
    // }));
    const postsWithAuthors = posts.map((post) => {
      return {
        ...post,
        author: admin._id
      }
    })

    await Post.create(postsWithAuthors);

    console.log(`¡${posts.length} artículos creados exitosamente!`);
    console.log(`  → ${posts.filter(p => p.status === 'published').length} publicados`);
    console.log(`  → ${posts.filter(p => p.status === 'draft').length} en draft`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Post.deleteMany();
    console.log('Todos los artículos han sido eliminados.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
