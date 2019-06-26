module.exports = (app, express) => {

    const router = express.Router();
    const MainController = require('../controllers/MainController')
    const config = require('../../configs/configs')


    /*            Category related                         */
    router.post('/addOrUpdateCategory', (req, res, next) => {
        const Action = (new MainController()).boot(req, res);
        return Action.addOrUpdateCategory();
    });
    router.post('/listCategory', (req, res, next) => {
        const Action = (new MainController()).boot(req, res);
        return Action.listCategory();
    });
    router.post('/softDeleteCategory', (req, res, next) => {
        const Action = (new MainController()).boot(req, res);
        return Action.softDeleteCategory();
    });
    router.post('/hardDeleteCategory', (req, res, next) => {
        const Action = (new MainController()).boot(req, res);
        return Action.hardDeleteCategory();
    });



    /*            Products related                      */
    router.post('/addProduct', (req, res, next) => {
        const Action = (new MainController()).boot(req, res);
        return Action.addProduct();
    });
    router.post('/listProducts', (req, res, next) => {
        const Action = (new MainController()).boot(req, res);
        return Action.listProducts();
    });


    app.use(config.baseApiUrl, router);
}