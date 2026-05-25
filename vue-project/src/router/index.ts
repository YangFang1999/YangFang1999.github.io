import { createRouter, createWebHashHistory } from 'vue-router';
import Desktop from '../views/Desktop.vue';
import AllNotes from '../views/AllNotes.vue';
import Categories from '../views/Categories.vue';
import NoteDetail from '../views/NoteDetail.vue';
import Computer from '../views/Computer.vue';
import AirplaneApp from '../views/AirplaneApp.vue';
import NotepadApp from '../views/NotepadApp.vue';
import PaintApp from '../views/PaintApp.vue';
import CalculatorApp from '../views/CalculatorApp.vue';

const routes = [
  { path: '/', component: Desktop },
  { path: '/computer', component: Computer },
  { path: '/all-notes', component: AllNotes },
  { path: '/categories', component: Categories },
  { path: '/notes/:id', component: NoteDetail },
  { path: '/airplane', component: AirplaneApp },
  { path: '/notepad', component: NotepadApp },
  { path: '/paint', component: PaintApp },
  { path: '/calculator', component: CalculatorApp },
];

const router = createRouter({
  history: createWebHashHistory(), // Use Hash mode for easier GitHub Pages deployment
  routes,
});

export default router;
