import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/Desktop.vue') },
  { path: '/computer', component: () => import('../views/Computer.vue') },
  { path: '/all-notes', component: () => import('../views/AllNotes.vue') },
  { path: '/categories', component: () => import('../views/Categories.vue') },
  { path: '/notes/:id', component: () => import('../views/NoteDetail.vue') },
  { path: '/airplane', component: () => import('../views/AirplaneApp.vue') },
  { path: '/notepad', component: () => import('../views/NotepadApp.vue') },
  { path: '/paint', component: () => import('../views/PaintApp.vue') },
  { path: '/calculator', component: () => import('../views/CalculatorApp.vue') },
];

const router = createRouter({
  history: createWebHashHistory(), // Use Hash mode for easier GitHub Pages deployment
  routes,
});

export default router;
