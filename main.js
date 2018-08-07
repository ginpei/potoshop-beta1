import MainController from './js/MainController.js';

{
  const controller = new MainController();
  const el = document.querySelector('#app');
  controller.start(el);
}
