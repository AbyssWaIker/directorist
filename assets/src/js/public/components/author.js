// author sorting
(function ($) {
    window.addEventListener('DOMContentLoaded', () => {
        /* Masonry layout */
        function authorsMasonry() {
            let authorsCard = $('.directorist-authors__cards');
            $(authorsCard).each(function (id, elm) {
                let authorsCardRow = $(elm).find('.directorist-row');
                let authorMasonryInit = $(authorsCardRow).imagesLoaded(function () {
                    $(authorMasonryInit).masonry({
                        percentPosition: true,
                        horizontalOrder: true
                    });
                })
            })
        }
        authorsMasonry();

        /* alphabet data value */
        let alphabetValue;

        /* authors nav default active item */
        if ($('.directorist-authors__nav').length) {
            $('.directorist-authors__nav ul li:first-child').addClass('active');
        }
        /* authors nav item */
        $('body').on('click', '.directorist-alphabet', function (e) {
            e.preventDefault();
            _this = $(this);
            var alphabet = $(this).attr("data-alphabet");
            $('body').addClass('atbdp-form-fade');
            $.ajax({
                method: 'POST',
                url: directorist.ajaxurl,
                data: {
                    action: 'directorist_author_alpha_sorting',
                    _nonce: $(this).attr("data-nonce"),
                    alphabet: $(this).attr("data-alphabet")
                },
                success(response) {
                    $('#directorist-all-authors').empty().append(response);
                    $('body').removeClass('atbdp-form-fade');
                    $('.' + alphabet).parent().addClass('active');
                    alphabetValue = $(_this).attr('data-alphabet');
                    authorsMasonry();
                },
                error(error) {
                    console.log(error);
                },
            });
        });

        /* authors pagination */
        $('body').on('click', '.directorist-authors-pagination a', function (e) {
            e.preventDefault();
            var paged = $(this).attr('href');
            paged = paged.split('/page/')[1];
            paged = parseInt(paged);
            paged = paged !== undefined ? paged : 1;
            $('body').addClass('atbdp-form-fade');
            var getAlphabetValue = alphabetValue;
            $.ajax({
                method: 'POST',
                url: directorist.ajaxurl,
                data: {
                    action: 'directorist_author_pagination',
                    paged: paged
                },
                success(response) {
                    $('body').removeClass('atbdp-form-fade');
                    $('#directorist-all-authors').empty().append(response);
                    authorsMasonry();
                },
                error(error) {
                    console.log(error);
                },
            });
        });
    });
})(jQuery)