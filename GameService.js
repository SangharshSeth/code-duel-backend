export class GameService {
    constructor(matchId, player1Id, player2Id) {
        this.matchId = matchId;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
    }

    startGame() {
        return `${this.player1Id} ${this.player2Id} are in a Game`;
    }
}

