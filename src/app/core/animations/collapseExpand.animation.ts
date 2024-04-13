import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';

export const collapseExpandAnimation = trigger('collapseExpandAnimation', [
    state(
        'open',
        style({
            height: AUTO_STYLE
        })
    ),
    state(
        'closed',
        style({
            height: '0',
            overflow: 'hidden',
        })
    ),
    transition('open <=> closed', animate('400ms ease')),
]);
