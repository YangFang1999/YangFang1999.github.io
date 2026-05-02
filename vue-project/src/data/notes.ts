export interface Note {
  id: string;
  title: string;
  date: string;
  icon: string;
  path: string;
  category?: string;
  content?: string;
}

export const notes: Note[] = [
  { id: 'hello-world', title: 'Hello World', date: '2023-10-01', icon: 'fa fa-file-text-o', path: '/notes/hello-world', category: 'java' },
  { id: 'idea-shortcuts', title: 'IDEA Shortcuts', date: '2023-11-01', icon: 'fa fa-file-text-o', path: '/notes/idea-shortcuts', category: 'java' },
  { id: 'java-collections-framework', title: 'Java Collections', date: '2023-11-15', icon: 'fa fa-file-text-o', path: '/notes/java-collections-framework', category: 'java' },
  { id: 'vue-migration', title: 'Vue Migration', date: '2024-03-15', icon: 'fa fa-file-code-o', path: '/notes/vue-migration', category: 'frontend' },
  { id: 'spring-boot-guide', title: 'Spring Boot Guide', date: '2024-03-20', icon: 'fa fa-leaf', path: '/notes/spring-boot-guide', category: 'spring' },
  { id: 'mysql-basics', title: 'MySQL Basics', date: '2024-03-22', icon: 'fa fa-database', path: '/notes/mysql-basics', category: 'database' },
  { id: 'git-basics', title: 'Git 常用命令', date: '2024-04-05', icon: 'fa fa-code-fork', path: '/notes/git-basics', category: 'devops' },
  { id: 'docker-intro', title: 'Docker 入门指南', date: '2024-04-12', icon: 'fa fa-ship', path: '/notes/docker-intro', category: 'devops' },
  { id: 'linux-commands', title: 'Linux 基础命令', date: '2024-04-20', icon: 'fa fa-terminal', path: '/notes/linux-commands', category: 'devops' },
  { id: 'javascript-es6', title: 'JavaScript ES6+ 新特性', date: '2024-05-01', icon: 'fa fa-file-code-o', path: '/notes/javascript-es6', category: 'frontend' },
  { id: 'design-patterns', title: '设计模式入门', date: '2024-05-15', icon: 'fa fa-puzzle-piece', path: '/notes/design-patterns', category: 'java' },
  { id: 'redis-basics', title: 'Redis 基础入门', date: '2024-05-28', icon: 'fa fa-database', path: '/notes/redis-basics', category: 'database' },
];
