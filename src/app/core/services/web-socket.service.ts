import { Injectable } from '@angular/core';

import { environment } from '@environment';
import { AppEnvironments } from '@app/shared/enums';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    RECONNECT_SIGNAL_INTERVAL = 3500;

    private _webSocketClient: WebSocket | undefined;

    constructor() {
        this._initialConnectWebSocket();
    }

    private _initialConnectWebSocket() {
        if (environment.name === AppEnvironments.Local) {
            return;
        }

        setInterval(() => {
            if (this._webSocketClient && this._webSocketClient.readyState !== WebSocket.CLOSED) {
                return;
            }

            console.log('WebSocket Connecting...');
            this.connect();
        }, this.RECONNECT_SIGNAL_INTERVAL);
    }

    connect() {
        // Stop WebSocket
        if (this._webSocketClient) {
            this._webSocketClient.close();
            this._webSocketClient = undefined;
        }

        const ws = new WebSocket(environment.webSocketUrl);
        this._webSocketClient = ws;

        ws.onmessage = (message) => {
            this.onReceiveMessage(message.data as string);
        };
        ws.onerror = (error) => {
            console.error('WebSocket Error', error);
        };
        ws.onclose = () => {
            ws.close();
            console.log('WebSocket Closed');
        };
        ws.onopen = () => {
            console.log('Successfully connected');
        };
    }

    onReceiveMessage(data: string) {
        console.log('data WS', data)
    }
}
