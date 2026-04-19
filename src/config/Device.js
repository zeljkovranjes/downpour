/**
 * @author pschroen / https://ufo.ai/
 */

const ua = navigator.userAgent.toLowerCase();
const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';

export class Device {
    static agent = ua;
    static platform = platform.toLowerCase();

    static mobile = /ios|iphone|ipad|ipod|android|blackberry|bb10|windows phone|webos/i.test(ua);
    static tablet = /ipad|tablet|(android(?!.*mobile))/i.test(ua);
    static phone = Device.mobile && !Device.tablet;

    static os = {
        ios: /iphone|ipad|ipod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1),
        android: /android/i.test(ua),
        mac: /mac/i.test(platform),
        windows: /win/i.test(platform),
        linux: /linux/i.test(platform)
    };

    static browser = {
        chrome: /chrome|crios/i.test(ua) && !/edge|edg\//i.test(ua),
        safari: /safari/i.test(ua) && !/chrome|crios|android/i.test(ua),
        firefox: /firefox|fxios/i.test(ua),
        edge: /edge|edg\//i.test(ua)
    };

    static webgl = (() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    })();
}
