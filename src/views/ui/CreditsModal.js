/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface, Stage } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class CreditsModal extends Interface {
    constructor() {
        super('.credits-modal');

        this.open = false;
        this.overlayFadeTimeout = null;
        this.transitionResetTimeout = null;

        this.initOverlay();
        this.initCard();
        this.initContent();
        this.addListeners();
    }

    initOverlay = () => {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0)',
            zIndex: 11000,
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 400ms ease-out, background 600ms ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)'
        });
    };

    initCard = () => {
        this.card = new Interface(null, 'div');
        this.card.css({
            position: 'relative',
            width: 280,
            padding: '0',
            background: 'transparent',
            border: 'none',
            transform: 'scale(0.92)',
            opacity: 0,
            filter: 'blur(6px)',
            transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease-out, filter 600ms ease-out',
            textAlign: 'center'
        });
        this.add(this.card);
    };

    initContent = () => {
        this.topRule = new Interface(null, 'div');
        this.topRule.css({
            width: '100%',
            height: 1,
            background: 'rgba(255, 255, 255, 0.25)',
            marginBottom: 36
        });
        this.card.add(this.topRule);

        this.label = new Interface(null, 'div');
        this.label.html('credits');
        this.label.css({
            fontFamily: '"Inter", sans-serif',
            fontWeight: 300,
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginBottom: 32,
            textShadow: '0 1px 8px rgba(0, 0, 0, 0.6)'
        });
        this.card.add(this.label);

        const entries = [
            { role: 'Developer', name: 'Zeljko Vranjes', url: 'https://github.com/zeljkovranjes' },
            { role: 'shader', name: 'Heartfelt', url: 'https://www.shadertoy.com/view/ltffzl' },
            { role: 'Track 1', name: 'Heavy Rain, Thunder Sounds', url: 'https://soundcloud.com/thunderstorm35178/heavy-rain-thunder-sounds?in=thunderstorm35178/sets/lightning-thunder-rain' },
            { role: 'Track 2', name: '//', url: 'https://www.youtube.com/watch?v=EMNuR9zf0c0' }
        ];

        this.rows = [];
        this.links = [];
        this.linkHandlers = [];

        entries.forEach((entry, i) => {
            const row = new Interface(null, 'div');
            row.css({
                marginBottom: i === entries.length - 1 ? 0 : 26
            });

            const role = new Interface(null, 'div');
            role.html(entry.role);
            role.css({
                fontFamily: '"Inter", sans-serif',
                fontWeight: 300,
                fontSize: 9,
                color: 'rgba(255, 255, 255, 0.45)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: 6,
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)'
            });
            row.add(role);

            const name = new Interface(null, 'a');
            name.html(entry.name);
            name.attr({ href: entry.url, target: '_blank', rel: 'noopener noreferrer' });
            name.css({
                display: 'inline-block',
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 17,
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                textShadow: '0 1px 10px rgba(0, 0, 0, 0.7)',
                transition: 'color 300ms ease-out, text-shadow 300ms ease-out'
            });

            const onEnter = () => {
                name.css({
                    color: 'rgba(255, 255, 255, 1)',
                    textShadow: '0 1px 14px rgba(0, 0, 0, 0.8)'
                });
            };
            const onLeave = () => {
                name.css({
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 1px 10px rgba(0, 0, 0, 0.7)'
                });
            };
            name.element.addEventListener('mouseenter', onEnter);
            name.element.addEventListener('mouseleave', onLeave);

            row.add(name);
            this.card.add(row);

            this.rows.push(row);
            this.links.push(name);
            this.linkHandlers.push({ element: name.element, onEnter, onLeave });
        });

        this.bottomRule = new Interface(null, 'div');
        this.bottomRule.css({
            width: '100%',
            height: 1,
            background: 'rgba(255, 255, 255, 0.25)',
            marginTop: 36
        });
        this.card.add(this.bottomRule);
    };

    addListeners = () => {
        Stage.events.on(Events.CREDITS_OPEN, this.onOpen);
        Stage.events.on(Events.CREDITS_CLOSE, this.onClose);
        window.addEventListener('keydown', this.onKeyDown);
        this.element.addEventListener('click', this.onOverlayClick);
    };

    removeListeners = () => {
        Stage.events.off(Events.CREDITS_OPEN, this.onOpen);
        Stage.events.off(Events.CREDITS_CLOSE, this.onClose);
        window.removeEventListener('keydown', this.onKeyDown);
        this.element.removeEventListener('click', this.onOverlayClick);

        this.linkHandlers.forEach(({ element, onEnter, onLeave }) => {
            element.removeEventListener('mouseenter', onEnter);
            element.removeEventListener('mouseleave', onLeave);
        });
    };

    // Event handlers

    onKeyDown = e => {
        if (e.key === 'Escape' && this.open) {
            Stage.events.emit(Events.CREDITS_CLOSE);
        }
    };

    onOverlayClick = e => {
        if (e.target === this.element) {
            Stage.events.emit(Events.CREDITS_CLOSE);
        }
    };

    onOpen = () => {
        if (this.open) return;
        this.open = true;

        if (this.overlayFadeTimeout) {
            clearTimeout(this.overlayFadeTimeout);
            this.overlayFadeTimeout = null;
        }
        if (this.transitionResetTimeout) {
            clearTimeout(this.transitionResetTimeout);
            this.transitionResetTimeout = null;
        }

        this.css({
            pointerEvents: 'auto',
            opacity: 1,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
        });

        this.card.css({
            transform: 'scale(1)',
            opacity: 1,
            filter: 'blur(0px)'
        });
    };

    onClose = () => {
        if (!this.open) return;
        this.open = false;

        this.card.css({
            transform: 'scale(0.96)',
            opacity: 0,
            filter: 'blur(4px)',
            transition: 'transform 350ms ease-in, opacity 300ms ease-in, filter 350ms ease-in'
        });

        this.overlayFadeTimeout = setTimeout(() => {
            this.css({
                opacity: 0,
                background: 'rgba(0, 0, 0, 0)',
                backdropFilter: 'blur(0px)',
                WebkitBackdropFilter: 'blur(0px)',
                pointerEvents: 'none'
            });
            this.overlayFadeTimeout = null;
        }, 100);

        this.transitionResetTimeout = setTimeout(() => {
            this.card.css({
                transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease-out, filter 600ms ease-out'
            });
            this.transitionResetTimeout = null;
        }, 500);
    };

    destroy = () => {
        if (this.overlayFadeTimeout) {
            clearTimeout(this.overlayFadeTimeout);
            this.overlayFadeTimeout = null;
        }
        if (this.transitionResetTimeout) {
            clearTimeout(this.transitionResetTimeout);
            this.transitionResetTimeout = null;
        }

        this.removeListeners();

        this.topRule = null;
        this.bottomRule = null;
        this.label = null;
        this.rows = null;
        this.links = null;
        this.linkHandlers = null;
        this.card = null;

        return super.destroy();
    };
}
