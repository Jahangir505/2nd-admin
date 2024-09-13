(function($) {
  'use strict';

  // $(document).ready(function(){
  //   CKEDITOR.replaceAll( );
  //
  // });

  // CKEDITOR.replaceAll();
  // CKEDITOR.replace( 'eventdesc' );
  // CKEDITOR.replace( 'description' );
  // CKEDITOR.replace( 'notifyToValidatorMsg' );
  // CKEDITOR.replace( 'eventdesc' );
  // CKEDITOR.replace( 'eventdesc', {
  //   // language: 'fr',
  //   uiColor: '#9AB8F3',
  // });



  // $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
  //   $("#success-alert").slideUp(500);
  // });

  $('.alert').delay(10000).slideUp(200, function() {
    $(this).alert('close');
  });



  // $(document).ready(function() {
  //   var table = $('#data-table-responsive').DataTable( {
  //     responsive: true
  //   } );
  //
  //   new $.fn.dataTable.FixedHeader( table );
  // } );


})(jQuery);
// })();
