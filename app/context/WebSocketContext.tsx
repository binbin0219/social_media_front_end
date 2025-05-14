"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext<{
    client: Client | null,
    connected: boolean
}>({
    client: null,
    connected: false
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [client, setClient] = useState<Client | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const sock = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`);
        const stompClient = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('[WebSocket] Connected');
            setConnected(true);
        },
        onDisconnect: () => {
            console.log('[WebSocket] Disconnected');
            setConnected(false);
        },
        onStompError: (frame) => {
            console.error('[WebSocket] Error:', frame.headers['message']);
        },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
        stompClient.deactivate();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ client, connected }}>
        {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
