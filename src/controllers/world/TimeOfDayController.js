/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class TimeOfDayController {
    static POLL_INTERVAL_MS = 60 * 1000;
    static SLOTS = ['morning', 'afternoon', 'evening', 'night'];

    static current = null;
    static intervalId = null;
    static sunTimes = null;

    static init = async () => {
        this.current = this.computeFallbackSlot();

        try {
            const coords = await this.fetchLocation();
            this.sunTimes = await this.fetchSunTimes(coords.latitude, coords.longitude);

            const accurate = this.computeAccurateSlot();

            if (accurate !== this.current) {
                const previous = this.current;
                this.current = accurate;
                Stage.events.emit(Events.TIME_OF_DAY_CHANGED, { previous, current: accurate });
            }
        } catch (err) {
            console.warn('TimeOfDay: accurate mode unavailable, using hour-based fallback —', err.message);
        }

        this.intervalId = setInterval(this.poll, this.POLL_INTERVAL_MS);
    };

    static poll = () => {
        const next = this.sunTimes ? this.computeAccurateSlot() : this.computeFallbackSlot();

        if (next !== this.current) {
            const previous = this.current;
            this.current = next;
            Stage.events.emit(Events.TIME_OF_DAY_CHANGED, { previous, current: next });
        }
    };

    // External calls

    static fetchLocation = async () => {
        try {
            return await this.fetchLocationZeljko();
        } catch (err) {
            console.warn('geo-api.zeljko.me failed:', err.message);
        }

        try {
            return await this.fetchLocationIpapi();
        } catch (err) {
            console.warn('ipapi.co failed:', err.message);
        }

        throw new Error('all geolocation sources failed');
    };

    static fetchLocationZeljko = async () => {
        const response = await fetch('https://geo-api.zeljko.me/');

        if (!response.ok) {
            throw new Error(`geo-api ${response.status}`);
        }

        const data = await response.json();

        if (typeof data.loc !== 'string' || !data.loc.includes(',')) {
            throw new Error('geo-api returned invalid loc field');
        }

        const [latStr, lngStr] = data.loc.split(',');
        const latitude = parseFloat(latStr);
        const longitude = parseFloat(lngStr);

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
            throw new Error('geo-api returned unparseable coordinates');
        }

        return { latitude, longitude };
    };

    static fetchLocationIpapi = async () => {
        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            throw new Error(`ipapi ${response.status}`);
        }

        const data = await response.json();

        if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
            throw new Error('ipapi returned invalid coordinates');
        }

        return { latitude: data.latitude, longitude: data.longitude };
    };

    static fetchSunTimes = async (lat, lng) => {
        const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`sunrise-sunset ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`sunrise-sunset status ${data.status}`);
        }

        return {
            sunrise: new Date(data.results.sunrise),
            sunset: new Date(data.results.sunset),
            civilTwilightEnd: new Date(data.results.civil_twilight_end)
        };
    };

    // Slot computation

    static computeAccurateSlot = () => {
        const now = new Date();
        const t = now.getTime();

        const sunrise = this.sunTimes.sunrise.getTime();
        const sunset = this.sunTimes.sunset.getTime();
        const twilightEnd = this.sunTimes.civilTwilightEnd.getTime();
        const morningEnd = sunrise + 4 * 60 * 60 * 1000;
        const eveningStart = sunset - 1.5 * 60 * 60 * 1000;

        if (t >= sunrise && t < morningEnd) {
            return 'morning';
        }

        if (t >= morningEnd && t < eveningStart) {
            return 'afternoon';
        }

        if (t >= eveningStart && t < twilightEnd) {
            return 'evening';
        }

        return 'night';
    };

    static computeFallbackSlot = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour <= 11) {
            return 'morning';
        }

        if (hour >= 12 && hour <= 16) {
            return 'afternoon';
        }

        if (hour >= 17 && hour <= 20) {
            return 'evening';
        }

        return 'night';
    };

    // Public methods

    static destroy = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.sunTimes = null;
    };
}
