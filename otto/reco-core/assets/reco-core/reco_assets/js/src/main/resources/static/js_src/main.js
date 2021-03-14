window.o_reco = window.o_reco || {};
window.o_reco.private= window.o_reco.private|| {};

window.o_reco.justlazy=  require('./justlazy/justlazy.js');

// internal apis
window.o_reco.private.initializeCinema = require('./cinema/cinemaController.js');
window.o_reco.private.initializeExpandableCinema = require('./expandableCinema/expandableCinema.js')();

// external apis
window.o_reco.private.asyncLoadRecommendationsForDetailView = require('./loader/asynchronousDetailViewCinemaLoader.js')();
window.o_reco.private.loadRecommendationsForProductLine = require('./loader/productLineCinemaLoader.js')();
window.o_reco.private.loadRecommendationsForOrderOverview = require('./loader/orderOverviewLoader.js')();
window.o_reco.private.loadRecommendationsForWishlist = require('./loader/wishlistLoader.js')();
window.o_reco.private.loadRecommendationsForEntryPage = require('./loader/entryPageCinemaLoader.js')();
window.o_reco.private.loadBounceLayerCinema = require('./loader/bounceLayerLoader.js')();

require('./privacy/privacy.js')(window);
require('./loader/cinemaAutoLoader.js')(window);
