/**
 * @author pschroen / https://ufo.ai/
 */

export class Styles {
    static root = {
        fontFamily: 'var(--ui-font-family)',
        fontWeight: 'var(--ui-font-weight)',
        fontSize: 'var(--ui-font-size)',
        lineHeight: 'var(--ui-line-height)',
        letterSpacing: 'var(--ui-letter-spacing)'
    };

    static label = {
        ...Styles.root,
        fontSize: 'var(--ui-secondary-font-size)',
        letterSpacing: 'var(--ui-secondary-letter-spacing)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
    };

    static number = {
        ...Styles.root,
        fontVariantNumeric: 'tabular-nums'
    };
}
