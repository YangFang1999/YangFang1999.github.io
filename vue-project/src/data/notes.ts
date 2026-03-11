export interface Note {
  id: string;
  title: string;
  date: string;
  icon: string;
  path: string;
  category?: string;
  content?: string; // Optional: content can be loaded dynamically or stored here for small apps
}

export const notes: Note[] = [
  { id: 'hello-world', title: 'Hello World', date: '2023-10-01', icon: 'fa fa-file-text-o', path: '/notes/hello-world', category: 'java' },
  { id: 'idea-shortcuts', title: 'IDEA Shortcuts', date: '2023-11-01', icon: 'fa fa-file-text-o', path: '/notes/idea-shortcuts', category: 'java' },
  { id: 'java-collections-framework', title: 'Java Collections', date: '2023-11-15', icon: 'fa fa-file-text-o', path: '/notes/java-collections-framework', category: 'java' },
  { id: 'vue-migration', title: 'Vue Migration', date: '2024-03-15', icon: 'fa fa-file-code-o', path: '/notes/vue-migration', category: 'frontend' },
  { id: 'spring-boot-guide', title: 'Spring Boot Guide', date: '2024-03-20', icon: 'fa fa-leaf', path: '/notes/spring-boot-guide', category: 'spring' },
  { id: 'mysql-basics', title: 'MySQL Basics', date: '2024-03-22', icon: 'fa fa-database', path: '/notes/mysql-basics', category: 'database' },
];
