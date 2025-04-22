export interface Language {
  name: string;
  iconName: string;
  className?: string;
}

export const languages: Record<string, Language> = {
  python: {
    name: "Python",
    iconName: "python",
  },
  r: {
    name: "R",
    iconName: "astro", // Use 'r-lang' (Simple Icons) or fallback if not available
  },
  docker: {
    name: "Docker",
    iconName: "astro",
  },
  aws: {
    name: "AWS",
    iconName: "astro",
  },
  hpc: {
    name: "HPC",
    iconName: "astro", // fallback to a server icon
  },
  gpu: {
    name: "GPU",
    iconName: "astro", // fallback to a gpu icon if available
  },
  jax: {
    name: "JAX",
    iconName: "astro", // fallback: use 'python' or a generic icon if not available
  },
  "scvi-tools": {
    name: "scvi-tools",
    iconName: "astro", // fallback: use 'tools' icon
  },
  scverse: {
    name: "scverse",
    iconName: "astro", // fallback: use 'toolbox' icon
  },
  angular: {
    name: "Angular",
    iconName: "angular",
  },
  astro: {
    name: "Astro",
    iconName: "astro",
  },
  bootstrap: {
    name: "Bootstrap",
    iconName: "bootstrap",
  },
  cloudflare: {
    name: "Cloudflare",
    iconName: "cloudflare",
  },
  html: {
    name: "HTML 5",
    iconName: "html",
  },
  javascript: {
    name: "JavaScript",
    iconName: "javascript",
  },
  mongo: {
    name: "MongoDb",
    iconName: "mongo",
  },
  mysql: {
    name: "MySQL",
    className: "!bg-[#f6ece1]",
    iconName: "mysql",
  },
  wordpress: {
    name: "Wordpress",
    iconName: "wordpress",
  },
  node: {
    name: "Node.js",
    iconName: "node",
  },
  tailwind: {
    name: "Tailwind CSS",
    iconName: "tailwind",
  },
  figma: {
    name: "Figma",
    iconName: "figma",
  },
  firebase: {
    name: "Firebase",
    iconName: "firebase",
  },
  markdown: {
    name: "Markdown",
    iconName: "markdown",
  },
  php: {
    name: "PHP",
    iconName: "php",
  },
  sass: {
    name: "Sass",
    iconName: "sass",
  },
  ts: {
    name: "TypeScript",
    iconName: "typescript",
  },
  git: {
    name: "Git",
    iconName: "git",
  },
  css: {
    name: "CSS",
    iconName: "css",
  },
  vercel: {
    name: "Vercel",
    iconName: "vercel",
  },
  netlify: {
    name: "Netlify",
    iconName: "netlify",
  },
  gatsby: {
    name: "Gatsby",
    iconName: "gatsby",
  },
  windsurf: {
    name: "Windsurf",
    iconName: "windsurf-logo",
  },
  cursor: {
    name: "Cursor",
    iconName: "cursor-ia",
  },
  deepseek: {
    name: "DeepSeek",
    iconName: "deepseek",
  },
  python: {
    name: "Python",
    iconName: "python",
  },
};

export const getLanguage = (lang: string): Language => {
  return languages[lang] || languages.html;
}; 