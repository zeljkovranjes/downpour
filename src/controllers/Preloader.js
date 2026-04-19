/**
 * @author pschroen / https://ufo.ai/
 */

import { AssetLoader, MultiLoader, Stage } from '@alienkitty/space.js';

import { Events } from '../config/Events.js';
import { Assets } from '../data/Assets.js';
import { Loader } from '../views/Loader.js';

export class Preloader {
    static init() {
        this.initView();
        this.initLoader();
    }

    static initView() {
        this.view = new Loader();

        Stage.add(this.view);
    }

    static initLoader() {
        const assetLoader = new AssetLoader();
        assetLoader.setPath(Assets.PATH);
        assetLoader.cache = true;
        assetLoader.loadAll(Assets.LIST.map(Assets.FILTER));

        this.loader = new MultiLoader();
        this.loader.load(assetLoader);

        this.loader.events.on(Events.PROGRESS, this.onProgress);
        this.loader.events.on(Events.COMPLETE, this.onComplete);
    }

    // Event handlers

    static onProgress = ({ progress }) => {
        this.view.update(progress);
    };

    static onComplete = async () => {
        this.loader.destroy();

        await this.view.animateOut();
        this.view = this.view.destroy();

        Stage.events.emit(Events.COMPLETE);
    };
}
