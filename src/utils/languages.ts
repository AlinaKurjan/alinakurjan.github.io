export interface Language {
  name: string;
  iconName: string;
  className?: string;
}

export const languages: Record<string, Language> = {
  bash: {
    name: "Bash",
    iconName: "Bash_light",
  },
  atlassian: {
    name: "Atlassian",
    iconName: "atlassian",
  },
  homebrew: {
    name: "Homebrew",
    iconName: "homebrew",
  },
  illustrator: {
    name: "Illustrator",
    iconName: "illustrator",
  },
  indesign: {
    name: "InDesign",
    iconName: "indesign",
  },
  linux: {
    name: "Linux",
    iconName: "linux",
  },
  tensorflow: {
    name: "TensorFlow",
    iconName: "tensorflow",
  },
  r: {
    name: "R",
    iconName: "R_light", // Use 'r-lang' (Simple Icons) or fallback if not available
  },
  docker: {
    name: "Dask",
    iconName: "Dask Logo-Icon-Primary",
  },
  docker: {
    name: "Docker",
    iconName: "docker",
  },
  aws: {
    name: "AWS",
    iconName: "Amazon Web Services",
  },
  astro: {
    name: "Astro",
    iconName: "astro",
  }
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
  github: {
    name: "GitHub",
    iconName: "GitHub_light",
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