/**
 * FrontProtectedController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


let moment = require('moment');
let Promise = require('bluebird');
let _ = require('lodash');
let randToken = require('rand-token');
let mailer = require('nodemailer');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: true
    },

    // ************************* Order Related Start******************************

    orderSave_fullOk: function (req, res) {

        let tmpOrder = {
              "cart_data": {
                  "items": [
                      {
                          "sku": "DSL_Tee_T-FOIL_BK_M",
                          "regular_price": 49.99,
                          "sale_price": 14.99,
                          "inventory": 48,
                          "identifier_type": 0,
                          "identifier_number": "",
                          "producttermsArr": [
                              {
                                  "attributeId": "6433cf1a10f6883521a92822",
                                  "attributeName": "size",
                                  "termsId": "6433d1d910f6883521a92827",
                                  "termsName": "m"
                              }
                          ],
                          "featured_image": "",
                          "available": false,
                          "outofstock": false,
                          "stockout_msg": "",
                          "id": "6458bf38d4996e69c80f922e",
                          "quantity": 2,
                          "name": "diesel t foil womens t shirts crew neck short sleeve casual black summer tee new",
                          "image": "wmsm-1-0705232146753.webp",
                          "slug": "diesel-t-foil-womens-t-shirts-crew-neck-short-sleeve-casual-black-summer-tee-new",
                          "unit_price": 1499,
                          "total_amount": 1499,
                          "product_id": "6459fa93170f883f0966efdf",
                          "item_total": 14.99,
                          "category_id": "64324afe66dc012d3d71c47e"
                      }
                  ],
                  "total": 14.99,
                  "grand_total": 14.99
              },
              "coupon_data": {
                  "coupon_code": null,
                  "coupon_value": null
              },
              "payment_info": {
                  "payment_method": "paypal",
                  "transition_id": "35238636BN0001914",
                  "status": "success",
                  "payer_name": "John",
                  "email": "sb-tpfiv25490079@business.example.com",
                  "payer_id": "KKMQ6QHDPJN7J"
              },
              "customer_info": {
                  "first_name": "Jahangir",
                  "last_name": "Hossain",
                  "email": "jahangir147441@gmail.com",
                  "street_address": "Dhaka",
                  "street_address2": "House#57",
                  "street_address3": "Road#25",
                  "post_code": "1216",
                  "phone": "01778175444",
                  "country": "GB",
                  "city": "Mirpur",
                  "county": "",
                  "agreement": false
              },
              "billing_address": {
                  "email": "example2@gmail.com",
                  "street_address": "Jatrabari",
                  "street_address2": "House#56",
                  "street_address3": "Road#27",
                  "postal_code": "1580",
                  "city": "Dhaka",
                  "phone": "0151789652",
                  "country": "BD"
              },
              "shipping_address": {
                  "shipping_method": "Free Delivery",
                  "email": "example@gmail.com",
                  "street_address": "Dhaka",
                  "street_address2": "House#57",
                  "street_address3": "Road#19",
                  "postal_code": "1980",
                  "city": "Laxmipur",
                  "phone": "012458484154",
                  "country": "BD"
              }
          };
        // let slug = req.param('slug');
        // let sale = tmpOrder;
        let sale = req.param("data");
        // console.log('sale', sale);
        if (!sale){
          return res.send({
            status: 'error',
            status_code: 11,
            message: 'data is empty',
          });
        }else{
            // =========================Start======================
            // console.log('coupon datasale', sale.coupon_data);
          let cart_data = sale.cart_data ? sale.cart_data : '';
          let coupon_data = sale.coupon_data ? sale.coupon_data : '';
          let payment_info = sale.payment_info ? sale.payment_info : '';
          let customer_info = sale.customer_info ? sale.customer_info : '';
          let billing_address = sale.billing_address ? sale.billing_address : '';
          let shipping_address = sale.shipping_address ? sale.shipping_address : '';
  
            let exixt_product=[];
              if(sale && cart_data && cart_data.items.length > 0){
                  for(let i=0; i<cart_data.items.length; i++){
                      exixt_product.push(cart_data.items[i].id);
                  }
              };
            // console.log('exixt_product ', exixt_product);
            let couponQData = {
              // coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
              coupon_code: (coupon_data && coupon_data.coupon_code)  ? coupon_data.coupon_code.trim() : '',
              is_active: true
            };
  
            let tokenUser = req.identity || '';
            let _newOrderData = {
              invoice: moment().format("YYMMDD")+randToken.generate(8, "123456789abcdefghijklnmpqrstuvwxyz"),
              code: moment().format("YYMMDD")+randToken.generate(32),
  
              billing_first_name: billing_address.first_name ?  billing_address.first_name : '',
              billing_last_name: billing_address.last_name ?  billing_address.last_name : '',
              billing_email: billing_address.email ?  billing_address.email : '',
              billing_street_address: billing_address.street_address ?  billing_address.street_address : '',
              billing_street_address2: billing_address.street_address2 ?  billing_address.street_address2 : '',
              billing_street_address3: billing_address.street_address3 ?  billing_address.street_address3 : '',
              billing_post_code: billing_address.postal_code ?  billing_address.postal_code : '',
              billing_phone: billing_address.phone ?  billing_address.phone : '',
              billing_country: billing_address.country ?  billing_address.country : '',
              billing_city: billing_address.city ?  billing_address.city : '',
              billing_county: billing_address.county ?  billing_address.county : '',
  
  
  
  
              shipping_method: shipping_address.shipping_method ?  shipping_address.shipping_method : '',
  
              shipping_first_name: shipping_address.first_name ?  shipping_address.first_name : '',
              shipping_last_name: shipping_address.last_name ?  shipping_address.last_name : '',
              shipping_email: shipping_address.email ?  shipping_address.email : '',
              shipping_street_address: shipping_address.street_address ?  shipping_address.street_address : '',
              shipping_street_address2: shipping_address.street_address2 ?  shipping_address.street_address2 : '',
              shipping_street_address3: shipping_address.street_address3 ?  shipping_address.street_address3 : '',
              shipping_post_code: shipping_address.postal_code ?  shipping_address.postal_code : '',
              shipping_phone: shipping_address.phone ?  shipping_address.phone : '',
              shipping_country: shipping_address.country ?  shipping_address.country : '',
              shipping_city: shipping_address.city ?  shipping_address.city : '',
              shipping_county: shipping_address.county ?  shipping_address.county : '',
  
              payment_method: payment_info.payment_method ? payment_info.payment_method : '',
              payer_id: payment_info.payer_id ? payment_info.payer_id : '',
              payer_name: payment_info.payer_name ? payment_info.payer_name : '',
              payer_email: payment_info.email ? payment_info.email : '',
              status: 2,

              customer: tokenUser ? tokenUser.id : null,
            }
  
            // console.log('couponQData ', couponQData);
            
            let final_sub_total = 0;
            let final_shipping_cost = 0;
            let final_coupon_discount = 0;
            let final_grand_total = 0;
  
            let final_order_item = [];
  
            return Promise.all([
              Product.find({id: exixt_product, product_type: [1,3]}).populate('variantMasterProduct', { select: ['id', 'slug', 'sku', 'name', 'featured_image', 'regular_price', 'sale_price', 'inventory']}),
              Coupon.findOne(couponQData)
            ]).spread(function(cartProduct, extCoupon) {
              
              // ************************** Order Discount Start ****************************
              // ************************** Order Discount End ******************************
  
              // ************************** OrderItem Discount Start ************************
              if(cartProduct && cartProduct.length > 0){
  
                for(let i=0; i<cartProduct.length; i++){
  
                  let targetCartItem = _.find(cart_data.items, { 'id': cartProduct[i].id });
                let targetDbProduct = _.find(cartProduct, { 'id': cartProduct[i].id });
                if(targetCartItem && targetDbProduct && targetCartItem.id == targetDbProduct.id){
                  let ordItemObj = {};
                   ordItemObj.quantity = targetCartItem.quantity;
                   if(targetDbProduct.product_type == 1){
                    ordItemObj.product_type = 1;
                    ordItemObj.price = targetDbProduct.sale_price;
                    ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.sale_price);
  
                      ordItemObj.product = targetDbProduct.id;
                      ordItemObj.productObj = {
                        id: targetDbProduct.id,
                        slug: targetDbProduct.slug,
                        sku: targetDbProduct.sku,
                        name: targetDbProduct.name,
                        featured_image: targetDbProduct.featured_image,
                        regular_price: targetDbProduct.regular_price,
                        sale_price: targetDbProduct.sale_price,
                      };

                      //reduce quantity from db

                      targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                      targetDbProduct.save();

                   }
  
                   if(targetDbProduct.product_type == 3){
                    ordItemObj.product_type = 2;
                    ordItemObj.price = targetDbProduct.sale_price;
                   ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.variantMasterProduct.sale_price);
  
                    ordItemObj.product = targetDbProduct.variantMasterProduct.id;
                      ordItemObj.productObj = {
                        id: targetDbProduct.variantMasterProduct.id,
                        slug: targetDbProduct.variantMasterProduct.slug,
                        sku: targetDbProduct.variantMasterProduct.sku,
                        name: targetDbProduct.variantMasterProduct.name,
                        featured_image: targetDbProduct.variantMasterProduct.featured_image,
                        regular_price: targetDbProduct.variantMasterProduct.regular_price,
                        sale_price: targetDbProduct.variantMasterProduct.sale_price,
                      };
  
  
                      ordItemObj.variantProduct = targetDbProduct.id;
                      ordItemObj.vatiantProductObj = {
                        id: targetDbProduct.id,
                        slug: targetDbProduct.slug,
                        sku: targetDbProduct.sku,
                        name: targetDbProduct.name,
                        featured_image: targetDbProduct.featured_image,
                        regular_price: targetDbProduct.regular_price,
                        sale_price: targetDbProduct.sale_price,
                      };

                      //reduce varient product quantity
                      targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                      targetDbProduct.save();
                      
                      //reduce master product quantity from db
                      let updt_master_quantity = parseInt(targetDbProduct.variantMasterProduct.inventory) - parseInt(targetCartItem.quantity);
                      // console.log('aaaaaa inventory', updt_master_quantity);
                      targetDbProduct.variantMasterProduct.inventory = updt_master_quantity;
                      targetDbProduct.variantMasterProduct.save();
                  }
  
                  final_sub_total += ordItemObj.total_price;
                  final_order_item.push(ordItemObj);
  
                }
  
                }; //<==Forloop End
  
                
              }
  
              // ************************** OrderItem Discount End **************************
  
              // ************************** Coupon Discount Start ***************************
              if (extCoupon) {
                _newOrderData.coupon_code = extCoupon.coupon_code;
                _newOrderData.coupon_value = extCoupon.coupon_value;
                final_coupon_discount = extCoupon.coupon_value;
              }
              // ************************** Coupon Discount End *****************************
  
  
              // ************************** Grand Total Cost Start ***************************
              final_grand_total = (final_sub_total + final_shipping_cost) - final_coupon_discount;
  
  
              // ************************** Grand Total Cost End *****************************
  
  
              // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  
              _newOrderData.sub_total = final_sub_total;
              _newOrderData.shipping_cost = final_shipping_cost;
              _newOrderData.grand_total = final_grand_total;
  
              return Order.create(_newOrderData).then(function (createData) {
                let itemPromissesList = [];
                for (let i = 0; i < final_order_item.length; i++) {
                  final_order_item[i].order = createData.id;
                  itemPromissesList.push(Orderitem.create(final_order_item[i]));
                  // itemPromissesList.push(final_order_item[i]);
                }
                return Promise.all(itemPromissesList).then(function(promissList){
                  return [createData, promissList];
  
                }).spread(function(createData, orderItemList){
  
                  return res.send({
                    status: 'success',
                    status_code: 22,
                    order: createData,
                    order_item: orderItemList,
                    message: 'order details',
                  });
  
                });
              });
  
              // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  
          }).catch(function(err){
            return res.send({
              status: 'error',
              message: 'server error',
              err: err
  
            });
          });
  
            // =========================End========================
        }
    },
    orderSave_19june23: function (req, res) {

      let tmpOrder = {
            "cart_data": {
                "items": [
                    {
                        "sku": "DSL_Tee_T-FOIL_BK_M",
                        "regular_price": 49.99,
                        "sale_price": 14.99,
                        "inventory": 48,
                        "identifier_type": 0,
                        "identifier_number": "",
                        "producttermsArr": [
                            {
                                "attributeId": "6433cf1a10f6883521a92822",
                                "attributeName": "size",
                                "termsId": "6433d1d910f6883521a92827",
                                "termsName": "m"
                            }
                        ],
                        "featured_image": "",
                        "available": false,
                        "outofstock": false,
                        "stockout_msg": "",
                        "id": "646a00335412737442824b0d",
                        "quantity": 2,
                        "name": "diesel t foil womens t shirts crew neck short sleeve casual black summer tee new",
                        "image": "wmsm-1-0705232146753.webp",
                        "slug": "diesel-t-foil-womens-t-shirts-crew-neck-short-sleeve-casual-black-summer-tee-new",
                        "unit_price": 1499,
                        "total_amount": 1499,
                        "product_id": "6459fa93170f883f0966efdf",
                        "item_total": 14.99,
                        "category_id": "64324afe66dc012d3d71c47e"
                    }
                ],
                "total": 14.99,
                "grand_total": 14.99
            },
            // "note": 'This is custom note',
            "coupon_data": {
                "coupon_code": null,
                "coupon_value": null
            },
            "payment_info": {
                "payment_method": "paypal",
                "transition_id": "35238636BN0001914",
                "status": "success",
                "payer_name": "John",
                "email": "sb-tpfiv25490079@business.example.com",
                "payer_id": "KKMQ6QHDPJN7J"
            },
            "customer_info": {
                "first_name": "Jahangir",
                "last_name": "Hossain",
                "email": "jahangir147441@gmail.com",
                "street_address": "Dhaka",
                "street_address2": "House#57",
                "street_address3": "Road#25",
                "post_code": "1216",
                "phone": "01778175444",
                "country": "GB",
                "city": "Mirpur",
                "county": "",
                "agreement": false
            },
            "billing_address": {
                "email": "example2@gmail.com",
                "street_address": "Jatrabari",
                "street_address2": "House#56",
                "street_address3": "Road#27",
                "postal_code": "1580",
                "city": "Dhaka",
                "phone": "0151789652",
                "country": "BD"
            },
            "shipping_address": {
                "shipping_method": "Free Delivery",
                "email": "example@gmail.com",
                "street_address": "Dhaka",
                "street_address2": "House#57",
                "street_address3": "Road#19",
                "postal_code": "1980",
                "city": "Laxmipur",
                "phone": "012458484154",
                "country": "BD"
            }
        };
      // let slug = req.param('slug');
      // let sale = tmpOrder;
      let sale = req.param("data");
      // console.log('sale', sale);
      if (!sale){
        return res.send({
          status: 'error',
          status_code: 11,
          message: 'data is empty',
        });
      }else{
          // =========================Start======================
          // console.log('coupon datasale', sale.coupon_data);
        let cart_data = sale.cart_data ? sale.cart_data : '';
        let coupon_data = sale.coupon_data ? sale.coupon_data : '';
        let payment_info = sale.payment_info ? sale.payment_info : '';
        let customer_info = sale.customer_info ? sale.customer_info : '';
        let billing_address = sale.billing_address ? sale.billing_address : '';
        let shipping_address = sale.shipping_address ? sale.shipping_address : '';

          let exixt_product=[];
            if(sale && cart_data && cart_data.items.length > 0){
                for(let i=0; i<cart_data.items.length; i++){
                    exixt_product.push(cart_data.items[i].id);
                }
            };
          // console.log('exixt_product ', exixt_product);
          let couponQData = {
            // coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
            coupon_code: (coupon_data && coupon_data.coupon_code)  ? coupon_data.coupon_code.trim() : '',
            is_active: true
          };

          let tokenUser = req.identity || '';
          let _newOrderData = {
            invoice: moment().format("YYMMDD")+randToken.generate(8, "123456789abcdefghijklnmpqrstuvwxyz"),
            code: moment().format("YYMMDD")+randToken.generate(32),

            billing_first_name: billing_address.first_name ?  billing_address.first_name : '',
            billing_last_name: billing_address.last_name ?  billing_address.last_name : '',
            billing_email: billing_address.email ?  billing_address.email : '',
            billing_street_address: billing_address.street_address ?  billing_address.street_address : '',
            billing_street_address2: billing_address.street_address2 ?  billing_address.street_address2 : '',
            billing_street_address3: billing_address.street_address3 ?  billing_address.street_address3 : '',
            billing_post_code: billing_address.postal_code ?  billing_address.postal_code : '',
            billing_phone: billing_address.phone ?  billing_address.phone : '',
            billing_country: billing_address.country ?  billing_address.country : '',
            billing_city: billing_address.city ?  billing_address.city : '',
            billing_county: billing_address.county ?  billing_address.county : '',




            shipping_method: shipping_address.shipping_method ?  shipping_address.shipping_method : '',

            shipping_first_name: shipping_address.first_name ?  shipping_address.first_name : '',
            shipping_last_name: shipping_address.last_name ?  shipping_address.last_name : '',
            shipping_email: shipping_address.email ?  shipping_address.email : '',
            shipping_street_address: shipping_address.street_address ?  shipping_address.street_address : '',
            shipping_street_address2: shipping_address.street_address2 ?  shipping_address.street_address2 : '',
            shipping_street_address3: shipping_address.street_address3 ?  shipping_address.street_address3 : '',
            shipping_post_code: shipping_address.postal_code ?  shipping_address.postal_code : '',
            shipping_phone: shipping_address.phone ?  shipping_address.phone : '',
            shipping_country: shipping_address.country ?  shipping_address.country : '',
            shipping_city: shipping_address.city ?  shipping_address.city : '',
            shipping_county: shipping_address.county ?  shipping_address.county : '',

            payment_method: payment_info.payment_method ? payment_info.payment_method : '',
            payer_id: payment_info.payer_id ? payment_info.payer_id : '',
            payer_name: payment_info.payer_name ? payment_info.payer_name : '',
            payer_email: payment_info.email ? payment_info.email : '',
            status: 1,
            note: 'This is custom note',

            customer: tokenUser ? tokenUser.id : null,
            customerObj: {id: tokenUser.id, email: tokenUser.email, nickname: tokenUser.nickname, name: tokenUser.first_name ? tokenUser.first_name : ' ' + tokenUser.last_name ? tokenUser.last_name : ' ', display_name: tokenUser.display_name ? tokenUser.display_name : tokenUser.display_name},
            
          }

          // console.log('couponQData ', couponQData);
          
          let final_sub_total = 0;
          let final_shipping_cost = 0;
          let final_coupon_discount = 0;
          let final_grand_total = 0;

          let final_order_item = [];

          return Promise.all([
            Product.find({id: exixt_product, product_type: [1,3]}).populate('variantMasterProduct', { select: ['id', 'slug', 'sku', 'name', 'featured_image', 'regular_price', 'sale_price', 'inventory']}),
            Coupon.findOne(couponQData)
          ]).spread(function(cartProduct, extCoupon) {
            
            // ************************** Order Discount Start ****************************
            // ************************** Order Discount End ******************************

            // ************************** OrderItem Discount Start ************************
            if(cartProduct && cartProduct.length > 0){

              for(let i=0; i<cartProduct.length; i++){

                let targetCartItem = _.find(cart_data.items, { 'id': cartProduct[i].id });
              let targetDbProduct = _.find(cartProduct, { 'id': cartProduct[i].id });
              if(targetCartItem && targetDbProduct && targetCartItem.id == targetDbProduct.id){
                let ordItemObj = {};
                 ordItemObj.quantity = targetCartItem.quantity;
                 if(targetDbProduct.product_type == 1){
                  ordItemObj.product_type = 1;
                  ordItemObj.price = targetDbProduct.sale_price;
                  ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.sale_price);

                    ordItemObj.product = targetDbProduct.id;
                    ordItemObj.productObj = {
                      id: targetDbProduct.id,
                      slug: targetDbProduct.slug,
                      sku: targetDbProduct.sku,
                      name: targetDbProduct.name,
                      featured_image: targetDbProduct.featured_image,
                      regular_price: targetDbProduct.regular_price,
                      sale_price: targetDbProduct.sale_price,
                    };

                    //reduce quantity from db

                    targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                    targetDbProduct.save();

                 }

                 if(targetDbProduct.product_type == 3){
                  ordItemObj.product_type = 2;
                  ordItemObj.price = targetDbProduct.sale_price;
                 ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.variantMasterProduct.sale_price);

                  ordItemObj.product = targetDbProduct.variantMasterProduct.id;
                    ordItemObj.productObj = {
                      id: targetDbProduct.variantMasterProduct.id,
                      slug: targetDbProduct.variantMasterProduct.slug,
                      sku: targetDbProduct.variantMasterProduct.sku,
                      name: targetDbProduct.variantMasterProduct.name,
                      featured_image: targetDbProduct.variantMasterProduct.featured_image,
                      regular_price: targetDbProduct.variantMasterProduct.regular_price,
                      sale_price: targetDbProduct.variantMasterProduct.sale_price,
                    };


                    ordItemObj.variantProduct = targetDbProduct.id;
                    ordItemObj.vatiantProductObj = {
                      id: targetDbProduct.id,
                      slug: targetDbProduct.slug,
                      sku: targetDbProduct.sku,
                      name: targetDbProduct.name,
                      featured_image: targetDbProduct.featured_image,
                      regular_price: targetDbProduct.regular_price,
                      sale_price: targetDbProduct.sale_price,
                      producttermsArr: targetDbProduct.producttermsArr,


                    };

                    //reduce varient product quantity
                    targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                    targetDbProduct.save();
                    
                    //reduce master product quantity from db
                    let updt_master_quantity = parseInt(targetDbProduct.variantMasterProduct.inventory) - parseInt(targetCartItem.quantity);
                    // console.log('aaaaaa inventory', updt_master_quantity);
                    targetDbProduct.variantMasterProduct.inventory = updt_master_quantity;
                    targetDbProduct.variantMasterProduct.save();
                }

                final_sub_total += ordItemObj.total_price;
                final_order_item.push(ordItemObj);

              }

              }; //<==Forloop End

              
            }

            // ************************** OrderItem Discount End **************************

            // ************************** Coupon Discount Start ***************************
            if (extCoupon) {
              _newOrderData.coupon_code = extCoupon.coupon_code;
              _newOrderData.coupon_value = extCoupon.coupon_value;
              final_coupon_discount = extCoupon.coupon_value;
            }
            // ************************** Coupon Discount End *****************************


            // ************************** Grand Total Cost Start ***************************
            final_grand_total = (final_sub_total + final_shipping_cost) - final_coupon_discount;


            // ************************** Grand Total Cost End *****************************


            // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

            _newOrderData.sub_total = final_sub_total;
            _newOrderData.shipping_cost = final_shipping_cost;
            _newOrderData.grand_total = final_grand_total;

            return Order.create(_newOrderData).then(function (createData) {
              let itemPromissesList = [];
              for (let i = 0; i < final_order_item.length; i++) {
                final_order_item[i].order = createData.id;
                itemPromissesList.push(Orderitem.create(final_order_item[i]));
                // itemPromissesList.push(final_order_item[i]);
              }
              return Promise.all(itemPromissesList).then(function(promissList){
                return [createData, promissList];

              }).spread(function(createData, orderItemList){

                let mailData = {
                  order: createData,
                  order_item: orderItemList
                }
                ZeMailerService.orderEmail(mailData);  // <= Here mail Send

                return res.send({
                  status: 'success',
                  status_code: 22,
                  order: createData,
                  order_item: orderItemList,
                  message: 'order details',
                });

              });
            });

            // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

        }).catch(function(err){
          return res.send({
            status: 'error' +err,
            message: 'server error',
            err: err

          });
        });

          // =========================End========================
      }
    },
    orderSave_24July23: function (req, res) {

      let tmpOrder = {
            "cart_data": {
                "items": [
                    {
                        "sku": "DSL_Tee_T-FOIL_BK_M",
                        "regular_price": 49.99,
                        "sale_price": 14.99,
                        "inventory": 48,
                        "identifier_type": 0,
                        "identifier_number": "",
                        "producttermsArr": [
                            {
                                "attributeId": "6433cf1a10f6883521a92822",
                                "attributeName": "size",
                                "termsId": "6433d1d910f6883521a92827",
                                "termsName": "m"
                            }
                        ],
                        "featured_image": "",
                        "available": false,
                        "outofstock": false,
                        "stockout_msg": "",
                        "id": "646a00335412737442824b0d",
                        "quantity": 2,
                        "name": "diesel t foil womens t shirts crew neck short sleeve casual black summer tee new",
                        "image": "wmsm-1-0705232146753.webp",
                        "slug": "diesel-t-foil-womens-t-shirts-crew-neck-short-sleeve-casual-black-summer-tee-new",
                        "unit_price": 1499,
                        "total_amount": 1499,
                        "product_id": "6459fa93170f883f0966efdf",
                        "item_total": 14.99,
                        "category_id": "64324afe66dc012d3d71c47e"
                    }
                ],
                "total": 14.99,
                "grand_total": 14.99
            },
            // "note": 'This is custom note',
            "coupon_data": {
                "coupon_code": null,
                "coupon_value": null
            },
            "payment_info": {
                "payment_method": "paypal",
                "transition_id": "35238636BN0001914",
                "status": "success",
                "payer_name": "John",
                "email": "sb-tpfiv25490079@business.example.com",
                "payer_id": "KKMQ6QHDPJN7J"
            },
            "customer_info": {
                "first_name": "Jahangir",
                "last_name": "Hossain",
                "email": "jahangir147441@gmail.com",
                "street_address": "Dhaka",
                "street_address2": "House#57",
                "street_address3": "Road#25",
                "post_code": "1216",
                "phone": "01778175444",
                "country": "GB",
                "city": "Mirpur",
                "county": "",
                "agreement": false
            },
            "billing_address": {
                "email": "example2@gmail.com",
                "street_address": "Jatrabari",
                "street_address2": "House#56",
                "street_address3": "Road#27",
                "postal_code": "1580",
                "city": "Dhaka",
                "phone": "0151789652",
                "country": "BD"
            },
            "shipping_address": {
                "shipping_method": "Free Delivery",
                "email": "example@gmail.com",
                "street_address": "Dhaka",
                "street_address2": "House#57",
                "street_address3": "Road#19",
                "postal_code": "1980",
                "city": "Laxmipur",
                "phone": "012458484154",
                "country": "BD"
            }
        };
      // let slug = req.param('slug');
      // let sale = tmpOrder;
      let sale = req.param("data");
      // console.log('sale', sale);
      if (!sale){
        return res.send({
          status: 'error',
          status_code: 11,
          message: 'data is empty',
        });
      }else{
          // =========================Start======================
          // console.log('coupon datasale', sale.coupon_data);
        let cart_data = sale.cart_data ? sale.cart_data : '';
        let coupon_data = sale.coupon_data ? sale.coupon_data : '';
        let payment_info = sale.payment_info ? sale.payment_info : '';
        let customer_info = sale.customer_info ? sale.customer_info : '';
        let billing_address = sale.billing_address ? sale.billing_address : '';
        let shipping_address = sale.shipping_address ? sale.shipping_address : '';

          let exixt_product=[];
            if(sale && cart_data && cart_data.items.length > 0){
                for(let i=0; i<cart_data.items.length; i++){
                    exixt_product.push(cart_data.items[i].id);
                }
            };
          // console.log('exixt_product ', exixt_product);
          let couponQData = {
            // coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
            coupon_code: (coupon_data && coupon_data.coupon_code)  ? coupon_data.coupon_code.trim() : '',
            is_active: true
          };

          let tokenUser = req.identity || '';
          let _newOrderData = {
            invoice: moment().format("YYMMDD")+randToken.generate(8, "123456789abcdefghijklnmpqrstuvwxyz"),
            code: moment().format("YYMMDD")+randToken.generate(32),

            customer_first_name: customer_info.first_name ?  customer_info.first_name : '',
            customer_last_name: customer_info.last_name ?  customer_info.last_name : '',
            customer_email: customer_info.email ?  customer_info.email : '',
            customer_street_address: customer_info.street_address ?  customer_info.street_address : '',
            customer_street_address2: customer_info.street_address2 ?  customer_info.street_address2 : '',
            customer_street_address3: customer_info.street_address3 ?  customer_info.street_address3 : '',
            customer_post_code: customer_info.postal_code ?  customer_info.postal_code : '',
            customer_phone: customer_info.phone ?  customer_info.phone : '',
            customer_country: customer_info.country ?  customer_info.country : '',
            customer_city: customer_info.city ?  customer_info.city : '',
            customer_county: customer_info.county ?  customer_info.county : '',


            billing_first_name: billing_address.first_name ?  billing_address.first_name : '',
            billing_last_name: billing_address.last_name ?  billing_address.last_name : '',
            billing_email: billing_address.email ?  billing_address.email : '',
            billing_street_address: billing_address.street_address ?  billing_address.street_address : '',
            billing_street_address2: billing_address.street_address2 ?  billing_address.street_address2 : '',
            billing_street_address3: billing_address.street_address3 ?  billing_address.street_address3 : '',
            billing_post_code: billing_address.postal_code ?  billing_address.postal_code : '',
            billing_phone: billing_address.phone ?  billing_address.phone : '',
            billing_country: billing_address.country ?  billing_address.country : '',
            billing_city: billing_address.city ?  billing_address.city : '',
            billing_county: billing_address.county ?  billing_address.county : '',




            shipping_method: shipping_address.shipping_method ?  shipping_address.shipping_method : '',

            shipping_first_name: shipping_address.first_name ?  shipping_address.first_name : '',
            shipping_last_name: shipping_address.last_name ?  shipping_address.last_name : '',
            shipping_email: shipping_address.email ?  shipping_address.email : '',
            shipping_street_address: shipping_address.street_address ?  shipping_address.street_address : '',
            shipping_street_address2: shipping_address.street_address2 ?  shipping_address.street_address2 : '',
            shipping_street_address3: shipping_address.street_address3 ?  shipping_address.street_address3 : '',
            shipping_post_code: shipping_address.postal_code ?  shipping_address.postal_code : '',
            shipping_phone: shipping_address.phone ?  shipping_address.phone : '',
            shipping_country: shipping_address.country ?  shipping_address.country : '',
            shipping_city: shipping_address.city ?  shipping_address.city : '',
            shipping_county: shipping_address.county ?  shipping_address.county : '',

            payment_method: payment_info.payment_method ? payment_info.payment_method : '',
            payer_id: payment_info.payer_id ? payment_info.payer_id : '',
            payer_name: payment_info.payer_name ? payment_info.payer_name : '',
            payer_email: payment_info.email ? payment_info.email : '',
            refund_link: payment_info.refund_link ? payment_info.refund_link : '',
            status: 1,
            note: sale.note ? sale.note : '',

            customer: tokenUser ? tokenUser.id : null,
            customerObj: {id: tokenUser.id, email: tokenUser.email, nickname: tokenUser.nickname, name: tokenUser.first_name ? tokenUser.first_name : ' ' + tokenUser.last_name ? tokenUser.last_name : ' ', display_name: tokenUser.display_name ? tokenUser.display_name : tokenUser.display_name},
            
          }

          // console.log('couponQData ', couponQData);
          
          let final_sub_total = 0;
          let final_shipping_cost = 0;
          let final_coupon_discount = 0;
          let final_grand_total = 0;

          let final_order_item = [];

          return Promise.all([
            Product.find({id: exixt_product, product_type: [1,3]}).populate('variantMasterProduct', { select: ['id', 'slug', 'sku', 'name', 'featured_image', 'regular_price', 'sale_price', 'inventory']}),
            Coupon.findOne(couponQData)
          ]).spread(function(cartProduct, extCoupon) {
            
            // ************************** Order Discount Start ****************************
            // ************************** Order Discount End ******************************

            // ************************** OrderItem Discount Start ************************
            if(cartProduct && cartProduct.length > 0){

              for(let i=0; i<cartProduct.length; i++){

                let targetCartItem = _.find(cart_data.items, { 'id': cartProduct[i].id });
              let targetDbProduct = _.find(cartProduct, { 'id': cartProduct[i].id });
              if(targetCartItem && targetDbProduct && targetCartItem.id == targetDbProduct.id){
                let ordItemObj = {};
                 ordItemObj.quantity = targetCartItem.quantity;

                //  ********************************Simple Product Data set save Start************************
                 if(targetDbProduct.product_type == 1){
                  ordItemObj.product_type = 1;
                  ordItemObj.price = targetDbProduct.sale_price;
                  ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.sale_price);

                    ordItemObj.product = targetDbProduct.id;
                    ordItemObj.productObj = {
                      id: targetDbProduct.id,
                      slug: targetDbProduct.slug,
                      sku: targetDbProduct.sku,
                      name: targetDbProduct.name,
                      featured_image: targetDbProduct.featured_image,
                      regular_price: targetDbProduct.regular_price,
                      sale_price: targetDbProduct.sale_price,
                    };
                  
                    //reduce quantity from db

                    targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                    targetDbProduct.save();

                 }

                 //  ********************************Simple Product Data set save End************************

                 //  ********************************Variant Product Data set save End************************
                 //Variant Product Data set
                 if(targetDbProduct.product_type == 3){
                  ordItemObj.product_type = 2;
                  ordItemObj.price = targetDbProduct.sale_price;
                //  ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.variantMasterProduct.sale_price);
                 ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.sale_price);

                  ordItemObj.product = targetDbProduct.variantMasterProduct.id;
                    ordItemObj.productObj = {
                      id: targetDbProduct.variantMasterProduct.id,
                      slug: targetDbProduct.variantMasterProduct.slug,
                      sku: targetDbProduct.variantMasterProduct.sku,
                      name: targetDbProduct.variantMasterProduct.name,
                      featured_image: targetDbProduct.variantMasterProduct.featured_image,
                      regular_price: targetDbProduct.variantMasterProduct.regular_price,
                      sale_price: targetDbProduct.variantMasterProduct.sale_price,
                    };


                    ordItemObj.variantProduct = targetDbProduct.id;
                    ordItemObj.vatiantProductObj = {
                      id: targetDbProduct.id,
                      slug: targetDbProduct.slug,
                      sku: targetDbProduct.sku,
                      name: targetDbProduct.name,
                      featured_image: targetDbProduct.featured_image,
                      regular_price: targetDbProduct.regular_price,
                      sale_price: targetDbProduct.sale_price,
                      producttermsArr: targetDbProduct.producttermsArr,


                    };

                    //reduce varient product quantity
                    targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                    targetDbProduct.save();
                    
                    //reduce master product quantity from db
                    let updt_master_quantity = parseInt(targetDbProduct.variantMasterProduct.inventory) - parseInt(targetCartItem.quantity);
                    // console.log('aaaaaa inventory', updt_master_quantity);
                    targetDbProduct.variantMasterProduct.inventory = updt_master_quantity;
                    targetDbProduct.variantMasterProduct.save();
                }

                //  ********************************Variant Product Data set save End************************

                final_sub_total += ordItemObj.total_price;
                final_order_item.push(ordItemObj);

              }

              }; //<==Forloop End

              
            }

            // ************************** OrderItem Discount End **************************

            // ************************** Coupon Discount Start ***************************
            if (extCoupon) {
              _newOrderData.coupon_code = extCoupon.coupon_code;
              let cupon_discount_calculate = 0;
              if(extCoupon.discount_type == 1){
                cupon_discount_calculate = (extCoupon.coupon_value * final_sub_total) / 100;
              }

              if(extCoupon.discount_type == 2){
                cupon_discount_calculate = extCoupon.coupon_value;
              }
              _newOrderData.coupon_value = cupon_discount_calculate;
              final_coupon_discount = cupon_discount_calculate;

              //set total Use 
              if(cupon_discount_calculate > 0){
                extCoupon.total_uses +=1;
                extCoupon.save();

                _newOrderData.coupon = extCoupon.id;
              }
              
            }
            // ************************** Coupon Discount End *****************************


            // ************************** Grand Total Cost Start ***************************
            final_grand_total = (final_sub_total + final_shipping_cost) - final_coupon_discount;


            // ************************** Grand Total Cost End *****************************


            // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

            _newOrderData.sub_total = final_sub_total;
            _newOrderData.shipping_cost = final_shipping_cost;
            _newOrderData.grand_total = final_grand_total;

            return Order.create(_newOrderData).then(function (createData) {
              let itemPromissesList = [];
              for (let i = 0; i < final_order_item.length; i++) {
                final_order_item[i].order = createData.id;
                itemPromissesList.push(Orderitem.create(final_order_item[i]));
                // itemPromissesList.push(final_order_item[i]);
              }
              return Promise.all(itemPromissesList).then(function(promissList){
                return [createData, promissList];

              }).spread(function(createData, orderItemList){

                let mailData = {
                  order: createData,
                  order_item: orderItemList
                }
                ZeMailerService.orderEmail(mailData);  // <= Here mail Send

                  return res.send({
                    status: 'success',
                    status_code: 22,
                    order: createData,
                    order_item: orderItemList,
                    message: 'order details',
                  });

              });
            });

            // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

        }).catch(function(err){
          return res.send({
            status: 'error' +err,
            message: 'server error',
            err: err

          });
        });

          // =========================End========================
      }
    },
    orderSave: function (req, res) {
      // let slug = req.param('slug');
      // let sale = tmpOrder;
      let sale = req.param("data");
      // console.log('sale', sale);
      if (!sale){
        return res.send({
          status: 'error',
          status_code: 11,
          message: 'data is empty',
        });
      }else{
          // =========================Start======================
          // console.log('coupon datasale', sale.coupon_data);
        let cart_data = sale.cart_data ? sale.cart_data : '';
        let coupon_data = sale.coupon_data ? sale.coupon_data : '';
        let payment_info = sale.payment_info ? sale.payment_info : '';
        let customer_info = sale.customer_info ? sale.customer_info : '';
        let billing_address = sale.billing_address ? sale.billing_address : '';
        let shipping_address = sale.shipping_address ? sale.shipping_address : '';

          let exixt_product=[];
            if(sale && cart_data && cart_data.items.length > 0){
                for(let i=0; i<cart_data.items.length; i++){
                    exixt_product.push(cart_data.items[i].id);
                }
            };
          // console.log('exixt_product ', exixt_product);
          let couponQData = {
            // coupon_code: req.param("coupon_code")  ? req.param("coupon_code").trim() : '',
            coupon_code: (coupon_data && coupon_data.coupon_code)  ? coupon_data.coupon_code.trim() : '',
            is_active: true
          };

          let tokenUser = req.identity || '';
          let _newOrderData = {
            invoice: moment().format("YYMMDD")+randToken.generate(8, "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ"),
            code: moment().format("YYMMDD")+randToken.generate(32),

            customer_first_name: customer_info.first_name ?  customer_info.first_name : '',
            customer_last_name: customer_info.last_name ?  customer_info.last_name : '',
            customer_email: customer_info.email ?  customer_info.email : '',
            customer_street_address: customer_info.street_address ?  customer_info.street_address : '',
            customer_street_address2: customer_info.street_address2 ?  customer_info.street_address2 : '',
            customer_street_address3: customer_info.street_address3 ?  customer_info.street_address3 : '',
            customer_post_code: customer_info.postal_code ?  customer_info.postal_code : '',
            customer_phone: customer_info.phone ?  customer_info.phone : '',
            customer_country: customer_info.country ?  customer_info.country : '',
            customer_city: customer_info.city ?  customer_info.city : '',
            customer_county: customer_info.county ?  customer_info.county : '',


            billing_first_name: billing_address.first_name ?  billing_address.first_name : '',
            billing_last_name: billing_address.last_name ?  billing_address.last_name : '',
            billing_email: billing_address.email ?  billing_address.email : '',
            billing_street_address: billing_address.street_address ?  billing_address.street_address : '',
            billing_street_address2: billing_address.street_address2 ?  billing_address.street_address2 : '',
            billing_street_address3: billing_address.street_address3 ?  billing_address.street_address3 : '',
            billing_post_code: billing_address.postal_code ?  billing_address.postal_code : '',
            billing_phone: billing_address.phone ?  billing_address.phone : '',
            billing_country: billing_address.country ?  billing_address.country : '',
            billing_city: billing_address.city ?  billing_address.city : '',
            billing_county: billing_address.county ?  billing_address.county : '',

            shipping_method: shipping_address.shipping_method ?  shipping_address.shipping_method : '',

            shipping_first_name: shipping_address.first_name ?  shipping_address.first_name : '',
            shipping_last_name: shipping_address.last_name ?  shipping_address.last_name : '',
            shipping_email: shipping_address.email ?  shipping_address.email : '',
            shipping_street_address: shipping_address.street_address ?  shipping_address.street_address : '',
            shipping_street_address2: shipping_address.street_address2 ?  shipping_address.street_address2 : '',
            shipping_street_address3: shipping_address.street_address3 ?  shipping_address.street_address3 : '',
            shipping_post_code: shipping_address.postal_code ?  shipping_address.postal_code : '',
            shipping_phone: shipping_address.phone ?  shipping_address.phone : '',
            shipping_country: shipping_address.country ?  shipping_address.country : '',
            shipping_city: shipping_address.city ?  shipping_address.city : '',
            shipping_county: shipping_address.county ?  shipping_address.county : '',

            payment_method: payment_info.payment_method ? payment_info.payment_method : '',

            transaction_id: payment_info.transaction_id ? payment_info.transaction_id : '',
            payer_id: payment_info.payer_id ? payment_info.payer_id : '',

            payer_name: payment_info.payer_name ? payment_info.payer_name : '',
            payer_email: payment_info.email ? payment_info.email : '',
            refund_link: payment_info.refund_link ? payment_info.refund_link : '',
            status: 1,
            note: sale.note ? sale.note : '',

            customer: tokenUser ? tokenUser.id : null,
            customerObj: {id: tokenUser.id, email: tokenUser.email, nickname: tokenUser.nickname, name: tokenUser.first_name ? tokenUser.first_name : ' ' + tokenUser.last_name ? tokenUser.last_name : ' ', display_name: tokenUser.display_name ? tokenUser.display_name : tokenUser.display_name},
            
          }

          // console.log('couponQData ', couponQData);
          
          let final_sub_total = 0;
          let final_shipping_cost = 0;
          let final_coupon_discount = 0;
          let final_grand_total = 0;

          let final_order_item = [];

          return Promise.all([
            Product.find({id: exixt_product, product_type: [1,3]}).populate('variantMasterProduct', { select: ['id', 'slug', 'sku', 'name', 'featured_image', 'regular_price', 'sale_price', 'inventory']}),
            Coupon.findOne(couponQData)
          ]).spread(function(cartProduct, extCoupon) {
            
            // ************************** Order Discount Start ****************************
            // ************************** Order Discount End ******************************

            // ************************** OrderItem Discount Start ************************
            if(cartProduct && cartProduct.length > 0){

              for(let i=0; i<cartProduct.length; i++){

                let targetCartItem = _.find(cart_data.items, { 'id': cartProduct[i].id });
              let targetDbProduct = _.find(cartProduct, { 'id': cartProduct[i].id });
              if(targetCartItem && targetDbProduct && targetCartItem.id == targetDbProduct.id){
                let ordItemObj = {};
                 ordItemObj.quantity = targetCartItem.quantity;

                //  ********************************Simple Product Data set save Start************************
                 if(targetDbProduct.product_type == 1){
                  ordItemObj.product_type = 1;
                  ordItemObj.price = targetDbProduct.sale_price;
                  ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.sale_price);

                    ordItemObj.product = targetDbProduct.id;
                    ordItemObj.productObj = {
                      id: targetDbProduct.id,
                      slug: targetDbProduct.slug,
                      sku: targetDbProduct.sku,
                      name: targetDbProduct.name,
                      featured_image: targetDbProduct.featured_image,
                      regular_price: targetDbProduct.regular_price,
                      sale_price: targetDbProduct.sale_price,
                    };
                  
                    //reduce quantity from db

                    targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                    targetDbProduct.save();

                 }

                 //  ********************************Simple Product Data set save End************************

                 //  ********************************Variant Product Data set save End************************
                 //Variant Product Data set
                 if(targetDbProduct.product_type == 3){
                  ordItemObj.product_type = 2;
                  ordItemObj.price = targetDbProduct.sale_price;
                //  ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.variantMasterProduct.sale_price);
                 ordItemObj.total_price = (targetCartItem.quantity * targetDbProduct.sale_price);

                  ordItemObj.product = targetDbProduct.variantMasterProduct.id;
                    ordItemObj.productObj = {
                      id: targetDbProduct.variantMasterProduct.id,
                      slug: targetDbProduct.variantMasterProduct.slug,
                      sku: targetDbProduct.variantMasterProduct.sku,
                      name: targetDbProduct.variantMasterProduct.name,
                      featured_image: targetDbProduct.variantMasterProduct.featured_image,
                      regular_price: targetDbProduct.variantMasterProduct.regular_price,
                      sale_price: targetDbProduct.variantMasterProduct.sale_price,
                    };


                    ordItemObj.variantProduct = targetDbProduct.id;
                    ordItemObj.vatiantProductObj = {
                      id: targetDbProduct.id,
                      slug: targetDbProduct.slug,
                      sku: targetDbProduct.sku,
                      name: targetDbProduct.name,
                      featured_image: targetDbProduct.featured_image,
                      regular_price: targetDbProduct.regular_price,
                      sale_price: targetDbProduct.sale_price,
                      producttermsArr: targetDbProduct.producttermsArr,


                    };

                    //reduce varient product quantity
                    targetDbProduct.inventory = parseInt(targetDbProduct.inventory) - parseInt(targetCartItem.quantity);
                    targetDbProduct.save();
                    
                    //reduce master product quantity from db
                    let updt_master_quantity = parseInt(targetDbProduct.variantMasterProduct.inventory) - parseInt(targetCartItem.quantity);
                    // console.log('aaaaaa inventory', updt_master_quantity);
                    targetDbProduct.variantMasterProduct.inventory = updt_master_quantity;
                    targetDbProduct.variantMasterProduct.save();
                }

                //  ********************************Variant Product Data set save End************************

                final_sub_total += ordItemObj.total_price;
                final_order_item.push(ordItemObj);

              }

              }; //<==Forloop End

              
            }

            // ************************** OrderItem Discount End **************************

            // ************************** Coupon Discount Start ***************************
            if (extCoupon) {
              _newOrderData.coupon_code = extCoupon.coupon_code;
              let cupon_discount_calculate = 0;
              if(extCoupon.discount_type == 1){
                cupon_discount_calculate = (extCoupon.coupon_value * final_sub_total) / 100;
              }

              if(extCoupon.discount_type == 2){
                cupon_discount_calculate = extCoupon.coupon_value;
              }
              _newOrderData.coupon_value = cupon_discount_calculate;
              final_coupon_discount = cupon_discount_calculate;

              //set total Use 
              if(cupon_discount_calculate > 0){
                extCoupon.total_uses +=1;
                extCoupon.save();

                _newOrderData.coupon = extCoupon.id;
              }
              
            }
            // ************************** Coupon Discount End *****************************


            // ************************** Grand Total Cost Start ***************************
            final_grand_total = (final_sub_total + final_shipping_cost) - final_coupon_discount;


            // ************************** Grand Total Cost End *****************************


            // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

            _newOrderData.sub_total = final_sub_total;
            _newOrderData.shipping_cost = final_shipping_cost;
            _newOrderData.grand_total = final_grand_total;

            return Order.create(_newOrderData).then(function (createData) {
              let itemPromissesList = [];
              for (let i = 0; i < final_order_item.length; i++) {
                final_order_item[i].order = createData.id;
                itemPromissesList.push(Orderitem.create(final_order_item[i]));
                // itemPromissesList.push(final_order_item[i]);
              }
              return Promise.all(itemPromissesList).then(function(promissList){
                
                let cShipAddObj={
                  shipping_email: createData.shipping_email,
                  shipping_street_address: createData.shipping_street_address,
                  shipping_street_address2: createData.shipping_street_address2,
                  shipping_street_address3: createData.shipping_street_address3,
                  shipping_phone: createData.shipping_phone,
                  shipping_country: createData.shipping_country,
                  shipping_city: createData.shipping_city,
                  shipping_county: createData.shipping_county,
                }
                
                return [createData, promissList, Users.update({id: tokenUser.id}, cShipAddObj)];

              }).spread(function(createData, orderItemList, cAddUpdate){

                let mailData = {
                  order: createData,
                  order_item: orderItemList
                }
                ZeMailerService.orderEmail(mailData);  // <= Here mail Send

                  return res.send({
                    status: 'success',
                    status_code: 22,
                    order: createData,
                    order_item: orderItemList,
                    message: 'order details',
                  });

              });
            });

            // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

        }).catch(function(err){
          return res.send({
            status: 'error' +err,
            message: 'server error',
            err: err

          });
        });

          // =========================End========================
      }
    },

    orderList: function (req, res) {
        let tokenUser = req.identity || '';
        let _qryData = {
          customer: tokenUser ? tokenUser.id : null,
        }

        return Promise.all([
          Order.find(_qryData).populate('orderitem').sort('id DESC')
        ]).spread(function(allOrder) {
          
          if(allOrder && allOrder.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              allOrder: allOrder,
              message: 'All order',
            });
          } else {
            return res.send({
              status: 'success',
              status_code: 22,
              allOrder: [],
              message: 'Any order Found order',
            });
          }
        }).catch(function(err){
          return res.send({
            status: 'error',
            status_code: 33,
            message: 'server error',
            err: err

          });
        });
    },

    orderDetails: function (req, res) {
      let tokenUser = req.identity || '';
      let sale = req.param("data");
      // console.log('i am ahere', sale);
      let _qryData = {
        customer: tokenUser ? tokenUser.id : null,
        code: sale.code ? sale.code : '',
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        Order.findOne(_qryData).populate('orderitem'),
      ]).spread(function(sinOrder) {
        
        if(sinOrder){
          return res.send({
            status: 'success',
            status_code: 11,
            order: sinOrder,
            message: 'Single order',
          });
        } else {
          return res.send({
            status: 'success',
            status_code: 22,
            order: {},
            message: 'Any order Found order',
          });
        }
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'server error',
          err: err

        });
      });
    },
      
    // ************************* Order Related End********************************

    

};

