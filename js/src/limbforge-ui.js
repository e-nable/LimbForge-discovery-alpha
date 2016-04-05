
// Specify an initial hand
var specs = {
    hand: "right",
    size: 100,
    design: "RR"
};

$(document).ready(function(){
    // Fetch the manifest so it's available everywhere!
    $.get('manifest.json',function(manifest){
        // Size Slider
        $('#flat-slider').slider({
            orientation: 'horizontal',
            range:       false,
            value:      specs.size,
            min: 100,
            max: 200,
            step: 10,
            slide: function( event, ui ) {
                $( "#sizeFeedback" ).text( "Size: " + ui.value + "%" );
            },
            stop: function( event, ui) {
                specs.size = ui.value;
                updateHand();
            }
        });

        // Hand Selector
        var $handSelectors = $('.hand-graphic');
        $handSelectors.click(function(){
            $handSelectors.removeClass("selected");
            $(this).addClass("selected");
            specs.hand = $(this).data("selectedhand");
            updateHand();
        });

        // Download Button
        $('.downloadBtn').click(function(e){
            e.preventDefault();
            downloadHand();
        });




        //////////////// Go !
        var hl = new HandLoader(manifest);
        updateHand();


        function zipFileName(specs){
            return "HandForge_" + specs.hand + "_" + specs.size + ".zip";
        }

        function GAObjectForSpecs(specs){
            // Create a 'productFieldObject' from the current hand specs
            return {
                'id': specs.design + specs.size + specs.hand,				// Product ID (string).
                'name': specs.design + "_" + specs.size + "_" + specs.hand, // Product name (string).
                'category': specs.design,   								// Product category (string).
                'variant': specs.hand,            							// Product variant (string).
                'position': specs.size           							// Product position (number).
                //'dimension1': 'Member',            							// Custom dimension (string).
                //'brand': 'Google',                							// Product brand (string).
                //'list': 'Search Results',         							// Product list (string).
            }
        }

        function updateHand(){
            // Remove any prior hand that was there
            clearScene();

            // Display some STLs
            hl.loadDisplayHand(specs.hand,specs.size,function(){
                ga('ec:addProduct',GAObjectForSpecs(specs));
                ga('ec:setAction', 'checkout',{
                    'step': 1
                });
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'HandForge',
                    eventAction: 'preview',
                    eventLabel: window.location.host
                });

                // Defined in setup.js
                render();

                setTimeout(function(){render();},500);
            });
        }

        function downloadHand(){
            ga('ec:addProduct',GAObjectForSpecs(specs));
            ga('ec:setAction', 'checkout_option',{
                'step': 2
            });

            hl.getFiles(specs.hand,specs.size,specs.design,function(files){
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'HandForge',
                    eventAction: 'download',
                    eventLabel: window.location.host
                });

                HandZipper.zip(zipFileName(specs),files);
            },function(errors){
                var message = "Some of the files you requested were not available:\n";
                _.each(errors,function(e){
                    message += "\n" +e;
                });
                alert(message);

                ga('send', 'exception', {
                    'exDescription': "Incomplete_Hand_"+specs.hand + "_" + specs.size,
                    'exFatal': false
                });
            });
        }




    });
});
