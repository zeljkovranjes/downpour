/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage, ticker } from '@alienkitty/space.js';

import { Config } from '../config/Config.js';
import { Events } from '../config/Events.js';
import { Data } from '../data/Data.js';
import { Scene } from '../scene/Scene.js';
import { Letterbox } from '../views/Letterbox.js';
import { Loader } from '../views/Loader.js';
import { OpeningLine } from '../views/OpeningLine.js';
import { CreditsIcon } from '../views/ui/CreditsIcon.js';
import { CreditsModal } from '../views/ui/CreditsModal.js';
import { UI } from '../views/ui/UI.js';
import { AudioController } from './audio/AudioController.js';
import { LoaderController } from './LoaderController.js';
import { PanelController } from './panel/PanelController.js';
import { SceneController } from './scene/SceneController.js';
import { CameraController } from './world/CameraController.js';
import { InputManager } from './world/InputManager.js';
import { RenderManager } from './world/RenderManager.js';
import { TimeOfDayController } from './world/TimeOfDayController.js';
import { WorldController } from './world/WorldController.js';

export class App {
    constructor() {
        this.view = null;
        this.ui = null;
        this.loader = null;
    }

    init = async () => {
        Data.init();
        TimeOfDayController.init();

        this.initStage();
        this.initWorld();
        this.initScene();
        this.initControllers();
        this.initViews();
        this.initLoader();

        this.addListeners();
        this.onResize();

        SceneController.ready();
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
        this.letterbox = new Letterbox();
        Stage.add(this.letterbox);

        this.openingLine = new OpeningLine();
        Stage.add(this.openingLine);

        this.ui = new UI();
        Stage.add(this.ui);

        this.creditsIcon = new CreditsIcon();
        Stage.add(this.creditsIcon);

        this.creditsModal = new CreditsModal();
        Stage.add(this.creditsModal);
    };

    initControllers = () => {
        AudioController.init();
        LoaderController.init();
        CameraController.init(WorldController.camera);
        InputManager.init(WorldController.scene, WorldController.camera);
        SceneController.init(this.view);

        if (Config.DEBUG) {
            PanelController.init(this.view);
        }
    };

    initLoader = () => {
        this.loader = new Loader();
        Stage.add(this.loader);
    };

    addListeners = () => {
        Stage.events.on(Events.RESIZE, this.onResize);
        Stage.events.on(Events.LOAD_COMPLETE, this.onLoadComplete);

        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('visibilitychange', this.onVisibility);
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

    onLoadComplete = () => {
        SceneController.animateIn();
        CameraController.animateIn();
    };

    // Public methods

    start = () => {
        ticker.start();
    };
}
