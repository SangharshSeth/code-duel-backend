//TODO::Replace with a queue service
export class MatchMakingQueue {
    constructor() {
        this.items = []
    }

    playersAvailable() {
        return this.items.length > 0;
    }

    addPlayer(player) {
        this.items.push(player);
    }

    removePlayer(player) {
        this.items.splice(this.items.indexOf(player), 1);
    }
}