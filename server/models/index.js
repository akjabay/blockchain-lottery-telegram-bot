var fs = require("fs"),
    path = require("path"),
    basename = path.basename(module.filename);


var db = (function(fs, path, base) {

    var instance,
        db = {};

    function init() {


        /**
         * load all module
         */

        fs
            .readdirSync(__dirname)
            .filter(function(file) {

                return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
            }).forEach(function(file) {

                var model = require("./" + file.slice(0, -3));

                db[model.modelName] = model

            });



        return db;




    } //end init



    return {

        getInstance: function() {

            if (!instance) {
                instance = init();
            }
            return instance;

        }


    }; //end return


})(fs, path, basename); //end db



module.exports = db.getInstance();
