declare module '*.json' {
    const value: any;
    export default value;
}

export interface ITranslationResources {
    common: {
        welcome: string;
        room: {
            title: string;
            newRoom: string;
            joinRoom: string;
            gameRoom: string;
            waiting: string;
            yourTurn: string;
            opponentTurn: string;
            winner: string;
            draw: string;
            gameOver: string;
        };
        player: {
            player1: string;
            player2: string;
            you: string;
            opponent: string;
        };
        buttons: {
            start: string;
            restart: string;
            exit: string;
            cancel: string;
            confirm: string;
            back: string;
            next: string;
        };
        menu: {
            home: string;
            play: string;
            settings: string;
            about: string;
            language: string;
        };
        settings: {
            language: string;
            sound: string;
            music: string;
            notifications: string;
        };
    };
} 