/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage, ticker } from '@alienkitty/space.js';

import { Config } from '../config/Config.js';
import { Events } from '../config/Events.js';
import { Data } from '../data/Data.js';
import { Scene } from '../scene/Scene.js';
import { UI } from '../views/ui/UI.js';
import { AudioController } from './audio/AudioController.js';
import { PanelController } from './panel/PanelController.js';
import { Preloader } from './Preloader.js';
import { SceneController } from './scene/SceneController.js';
import { CameraController } from './world/CameraController.js';
import { InputManager } from './world/InputManager.js';
import { RenderManager } from './world/RenderManager.js';
import { WorldController } from './world/WorldController.js';

export class App {
    constructor() {
        this.view = null;
        this.ui = null;
    }

    init = async () => {
        Data.init();

        this.initStage();
        this.initWorld();
        this.initScene();
        this.initControllers();
        this.initViews();

        this.addListeners();
        this.onResize();

        await Preloader.init();
    };

    initStage = () => {
        Stage.init();
    };

    initWorld = () => {
        WorldController.init();
        RenderManager.init();

        Stage.add(WorldController.element);
    };

    initScene = () => {
        this.view = new Scene();
        WorldController.scene.add(this.view);
    };

    initViews = () => {
        this.ui = new UI();
        Stage.add(this.ui);
    };

    initControllers = () => {
        AudioController.init();
        CameraController.init(WorldController.camera);
        InputManager.init(WorldController.scene, WorldController.camera);
        SceneController.init(this.view);

        if (Config.DEBUG) {
            PanelController.init(this.view);
        }
    };

    addListeners = () => {
        Stage.events.on(Events.RESIZE, this.onResize);
        Stage.events.on(Events.COMPLETE, this.onComplete);

        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('visibilitychange', this.onVisibility);
        window.addEventListener('pointerdown', this.onFirstGesture);
        window.addEventListener('keydown', this.onFirstGesture);
    };

    onFirstGesture = () => {
        AudioController.onFirstGesture();

        window.removeEventListener('pointerdown', this.onFirstGesture);
        window.removeEventListener('keydown', this.onFirstGesture);
    };

    // Event handlers

    onWindowResize = () => {
        Stage.events.emit(Events.RESIZE);
    };

    onVisibility = () => {
        Stage.events.emit(Events.VISIBILITY);
    };

    onResize = () => {
    };

    onComplete = async () => {
        await SceneController.ready();

        this.ui.animateIn();
        SceneController.animateIn();
        CameraController.animateIn();
    };

    // Public methods

    start = () => {
        ticker.start();
    };
}
