/**
 * FrontCouponController
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

    applyCoupon_v1: function (req, res) {
        let tokenUser = req.identity || '';
        const customFieldErrors = {};

        // let cart_sub_total = 9;
  
        let qryData = {
            coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
            is_active: true
          };
  
          if (!qryData.coupon_code) {
            customFieldErrors.coupon_code = {message: 'Code is Required'};
          }
  
          
          if (Object.keys(customFieldErrors).length) {
            return res.send({
              status: 'error',
              message: 'field error',
              fieldErrors: customFieldErrors,
              remoteData: qryData
            });
  
          } else {
             // #########################
          return Coupon.findOne(qryData).then(function (sinExistdata){
            if (!sinExistdata) {
              //coupon_code Check
                return res.send({
                status: 'error',
                coupon_status: 1, // Invalide
                message: 'coupon code invalid',
            });
          } else {
            
            return Promise.all([
                CouponIncludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Include category Multi Box Auto Selected
                CouponExcludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Exclude category Multi Box Auto Selected
              ]).spread(function(incCategory, excCategory) {

                // console.log('incCategory', incCategory);
                // console.log('excCategory', excCategory);

                let cart_sub_total = 56;
                let final_discount_amt = 0;
                // ************************************
                //coupon expire date check
                let expire_date = moment(sinExistdata.expiration_date).format('YYYY-MM-DD');
                let current_date = moment().format('YYYY-MM-DD');
                // console.log('current_date', current_date);
                // console.log('expire_date', expire_date);
                if(current_date > expire_date){
                  return res.send({
                      status: 'error',
                      coupon_status: 2, // Expired
                      message: 'coupon date expired',
                  });
                }

                //Check curt sub_total less than minimum_expend
                if(sinExistdata.minimum_expend > 0 &&  (sinExistdata.minimum_expend > cart_sub_total)){
                  return res.send({
                      status: 'error',
                      coupon_status: 3, // Expired
                      message: 'you are not reach minimum expend',
                  });
                }

                //Check curt sub_total greter than maximum_expend
                if(sinExistdata.maximum_expend > 0 &&  (cart_sub_total > sinExistdata.maximum_expend)){
                    let dis_amt = 0;
                    if(sinExistdata.discount_type == 1) {
                        console.log('i am at percent');
                        dis_amt = (sinExistdata.coupon_value * sinExistdata.maximum_expend)/100;
                    } else if(sinExistdata.discount_type == 2) {
                        console.log('i am at Fixed');
                        dis_amt = sinExistdata.coupon_value;
                    }
                  
                    return res.send({
                        status: 'success',
                        coupon_status: 4, // Expired
                        message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                    });
                }

                return res.send({
                  status: 'success',
                  coupon_status: 1, // Invalide
                  message: 'you are allways Valid and got ' + sinExistdata.coupon_value,
                });
                // ************************************

              })
          } //<--sinExistdata Else End
          
      }).catch(function(err){
        return res.send({
          status: 'error',
          message: 'server error'+err,
        });
      });
    // =============Slug Create End=================
  
          }
  
        
  
    },
    applyCoupon_v2: function (req, res) {
        let tokenUser = req.identity || '';

        let cart = {
            "coupon_code": 50,
            "cart_total": 49.97,
            "cartItems": [
                {
                    "regular_price": 11,
                    "sale_price": 11,
                    "quantity": 1,
                    "name": "product1",
                    "slug": "product-1",
                    "unit_price": 11,
                    "total_amount": 11,
                    "category_id": "63aadcc9981f6a36edb2fd34",
                    "product_id": "64522f41a2cf966b9878129a"
                },
                {
                    "regular_price": 12,
                    "sale_price": 12,
                    "quantity": 1,
                    "name": "product 2",
                    "image": "product-2",
                    "slug": "farah-mens-chinos-shorts-regular-fit-combat-light-weight-summer-soft-cotton-knee",
                    "unit_price": 12,
                    "total_amount": 12,
                    "category_id": "63aadcde981f6a36edb2fd35",
                    "product_id": "64522f93a2cf966b987812a4"
                },
                {
                    "regular_price": 59.99,
                    "sale_price": 19.99,
                    "quantity": 1,
                    "name": "product 3",
                    "slug": "product-3",
                    "unit_price": 13,
                    "total_amount": 13,
                    "category_id": "63b3fffd740c0c52b01de7c2",
                    "product_id": "64523044a2cf966b987812ae"
                }
            ],
            
        };
        const customFieldErrors = {};

        // let cart_sub_total = 9;
  
        let qryData = {
            coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
            is_active: true
          };
  
          if (!qryData.coupon_code) {
            customFieldErrors.coupon_code = {message: 'Code is Required'};
          }
  
          
          if (Object.keys(customFieldErrors).length) {
            return res.send({
              status: 'error',
              message: 'field error',
              fieldErrors: customFieldErrors,
              remoteData: qryData
            });
  
          } else {
             // #########################
          return Coupon.findOne(qryData).then(function (sinExistdata){
            if (!sinExistdata) {
              //coupon_code Check
                return res.send({
                status: 'error',
                coupon_status: 1, // Invalide
                message: 'coupon code invalid',
            });
          } else {
            let exixt_category=[];
            let exixt_product=[];
            // exixt_product=['6437aa0915a6725516d2cb2b'];
            if(cart && cart.cartItems && (cart.cartItems).length > 0){
                for(let i=0; i<cart.cartItems.length; i++){
                    exixt_product.push(cart.cartItems[i].product_id);
                    exixt_category.push(cart.cartItems[i].category_id);
                }
            };
            // console.log('exixt_product', exixt_product);
            // console.log('exixt_category', exixt_category);

            
            return Promise.all([
                CouponIncludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Include category Multi Box Auto Selected
                CouponExcludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Exclude category Multi Box Auto Selected

                CouponIncludeproduct.find({coupon: sinExistdata.id, product: exixt_product},{select: ['product']}), //<--For Related Include Product Multi Box Auto Selected
                CouponExcludeproduct.find({coupon: sinExistdata.id, product: exixt_product},{select: ['product']}), //<--For Related Exclude Product Multi Box Auto Selected

                Product.find({id: exixt_product, is_clearance: true, product_type: [1,2]},{select: ['id']}), //
              ]).spread(function(incCategory, excCategory, incProduct, excProduct, clearanceProduct) {

                // console.log(cart);
                // console.log('incCategory', incCategory);
                // console.log('excCategory', excCategory);
                // console.log('incProduct', incProduct);
                // console.log('excProduct', excProduct);
                console.log('clearanceProduct', clearanceProduct);

                let cart_sub_total = 56;
                let final_discount_amt = 0;

                let final_cart_item = cart.cartItems;


                // ************************************
                //coupon expire date check
                let expire_date = moment(sinExistdata.expiration_date).format('YYYY-MM-DD');
                let current_date = moment().format('YYYY-MM-DD');
                // console.log('current_date', current_date);
                // console.log('expire_date', expire_date);
                if(current_date > expire_date){
                  return res.send({
                      status: 'error',
                      coupon_status: 10, // Expired
                      message: 'coupon date expired',
                  });
                }

                //Check curt sub_total less than minimum_expend
                if(sinExistdata.minimum_expend > 0 &&  (sinExistdata.minimum_expend > cart_sub_total)){
                  return res.send({
                      status: 'error',
                      coupon_status: 15, // Expired
                      message: 'you are not reach minimum expend',
                  });
                }

                //if ExcludedCategory product reduce from Cartitem

                if(excCategory && excCategory.length > 0){
                    for(let i=0; i<excCategory.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.category_id !== excCategory[i].category; });
                    }
                }

                if(excProduct && excProduct.length > 0){
                    for(let i=0; i<excProduct.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.product_id !== excProduct[i].product; });
                    }
                }

                if(incCategory && incCategory.length > 0){
                    for(let i=0; i<incCategory.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.category_id == incCategory[i].category; });
                    }
                }

                if(incProduct && incProduct.length > 0){
                    for(let i=0; i<incProduct.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.product_id == incProduct[i].product; });
                    }
                }

                if(clearanceProduct && clearanceProduct.length > 0){
                    for(let i=0; i<clearanceProduct.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.product_id !== clearanceProduct[i].id; });
                    }
                }

                if(final_cart_item && final_cart_item.length > 0){
                   let final_cart_sub_total = 0;
                    for(let i=0; i<final_cart_item.length; i++){

                        let quantity = final_cart_item[i].quantity ? final_cart_item[i].quantity : 0;
                        let sale_price = final_cart_item[i].sale_price ? final_cart_item[i].sale_price : 0;
                        final_cart_sub_total += quantity * sale_price;
                    }

                    console.log('final_cart_sub_total', final_cart_sub_total);

                    //Check curt sub_total greter than maximum_expend
                    let dis_amt = 0;
                    if(sinExistdata.maximum_expend > 0 &&  (final_cart_sub_total > sinExistdata.maximum_expend)){
                        
                        if(sinExistdata.discount_type == 1) {
                            console.log('i am at percent');
                            dis_amt = (sinExistdata.coupon_value * sinExistdata.maximum_expend)/100;
                        } else if(sinExistdata.discount_type == 2) {
                            console.log('i am at Fixed');
                            dis_amt = sinExistdata.coupon_value;
                        }
                        return res.send({
                            status: 'success',
                            coupon_status: 20, // Expired
                            discount_val: dis_amt ? dis_amt.toFixed(2): 0, // Expired
                            message: 'coupon discount1',
                            // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                        });
                    } else {
                        console.log('fgfgfg', sinExistdata.discount_type);
                        if(sinExistdata.discount_type == 1) {
                            console.log('i am at percent111', final_cart_sub_total);
                            dis_amt = (sinExistdata.coupon_value * final_cart_sub_total)/100;
                        } else if(sinExistdata.discount_type == 2) {
                            console.log('i am at Fixed22'+sinExistdata.coupon_value);
                            dis_amt = sinExistdata.coupon_value;
                        }

                        return res.send({
                            status: 'success',
                            coupon_status: 25, // Expired
                            discount_val: dis_amt ? dis_amt.toFixed(2): 0, // Expired
                            message: 'coupon discount2',
                            // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                        });
                    }


                } else{
                    return res.send({
                        status: 'success',
                        coupon_status: 30, // Expired
                        discount_val: 0, // Expired
                        message: 'coupon discount3',
                        // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                    });
                }

                // clearanceProduct




                console.log('final_cart_item Aft Exc category', final_cart_item);




                

                return res.send({
                  status: 'success',
                  coupon_status: 1, // Invalide
                  message: 'you are allways Valid and got ' + sinExistdata.coupon_value,
                });
                // ************************************

              })
          } //<--sinExistdata Else End
          
      }).catch(function(err){
        return res.send({
          status: 'error',
          message: 'server error'+err,
        });
      });
    // =============Slug Create End=================
  
          }
  
        
  
    },

    applyCoupon_20Aug23: function (req, res) {
        let tokenUser = req.identity || '';

        let cart1 = {
            "coupon_code": "3SJX3I1J",
            "cart_total": "99.95",
            "cart_items": [
                {
                    "sku": "1304231441789_m",
                    "regular_price": 59.99,
                    "sale_price": 19.99,
                    "quantity": 3,
                    "name": "gant 234100 mens t shirt crew neck short sleeve summer logo tee cotton top new",
                    "image": "11304231441133.webp",
                    "slug": "gant-234100-mens-t-shirt-crew-neck-short-sleeve-summer-logo-tee-cotton-top-new",
                    "unit_price": 1999,
                    "total_amount": 5997,
                    "product_id": "6437c03e253cbb545891b90b",
                    "item_total": 59.97,
                    "category_id": "64324af166dc012d3d71c47d"
                    
                },
                {
                    "sku": "1304231441789_xl",
                    "regular_price": 59.99,
                    "sale_price": 19.99,
                    "quantity": 2,
                    "name": "gant 234100 mens t shirt crew neck short sleeve summer logo tee cotton top new",
                    "image": "11304231441133.webp",
                    "slug": "gant-234100-mens-t-shirt-crew-neck-short-sleeve-summer-logo-tee-cotton-top-new",
                    "unit_price": 1999,
                    "total_amount": 3998,
                    "product_id": "6437c03e253cbb545891b90b",
                    "item_total": 39.98,
                    "category_id": "64324af166dc012d3d71c47d"
                }
            ],
           
        };

    let data = req.param("data");
    console.log('data', data);
        // let cart = JSON.parse(data);
        let cart = req.param("data");
        const customFieldErrors = {};

        // let cart_sub_total = 9;
  
        let qryData = {
            // coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
            coupon_code: cart  ? cart.coupon_code.trim() : '',
            is_active: true
          };
  
          if (!qryData.coupon_code) {
            customFieldErrors.coupon_code = {message: 'Code is Required'};
          }
  
          
          if (Object.keys(customFieldErrors).length) {
            return res.send({
              status: 'error',
              message: 'field error',
              fieldErrors: customFieldErrors,
              remoteData: qryData
            });
  
          } else {
             // #########################
          return Coupon.findOne(qryData).then(function (sinExistdata){
            if (!sinExistdata) {
              //coupon_code Check
                return res.send({
                status: 'error',
                coupon_status: 1, // Invalide
                message: 'coupon code invalid',
            });
          } else {
            let exixt_category=[];
            let exixt_product=[];
            // exixt_product=['6437aa0915a6725516d2cb2b'];
            if(cart && cart.cart_items && (cart.cart_items).length > 0){
                for(let i=0; i<cart.cart_items.length; i++){
                    exixt_product.push(cart.cart_items[i].product_id);
                    exixt_category.push(cart.cart_items[i].category_id);
                }
            };
            // console.log('exixt_product', exixt_product);
            // console.log('exixt_category', exixt_category);

            
            return Promise.all([
                CouponIncludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Include category Multi Box Auto Selected
                CouponExcludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Exclude category Multi Box Auto Selected

                CouponIncludeproduct.find({coupon: sinExistdata.id, product: exixt_product},{select: ['product']}), //<--For Related Include Product Multi Box Auto Selected
                CouponExcludeproduct.find({coupon: sinExistdata.id, product: exixt_product},{select: ['product']}), //<--For Related Exclude Product Multi Box Auto Selected

                Product.find({id: exixt_product, is_clearance: true, product_type: [1,2]},{select: ['id']}), //
              ]).spread(function(incCategory, excCategory, incProduct, excProduct, clearanceProduct) {

                // console.log(cart);
                // console.log('incCategory', incCategory);
                // console.log('excCategory', excCategory);
                // console.log('incProduct', incProduct);
                // console.log('excProduct', excProduct);
                console.log('clearanceProduct', clearanceProduct);

                let cart_sub_total = 56;
                let final_discount_amt = 0;

                let final_cart_item = cart.cart_items;


                // ************************************
                //coupon expire date check
                let expire_date = moment(sinExistdata.expiration_date).format('YYYY-MM-DD');
                let current_date = moment().format('YYYY-MM-DD');
                // console.log('current_date', current_date);
                // console.log('expire_date', expire_date);
                if(current_date > expire_date){
                  return res.send({
                      status: 'error',
                      coupon_status: 10, // Expired
                      message: 'coupon date expired',
                  });
                }

                //Check curt sub_total less than minimum_expend
                if(sinExistdata.minimum_expend > 0 &&  (sinExistdata.minimum_expend > cart_sub_total)){
                  return res.send({
                      status: 'error',
                      coupon_status: 15, // Expired
                      message: 'you are not reach minimum expend',
                  });
                }

                //if ExcludedCategory product reduce from Cartitem

                if(excCategory && excCategory.length > 0){
                    for(let i=0; i<excCategory.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.category_id !== excCategory[i].category; });
                    }
                }

                if(excProduct && excProduct.length > 0){
                    for(let i=0; i<excProduct.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.product_id !== excProduct[i].product; });
                    }
                }

                if(incCategory && incCategory.length > 0){
                    for(let i=0; i<incCategory.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.category_id == incCategory[i].category; });
                    }
                }

                if(incProduct && incProduct.length > 0){
                    for(let i=0; i<incProduct.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.product_id == incProduct[i].product; });
                    }
                }

                if(clearanceProduct && clearanceProduct.length > 0){
                    for(let i=0; i<clearanceProduct.length; i++){
                        final_cart_item = _.filter(final_cart_item, function(sinItem) { return sinItem.product_id !== clearanceProduct[i].id; });
                    }
                }

                if(final_cart_item && final_cart_item.length > 0){
                   let final_cart_sub_total = 0;
                    for(let i=0; i<final_cart_item.length; i++){

                        let quantity = final_cart_item[i].quantity ? final_cart_item[i].quantity : 0;
                        let sale_price = final_cart_item[i].sale_price ? final_cart_item[i].sale_price : 0;
                        final_cart_sub_total += quantity * sale_price;
                    }

                    console.log('final_cart_sub_total', final_cart_sub_total);

                    //Check curt sub_total greter than maximum_expend
                    let dis_amt = 0;
                    if(sinExistdata.maximum_expend > 0 &&  (final_cart_sub_total > sinExistdata.maximum_expend)){
                        
                        if(sinExistdata.discount_type == 1) {
                            console.log('i am at percent');
                            dis_amt = (sinExistdata.coupon_value * sinExistdata.maximum_expend)/100;
                        } else if(sinExistdata.discount_type == 2) {
                            console.log('i am at Fixed');
                            dis_amt = sinExistdata.coupon_value;
                        }
                        return res.send({
                            status: 'success',
                            coupon_status: 20, // Expired
                            discount_val: dis_amt ? dis_amt.toFixed(2): 0, // Expired
                            message: 'coupon discount1',
                            // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                        });
                    } else {
                        console.log('fgfgfg', sinExistdata.discount_type);
                        if(sinExistdata.discount_type == 1) {
                            console.log('i am at percent111', final_cart_sub_total);
                            dis_amt = (sinExistdata.coupon_value * final_cart_sub_total)/100;
                        } else if(sinExistdata.discount_type == 2) {
                            console.log('i am at Fixed22'+sinExistdata.coupon_value);
                            dis_amt = sinExistdata.coupon_value;
                        }

                        return res.send({
                            status: 'success',
                            coupon_status: 25, // Expired
                            discount_val: dis_amt ? dis_amt.toFixed(2): 0, // Expired
                            message: 'coupon discount2',
                            // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                        });
                    }


                } else{
                    return res.send({
                        status: 'success',
                        coupon_status: 30, // Expired
                        discount_val: 0, // Expired
                        message: 'coupon discount3',
                        // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                    });
                }

                // clearanceProduct

                // ************************************

              })
          } //<--sinExistdata Else End
          
      }).catch(function(err){
        return res.send({
          status: 'error',
          message: 'server error'+err,
        });
      });
    // =============Slug Create End=================
  
          }
  
        
  
    },
    applyCoupon: function (req, res) {
        let tokenUser = req.identity || '';

        let tempCart = {
            "coupon_code": "TBO15",
            "cart_items": [
              {
                "sku": "BC_POLO_2B_2XL_Pink",
                "regular_price": 11.99,
                "sale_price": 7.49,
                 "id": "64afcf41af218df52da8260c",
                "quantity": 2,
                "name": "mens polo shirts regular fit short sleeve pink",
                "slug": "mens-polo-shirts-regular-fit-short-sleeve-pink",
                "product_id": "64afcf41af218df52da825fa",
                "item_total": 14.98,
                "category_id": "64324af166dc012d3d71c47d",
              },
              {
                "sku": "BC_POLO_2B_L_Red",
                "regular_price": 11.99,
                "sale_price": 6.49,
                "id": "64afcf84af218df52da82626",
                "quantity": 3,
                "name": "mens polo shirts regular fit short sleeve red",
                "slug": "mens-polo-shirts-regular-fit-short-sleeve-red",
                "product_id": "64afcf84af218df52da8260f",
                "item_total": 19.47,
                "category_id": "64324af166dc012d3d71c47d",
              },
              {
                "sku": "MANA_SW_BL_Stripe_M",
                "regular_price": 29.99,
                "sale_price": 12.99,
                "inventory": 4,
                "id": "64e19acf06f68b1373f6d63e",
                "quantity": 1,
                "name": "mana mens jacket half zip pullover jumpers long sleeve blue",
                "image": "wmsm-1-200823547757.webp",
                "slug": "mana-mens-jacket-half-zip-pullover-jumpers-long-sleeve-blue",
                "product_id": "64e19acf06f68b1373f6d62d",
                "item_total": 12.99,
                "category_id": "64324af166dc012d3d71c47d",
              }
            ],
            "cart_total": "47.44"
        };

    
        // let cart = tempCart;
        let cart = req.param("data");
        // console.log('cart', cart);
        // return res.send({
        //     status: 'test',
        //     message: 'field error',
        //     cart: cart
        //   });

        const customFieldErrors = {};

        // let cart_sub_total = 9;
  
        let qryData = {
            // coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
            coupon_code: cart  ? cart.coupon_code.trim() : '',
            is_active: true
          };
  
          if (!qryData.coupon_code) {
            customFieldErrors.coupon_code = {message: 'Code is Required'};
          }
  
          
          if (Object.keys(customFieldErrors).length) {
            return res.send({
              status: 'error',
              message: 'field error',
              fieldErrors: customFieldErrors,
              remoteData: qryData
            });
  
          } else {
             // #########################
          return Coupon.findOne(qryData).then(function (sinExistdata){
            if (!sinExistdata) {
              //coupon_code Check
                return res.send({
                status: 'error',
                coupon_status: 1, // Invalide
                message: 'coupon code invalid',
            });
          } else {
            //  ************************Coupon Expire date Check Start**********************************
            
               //coupon expire date check
               let expire_date = moment(sinExistdata.expiration_date).format('YYYY-MM-DD');
               let current_date = moment().format('YYYY-MM-DD');
               console.log('current_date', current_date);
               console.log('expire_date', expire_date);
               if(current_date > expire_date){
                 return res.send({
                     status: 'error',
                     coupon_status: 10, // Expired
                     message: 'coupon date expired',
                 });
               }

            //  ************************Coupon Expire date Check End************************************


            let exixt_category=[];
            let exixt_product=[];
            let order_cart_item = [];
            let cart_item_sub_total = 0;
            // exixt_product=['6437aa0915a6725516d2cb2b'];


            if(cart && cart.cart_items && (cart.cart_items).length > 0){
                order_cart_item = cart.cart_items;
                order_cart_item.map((sinCartItem) =>{
                    exixt_product.push(sinCartItem.product_id);
                    exixt_category.push(sinCartItem.category_id);
                    // cart_item_sub_total += parseFloat(sinCartItem.sale_price) * parseInt(sinCartItem.quantity) ;
                })
            };
            console.log('exixt_product', exixt_product);
            console.log('exixt_product', exixt_product);
            // console.log('cart_item_sub_total', cart_item_sub_total);

            
            
            return Promise.all([
                CouponIncludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Include category Multi Box Auto Selected
                CouponExcludecategory.find({coupon: sinExistdata.id},{select: ['category']}), //<--For Related Exclude category Multi Box Auto Selected

                CouponIncludeproduct.find({coupon: sinExistdata.id, product: exixt_product},{select: ['product']}), //<--For Related Include Product Multi Box Auto Selected
                CouponExcludeproduct.find({coupon: sinExistdata.id, product: exixt_product},{select: ['product']}), //<--For Related Exclude Product Multi Box Auto Selected

                Product.find({id: exixt_product, is_clearance: true, product_type: [1,2]},{select: ['id']}), //
              ]).spread(function(incCategory, excCategory, incProduct, excProduct, clearanceProduct) {

                // console.log(cart);
                // console.log('incCategory', incCategory);
                // console.log('excCategory', excCategory);
                // console.log('incProduct', incProduct);
                // console.log('excProduct', excProduct);
                // console.log('clearanceProduct', clearanceProduct);

                let cart_sub_total = 56;
                let final_discount_amt = 0;

                // let order_cart_item = cart.cart_items;

                // ************************************

                //if ExcludedCategory product reduce from Cartitem

                // ******************If Excludeed Category Reduce From order_cart_item Start**********************
                    if(excCategory && excCategory.length > 0){
                        excCategory.map((sinExcCat)=>{
                            order_cart_item = _.filter(order_cart_item, function(sinItem) { return sinItem.category_id !== sinExcCat.category; });
                        })
                    }
                // ******************If Excludeed Category Reduce From order_cart_item End************************

                // ******************If Excludeed Product Reduce From order_cart_item Start**********************
                    if(excProduct && excProduct.length > 0){
                        excProduct.map((sinExcPro)=>{
                            order_cart_item = _.filter(order_cart_item, function(sinItem) { return sinItem.product_id !== sinExcPro.product; });
                        })
                    }
                // ******************If Excludeed Product Reduce From order_cart_item End************************

                // ******************If Includeed Category Reduce From order_cart_item Start**********************
                    if(incCategory && incCategory.length > 0){
                        incCategory.map((sinIncCat)=>{
                            order_cart_item = _.filter(order_cart_item, function(sinItem) { return sinItem.category_id == sinIncCat.category; });
                        })
                    }
                // ******************If Includeed Category Reduce From order_cart_item End************************

                // ******************If Includeed Product Reduce From order_cart_item Star***********************
                    if(incProduct && incProduct.length > 0){
                        incProduct.map((sinIncPro)=>{
                            order_cart_item = _.filter(order_cart_item, function(sinItem) { return sinItem.product_id == sinIncPro.product; });
                        })
                    }
                // ******************If Includeed Product Reduce From order_cart_item End************************

                // ******************If Includeed Clearence Product Reduce From order_cart_item Start**********************
                    if(clearanceProduct && clearanceProduct.length > 0){
                        
                        clearanceProduct.map((sinClrcPro)=>{
                            order_cart_item = _.filter(order_cart_item, function(sinItem) { return sinItem.product_id !== sinClrcPro.id; });
                        })
                    }
                // ******************If Includeed Clearence Product Reduce From order_cart_item End************************

                if(order_cart_item && order_cart_item.length > 0){

                    //Calculate Order_item Sub Total
                    order_cart_item.map((sinCartItem) =>{
                        cart_item_sub_total += parseFloat(sinCartItem.sale_price) * parseInt(sinCartItem.quantity) ;
                    })
                    console.log('final_cart_sub_total', cart_item_sub_total);

                    //  ************************curt sub_total less than minimum_expend Check Start**********************************
                    //Check curt sub_total less than minimum_expend
                        if(sinExistdata.minimum_expend > 0 &&  (sinExistdata.minimum_expend > cart_item_sub_total)){
                            return res.send({
                                status: 'error',
                                coupon_status: 15, // Expired
                                message: 'you are not reach minimum expend',
                            });
                        }
                    //  ************************curt sub_total less than minimum_expend Check End************************************

                    //Check curt sub_total greter than maximum_expend
                    let dis_amt = 0;
                    if(sinExistdata.maximum_expend > 0 &&  (cart_item_sub_total > sinExistdata.maximum_expend)){
                        if(sinExistdata.discount_type == 1) {
                            console.log('i am at percent');
                            dis_amt = (sinExistdata.coupon_value * sinExistdata.maximum_expend)/100;
                        } else if(sinExistdata.discount_type == 2) {
                            console.log('i am at Fixed');
                            dis_amt = sinExistdata.coupon_value;
                        }
                        return res.send({
                            status: 'success',
                            coupon_status: 20, // Expired
                            discount_val: dis_amt ? dis_amt.toFixed(2): 0, // Expired
                            message: 'coupon discount1',
                            // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                        });
                    } else {
                        console.log('fgfgfg', sinExistdata.discount_type);
                        if(sinExistdata.discount_type == 1) {
                            console.log('i am at percent111', cart_item_sub_total);
                            dis_amt = (sinExistdata.coupon_value * cart_item_sub_total)/100;
                        } else if(sinExistdata.discount_type == 2) {
                            console.log('i am at Fixed22'+sinExistdata.coupon_value);
                            dis_amt = sinExistdata.coupon_value;
                        }

                        return res.send({
                            status: 'success',
                            coupon_status: 25, // Expired
                            discount_val: dis_amt ? dis_amt.toFixed(2): 0, // Expired
                            message: 'coupon discount2',
                            // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                        });
                    }


                } else{
                    return res.send({
                        status: 'success',
                        coupon_status: 30, // Expired
                        discount_val: 0, // Expired
                        message: 'coupon discount3',
                        // message: 'you are out of maximum expend'+ dis_amt ? dis_amt.toFixed(2): 0,
                    });
                }

                // clearanceProduct

                // ************************************

              })
          } //<--sinExistdata Else End
          
      }).catch(function(err){
        return res.send({
          status: 'error',
          message: 'server error'+err,
        });
      });
    // =============Slug Create End=================
  
          }
  
        
  
    },

};

