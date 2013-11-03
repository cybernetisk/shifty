    $(document).ready(function() {    
        $(".shift").click(function() {
            $("> .take_shift" ,this).foundation('reveal', 'open', {
                animation: 'fade',
                animationSpeed: 100,
                closeOnBackgroundClick: true,
                dismissModalClass: 'close-reveal-modal'
            });
        });
    });