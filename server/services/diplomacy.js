const EventEmitter = require('events');
const moment = require('moment');
const ValidationError = require('../errors/validation');

module.exports = class DiplomacyService extends EventEmitter {

    constructor(userService, playerService) {
        super();
        
        this.userService = userService;
        this.playerService = playerService;
    }

    async requestAlliance(game, fromPlayer, toPlayerId) {
        //TODO make amount dynamic
        let amount = 150

        // TODO: Maybe this validation needs to be in the middleware?
        if (!game.state.startDate) {
            throw new ValidationError(`Cannot send alliance request, the game has not started yet.`);
        }
        
        // Get the players.
        let toPlayer = this.playerService.getById(game, toPlayerId);

        if (fromPlayer === toPlayer) {
            throw new ValidationError(`Cannot ally yourself.`);
        }
       
        if (fromPlayer.credits < amount) {
            throw new ValidationError(`The player does not own ${amount} credits.`);
        }

        let fromPlayerUser = await this.userService.getById(fromPlayer.userId);
        let toPlayerUser = await this.userService.getById(toPlayer.userId);

        if (!toPlayerUser) {
            throw new ValidationError(`There is no user associated with this player.`);
        }

        fromPlayer.credits -= amount;
        //TODO other Alliance mechanics
        
        await game.save();
        await fromPlayerUser.save();
        await toPlayerUser.save();

        let eventObject = {
            game,
            fromPlayer,
            toPlayer,
            date: moment().utc()
        };

        this.emit('onPlayerAllianceRequestReceived', eventObject);
        this.emit('onPlayerAllianceRequestSent', eventObject);

        return eventObject;
    }
};
