/**
 * CornjobController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');
let Promise = require('bluebird');
let _ = require('lodash');

module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: true
    },
    unsetIsNew: function (req, res) {
        let currentDate = moment(new Date()).format("YYYY-MM-DD");
        const beforeDate = moment().add(-14, 'days').format('YYYY-MM-DD');
        console.log('beforeDate', beforeDate);
        let qData={
            product_type: [1,2],
            is_new_in: true,
            createdAt: {'<=': beforeDate}
        }

        return Promise.all([
            Product.find({select: ['id','product_type','is_new_in', 'createdAt']}).where(qData).sort('id DESC'),
        ])
          .spread(function(allRecord){
            if(allRecord && allRecord.length > 0){
                allRecord.map((sinItem)=>{
                    sinItem.is_new_in = false;
                    sinItem.save();
                })
            }
            return res.json(true);
                // return res.send({
                //     status: 'success',
                //     message: 'I am unsetIsNew ',
                //     // product: allRecord.length
                // });

            }).catch(function(err){
                // return res.send({
                //     status: 'error',
                //     message: 'server error',
                // });
                return res.json(false);
            });
    }

};

