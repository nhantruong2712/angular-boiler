import { animate, style, transition, trigger } from '@angular/animations';

export const spinAnimation =
    trigger('spin', [
        transition(':enter', [
            style({ transform: 'rotate(0deg)' }),
            animate('{{speed}} ease', style({ transform: 'rotate(360deg)' }))
        ],
            { params: { speed: '1000ms' } })
    ]);
