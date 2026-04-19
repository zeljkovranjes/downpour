/**
 * @author pschroen / https://ufo.ai/
 */

export class Config {
    static PATH = '/';
    static BREAKPOINT = 1000;

    static DEBUG = /[?&]debug/.test(location.search);
    static ORBIT = /[?&]orbit/.test(location.search);
}
