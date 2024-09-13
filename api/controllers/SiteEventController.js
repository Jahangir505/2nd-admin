/**
 * SiteEventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let Promise = require('bluebird');
let moment = require('moment');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        // rest: true
      },

      index: function (req, res) {
                
        let qdata = {};
        let currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 5;
        // var pageLimit = 30;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
        let paTitle = req.param("title") ? req.param("title").trim() : '';
        let paCategory = req.param("category") ? req.param("category").trim() : '';
        let paStatus = req.param("status") ? req.param("status").trim() : '';
        let paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTitle){
          qdata.title = { 'like': '%'+paTitle+'%' };
        }
        
                    
        if(paCategory){
          qdata.category = paCategory;
        }
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
          SiteEvent.count(qdata),
          SiteEvent.find(qdata).populate('state').populate('siteEventCategory').populate('createdBy').paginate({page: currentPage, limit: pageLimit}).sort('title ' +paSortBy),
          SiteEventCategory.find({status: 1},{select: ['name']}).sort('sort ASC'),
        ])
          .spread(function(totalCount, alldata, allCategory){
            // **************************
            // console.log('allUsers ',allUsers);
            // console.log('Total cou ',totalCount);
    
            var pageCount = 0;
            if (totalCount <= pageLimit) {
              pageCount = 1;
            }
            else if ((totalCount % pageLimit) == 0) {
              pageCount = (totalCount / pageLimit) ;
            }
            else  {
              pageCount = Math.floor(totalCount / pageLimit) + 1;
            }
    
            return res.view("admin/site-event/index", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                alldata: alldata,
                allCategory: allCategory,
        
                moment: moment,
                module: 'Site Events',
                submodule: 'Events',
                title: 'Event',
                subtitle: 'All Events',
                link1: '/admin/site-event/index/',
                // linkback1: '/admin/current-election/index/',
                linknew: '/admin/site-event/new/',
        
                paginateUrl: '/admin/site-event/index',
                pageLimit: pageLimit, // Per page how much i want to see,
                pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
                currentPage: currentPage,
                adjacents: 2,
                lpm1: pageCount - 1,
        
                paTitle: paTitle,
                paCategory: paCategory,
                paStatus: paStatus,
                paSortBy: paSortBy,
                totalCount: totalCount,
                paginateVariable : '&title='+paTitle+'&category='+paCategory+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
            });
    
            // **************************
          }).catch(function(err){
            console.log(err);
            req.flash('flashMsgError', 'Error In User Index');
            return res.redirect('/admin/site-event/index');
          });
        // =============Embaded End=================
    
      },
      new_old : function (req, res) {
        // console.log("Inside new..............");
        var _formData = {
          title: "",
          category: "",
          details: "",
          status: 0,
        };
      
        return res.view("admin/site-event/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/site-event/create",
            status: 'OK',
            customFieldErrors: {},
            module: 'Site Events',
            submodule: 'Events',
            title: 'Event',
            subtitle: 'New',
            link1: '/admin/site-event/index'
        });
    
      },

      new : function (req, res) {
        // console.log("Inside new..............");

        // var d = moment("2024-06-20 4:45 AM GMT")
        // console.log(d.format("L LT"));

        let dateStr = '2017-03-13',
    // timeStr = '18:10',
    // timeStr = '06:10 PM',
    timeStr = '3:11 PM',
    date    = moment(dateStr),
    // time    = moment(timeStr, 'HH:mm');
    time    = moment(timeStr, 'hh:mm A');

date.set({
    hour:   time.get('hour'),
    minute: time.get('minute'),
    second: time.get('second')
});
// https://stackoverflow.com/questions/62016093/dd-mm-yyy-hhmm-am-pm-format-using-monentjs

console.log(date);
// console.log('formated', moment(date).format('DD-MMM-YYYY HH:MM'));
// console.log('formated', moment(date).format('DD-MMM-YYYY HH:mm'));
// console.log('formated', moment(date).format('DD-MMM-YYYY hh:mm a'));
// console.log('formated', moment(date).format('DD-MMM-YYYY hh:mm A'));

let customDate1 = '2016-04-12 07:45 PM'
// moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss", true);
// let make1 = moment(customDate1, "YYYY-MM-DD hh:mm A");
let make1 = moment(customDate1, "YYYY-MM-DD hh:mm A", true);
console.log('make1===', make1);

let isoMake1 = make1.toISOString();
// console.log('isoMake1 ISO===', make1.toISOString());
console.log('isoMake1 ISO===', isoMake1);

let result1 = moment(make1).format("DD-MMM-YYYY hh:mm A");
console.log('result1===', result1);

let isoResult1 = moment(isoMake1).format("DD-MMM-YYYY hh:mm A");
console.log('isoResult1===', isoResult1);

    
        var _formData = {
            title: '',
            image: '',
            siteEventCategory: '',
            // start_date_time: '',
            // end_date_time: '',
            venue_name: '',
            ticket_price: 0.00,
            address: '',
            phone_no: '',
            country: '',
            state: '',
            city: '',
            zip_code: '',
            website: '',
            details: '',
            status: 0,
        };

        let _othFormData = {
          start_date: '',
          start_time: '',

          end_date: '',
          end_time: ''
       };
    
        Promise.all([
          SiteEventCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
          Country.find({status: 1},{select: ['name']}).sort('name ASC'),
          State.find({status: 1},{select: ['name']}).sort('name ASC')
        ])
          .spread(function(allCategory, allCountry, allState){
              return res.view("admin/site-event/new", {
                  flashMsgError: req.flash('flashMsgError'),
                  flashMsgSuccess: req.flash('flashMsgSuccess'),
                  data: _formData,
                  othFormData: _othFormData,
                  allCategory: allCategory,
                  allCountry: allCountry,
                  allState: allState,
                  formActionTarget : "/admin/site-event/create",
                  status: 'OK',
                  customFieldErrors: {},
                  module: 'Site Events',
                  submodule: 'Events',
                  title: 'Event',
                  subtitle: 'New',
                  link1: '/admin/site-event/index'
              });
    
          }).catch(function(err){
          req.flash('flashMsgError', 'Error In New');
          return res.redirect('/admin/site-event/index');
        });
    
      },
      create : function (req, res) {
        let main_image = req.file('image');
        let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';

        let _formData = {
            title: req.param("title") ? req.param("title").trim() : '',
            siteEventCategory: req.param("category") ? req.param("category").trim() : '',
            // start_date_time: req.param("start_date_time") ? req.param("start_date_time").trim() : '',
            // end_date_time: req.param("end_date_time") ? req.param("end_date_time").trim() : '',
            venue_name: req.param("venue_name") ? req.param("venue_name").trim() : '',
            ticket_price: (req.param("ticket_price") && req.param("ticket_price") >= 0) ? req.param("ticket_price") : 0,
            address: req.param("address") ? req.param("address").trim() : '',
            phone_no: req.param("phone_no") ? req.param("phone_no").trim() : '',
            // country: req.param("country") ? req.param("country").trim() : '',
            state: req.param("state") ? req.param("state").trim() : '',
            city: req.param("city") ? req.param("city").trim() : '',
            zip_code: req.param("zip_code") ? req.param("zip_code").trim() : '',
            website: req.param("website") ? req.param("website").trim() : '',
            details: req.param("details") ? req.param("details").trim() : '',
            status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
            createdBy: req.user.id,
            createdByObj: {email: req.user.email},
            updatedBy: '',
            updatedByObj: {email: ''}
        };
        console.log('asas_formData',_formData);

        // let start_date = req.param("start_date") ? req.param("start_date").trim() : '';
        // let start_date = req.param("start_date") ? (req.param("start_date").split("-").reverse().join("-")) : '';
        // let start_time = req.param("start_time") ? req.param("start_time").trim() : '';

        // // let end_date = req.param("end_date") ? req.param("end_date").trim() : '';
        // let end_date = req.param("end_date") ? (req.param("end_date").split("-").reverse().join("-")) : '';
        // let end_time = req.param("end_time") ? req.param("end_time").trim() : '';

        let _othFormData = {
           start_date: req.param("start_date") ? (req.param("start_date").split("-").reverse().join("-")) : '',
           start_time: req.param("start_time") ? req.param("start_time").trim() : '',

           end_date: req.param("end_date") ? (req.param("end_date").split("-").reverse().join("-")) : '',
           end_time: req.param("end_time") ? req.param("end_time").trim() : ''
        }

        console.log('start_date=', _othFormData.start_date);
        console.log('start_time=', _othFormData.start_time);
        console.log('end_date=', _othFormData.end_date);
        console.log('end_time=', _othFormData.end_time);

        // let customStDate = '2016-04-12 07:45 PM'
        let customStDate = _othFormData.start_date+' '+_othFormData.start_time;
        // console.log('customStDate=', customStDate);

        let customStDateMake = moment(customStDate, "YYYY-MM-DD hh:mm A");
        // console.log('customStDateMake=', customStDateMake);
        let customStDateIsoMake = customStDateMake.toISOString();
        // console.log('customStDateIsoMake=', customStDateIsoMake);
        let customStDateIsoResult = moment(customStDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
        console.log('customStDateIsoResult===', customStDateIsoResult);


        let customEndDate = _othFormData.end_date+' '+_othFormData.end_time;
        // console.log('customEndDate=', customEndDate);
        let customEndDateMake = moment(customEndDate, "YYYY-MM-DD hh:mm A");
        // console.log('customEndDateMake=', customEndDateMake);
        let customEndDateIsoMake = customEndDateMake.toISOString();
        // console.log('customEndDateIsoMake=', customEndDateIsoMake);
        let customEndDateIsoResult = moment(customEndDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
        console.log('customEndDateIsoResult===', customEndDateIsoResult);

        _formData.start_date_time = customStDateIsoResult;
        _formData.end_date_time = customEndDateIsoResult;


      var hoursDiff = customEndDateMake.diff(customStDateMake, 'hours');
      console.log('Hours:' + hoursDiff);
    
      // var minutesDiff = endTime.diff(startTime, 'minutes');
      var minutesDiff = customEndDateMake.diff(customStDateMake, 'minutes');
      console.log('Minutes:' + minutesDiff);
    
      // var secondsDiff = customEndDateMake.diff(customStDateMake, 'seconds');
      // console.log('Seconds:' + secondsDiff);

        // return res.redirect('/admin/site-event/new');

        console.log(moment.utc(moment(customEndDateMake,"DD/MM/YYYY HH:mm:ss").diff(moment(customStDateMake,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"));
    
        // if(customEndDateMake >= customStDateMake){
        //   console.log('end date is greter');
        // }else{
        //   console.log('Start date is greter');
        // }
        
    // =============Custom Error Start==================
    const customFieldErrors = {};
    
    
    if (!_formData.title) {
      customFieldErrors.title = {message: 'Title is Required'};
    }
    if (!_formData.siteEventCategory) {
        customFieldErrors.category = {message: 'Category is Required'};
    }

    // if (!_formData.start_date_time) {
    //     customFieldErrors.start_date_time = {message: 'From Date Time is Required'};
    // }
    // if (!_othFormData.start_date) {
    //     customFieldErrors.start_date = {message: 'From Date & Time is Required'};
    // } else {
    //   if(minutesDiff < 0){
    //     customFieldErrors.start_date = {message: 'From Date & Time is less then End Date Time'};
    //   }
    // }
    if (!_othFormData.start_date) {
        customFieldErrors.start_date = {message: 'From Date & Time is Required'};
    } else {
      if(customStDateMake  > customEndDateMake){
        customFieldErrors.start_date = {message: 'From Date & Time is less then End Date Time'};
        customFieldErrors.end_date = {message: 'End Date & Time is Greter than From Date Time'};
      }
    }

    // if (!_formData.end_date_time) {
    //     customFieldErrors.end_date_time = {message: 'End Date Time is Required'};
    // }
    if (!_othFormData.end_date) {
        customFieldErrors.end_date = {message: 'End Date & Time is Required'};
    }
    //  else {
    //   if(minutesDiff < 0){
    //     customFieldErrors.end_date = {message: 'End Date & Time is Greter than From Date Time'};
    //   }
    // }
    
    if (!_formData.venue_name) {
        customFieldErrors.venue_name = {message: 'Venue Name is Required'};
    }
    if (!_formData.ticket_price) {
        customFieldErrors.ticket_price = {message: 'Ticket  Price is Required'};
    }
    if (!_formData.address) {
        customFieldErrors.address = {message: 'Address is Required'};
    }
    if (!_formData.phone_no) {
        customFieldErrors.phone_no = {message: 'Phone No is Required'};
    }
    // if (!_formData.country) {
    //     customFieldErrors.country = {message: 'Country is Required'};
    // }
    if (!_formData.state) {
        customFieldErrors.state = {message: 'State is Required'};
    }
    if (!_formData.city) {
        customFieldErrors.city = {message: 'City is Required'};
    }
    if (!_formData.zip_code) {
        customFieldErrors.zip_code = {message: 'Zip Code is Required'};
    }
    if (!_formData.website) {
        customFieldErrors.website = {message: 'Website is Required'};
    }
    if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
    }
    
    if (!_formData.status) {
      customFieldErrors.status = {message: 'Status is Required'};
    }

    let _creSlugData = {
        model: 'siteevent',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
      // =============Custom Error End====================
    
      let uploadSaveLocation = '.tmp/public/uploads/site-event';
      let uploadCopyLocation = 'assets/uploads/site-event';
    
    return Promise.all([
        SiteEventCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        Country.find({status: 1},{select: ['name']}).sort('name ASC'),
        State.find({status: 1},{select: ['name']}).sort('name ASC'),
        ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 300, 400, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
        SiteEvent.findOne({siteEventCategory: _formData.category, title: _formData.title}), //<--For validation Check
        State.findOne({id: _formData.state}), //<--For validation Check
    ])
      .spread(function(allCategory, allCountry, allState, main_image_Ret, creSlug, extTitle, extState){
    //    console.log('extName is', extName);
          if(!extState){
            customFieldErrors.state = {message: 'State is invalid'};
          } else {
            _formData.country = extState.country;
          }

          if(extTitle){
            customFieldErrors.title = {message: 'Title is already taken'};
          }
    
          _formData.slug = creSlug;
          // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
            _formData.image = main_image_Ret.coreUploadFile;
            if(main_image_Ret.coreUploadFile == ''){
              customFieldErrors.image = {message: 'Image File is Requird'};
            }
          }else{
            _formData.image = main_image_Ret.coreUploadFile;
            customFieldErrors.image = {message: main_image_Ret.errorMessage};
          }
          // ============================ Image End=================================
        if (Object.keys(customFieldErrors).length) {
          console.log('eeee1', customFieldErrors);
          req.flash('errorMessage', 'Error in Create');
            return res.view('admin/site-event/new', {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: _formData,
                othFormData: _othFormData,
                allCategory: allCategory,
                allCountry: allCountry,
                allState: allState,
                formActionTarget : "/admin/site-event/create",
                status: 'Error',
                customFieldErrors: customFieldErrors,
                fieldErrors: {},
                module: 'Site Events',
                submodule: 'Events',
                title: 'Event',
                subtitle: 'Create',
                link1: '/admin/site-event/index'
          });
    
        } else {
                  
          return SiteEvent.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'Record Create Success.');
              return res.redirect('/admin/site-event/index');
          }).catch(function (err) {
            console.log('err2', err);
            req.flash('flashMsgError', 'Error in User Create');
            // ===============
            return res.view("admin/site-event/new", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: _formData,
                othFormData: _othFormData,
                allCategory: allCategory,
                allCountry: allCountry,
                allState: allState,
                formActionTarget : "/admin/site-event/create",
                status: 'Error',
                errorType: 'validation-error',
                customFieldErrors: {},
                fieldErrors: {},
                module: 'Site Events',
                submodule: 'Events',
                title: 'Event',
                subtitle: 'Create',
                link1: '/admin/site-event/index'
            });
      
          });// ------catch End----
        }
      });
    // =============Promisses End=======================
      },
      edit: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-event/index');
        }
        Promise.all([
          SiteEvent.findOne({id:id}),
          SiteEventCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
          Country.find({status: 1},{select: ['name']}).sort('name ASC'),
          State.find({status: 1},{select: ['name']}).sort('name ASC')
        ])
          .spread(function(existSingleData, allCategory, allCountry, allState){
    
            if(!existSingleData){
              req.flash('flashMsgError', 'Record Not Found In Database');
              return res.redirect('/admin/site-event/index');
            } else {

              var stDateComponent = moment(existSingleData.start_date_time).format('YYYY-MM-DD');
              var stTimeComponent = moment(existSingleData.start_date_time).format('HH:mm A');

              var endDateComponent = moment(existSingleData.end_date_time).format('YYYY-MM-DD');
              var endTimeComponent = moment(existSingleData.end_date_time).format('HH:mm A');

              let _othFormData = {
                start_date: stDateComponent,
                start_time: stTimeComponent,
     
                end_date: endDateComponent,
                end_time: endTimeComponent
             };

          //   let _othFormData = {
          //     start_date: vari1,
          //     start_time: vari2,
   
          //     end_date: vari3,
          //     end_time: vari4
          //  };
            //  console.log('start_date=', _othFormData.start_date);
            // console.log('start_time=', _othFormData.start_time);
            // console.log('end_date=', _othFormData.end_date);
            // console.log('end_time=', _othFormData.end_time);


                return res.view("admin/site-event/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: existSingleData,
                    othFormData: _othFormData,
                    allCategory: allCategory,
                    allCountry: allCountry,
                    allState: allState,
                    formActionTarget : "/admin/site-event/update/" + id,
                    status: 'OK',
                    customFieldErrors: {},
                    module: 'Site Events',
                    submodule: 'Events',
                    title: 'Event',
                    subtitle: 'Edit',
                    link1: '/admin/site-event/index'
                });
            }
          }).catch(function(err){
            console.log(err);
          req.flash('flashMsgError', 'Error in Edit');
          return res.redirect('/admin/site-event/index');
        });
      },
      update_old: function (req, res) {
        // console.log('I m in Update');
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-event/index');
        };

        let main_image = req.file('image');
        let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';
    
       
        let _formData = {
            title: req.param("title") ? req.param("title").toLowerCase() : '',
            siteEventCategory: req.param("category") ? req.param("category").trim() : '',
            // start_date_time: req.param("start_date_time") ? req.param("start_date_time").trim() : '',
            // end_date_time: req.param("end_date_time") ? req.param("end_date_time").trim() : '',
            venue_name: req.param("venue_name") ? req.param("venue_name").trim() : '',
            ticket_price: (req.param("ticket_price") && req.param("ticket_price") >= 0) ? req.param("ticket_price") : 0,
            address: req.param("address") ? req.param("address").trim() : '',
            phone_no: req.param("phone_no") ? req.param("phone_no").trim() : '',
            // country: req.param("country") ? req.param("country").trim() : '',
            state: req.param("state") ? req.param("state").trim() : '',
            city: req.param("city") ? req.param("city").trim() : '',
            zip_code: req.param("zip_code") ? req.param("zip_code").trim() : '',
            website: req.param("website") ? req.param("website").trim() : '',
            details: req.param("details") ? req.param("details").trim() : '',
            status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
            updatedBy: req.user.id,
            updatedByObj: {email: req.user.email}
          };
          let _othFormData = {
            start_date: req.param("start_date") ? (req.param("start_date").split("-").reverse().join("-")) : '',
            start_time: req.param("start_time") ? req.param("start_time").trim() : '',
 
            end_date: req.param("end_date") ? (req.param("end_date").split("-").reverse().join("-")) : '',
            end_time: req.param("end_time") ? req.param("end_time").trim() : ''
         };

         let customStDate = _othFormData.start_date+' '+_othFormData.start_time;
         let customStDateMake = moment(customStDate, "YYYY-MM-DD hh:mm A");
         let customStDateIsoMake = customStDateMake.toISOString();
         let customStDateIsoResult = moment(customStDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
 
         let customEndDate = _othFormData.end_date+' '+_othFormData.end_time;
         let customEndDateMake = moment(customEndDate, "YYYY-MM-DD hh:mm A");
         let customEndDateIsoMake = customEndDateMake.toISOString();
         let customEndDateIsoResult = moment(customEndDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
 
         _formData.start_date_time = customStDateIsoResult;
         _formData.end_date_time = customEndDateIsoResult;

         var hoursDiff = customEndDateMake.diff(customStDateMake, 'hours');
          var minutesDiff = customEndDateMake.diff(customStDateMake, 'minutes');

          console.log('minutesDiff ==', minutesDiff);
          console.log(moment.utc(moment(customEndDateMake,"DD/MM/YYYY HH:mm:ss").diff(moment(customStDateMake,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"));

    
          // =============Custom Error Start==================
          const customFieldErrors = {};
          
          if (!_formData.title) {
            customFieldErrors.title = {message: 'Title is Required'};
          }
          if (!_formData.siteEventCategory) {
              customFieldErrors.category = {message: 'Category is Required'};
          }
      
          if (!_othFormData.start_date) {
            customFieldErrors.start_date = {message: 'From Date & Time is Required'};
          } else {
            if(minutesDiff < 0){
              customFieldErrors.start_date = {message: 'From Date & Time is less then End Date Time'};
            }
          }
          if (!_othFormData.end_date) {
            customFieldErrors.end_date = {message: 'End Date & Time is Required'};
          } else {
            if(minutesDiff < 0){
              customFieldErrors.end_date = {message: 'End Date & Time is Greter than From Date Time'};
            }
          }
          if (!_formData.venue_name) {
              customFieldErrors.venue_name = {message: 'Venue Name is Required'};
          }
          if (!_formData.ticket_price) {
              customFieldErrors.ticket_price = {message: 'Ticket  Price is Required'};
          }
          if (!_formData.address) {
              customFieldErrors.address = {message: 'Address is Required'};
          }
          if (!_formData.phone_no) {
              customFieldErrors.phone_no = {message: 'Phone No is Required'};
          }
          // if (!_formData.country) {
          //     customFieldErrors.country = {message: 'Country is Required'};
          // }
          if (!_formData.state) {
              customFieldErrors.state = {message: 'State is Required'};
          }
          if (!_formData.city) {
              customFieldErrors.city = {message: 'City is Required'};
          }
          if (!_formData.zip_code) {
            customFieldErrors.zip_code = {message: 'Zip Code is Required'};
          }
          if (!_formData.website) {
              customFieldErrors.website = {message: 'Website is Required'};
          }
          if (!_formData.details) {
              customFieldErrors.details = {message: 'Details is Required'};
          }
          
          if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is Required'};
          }

          let _creSlugData = {
            model: 'siteevent',
            type: 'slug',
            from: _formData.title,
            defaultValue: 'slug'
          };
          
          console.log('_formData==', _formData);
          
          
      
         // =============Custom Error End====================
    
        // =============Save Start=====================
            // #########################
            
            return SiteEvent.findOne({id:id}).then(function (sinExistdata){
              if (!sinExistdata) {
                req.flash('flashMsgError', 'Record Not found 11');
                return res.redirect('/admin/site-event/index');
              } else {
                let uploadSaveLocation = '.tmp/public/uploads/site-event';
                let uploadCopyLocation = 'assets/uploads/site-event';
                Promise.all([
                    SiteEventCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
                    Country.find({status: 1},{select: ['name']}).sort('name ASC'),
                    State.find({status: 1},{select: ['name']}).sort('name ASC'),
                    ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 300, 400, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload
                    ZeslugService.slugForUpdate(_creSlugData),
                    SiteEvent.findOne({siteEventCategory: _formData.siteEventCategory, title: _formData.title}), //<--For validation Check
                    State.findOne({id: _formData.state}), //<--For validation Check     
                  ]).spread(function(allCategory, allCountry, allState, main_image_Ret, creSlug, extTitle, extState) {
    
                    if(!extState){
                      customFieldErrors.state = {message: 'State is invalid'};
                    } else {
                      _formData.country = extState.country;
                    }

                    if(extTitle){
                        if(sinExistdata.id != extTitle.id){
                            customFieldErrors.title = {message: 'Title is already taken'};
                        }
                    }

                    if(sinExistdata.title != _formData.title){
                        _formData.slug = creSlug;
                    }

                    // ============================ Image Strat===============================
                    if(!main_image_Ret.errorFound){
                      _formData.image = main_image_Ret.coreUploadFile;
                      if(main_image_Ret.coreUploadFile == ''){
                        customFieldErrors.image = {message: 'Image File is Requird'};
                      }
                    }else{
                      _formData.image = main_image_Ret.coreUploadFile;
                      customFieldErrors.image = {message: main_image_Ret.errorMessage};
                    }
                    // ============================ Image End=================================
          
                    
                    
                  if (Object.keys(customFieldErrors).length) {
                    console.log('_formData', _formData);
                        req.flash('errorMessage', 'Error in Update');
                          return res.view('admin/site-event/edit', {
                            flashMsgError: req.flash('flashMsgError'),
                            flashMsgSuccess: req.flash('flashMsgSuccess'),
                            data: _formData,
                            othFormData: _othFormData,
                            allCategory: allCategory,
                            allCountry: allCountry,
                            allState: allState,
                            formActionTarget : "/admin/site-event/update/" + id,
                            status: 'Error',
                            customFieldErrors: customFieldErrors,
                            module: 'Site Events',
                            submodule: 'Events',
                            title: 'Event',
                            subtitle: 'Update',
                            link1: '/admin/site-event/index'
                        });
              
                  } else {
                    // =================================
                        return SiteEvent.update(id, _formData).then(function (_updateSingle) {
                              req.flash('flashMsgSuccess', 'Record Create Success.');
                              return res.redirect('/admin/site-event/index');
                
                          }).catch(function (err) {
                                console.log('err 1', err);
                                req.flash('flashMsgError', 'Error in Sub-category Update');
                                return res.view("admin/site-event/new", {
                                    flashMsgError: req.flash('flashMsgError'),
                                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                                    data: sinExistdata,
                                    othFormData: _othFormData,
                                    allCategory: allCategory,
                                    allCountry: allCountry,
                                    allState: allState,
                                    formActionTarget : "/admin/site-event/update/" + id,
                                    status: 'Error',
                                    errorType: 'validation-error',
                                    customFieldErrors: {},
                                    module: 'FAQs ',
                                    submodule: 'FAQs',
                                    title: 'FAQ ',
                                    subtitle: 'Update',
                                    link1: '/admin/site-event/index'
                                });
                              });// <--Create record Catch End
      
                         } //<--Validation Check Else End
                    // =================================
                  });
              } //<--sinExistdata Else End
              
          }).catch(function(err){
            console.log('err 2', err);
            req.flash('flashMsgError', 'Error in Record update');
            return res.redirect('/admin/site-event/index');
          });
        // =============Slug Create End=================
    
      },
      update: function (req, res) {
        // console.log('I m in Update');
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-event/index');
        };

        let main_image = req.file('image');
        let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';
    
       
        let _formData = {
            title: req.param("title") ? req.param("title").trim() : '',
            siteEventCategory: req.param("category") ? req.param("category").trim() : '',
            // start_date_time: req.param("start_date_time") ? req.param("start_date_time").trim() : '',
            // end_date_time: req.param("end_date_time") ? req.param("end_date_time").trim() : '',
            venue_name: req.param("venue_name") ? req.param("venue_name").trim() : '',
            ticket_price: (req.param("ticket_price") && req.param("ticket_price") >= 0) ? req.param("ticket_price") : 0,
            address: req.param("address") ? req.param("address").trim() : '',
            phone_no: req.param("phone_no") ? req.param("phone_no").trim() : '',
            // country: req.param("country") ? req.param("country").trim() : '',
            state: req.param("state") ? req.param("state").trim() : '',
            city: req.param("city") ? req.param("city").trim() : '',
            zip_code: req.param("zip_code") ? req.param("zip_code").trim() : '',
            website: req.param("website") ? req.param("website").trim() : '',
            details: req.param("details") ? req.param("details").trim() : '',
            status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
            updatedBy: req.user.id,
            updatedByObj: {email: req.user.email}
          };
          let _othFormData = {
            start_date: req.param("start_date") ? (req.param("start_date").split("-").reverse().join("-")) : '',
            start_time: req.param("start_time") ? req.param("start_time").trim() : '',
 
            end_date: req.param("end_date") ? (req.param("end_date").split("-").reverse().join("-")) : '',
            end_time: req.param("end_time") ? req.param("end_time").trim() : ''
         };

         let customStDate = _othFormData.start_date+' '+_othFormData.start_time;
         let customStDateMake = moment(customStDate, "YYYY-MM-DD hh:mm A");
         let customStDateIsoMake = customStDateMake.toISOString();
         let customStDateIsoResult = moment(customStDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
 
         let customEndDate = _othFormData.end_date+' '+_othFormData.end_time;
         let customEndDateMake = moment(customEndDate, "YYYY-MM-DD hh:mm A");
         let customEndDateIsoMake = customEndDateMake.toISOString();
         let customEndDateIsoResult = moment(customEndDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
 
         _formData.start_date_time = customStDateIsoResult;
         _formData.end_date_time = customEndDateIsoResult;

         var hoursDiff = customEndDateMake.diff(customStDateMake, 'hours');
          var minutesDiff = customEndDateMake.diff(customStDateMake, 'minutes');

          console.log('minutesDiff ==', minutesDiff);
          console.log(moment.utc(moment(customEndDateMake,"DD/MM/YYYY HH:mm:ss").diff(moment(customStDateMake,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"));

          
    
          // =============Custom Error Start==================
          const customFieldErrors = {};
          
          if (!_formData.title) {
            customFieldErrors.title = {message: 'Title is Required'};
          }
          if (!_formData.siteEventCategory) {
              customFieldErrors.category = {message: 'Category is Required'};
          }
      
          if (!_othFormData.start_date) {
            customFieldErrors.start_date = {message: 'From Date & Time is Required'};
        } else {
          if(customStDateMake  > customEndDateMake){
            customFieldErrors.start_date = {message: 'From Date & Time is less then End Date Time'};
            customFieldErrors.end_date = {message: 'End Date & Time is Greter than From Date Time'};
          }
        }
          if (!_othFormData.end_date) {
            customFieldErrors.end_date = {message: 'End Date & Time is Required'};
          }
          if (!_formData.venue_name) {
              customFieldErrors.venue_name = {message: 'Venue Name is Required'};
          }
          if (!_formData.ticket_price) {
              customFieldErrors.ticket_price = {message: 'Ticket  Price is Required'};
          }
          if (!_formData.address) {
              customFieldErrors.address = {message: 'Address is Required'};
          }
          if (!_formData.phone_no) {
              customFieldErrors.phone_no = {message: 'Phone No is Required'};
          }
          // if (!_formData.country) {
          //     customFieldErrors.country = {message: 'Country is Required'};
          // }
          if (!_formData.state) {
              customFieldErrors.state = {message: 'State is Required'};
          }
          if (!_formData.city) {
              customFieldErrors.city = {message: 'City is Required'};
          }
          if (!_formData.zip_code) {
            customFieldErrors.zip_code = {message: 'Zip Code is Required'};
          }
          if (!_formData.website) {
              customFieldErrors.website = {message: 'Website is Required'};
          }
          if (!_formData.details) {
              customFieldErrors.details = {message: 'Details is Required'};
          }
          
          if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is Required'};
          }

          let _creSlugData = {
            model: 'siteevent',
            type: 'slug',
            from: _formData.title,
            defaultValue: 'slug'
          };
          
          console.log('_formData==', _formData);
          
          
      
         // =============Custom Error End====================
    
        // =============Save Start=====================
            // #########################
            
            return SiteEvent.findOne({id:id}).then(function (sinExistdata){
              if (!sinExistdata) {
                req.flash('flashMsgError', 'Record Not found 11');
                return res.redirect('/admin/site-event/index');
              } else {
                let uploadSaveLocation = '.tmp/public/uploads/site-event';
                let uploadCopyLocation = 'assets/uploads/site-event';
                Promise.all([
                    SiteEventCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
                    Country.find({status: 1},{select: ['name']}).sort('name ASC'),
                    State.find({status: 1},{select: ['name']}).sort('name ASC'),
                    ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 300, 400, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload
                    ZeslugService.slugForUpdate(_creSlugData),
                    SiteEvent.findOne({siteEventCategory: _formData.siteEventCategory, title: _formData.title}), //<--For validation Check
                    State.findOne({id: _formData.state}), //<--For validation Check     
                  ]).spread(function(allCategory, allCountry, allState, main_image_Ret, creSlug, extTitle, extState) {
    
                    if(!extState){
                      customFieldErrors.state = {message: 'State is invalid'};
                    } else {
                      _formData.country = extState.country;
                    }

                    if(extTitle){
                        if(sinExistdata.id != extTitle.id){
                            customFieldErrors.title = {message: 'Title is already taken'};
                        }
                    }

                    if(sinExistdata.title != _formData.title){
                        _formData.slug = creSlug;
                    }

                    // ============================ Image Strat===============================
                    if(!main_image_Ret.errorFound){
                      _formData.image = main_image_Ret.coreUploadFile;
                      if(main_image_Ret.coreUploadFile == ''){
                        customFieldErrors.image = {message: 'Image File is Requird'};
                      }
                    }else{
                      _formData.image = main_image_Ret.coreUploadFile;
                      customFieldErrors.image = {message: main_image_Ret.errorMessage};
                    }
                    // ============================ Image End=================================
          
                    
                    
                  if (Object.keys(customFieldErrors).length) {
                    console.log('_formData', _formData);
                        req.flash('errorMessage', 'Error in Update');
                          return res.view('admin/site-event/edit', {
                            flashMsgError: req.flash('flashMsgError'),
                            flashMsgSuccess: req.flash('flashMsgSuccess'),
                            data: _formData,
                            othFormData: _othFormData,
                            allCategory: allCategory,
                            allCountry: allCountry,
                            allState: allState,
                            formActionTarget : "/admin/site-event/update/" + id,
                            status: 'Error',
                            customFieldErrors: customFieldErrors,
                            module: 'Site Events',
                            submodule: 'Events',
                            title: 'Event',
                            subtitle: 'Update',
                            link1: '/admin/site-event/index'
                        });
              
                  } else {
                    // =================================
                        return SiteEvent.update(id, _formData).then(function (_updateSingle) {
                              req.flash('flashMsgSuccess', 'Record Create Success.');
                              return res.redirect('/admin/site-event/index');
                
                          }).catch(function (err) {
                                console.log('err 1', err);
                                req.flash('flashMsgError', 'Error in Sub-category Update');
                                return res.view("admin/site-event/new", {
                                    flashMsgError: req.flash('flashMsgError'),
                                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                                    data: sinExistdata,
                                    othFormData: _othFormData,
                                    allCategory: allCategory,
                                    allCountry: allCountry,
                                    allState: allState,
                                    formActionTarget : "/admin/site-event/update/" + id,
                                    status: 'Error',
                                    errorType: 'validation-error',
                                    customFieldErrors: {},
                                    module: 'FAQs ',
                                    submodule: 'FAQs',
                                    title: 'FAQ ',
                                    subtitle: 'Update',
                                    link1: '/admin/site-event/index'
                                });
                              });// <--Create record Catch End
      
                         } //<--Validation Check Else End
                    // =================================
                  });
              } //<--sinExistdata Else End
              
          }).catch(function(err){
            console.log('err 2', err);
            req.flash('flashMsgError', 'Error in Record update');
            return res.redirect('/admin/site-event/index');
          });
        // =============Slug Create End=================
    
      },
      view: function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/site-event/index');
        }
    
        SiteEvent.findOne({id:id}).populate('state').populate('siteEventCategory').populate('createdBy').then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'Record Not Found In Database');
            return res.redirect('/admin/site-event/index');
          }else{
            // console.log('singleData==', singleData);
            return res.view("admin/site-event/view", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singleData,
                moment: moment,
                module: 'Site Events',
                submodule: 'Events',
                title: 'Event',
                subtitle: 'View',
                link1: '/admin/site-event/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/site-event/index');
          });
      },
      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-event/index');
        };
    
        Promise.all([
          SiteEvent.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/site-event/index');
          } else {
                deleteData.destroy().then(function (_deldata) {

              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/site-event/index');
            });
          }
        //   if(stateHasData ){
        //     req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
        //     return res.redirect('/admin/site-event/index');
        //   } else {
        //     deleteData.destroy().then(function (_deldata) {
        //       req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
        //       return res.redirect('/admin/site-event/index');
        //     });
        //   }
        
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/site-event/index');
        });
    
      },

};

