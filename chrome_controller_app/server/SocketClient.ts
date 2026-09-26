import { io, Socket } from "socket.io-client";

type Listener = (...args: any[]) => void;

class SocketClient
{
    private socket: Socket | null = null;
    private listeners = new Map<string, Set<Listener>>();

    connect(uri: string, opts?: Parameters<typeof io>[1])
    {
        this.socket?.removeAllListeners();
        this.socket?.disconnect();

        this.socket = io(uri, opts);

        this.socket.on('connect', () => {
            console.log("Connecté au serveur");
        });

        for(const [event, callbacks] of this.listeners)
            for(const cb of callbacks)
                this.socket.on(event, cb);
    }

    on(event: string, callback: Listener)
    {
        if(!this.listeners.has(event))
            this.listeners.set(event, new Set());

        this.listeners.get(event)!.add(callback);
        this.socket?.on(event, callback);
    }

    off(event: string, callback: Listener)
    {
        this.listeners.get(event)?.delete(callback);
        this.socket?.off(event, callback);
    }

    emit(event: string, ...args: any[])
    {
        this.socket?.emit(event, ...args);
    }

    get connected()
    {
        return this.socket?.connected ?? false;
    }
}

export const socketClient = new SocketClient();