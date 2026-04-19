/**
 * @author pschroen / https://ufo.ai/
 */

import { App } from './controllers/App.js';

const app = new App();

app.init().then(() => {
    app.start();
});
