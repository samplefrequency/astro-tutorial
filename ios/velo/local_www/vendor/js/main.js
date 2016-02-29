require(['config'], function() {
    require([
        '$',
        'velocity',
        'navitron'
    ],
    function($) {
        $('#myNavitron').navitron({
            structure: false,
            shiftAmount: 100
        });

        $('.navitron__content ul li a, .navitron__footer__link').on('click',function() {
          Astro.trigger('navLinkClick',{url:$(this).attr('href')});
        })
        //on barcode scanner click
        $('.barcode-scanner').on('click',function(){
          Astro.trigger('barcodeScannerClicked');
        })
    });
});
