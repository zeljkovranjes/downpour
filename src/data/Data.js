/**
 * @author pschroen / https://ufo.ai/
 */

export class Data {
    static init = () => {
    };

    static getPage = path => {
        return Data.pages.find(page => page.path === path);
    };

    static getNext = page => {
        const i = Data.pages.indexOf(page);

        return Data.pages[(i + 1) % Data.pages.length];
    };

    static pages = [
        {
            path: '/',
            title: 'Experience'
        }
    ];
}
