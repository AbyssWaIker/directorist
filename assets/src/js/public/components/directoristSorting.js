;
(function ($) {
    window.addEventListener('DOMContentLoaded', () => {
        // Sorting Js
        if(!$('.directorist-instant-search').length){
            $('.directorist-dropdown__links--single-js').click(function (e) {
                e.preventDefault();
                var href = $(this).attr('data-link');
                $('#directorsit-listing-sort').attr('action', href);
                $('#directorsit-listing-sort').submit();
            });
        }

        //sorting toggle
        $('.sorting span').on('click', function () {
            $(this).toggleClass('fa-sort-amount-asc fa-sort-amount-desc');
        });
    });
})(jQuery);