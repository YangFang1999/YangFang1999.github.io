import { createRouter, createWebHashHistory } from 'vue-router';
import Desktop from '../views/Desktop.vue';
import AllNotes from '../views/AllNotes.vue';
import Categories from '../views/Categories.vue';
import NoteDetail from '../views/NoteDetail.vue';
import Computer from '../views/Computer.vue';

const routes = [
  { path: '/', component: Desktop },
  { path: '/computer', component: Computer },
  { path: '/all-notes', component: AllNotes },
  { path: '/categories', component: Categories },
  { path: '/notes/:id', component: NoteDetail },
];

const router = createRouter({
  history: createWebHashHistory(), // Use Hash mode for easier GitHub Pages deployment
  routes,
});

export default router;
