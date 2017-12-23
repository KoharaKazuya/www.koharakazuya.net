import 'core-js/es6/promise';

import DomContentLoaded from './window/DOMContentLoaded';
import SpeedLinks from './window/SpeedLinks';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

(async () => {
  await DomContentLoaded;

  new SpeedLinks();
})();
