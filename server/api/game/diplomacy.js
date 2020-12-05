const ValidationError = require('../../errors/validation');

module.exports = (router, io, container) => {

    const middleware = require('../middleware')(container);

    router.put('/api/game/:gameId/diplomacy/requestAlliance', middleware.authenticate, middleware.loadGame, middleware.validateGameInProgress, middleware.loadPlayer, middleware.validateUndefeatedPlayer, async (req, res, next) => {
        let errors = [];

        if (!req.body.toPlayerId) {
            errors.push('toPlayerId is required.');
        }

        if (req.session.userId === req.body.toPlayerId) {
            errors.push('Cannot ally yourself.');
        }

        if (errors.length) {
            throw new ValidationError(errors);
        }

        try {
            let allianceRequest = await container.diplomacyService.requestAlliance(
                req.game,
                req.player,
                req.body.toPlayerId);
            
            res.sendStatus(200);

            container.broadcastService.gamePlayerAllianceRequestReceived(req.game, allianceRequest.fromPlayer.id, allianceRequest.toPlayer.id, allianceRequest.date);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);
};
