(function ($) {
    const content = '';

    // Category icon selection
    function selecWithIcon(selected) {
        if (!selected.id) {
            return selected.text;
        }
        const $elem = $(`<span><span class='${atbdp_admin_data.icon_type} ${selected.element.value}'></span> ${selected.text}</span>`);
        return $elem;
    }

    $('#category_icon').select2({
        placeholder: atbdp_admin_data.i18n_text.icon_choose_text,
        allowClear: true,
        templateResult: selecWithIcon,
    });

    /* Show and hide manual coordinate input field */
    if (!$('input#manual_coordinate').is(':checked')) {
        $('#hide_if_no_manual_cor').hide();
    }
    $('#manual_coordinate').on('click', function (e) {
        if ($('input#manual_coordinate').is(':checked')) {
            $('#hide_if_no_manual_cor').show();
        } else {
            $('#hide_if_no_manual_cor').hide();
        }
    });

    $("[data-toggle='tooltip']").tooltip();

    // price range
    const pricerange = $('#pricerange_val').val();
    if (pricerange) {
        $('#pricerange').fadeIn(100);
    }
    $('#price_range_option').on('click', function () {
        $('#pricerange').fadeIn(500);
    });

    // enable sorting if only the container has any social or skill field
    const $s_wrap = $('#social_info_sortable_container'); // cache it
    if (window.outerWidth > 1700) {
        if ($s_wrap.length) {
            $s_wrap.sortable({
                axis: 'y',
                opacity: '0.7',
            });
        }
    }

    // SOCIAL SECTION
    // Rearrange the IDS and Add new social field
    $('body').on('click', '#addNewSocial', function () {
        const currentItems = $('.atbdp_social_field_wrapper').length;
        const ID = `id=${currentItems}`; // eg. 'id=3'
        const iconBindingElement = jQuery('#addNewSocial');
        // arrange names ID in order before adding new elements
        $('.atbdp_social_field_wrapper').each(function (index, element) {
            const e = $(element);
            e.attr('id', `socialID-${index}`);
            e.find('select').attr('name', `social[${index}][id]`);
            e.find('.atbdp_social_input').attr('name', `social[${index}][url]`);
            e.find('.removeSocialField').attr('data-id', index);
        });
        // now add the new elements. we could do it here without using ajax but it would require more markup here.
        atbdp_do_ajax(iconBindingElement, 'atbdp_social_info_handler', ID, function (data) {
            $s_wrap.append(data);
        });
    });

    // remove the social field and then reset the ids while maintaining position
    $(document).on('click', '.removeSocialField', function (e) {
        const id = $(this).data('id');
        const elementToRemove = $(`div#socialID-${id}`);
        event.preventDefault();
        /* Act on the event */
        swal(
            {
                title: atbdp_admin_data.i18n_text.confirmation_text,
                text: atbdp_admin_data.i18n_text.ask_conf_sl_lnk_del_txt,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: atbdp_admin_data.i18n_text.confirm_delete,
                cancel: atbdp_add_listing.i18n_text.cancel,
                closeOnConfirm: false,
            },
            function (isConfirm) {
                if (isConfirm) {
                    // user has confirmed, no remove the item and reset the ids
                    elementToRemove.slideUp('fast', function () {
                        elementToRemove.remove();
                        // reorder the index
                        $('.atbdp_social_field_wrapper').each(function (index, element) {
                            const e = $(element);
                            e.attr('id', `socialID-${index}`);
                            e.find('select').attr('name', `social[${index}][id]`);
                            e.find('.atbdp_social_input').attr(
                                'name',
                                `social[${index}][url]`
                            );
                            e.find('.removeSocialField').attr('data-id', index);
                        });
                    });

                    // show success message
                    swal({
                        title: atbdp_admin_data.i18n_text.deleted,
                        // text: "Item has been deleted.",
                        type: 'success',
                        timer: 200,
                        showConfirmButton: false,
                    });
                }
            }
        );
    });

    // upgrade old listing
    $('#upgrade_directorist').on('click', function (event) {
        event.preventDefault();
        const $this = $(this);
        // display a notice to user to wait
        // send an ajax request to the back end
        atbdp_do_ajax($this, 'atbdp_upgrade_old_listings', null, function (response) {
            if (response.success) {
                $this.after(`<p>${response.data}</p>`);
            }
        });
    });

    // upgrade old pages
    $('#shortcode-updated input[name="shortcode-updated"]').on('change', function (event) {
        event.preventDefault();
        $('#success_msg').hide();

        const $this = $(this);
        // display a notice to user to wait
        // send an ajax request to the back end
        atbdp_do_ajax($this, 'atbdp_upgrade_old_pages', null, function (response) {
            if (response.success) {
                $('#shortcode-updated').after(`<p id="success_msg">${response.data}</p>`);
            }
        });

        $('.atbdp_ajax_loading').css({
            display: 'none',
        });
    });

    // send system info to admin
    $("#atbdp-send-system-info-submit").on("click", function (event) {
        event.preventDefault();

        if (!$("#atbdp-email-subject").val()) {
            alert("The Subject field is required");
            return;
        }
        if (!$("#atbdp-email-address").val()) {
            alert("The Email field is required");
            return;
        }
        if (!$("#atbdp-email-message").val()) {
            alert("The Message field is required");
            return;
        }
        $.ajax({
            type: "post",
            url: atbdp_admin_data.ajaxurl,
            data: {
                action: "send_system_info", //calls wp_ajax_nopriv_ajaxlogin
                _nonce: $("#atbdp_email_nonce").val(),
                email: $("#atbdp-email-address").val(),
                sender_email: $("#atbdp-sender-address").val(),
                subject: $("#atbdp-email-subject").val(),
                message: $("#atbdp-email-message").val(),
                system_info_url: $("#atbdp-system-info-url").val(),
            },
            beforeSend: function () {
                $("#atbdp-send-system-info-submit").html("Sending");
            },
            success: function (data) {
                if (data.success) {
                    $("#atbdp-send-system-info-submit").html("Send Email");
                    $(".system_info_success").html("Successfully send");
                }
            },
            error: function (data) {
                console.log(data);
            },
        });
    });

    /**
     * Generate new Remote View URL and display it on the admin page
     */
    $("#generate-url").on("click", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: atbdp_admin_data.ajaxurl,
            data: {
                action: "generate_url", //calls wp_ajax_nopriv_ajaxlogin nonce: ()
                _nonce: $(this).attr('data-nonce')
            },
            success: function (response) {
                $("#atbdp-remote-response").html(response.data.message);
                $("#system-info-url, #atbdp-system-info-url").val(response.data.url);
                $("#system-info-url-text-link")
                    .attr("href", response.data.url)
                    .css("display", "inline-block");
            },
            error: function (response) {
                // $('#atbdp-remote-response').val(response.data.error);
            },
        });

        return false;
    });

    $("#revoke-url").on("click", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: atbdp_admin_data.ajaxurl,
            data: {
                action: "revoke_url", //calls wp_ajax_nopriv_ajaxlogin
                _nonce: $(this).attr('data-nonce')
            },
            success: function (response) {
                $("#atbdp-remote-response").html(response.data);
                $("#system-info-url, #atbdp-system-info-url").val("");
                $("#system-info-url-text-link")
                    .attr("href", "#")
                    .css("display", "none");
            },
            error: function (response) {
                // $('#atbdp-remote-response').val(response.data.error);
            },
        });

        return false;
    });

    // redirect to import import_page_link
    $('#csv_import input[name="csv_import"]').on('change', function (event) {
        event.preventDefault();
        window.location = atbdp_admin_data.import_page_link;
    });

    /* This function handles all ajax request */
    function atbdp_do_ajax(ElementToShowLoadingIconAfter, ActionName, arg, CallBackHandler) {
        let data;
        if (ActionName) data = `action=${ActionName}`;
        if (arg) data = `${arg}&action=${ActionName}`;
        if (arg && !ActionName) data = arg;
        // data = data ;

        const n = data.search(atbdp_admin_data.nonceName);
        if (n < 0) {
            data = `${data}&${atbdp_admin_data.nonceName}=${atbdp_admin_data.nonce}`;
        }

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data,
            beforeSend() {
                jQuery("<span class='atbdp_ajax_loading'></span>").insertAfter(
                    ElementToShowLoadingIconAfter
                );
            },
            success(data) {
                jQuery('.atbdp_ajax_loading').remove();
                CallBackHandler(data);
            },
        });
    }


    // Custom Image uploader for listing image
    // Set all variables to be used in scope
    let frame;
    let selection;
    const multiple_image = true;
    const metaBox = $('#_listing_gallery'); // meta box id here
    const addImgLink = metaBox.find('#listing_image_btn');
    const delImgLink = metaBox.find('#delete-custom-img');
    const imgContainer = metaBox.find('.listing-img-container');

    // ADD IMAGE LINK
    addImgLink.on('click', function (event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame) {
            frame.open();
            return;
        }

        // Create a new media frame
        frame = wp.media({
            title: atbdp_admin_data.i18n_text.upload_image,
            button: {
                text: atbdp_admin_data.i18n_text.choose_image,
            },
            library: { type: 'image' }, // only allow image upload only
            multiple: multiple_image, // Set to true to allow multiple files to be selected. it will be set based on the availability of Multiple Image extension
        });

        // When an image is selected in the media frame...
        frame.on('select', function () {
            /* get the image collection array if the MI extension is active */
            /* One little hints: a constant can not be defined inside the if block */
            if (multiple_image) {
                selection = frame
                    .state()
                    .get('selection')
                    .toJSON();
            } else {
                selection = frame
                    .state()
                    .get('selection')
                    .first()
                    .toJSON();
            }
            let data = ''; // create a placeholder to save all our image from the selection of media uploader

            // if no image exist then remove the place holder image before appending new image
            if ($('.single_attachment').length === 0) {
                imgContainer.html('');
            }

            // handle multiple image uploading.......
            if (multiple_image) {
                $(selection).each(function () {
                    // here el === this
                    // append the selected element if it is an image
                    if (this.type === 'image') {
                        // we have got an image attachment so lets proceed.
                        // target the input field and then assign the current id of the attachment to an array.
                        data += '<div class="single_attachment">';
                        data += `<input class="listing_image_attachment" name="listing_img[]" type="hidden" value="${this.id
                            }">`;
                        data += `<img style="width: 100%; height: 100%;" src="${this.url
                            }" alt="Listing Image" /> <span class="remove_image fa fa-times" title="Remove it"></span></div>`;
                    }
                });
            } else {
                // Handle single image uploading

                // add the id to the input field of the image uploader and then save the ids in the database as a post meta
                // so check if the attachment is really an image and reject other types
                if (selection.type === 'image') {
                    // we have got an image attachment so lets proceed.
                    // target the input field and then assign the current id of the attachment to an array.
                    data += '<div class="single_attachment">';
                    data += `<input class="listing_image_attachment" name="listing_img[]" type="hidden" value="${selection.id
                        }">`;
                    data += `<img style="width: 100%; height: 100%;" src="${selection.url
                        }" alt="Listing Image" /> <span class="remove_image  fa fa-times" title="Remove it"></span></div>`;
                }
            }

            // If MI extension is active then append images to the listing, else only add one image replacing previous upload
            if (multiple_image) {
                imgContainer.append(data);
            } else {
                imgContainer.html(data);
            }

            // Un-hide the remove image link
            delImgLink.removeClass('hidden');
        });
        // Finally, open the modal on click
        frame.open();
    });

    // DELETE ALL IMAGES LINK
    delImgLink.on('click', function (event) {
        event.preventDefault();
        // Clear out the preview image and set no image as placeholder
        imgContainer.html(
            `<img src="${atbdp_admin_data.AdminAssetPath}images/no-image.png" alt="Listing Image" />`
        );
        // Hide the delete image link
        delImgLink.addClass('hidden');
    });

    /* REMOVE SINGLE IMAGE */
    $(document).on('click', '.remove_image', function (e) {
        e.preventDefault();
        $(this)
            .parent()
            .remove();
        // if no image exist then add placeholder and hide remove image button
        if ($('.single_attachment').length === 0) {
            imgContainer.html(
                `<img src="${atbdp_admin_data.AdminAssetPath
                }images/no-image.png" alt="Listing Image" /><p>No images</p> ` +
                `<small>(allowed formats jpeg. png. gif)</small>`
            );
            delImgLink.addClass('hidden');
        }
    });

    const has_tagline = $('#has_tagline').val();
    const has_excerpt = $('#has_excerpt').val();
    if (has_excerpt && has_tagline) {
        $('.atbd_tagline_moto_field').fadeIn();
    } else {
        $('.atbd_tagline_moto_field').fadeOut();
    }

    $('#atbd_optional_field_check').on('change', function () {
        $(this).is(':checked')
            ? $('.atbd_tagline_moto_field').fadeIn()
            : $('.atbd_tagline_moto_field').fadeOut();
    });

    let imageUpload;
    if (imageUpload) {
        imageUpload.open();
        return;
    }

    $('.upload-header').on('click', function (element) {
        element.preventDefault();

        imageUpload = wp.media.frames.file_frame = wp.media({
            title: atbdp_admin_data.i18n_text.select_prv_img,
            button: {
                text: atbdp_admin_data.i18n_text.insert_prv_img,
            },
        });
        imageUpload.open();

        imageUpload.on('select', function () {
            prv_image = imageUpload
                .state()
                .get('selection')
                .first()
                .toJSON();
            prv_url = prv_image.id;
            prv_img_url = prv_image.url;

            $('.listing_prv_img').val(prv_url);
            $('.change_listing_prv_img').attr('src', prv_img_url);
            $('.upload-header').html('Change Preview Image');
            $('.remove_prev_img').show();
        });

        imageUpload.open();
    });

    $('.remove_prev_img').on('click', function (e) {
        $(this).hide();
        $('.listing_prv_img').attr('value', '');
        $('.change_listing_prv_img').attr('src', '');
        e.preventDefault();
    });
    if ($('.change_listing_prv_img').attr('src') === '') {
        $('.remove_prev_img').hide();
    } else if ($('.change_listing_prv_img').attr('src') !== '') {
        $('.remove_prev_img').show();
    }

    // price range
    $('#price_range').hide();
    const is_checked = $('#atbd_listing_pricing').val();
    if (is_checked === 'range') {
        $('#price').hide();
        $('#price_range').show();
    }
    $('.atbd_pricing_options label').on('click', function () {
        const $this = $(this);
        $this.children('input[type=checkbox]').prop('checked') == true
            ? $(`#${$this.data('option')}`).show()
            : $(`#${$this.data('option')}`).hide();
        const $sibling = $this.siblings('label');
        $sibling.children('input[type=checkbox]').prop('checked', false);
        $(`#${$sibling.data('option')}`).hide();
    });

    // Load custom fields of the selected category in the custom post type "atbdp_listings"

    // ekhane to apni ul e click event add korecen. eita add howa uchit checkbox e!  Ohh !
    $('#at_biz_dir-categorychecklist').on('change', function (event) {
        $('#atbdp-custom-fields-list').append('<div class="spinner"></div>');

        const length = $('#at_biz_dir-categorychecklist input:checked');
        const id = [];
        length.each((el, index) => {
            id.push($(index).val());
        });
        const data = {
            action: 'atbdp_custom_fields_listings',
            post_id: $('#atbdp-custom-fields-list').data('post_id'),
            term_id: id,
        };
        $.post(ajaxurl, data, function (response) {
            if (response == ' 0') {
                $('#atbdp-custom-fields-list').hide();
            } else {
                $('#atbdp-custom-fields-list').show();
            }
            $('#atbdp-custom-fields-list').html(response);
        });
        $('#atbdp-custom-fields-list-selected').hide();
    });

    var length = $('#at_biz_dir-categorychecklist input:checked');
    if (length) {
        $('#atbdp-custom-fields-list-selected').html('<div class="spinner"></div>');

        var length = $('#at_biz_dir-categorychecklist input:checked');
        const id = [];
        length.each((el, index) => {
            id.push($(index).val());
        });
        const data = {
            action: 'atbdp_custom_fields_listings_selected',
            post_id: $('#atbdp-custom-fields-list-selected').data('post_id'),
            term_id: id,
        };

        $.post(ajaxurl, data, function (response) {
            $('#atbdp-custom-fields-list-selected').html(response);
        });
    }

    const avg_review = $('#average_review_for_popular').hide();
    const logged_count = $('#views_for_popular').hide();
    if ($('#listing_popular_by select[name="listing_popular_by"]').val() === 'average_rating') {
        avg_review.show();
        logged_count.hide();
    } else if ($('#listing_popular_by select[name="listing_popular_by"]').val() === 'view_count') {
        logged_count.show();
        avg_review.hide();
    } else if ($('#listing_popular_by select[name="listing_popular_by"]').val() === 'both_view_rating') {
        avg_review.show();
        logged_count.show();
    }
    $('#listing_popular_by select[name="listing_popular_by"]').on('change', function () {
        if ($(this).val() === 'average_rating') {
            avg_review.show();
            logged_count.hide();
        } else if ($(this).val() === 'view_count') {
            logged_count.show();
            avg_review.hide();
        } else if ($(this).val() === 'both_view_rating') {
            avg_review.show();
            logged_count.show();
        }
    });

    /* // Display the media uploader when "Upload Image" button clicked in the custom taxonomy "atbdp_categories"
    $( '#atbdp-categories-upload-image' ).on( 'click', function( e ) {
    
     if (frame) {
         frame.open();
         return;
     }
    
     // Create a new media frame
     frame = wp.media({
         title: atbdp_admin_data.i18n_text.upload_cat_image,
         button: {
             text: atbdp_admin_data.i18n_text.choose_image
         },
         library: {type: 'image'}, // only allow image upload only
         multiple: multiple_image  // Set to true to allow multiple files to be selected. it will be set based on the availability of Multiple Image extension
     });
     frame.open();
    }); */
    /**
     * Display the media uploader for selecting an image.
     *
     * @since    1.0.0
     */
    function atbdp_render_media_uploader(page) {
        let file_frame;
        let image_data;
        let json;

        // If an instance of file_frame already exists, then we can open it rather than creating a new instance
        if (undefined !== file_frame) {
            file_frame.open();
            return;
        }
        // Here, use the wp.media library to define the settings of the media uploader
        file_frame = wp.media.frames.file_frame = wp.media({
            frame: 'post',
            state: 'insert',
            multiple: false,
        });

        // Setup an event handler for what to do when an image has been selected
        file_frame.on('insert', function () {
            // Read the JSON data returned from the media uploader
            json = file_frame
                .state()
                .get('selection')
                .first()
                .toJSON();

            // First, make sure that we have the URL of an image to display
            if ($.trim(json.url.length) < 0) {
                return;
            }
            // After that, set the properties of the image and display it
            if (page == 'listings') {
                const html =
                    `${'<tr class="atbdp-image-row">' +
                    '<td class="atbdp-handle"><span class="dashicons dashicons-screenoptions"></span></td>' +
                    '<td class="atbdp-image">' +
                    '<img src="'}${json.url}" />` +
                    `<input type="hidden" name="images[]" value="${json.id}" />` +
                    `</td>` +
                    `<td>${json.url}<br />` +
                    `<a href="post.php?post=${json.id}&action=edit" target="_blank">${atbdp.edit
                    }</a> | ` +
                    `<a href="javascript:;" class="atbdp-delete-image" data-attachment_id="${json.id
                    }">${atbdp.delete_permanently}</a>` +
                    `</td>` +
                    `</tr>`;

                $('#atbdp-images').append(html);
            } else {
                $('#atbdp-categories-image-id').val(json.id);
                $('#atbdp-categories-image-wrapper').html(
                    `<img src="${json.url
                    }" /><a href="" class="remove_cat_img"><span class="fa fa-times" title="Remove it"></span></a>`
                );
            }
        });

        // Now display the actual file_frame
        file_frame.open();
    }

    // Display the media uploader when "Upload Image" button clicked in the custom taxonomy "atbdp_categories"
    $('#atbdp-categories-upload-image').on('click', function (e) {
        e.preventDefault();

        atbdp_render_media_uploader('categories');
    });

    $('#submit').on('click', function () {
        $('#atbdp-categories-image-wrapper img').attr('src', '');
        $('.remove_cat_img').remove();
    });

    $(document).on('click', '.remove_cat_img', function (e) {
        e.preventDefault();
        $(this).hide();
        $(this)
            .prev('img')
            .remove();
        $('#atbdp-categories-image-id').attr('value', '');
    });

    //
    const lf_opt2 = $(
        '#search_result_filter_button_text, #search_result_filters_fields, #search_result_search_text_placeholder, #search_result_category_placeholder, #search_result_location_placeholder,#search_result_display_filter,#search_result_filters_button,#sresult_reset_text,#sresult_apply_text'
    );
    lf_opt2.hide();
    $('input[name="search_result_filters_button_display"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt2.show();
        } else {
            lf_opt2.hide();
        }
    });
    if ($('input[name="search_result_filters_button_display"]').is(':checked') === true) {
        lf_opt2.show();
    }

    // Display more filters - option
    const lf_opt3 = $(
        '#search_more_filters_fields, #search_filters, #search_more_filters, #search_reset_filters, #search_apply_filters,#home_display_filter,#search_reset_text,#search_apply_filter,#search_more_filter_icon'
    );
    lf_opt3.hide();
    $('input[name="search_more_filter"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt3.show();
        } else {
            lf_opt3.hide();
        }
    });
    if ($('input[name="search_more_filter"]').is(':checked') === true) {
        lf_opt3.show();
    }

    // Display more filters - option
    const lf_opt4 = $('#search_result_meta_title');
    lf_opt4.hide();
    $('#meta_title_for_search_result select[name="meta_title_for_search_result"]').on('change', function () {
        if ($(this).val() === 'custom') {
            lf_opt4.show();
        } else {
            lf_opt4.hide();
        }
    });
    if ($('#meta_title_for_search_result select[name="meta_title_for_search_result"]').val() === 'custom') {
        lf_opt4.show();
    }

    // Display Header - option
    const lf_opt5 = $('#all_listing_title');
    lf_opt5.hide();
    $('input[name="display_listings_header"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt5.show();
        } else {
            lf_opt5.hide();
        }
    });
    if ($('input[name="display_listings_header"]').is(':checked') === true) {
        lf_opt5.show();
    }

    // Display filter button
    const lf_opt6 = $(
        '#listings_filter_button_text, #listings_display_filter, #listing_filters_fields, #listings_filters_button, #listings_reset_text, #listings_apply_text, #listings_search_text_placeholder, #listings_category_placeholder, #listings_location_placeholder, #listing_filters_icon'
    );
    lf_opt6.hide();
    $('input[name="listing_filters_button"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt6.show();
        } else {
            lf_opt6.hide();
        }
    });
    if ($('input[name="listing_filters_button"]').is(':checked') === true) {
        lf_opt6.show();
    }

    // Preview image
    let preview_image_sections = [
        '#default_preview_image',
        '#crop_width,#crop_height',
        'div#prv_container_size_by',
        '#preview_image_quality',
        '#way_to_show_preview',
        '#prv_background_type',
    ];
    preview_image_sections = preview_image_sections.join(',');
    const lf_opt7 = $(preview_image_sections);

    lf_opt7.hide();
    $('input[name="display_preview_image"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt7.show();
        } else {
            lf_opt7.hide();
        }
    });

    if ($('input[name="display_preview_image"]').is(':checked') === true) {
        lf_opt7.show();
    }

    // Preview image
    const fill = $('#crop_width, #crop_height, div#prv_container_size_by');
    const backType = $('#prv_background_type');
    const backgroundType = $('#prv_background_color');
    backgroundType.hide();
    fill.hide();
    backType.hide();
    $('select[name="way_to_show_preview"]').on('change', function () {
        if ($(this).val() === 'cover' || $(this).val() === 'contain') {
            if ($(this).val() === 'contain') {
                fill.show();
                backType.show();
                if ($('select[name="prv_background_type"]').val() === 'color') {
                    backgroundType.show();
                }
            } else {
                fill.show();
                backType.hide();
                backgroundType.hide();
            }
        } else {
            fill.hide();
            backType.hide();
            backgroundType.hide();
        }
    });
    if ($('select[name="way_to_show_preview"]').val() === 'contain') {
        fill.show();
        backType.show();
    }
    if ($('select[name="way_to_show_preview"]').val() === 'cover') {
        fill.show();
    }
    // background type
    $('select[name="prv_background_type"]').on('change', function () {
        if ($(this).val() === 'color') {
            backgroundType.show();
        } else {
            backgroundType.hide();
        }
    });
    if ($('select[name="way_to_show_preview"]').val() === 'contain') {
        if ($('select[name="prv_background_type"]').val() === 'color') {
            backgroundType.show();
        }
    }

    //
    const lf_opt9 = $('#address_location');
    lf_opt9.hide();
    $('input[name="display_contact_info"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt9.show();
        } else {
            lf_opt9.hide();
        }
    });
    if ($('input[name="display_contact_info"]').is(':checked') === true) {
        lf_opt9.show();
    }

    //
    const lf_opt10 = $('#delete_expired_listings_after, #deletion_mode');
    lf_opt10.hide();
    $('input[name="delete_expired_listing"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt10.show();
        } else {
            lf_opt10.hide();
        }
    });
    if ($('input[name="delete_expired_listing"]').is(':checked') === true) {
        lf_opt10.show();
    }

    //
    const lf_opt11 = $(
        '#atbdp_listing_slug, #new_listing_status, #edit_listing_status, #edit_listing_redirect, #listing_details_text, #custom_section_lable, #listing_location_text, #contact_info_text, #contact_listing_owner, #atbd_video_title, #dsiplay_prv_single_page, #dsiplay_slider_single_page, #gallery_crop_width, #gallery_crop_height, #enable_social_share, #enable_favourite, #enable_report_abuse, #disable_list_price, #disable_contact_info, #disable_contact_owner, #use_nofollow, #disable_map, #atbd_video_url,#dsiplay_thumbnail_img, #enable_rel_listing,#rel_listing_title, #rel_listing_num, #rel_listing_column'
    );
    lf_opt11.show();
    $('input[name="disable_single_listing"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt11.hide();
        } else {
            lf_opt11.show();
        }
    });
    if ($('input[name="disable_single_listing"]').is(':checked') === true) {
        lf_opt11.hide();
    }

    // Display all listings sort by dropdown
    const lf_opt12 = $('#listings_sort_by_items,#sort_by_text');
    lf_opt12.hide();
    $('input[name="display_sort_by"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt12.show();
        } else {
            lf_opt12.hide();
        }
    });
    if ($('input[name="display_sort_by"]').is(':checked') === true) {
        lf_opt12.show();
    }

    // Display all listings view as dropdown
    const lf_opt13 = $('#listings_view_as_items,#view_as_text');
    lf_opt13.hide();
    $('input[name="display_view_as"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt13.show();
        } else {
            lf_opt13.hide();
        }
    });
    if ($('input[name="display_view_as"]').is(':checked') === true) {
        lf_opt13.show();
    }

    // Display new badge
    const lf_opt14 = $('#new_badge_text,#new_listing_day');
    lf_opt14.hide();
    $('input[name="display_new_badge_cart"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt14.show();
        } else {
            lf_opt14.hide();
        }
    });
    if ($('input[name="display_new_badge_cart"]').is(':checked') === true) {
        lf_opt14.show();
    }

    // Display featured badge
    const lf_opt15 = $('#feature_badge_text');
    lf_opt15.hide();
    $('input[name="display_feature_badge_cart"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt15.show();
        } else {
            lf_opt15.hide();
        }
    });
    if ($('input[name="display_feature_badge_cart"]').is(':checked') === true) {
        lf_opt15.show();
    }

    // Display featured badge
    const lf_opt16 = $('#popular_badge_text');
    lf_opt16.hide();
    $('input[name="display_popular_badge_cart"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt16.show();
        } else {
            lf_opt16.hide();
        }
    });
    if ($('input[name="display_popular_badge_cart"]').is(':checked') === true) {
        lf_opt16.show();
    }

    // Display review rating
    const lf_opt17 = $(
        '#enable_owner_review,#review_num,#enable_reviewer_img,#review_approval,#approve_immediately,#guest_review,#review_approval_text,#enable_reviewer_content,#required_reviewer_content'
    );
    lf_opt17.hide();
    $('input[name="enable_review"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt17.show();
        } else {
            lf_opt17.hide();
        }
    });
    if ($('input[name="enable_review"]').is(':checked') === true) {
        lf_opt17.show();
    }

    // Display form tagline
    const lf_opt18 = $('#tagline_label,#display_tagline_for');
    lf_opt18.hide();
    $('input[name="display_tagline_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt18.show();
        } else {
            lf_opt18.hide();
        }
    });
    if ($('input[name="display_tagline_field"]').is(':checked') === true) {
        lf_opt18.show();
    }

    // Display form pricing
    const lf_opt19 = $('#price_label,#require_price,#display_price_for,#price_placeholder');
    lf_opt19.hide();
    $('input[name="display_pricing_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt19.show();
        } else {
            lf_opt19.hide();
        }
    });
    if ($('input[name="display_pricing_field"]').is(':checked') === true) {
        lf_opt19.show();
    }

    // Display form price range
    const lf_opt_price_range = $(
        '#price_range_label,#require_price_range,#display_price_range_for,#price_range_placeholder'
    );
    lf_opt_price_range.hide();
    $('input[name="display_price_range_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt_price_range.show();
        } else {
            lf_opt_price_range.hide();
        }
    });
    if ($('input[name="display_price_range_field"]').is(':checked') === true) {
        lf_opt_price_range.show();
    }

    // Display form excerpt
    const lf_opt20 = $('#excerpt_label,#require_excerpt,#display_short_desc_for');
    lf_opt20.hide();
    $('input[name="display_excerpt_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt20.show();
        } else {
            lf_opt20.hide();
        }
    });
    if ($('input[name="display_excerpt_field"]').is(':checked') === true) {
        lf_opt20.show();
    }

    // Display form address
    const lf_opt21 = $('#address_label,#require_address,#display_address_for');
    lf_opt21.hide();
    $('input[name="display_address_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt21.show();
        } else {
            lf_opt21.hide();
        }
    });
    if ($('input[name="display_address_field"]').is(':checked') === true) {
        lf_opt21.show();
    }

    // Display form phone number
    const lf_opt22 = $('#phone_label,#require_phone_number,#display_phone_for');
    lf_opt22.hide();
    $('input[name="display_phone_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt22.show();
        } else {
            lf_opt22.hide();
        }
    });
    if ($('input[name="display_phone_field"]').is(':checked') === true) {
        lf_opt22.show();
    }

    // Display form email
    const lf_opt23 = $('#email_label,#require_email,#display_email_for');
    lf_opt23.hide();
    $('input[name="display_email_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt23.show();
        } else {
            lf_opt23.hide();
        }
    });
    if ($('input[name="display_email_field"]').is(':checked') === true) {
        lf_opt23.show();
    }

    // Display form website
    const lf_opt24 = $('#website_label,#require_website,#display_website_for');
    lf_opt24.hide();
    $('input[name="display_website_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt24.show();
        } else {
            lf_opt24.hide();
        }
    });
    if ($('input[name="display_website_field"]').is(':checked') === true) {
        lf_opt24.show();
    }

    // Display zip/post code
    const lf_opt25 = $('#zip_label,#require_zip,#display_zip_for');
    lf_opt25.hide();
    $('input[name="display_zip_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt25.show();
        } else {
            lf_opt25.hide();
        }
    });
    if ($('input[name="display_zip_field"]').is(':checked') === true) {
        lf_opt25.show();
    }

    // Display social info
    const lf_opt26 = $('#social_label,#require_social_info,#display_social_info_for');
    lf_opt26.hide();
    $('input[name="display_social_info_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt26.show();
        } else {
            lf_opt26.hide();
        }
    });
    if ($('input[name="display_social_info_field"]').is(':checked') === true) {
        lf_opt26.show();
    }

    // Display map
    const lf_opt27 = $('#display_map_for');
    lf_opt27.hide();
    $('input[name="display_map_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt27.show();
        } else {
            lf_opt27.hide();
        }
    });
    if ($('input[name="display_map_field"]').is(':checked') === true) {
        lf_opt27.show();
    }

    // Display gallery image
    const lf_opt29 = $('#gallery_label,#require_gallery_img,#display_glr_img_for');
    lf_opt29.hide();
    $('input[name="display_gallery_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt29.show();
        } else {
            lf_opt29.hide();
        }
    });
    if ($('input[name="display_gallery_field"]').is(':checked') === true) {
        lf_opt29.show();
    }

    // Display form video
    const lf_opt30 = $('#video_label,#require_video,#display_video_for');
    lf_opt30.hide();
    $('input[name="display_video_field"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt30.show();
        } else {
            lf_opt30.hide();
        }
    });
    if ($('input[name="display_video_field"]').is(':checked') === true) {
        lf_opt30.show();
    }

    // Display terms and condition
    const lf_opt31 = $('#require_terms_conditions, #terms_label, #terms_label_link');
    lf_opt31.hide();
    $('input[name="listing_terms_condition"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt31.show();
        } else {
            lf_opt31.hide();
        }
    });
    if ($('input[name="listing_terms_condition"]').is(':checked') === true) {
        lf_opt31.show();
    }

    // Display Privacy Policy
    const lf_privacy = $('#require_privacy, #privacy_label, #privacy_label_link');
    lf_privacy.hide();
    $('input[name="listing_privacy"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_privacy.show();
        } else {
            lf_privacy.hide();
        }
    });
    if ($('input[name="listing_privacy"]').is(':checked') === true) {
        lf_privacy.show();
    }

    // Display search header
    const lf_opt32 = $('#search_header_title');
    lf_opt32.hide();
    $('input[name="search_header"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt32.show();
        } else {
            lf_opt32.hide();
        }
    });
    if ($('input[name="search_header"]').is(':checked') === true) {
        lf_opt32.show();
    }

    // Display search view as
    const lf_opt33 = $('#search_view_as_items');
    lf_opt33.hide();
    $('input[name="search_view_as"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt33.show();
        } else {
            lf_opt33.hide();
        }
    });
    if ($('input[name="search_view_as"]').is(':checked') === true) {
        lf_opt33.show();
    }

    // Display search sort by
    const lf_opt34 = $('#search_sort_by_items');
    lf_opt34.hide();
    $('input[name="search_sort_by"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt34.show();
        } else {
            lf_opt34.hide();
        }
    });
    if ($('input[name="search_sort_by"]').is(':checked') === true) {
        lf_opt34.show();
    }

    // Display decimal
    const lf_opt35 = $('#g_decimal_separator');
    lf_opt35.hide();
    $('input[name="allow_decimal"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt35.show();
        } else {
            lf_opt35.hide();
        }
    });
    if ($('input[name="allow_decimal"]').is(':checked') === true) {
        lf_opt35.show();
    }

    // Display email notification
    const disable_email_notification = $(
        '#email_from_name,#email_from_email,#admin_email_lists,#notify_admin,#notify_user'
    );
    disable_email_notification.show();
    $('input[name="disable_email_notification"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            disable_email_notification.hide();
        } else {
            disable_email_notification.show();
        }
    });
    if ($('input[name="disable_email_notification"]').is(':checked') === true) {
        disable_email_notification.hide();
    }

    // Email header
    const email_header = $('#email_header_color');
    email_header.hide();
    $('input[name="allow_email_header"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            email_header.show();
        } else {
            email_header.hide();
        }
    });
    if ($('input[name="allow_email_header"]').is(':checked') === true) {
        email_header.show();
    }

    // Display email notification
    const lf_opt36 = $(
        '#enable_featured_listing,#featured_listing_title,#featured_listing_desc,#featured_listing_price, #featured_listing_time'
    );
    lf_opt36.hide();
    $('input[name="enable_monetization"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt36.show();
        } else {
            lf_opt36.hide();
        }
    });
    if ($('input[name="enable_monetization"]').is(':checked') === true) {
        lf_opt36.show();
    }

    // Map setting options
    const g_map_api = $('#map_api_key, #country_restriction, #restricted_countries');
    g_map_api.hide();
    $('select[name="select_listing_map"]').on('change', function () {
        if ($(this).val() === 'google') {
            g_map_api.show();
        } else {
            g_map_api.hide();
        }
    });
    if ($('select[name="select_listing_map"]').val() === 'google') {
        g_map_api.show();
    }

    // Map setting options
    const restrict_countries = $('#restricted_countries');
    restrict_countries.hide();
    $('input[name="country_restriction"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            restrict_countries.show();
        } else {
            restrict_countries.hide();
        }
    });
    if ($('input[name="country_restriction"]').is(':checked') === true) {
        restrict_countries.show();
    }

    // Category & Location default settings js
    const subc_depth = $('#categories_depth_number');
    subc_depth.hide();
    $('select[name="display_categories_as"]').on('change', function () {
        if ($(this).val() === 'list') {
            subc_depth.show();
        } else {
            subc_depth.hide();
        }
    });
    if ($('select[name="display_categories_as"]').val() === 'list') {
        subc_depth.show();
    }

    const subl_depth = $('#locations_depth_number');
    subl_depth.hide();
    $('select[name="display_locations_as"]').on('change', function () {
        if ($(this).val() === 'list') {
            subl_depth.show();
        } else {
            subl_depth.hide();
        }
    });
    if ($('select[name="display_locations_as"]').val() === 'list') {
        subl_depth.show();
    }

    // Display website in registration form
    const lf_opt37 = $('#reg_website,#require_website_reg');
    lf_opt37.hide();
    $('input[name="display_website_reg"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt37.show();
        } else {
            lf_opt37.hide();
        }
    });
    if ($('input[name="display_website_reg"]').is(':checked') === true) {
        lf_opt37.show();
    }

    // Display first name in registration form
    const lf_opt38 = $('#reg_fname,#require_fname_reg');
    lf_opt38.hide();
    $('input[name="display_fname_reg"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt38.show();
        } else {
            lf_opt38.hide();
        }
    });
    if ($('input[name="display_fname_reg"]').is(':checked') === true) {
        lf_opt38.show();
    }

    // Display last name in registration form
    const lf_opt39 = $('#reg_lname,#require_lname_reg');
    lf_opt39.hide();
    $('input[name="display_lname_reg"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt39.show();
        } else {
            lf_opt39.hide();
        }
    });
    if ($('input[name="display_lname_reg"]').is(':checked') === true) {
        lf_opt39.show();
    }

    // Display bio in registration form
    const lf_opt40 = $('#reg_bio,#require_bio_reg');
    lf_opt40.hide();
    $('input[name="display_bio_reg"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt40.show();
        } else {
            lf_opt40.hide();
        }
    });
    if ($('input[name="display_bio_reg"]').is(':checked') === true) {
        lf_opt40.show();
    }

    // Display privacy fields in registration form
    const lf_registration_privacy = $('#registration_privacy_label,#registration_privacy_label_link');
    lf_registration_privacy.hide();
    $('input[name="registration_privacy"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_registration_privacy.show();
        } else {
            lf_registration_privacy.hide();
        }
    });
    if ($('input[name="registration_privacy"]').is(':checked') === true) {
        lf_registration_privacy.show();
    }

    // Display terms and conditions fields in registration form
    const lf_registration_terms = $('#regi_terms_label,#regi_terms_label_link, #require_regi_terms_conditions');
    lf_registration_terms.hide();
    $('input[name="regi_terms_condition"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_registration_terms.show();
        } else {
            lf_registration_terms.hide();
        }
    });
    if ($('input[name="regi_terms_condition"]').is(':checked') === true) {
        lf_registration_terms.show();
    }

    // Display login message in registration form
    const lf_opt41 = $('#login_text,#log_linkingmsg');
    lf_opt41.hide();
    $('input[name="display_login"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt41.show();
        } else {
            lf_opt41.hide();
        }
    });
    if ($('input[name="display_login"]').is(':checked') === true) {
        lf_opt41.show();
    }

    // Display remember login information in login form
    const lf_opt42 = $('#log_rememberme');
    lf_opt42.hide();
    $('input[name="display_rememberme"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt42.show();
        } else {
            lf_opt42.hide();
        }
    });
    if ($('input[name="display_rememberme"]').is(':checked') === true) {
        lf_opt42.show();
    }

    // Display sign up login message in login form
    const lf_opt43 = $('#reg_text,#reg_linktxt');
    lf_opt43.hide();
    $('input[name="display_signup"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt43.show();
        } else {
            lf_opt43.hide();
        }
    });
    if ($('input[name="display_signup"]').is(':checked') === true) {
        lf_opt43.show();
    }

    // Display recover message in login form
    const lf_opt44 = $('#recpass_text,#recpass_desc,#recpass_username,#recpass_placeholder,#recpass_button');
    lf_opt44.hide();
    $('input[name="display_recpass"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt44.show();
        } else {
            lf_opt44.hide();
        }
    });
    if ($('input[name="display_recpass"]').is(':checked') === true) {
        lf_opt44.show();
    }

    // Display recover message in login form
    const lf_opt45 = $('#reg_password,#require_password_reg');
    lf_opt45.hide();
    $('input[name="display_password_reg"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            $('#display_password_reg + .password_notice').remove();
            lf_opt45.show();
        } else {
            $('#display_password_reg').after(
                "<p class='password_notice'>We recommand you to customize registration confirmation email. Click <a href='#' id='goto_passwoard'>here</a> to customize</p>"
            );
            $('.req_password_notice').remove();
            lf_opt45.hide();
        }
    });
    if ($('input[name="display_password_reg"]').is(':checked') === true) {
        lf_opt45.show();
    }
    function scrollToSettingsElement(eventId, menuId, targetId) {
        $('body').on('click', eventId, function (e) {
            e.preventDefault();
            $(`a[href="${menuId}"]`).click();
            $('html, body').animate(
                { scrollTop: $(targetId)[0].closest('.vp-section').offsetTop },
                500,
                'swing'
            );
        });
    }

    scrollToSettingsElement('#goto_passwoard', '#emails_templates', '#email_sub_registration_confirmation');

    // required password notice
    $('input[name="require_password_reg"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            $('#require_password_reg + .req_password_notice').remove();
        } else {
            $('#require_password_reg').after(
                "<p class='req_password_notice'>We recommand you to customize registration confirmation email. Click <a href='#' id='goto_passwoard'>here</a> to customize</p>"
            );
        }
    });

    // Display excerpt
    const lf_opt46 = $('#excerpt_limit,#display_readmore,#excerpt_limit,#readmore_text');
    lf_opt46.hide();
    $('input[name="enable_excerpt"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt46.show();
        } else {
            lf_opt46.hide();
        }
    });
    if ($('input[name="enable_excerpt"]').is(':checked') === true) {
        lf_opt46.show();
    }

    // Display readmore
    var lf_opt47 = $('#readmore_text');
    lf_opt47.hide();
    $('input[name="display_readmore"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt47.show();
        } else {
            lf_opt47.hide();
        }
    });
    if ($('input[name="display_readmore"]').is(':checked') === true) {
        lf_opt47.show();
    }

    // Display my listing tab
    var lf_opt47 = $('#user_listings_pagination,#user_listings_per_page');
    lf_opt47.hide();
    $('input[name="my_listing_tab"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt47.show();
        } else {
            lf_opt47.hide();
        }
    });
    if ($('input[name="my_listing_tab"]').is(':checked') === true) {
        lf_opt47.show();
    }

    // Display popular categories
    const lf_opt49 = $('#show_connector,#connectors_title,#popular_cat_title,#popular_cat_num');
    lf_opt49.hide();
    $('input[name="show_popular_category"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt49.show();
        } else {
            lf_opt49.hide();
        }
    });
    if ($('input[name="show_popular_category"]').is(':checked') === true) {
        lf_opt49.show();
    }

    // Display popular categories
    const lf_opt50 = $('#connectors_title');
    lf_opt50.hide();
    $('input[name="show_connector"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt50.show();
        } else {
            lf_opt50.hide();
        }
    });
    if ($('input[name="show_connector"]').is(':checked') === true) {
        lf_opt50.show();
    }

    // Display popular categories
    const lf_opt51 = $('#readmore_text');
    lf_opt51.hide();
    $('input[name="display_readmore"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt51.show();
        } else {
            lf_opt51.hide();
        }
    });
    if ($('input[name="display_readmore"]').is(':checked') === true) {
        lf_opt51.show();
    }

    // Display related listings
    const lf_opt52 = $('#rel_listing_title,#rel_listing_num,#rel_listing_column,#rel_listings_logic');
    lf_opt52.hide();
    $('input[name="enable_rel_listing"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt52.show();
        } else {
            lf_opt52.hide();
        }
    });
    if ($('input[name="enable_rel_listing"]').is(':checked') === true) {
        lf_opt52.show();
    }

    // Display search button
    const lf_opt53 = $('#search_listing_text,#search_button_icon');
    lf_opt53.hide();
    $('input[name="search_button"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt53.show();
        } else {
            lf_opt53.hide();
        }
    });
    if ($('input[name="search_button"]').is(':checked') === true) {
        lf_opt53.show();
    }

    // Email use field
    const lf_opt54_1 = $('#user_email');
    lf_opt54_1.hide();
    $('input[name="disable_contact_owner"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt54_1.hide();
        } else {
            lf_opt54_1.show();
        }
    });
    if ($('input[name="disable_contact_owner"]').is(':checked') == false) {
        lf_opt54_1.show();
    }

    // Display all listings header
    const lf_opt54 = $(
        '#all_listing_title,#listing_filters_button,#listings_filter_button_text,#listings_display_filter,#listing_filters_fields,#listings_filters_button,#listings_reset_text,#listings_apply_text,#listings_search_text_placeholder,#listings_category_placeholder,#listings_location_placeholder,#display_sort_by,#sort_by_text,#listings_sort_by_items,#display_view_as,#view_as_text,#listings_view_as_items'
    );
    lf_opt54.hide();
    $('input[name="display_listings_header"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt54.show();
        } else {
            lf_opt54.hide();
        }
    });
    if ($('input[name="display_listings_header"]').is(':checked') === true) {
        lf_opt54.show();
    }

    // Display search result header
    const lf_opt55 = $(
        '#search_header_title,#search_result_filters_button_display,#search_result_filter_button_text,#search_result_display_filter,#search_result_filters_fields,#search_result_filters_button,#sresult_reset_text,#sresult_apply_text,#search_result_search_text_placeholder,#search_result_category_placeholder,#search_result_location_placeholder,#search_view_as,#search_viewas_text,#search_view_as_items,#search_sort_by,#search_sortby_text,#search_sort_by_items'
    );
    lf_opt55.hide();
    $('input[name="search_header"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt55.show();
        } else {
            lf_opt55.hide();
        }
    });
    if ($('input[name="search_header"]').is(':checked') === true) {
        lf_opt55.show();
    }

    // Display my listing tab text option for deshboard
    const lf_opt56 = $('#my_listing_tab_text');
    lf_opt56.hide();
    $('input[name="my_listing_tab"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt56.show();
        } else {
            lf_opt56.hide();
        }
    });
    if ($('input[name="my_listing_tab"]').is(':checked') === true) {
        lf_opt56.show();
    }

    // Display my profile tab text option for deshboard
    const lf_opt57 = $('#my_profile_tab_text');
    lf_opt57.hide();
    $('input[name="my_profile_tab"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt57.show();
        } else {
            lf_opt57.hide();
        }
    });
    if ($('input[name="my_profile_tab"]').is(':checked') === true) {
        lf_opt57.show();
    }

    // Display my profile tab text option for deshboard
    const lf_opt58 = $('#fav_listings_tab_text');
    lf_opt58.hide();
    $('input[name="fav_listings_tab"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt58.show();
        } else {
            lf_opt58.hide();
        }
    });
    if ($('input[name="fav_listings_tab"]').is(':checked') === true) {
        lf_opt58.show();
    }

    // Display view count for add listing
    const lf_opt59 = $('#views_count_label,#display_views_count_for');
    lf_opt59.hide();
    $('input[name="display_views_count"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt59.show();
        } else {
            lf_opt59.hide();
        }
    });
    if ($('input[name="display_views_count"]').is(':checked') === true) {
        lf_opt59.show();
    }
    // display review approval
    // Display review rating
    const lf_opt60 = $('#review_approval_text');
    lf_opt60.show();
    $('input[name="approve_immediately"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt60.hide();
        } else {
            lf_opt60.show();
        }
    });
    if ($('input[name="approve_immediately"]').is(':checked') === true) {
        lf_opt60.hide();
    }

    // Display review rating
    const lf_opt61 = $('#display_image_map, #display_title_map, #display_address_map, #display_direction_map');
    lf_opt61.hide();
    $('input[name="display_map_info"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt61.show();
        } else {
            lf_opt61.hide();
        }
    });
    if ($('input[name="display_map_info"]').is(':checked') === true) {
        lf_opt61.show();
    }

    // Display guest field
    const lf_opt62 = $('#guest_email, #guest_email_placeholder');
    lf_opt62.hide();
    $('input[name="guest_listings"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt62.show();
        } else {
            lf_opt62.hide();
        }
    });
    if ($('input[name="guest_listings"]').is(':checked') === true) {
        lf_opt62.show();
    }

    // Display Maximum Location
    const lf_opt63 = $('#max_location_creation');
    lf_opt63.hide();
    $('input[name="multiple_loc_for_user"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            lf_opt63.show();
        } else {
            lf_opt63.hide();
        }
    });
    if ($('input[name="multiple_loc_for_user"]').is(':checked') === true) {
        lf_opt63.show();
    }

    // Display review content
    const enable_reviewer_content_effects = $('#required_reviewer_content');
    enable_reviewer_content_effects.hide();
    $('input[name="enable_reviewer_content"]').on('change', function () {
        if ($(this).is(':checked') === true) {
            enable_reviewer_content_effects.show();
        } else {
            enable_reviewer_content_effects.hide();
        }
    });
    if ($('input[name="enable_reviewer_content"]').is(':checked') === true) {
        enable_reviewer_content_effects.show();
    }

    /* Copy shortcodes on click */
    const textToCopy = document.querySelectorAll('.description.atbdp_settings_description strong');
    textToCopy.forEach((el, index) => {
        el.addEventListener('click', function () {
            const $temp = $('<input>');
            $('body').append($temp);
            $temp.val($(el).text()).select();
            document.execCommand('copy');
            $temp.remove();
            $(el).after("<p style='color: #32cc6f; margin-top: 5px;'>Copied to clipboard!</p>");
            setTimeout(function () {
                $(el)
                    .siblings('p')
                    .fadeOut(300, function () {
                        $(this).remove();
                    });
            }, 3000);
        });
    });

    // Single Slider - Display Background Type Options
    const single_slider_image_size_inp = $('select[name="single_slider_image_size"]');
    const single_slider_background_type_wrap = $('#single_slider_background_type');

    single_slider_image_size_inp.on('change', function () {
        if ($(this).val() === 'contain') {
            single_slider_background_type_wrap.show();
        } else {
            single_slider_background_type_wrap.hide();
        }
    });

    single_slider_background_type_wrap.hide();
    if (single_slider_image_size_inp.val() === 'contain') {
        single_slider_background_type_wrap.show();
    }

    // Single Slider - Display Background Color Options
    const single_slider_background_type_inp = $('select[name="single_slider_background_type"]');
    const single_slider_background_color_wrap = $('#single_slider_background_color');

    single_slider_background_type_inp.on('change', function () {
        if ($(this).val() === 'custom-color') {
            single_slider_background_color_wrap.show();
        } else {
            single_slider_background_color_wrap.hide();
        }
    });

    single_slider_background_color_wrap.hide();
    if (single_slider_background_type_inp.val() === 'custom-color') {
        single_slider_background_color_wrap.show();
    }

    // Single Slider - Display Dependency Options For Slider Image
    const dsiplay_slider_single_page_inp = $('input[name="dsiplay_slider_single_page"]');
    const dsiplay_slider_single_page_dep = $(
        'div#single_slider_image_size, div#dsiplay_thumbnail_img, div#gallery_crop_width, div#gallery_crop_height, div#single_slider_background_color'
    );

    dsiplay_slider_single_page_inp.on('change', function () {
        if ($(this).is(':checked') === true) {
            dsiplay_slider_single_page_dep.show();
        } else {
            dsiplay_slider_single_page_dep.hide();
        }
    });

    dsiplay_slider_single_page_dep.hide();
    if (dsiplay_slider_single_page_inp.is(':checked')) {
        dsiplay_slider_single_page_dep.show();
    }

    // Announcement
    // ----------------------------------------------------------------------------------
    // Display Announcement Recepents
    const announcement_to = $('select[name="announcement_to"]');
    const announcement_recepents_section = $('#announcement_recepents');
    toggle_section('selected_user', announcement_to, announcement_recepents_section);
    announcement_to.on('change', function () {
        toggle_section('selected_user', $(this), announcement_recepents_section);
    });

    const submit_button = $('#announcement_submit .vp-input ~ span');
    const form_feedback = $('#announcement_submit .field');
    form_feedback.prepend('<div class="announcement-feedback"></div>');

    let announcement_is_sending = false;

    // Send Announcement
    submit_button.on('click', function () {
        if (announcement_is_sending) {
            console.log('Please wait...');
            return;
        }

        const to = $('select[name="announcement_to"]');
        const recepents = $('select[name="announcement_recepents"]');
        const subject = $('input[name="announcement_subject"]');
        const message = $('textarea[name="announcement_message"]');
        const expiration = $('input[name="announcement_expiration"]');
        const send_to_email = $('input[name="announcement_send_to_email"]');

        const fields_elm = {
            to: { elm: to, value: to.val(), default: 'all_user' },
            recepents: { elm: recepents, value: recepents.val(), default: null },
            subject: { elm: subject, value: subject.val(), default: '' },
            message: { elm: message, value: message.val(), default: '' },
            expiration: { elm: expiration, value: expiration.val(), default: 3 },
            send_to_email: { elm: send_to_email.val(), value: send_to_email.val(), default: 1 },
        };

        // Send the form
        const form_data = new FormData();

        // Fillup the form
        form_data.append('action', 'atbdp_send_announcement');
        for (field in fields_elm) {
            form_data.append(field, fields_elm[field].value);
        }

        announcement_is_sending = true;

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            processData: false,
            contentType: false,
            beforeSend() {
                // console.log( 'Sending...' );
                form_feedback
                    .find('.announcement-feedback')
                    .html('<div class="form-alert">Sending the announcement, please wait..</div>');
            },
            success(response) {
                // console.log( {response} );
                announcement_is_sending = false;

                if (response.message) {
                    form_feedback
                        .find('.announcement-feedback')
                        .html(`<div class="form-alert">${response.message}</div>`);
                }
            },
            error(error) {
                console.log({ error });
                announcement_is_sending = false;
            },
        });

    });

    // Tab Content
    // ----------------------------------------------------------------------------------
    // Modular, classes has no styling, so reusable
    $('.atbdp-tab__nav-link').on('click', function (e) {
        e.preventDefault();

        const data_target = $(this).data('target');
        const current_item = $(this).parent();

        // Active Nav Item
        $('.atbdp-tab__nav-item').removeClass('active');
        current_item.addClass('active');

        // Active Tab Content
        $('.atbdp-tab__content').removeClass('active');
        $(data_target).addClass('active');
    });

    // Custom
    $('.atbdp-tab-nav-menu__link').on('click', function (e) {
        e.preventDefault();

        const data_target = $(this).data('target');
        const current_item = $(this).parent();

        // Active Nav Item
        $('.atbdp-tab-nav-menu__item').removeClass('active');
        current_item.addClass('active');

        // Active Tab Content
        $('.atbdp-tab-content').removeClass('active');
        $(data_target).addClass('active');
    });

    // Section Toggle
    $('.atbdp-section-toggle').on('click', function (e) {
        e.preventDefault();

        const data_target = $(this).data('target');
        $(data_target).slideToggle();
    });

    // Accordion Toggle
    $('.atbdp-accordion-toggle').on('click', function (e) {
        e.preventDefault();

        const data_parent = $(this).data('parent');
        const data_target = $(this).data('target');

        if ($(data_target).hasClass('active')) {
            $(data_target).removeClass('active');
            $(data_target).slideUp();
        } else {
            $(data_parent)
                .find('.atbdp-accordion-content')
                .removeClass('active');
            $(data_target).toggleClass('active');

            $(data_parent)
                .find('.atbdp-accordion-content')
                .slideUp();
            $(data_target).slideToggle();
        }
    });

    // Themes & Extensions
    // ------------------------------------------------
    // My themes and extensions

    // button primary
    const primary_button = $(
        '#primary_color, #primary_hover_color, #back_primary_color, #back_primary_hover_color, #border_primary_color, #border_primary_hover_color, #primary_example'
    );
    const secondary_button = $(
        '#secondary_color, #secondary_hover_color, #back_secondary_color, #back_secondary_hover_color, #secondary_border_color, #secondary_border_hover_color, #secondary_example'
    );
    const danger_button = $(
        '#danger_color, #danger_hover_color, #back_danger_color, #back_danger_hover_color, #danger_border_color, #danger_border_hover_color, #danger_example'
    );
    const success_button = $(
        '#success_color, #success_hover_color, #back_success_color, #back_success_hover_color, #border_success_color, #border_success_hover_color, #success_example'
    );
    const primary_outline = $(
        '#priout_color, #priout_hover_color, #back_priout_color, #back_priout_hover_color, #border_priout_color, #border_priout_hover_color, #priout_example'
    );
    const primary_outline_light = $(
        '#prioutlight_color, #prioutlight_hover_color, #back_prioutlight_color, #back_prioutlight_hover_color, #border_prioutlight_color, #border_prioutlight_hover_color, #prioutlight_example'
    );
    const danger_outline = $(
        '#danout_color, #danout_hover_color, #back_danout_color, #back_danout_hover_color, #border_danout_color, #border_danout_hover_color, #danout_example'
    );
    primary_button.hide();
    secondary_button.hide();
    danger_button.hide();
    success_button.hide();
    primary_outline.hide();
    primary_outline_light.hide();
    danger_outline.hide();
    $('select[name="button_type"]').on('change', function () {
        if ($(this).val() === 'solid_primary') {
            primary_button.show();
            secondary_button.hide();
            danger_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === 'solid_secondary') {
            secondary_button.show();
            primary_button.hide();
            danger_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === 'solid_danger') {
            danger_button.show();
            primary_button.hide();
            secondary_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === 'solid_success') {
            success_button.show();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === 'primary_outline') {
            primary_outline.show();
            success_button.hide();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === 'primary_outline_light') {
            primary_outline_light.show();
            success_button.hide();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline.hide();
            danger_outline.hide();
        } else if ($(this).val() === 'danger_outline') {
            danger_outline.show();
            success_button.hide();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
        } else {
            primary_button.hide();
            secondary_button.hide();
            danger_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        }
    });
    if ($('select[name="button_type"]').val() === 'solid_primary') {
        primary_button.show();
    } else if ($('select[name="button_type"]').val() === 'solid_secondary') {
        secondary_button.show();
    } else if ($('select[name="button_type"]').val() === 'solid_danger') {
        danger_button.show();
    } else if ($('select[name="button_type"]').val() === 'solid_success') {
        success_button.show();
    } else if ($('select[name="button_type"]').val() === 'primary_outline') {
        primary_outline.show();
    } else if ($('select[name="button_type"]').val() === 'primary_outline_light') {
        primary_outline_light.show();
    } else if ($('select[name="button_type"]').val() === 'danger_outline') {
        danger_outline.show();
    }

    // Helpers
    // -----------------------------------
    // toggle_section
    function toggle_section(show_if_value, subject_elm, terget_elm) {
        if (show_if_value === subject_elm.val()) {
            terget_elm.show();
        } else {
            terget_elm.hide();
        }
    }


    // License Authentication
    // ----------------------------------------------------------
    // atbdp_get_license_authentication
    let is_sending = false;
    $('#atbdp-directorist-license-login-form').on('submit', function (e) {
        e.preventDefault();
        if (is_sending) {
            return;
        }

        const form = $(this);
        const submit_button = form.find('button[type="submit"]');

        const form_data = {
            action: 'atbdp_authenticate_the_customer',
            username: form.find('input[name="username"]').val(),
            password: form.find('input[name="password"]').val(),
        };

        $('.atbdp-form-feedback').html('');

        is_sending = true;
        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                submit_button.prepend(
                    '<span class="atbdp-loading"><span class="fas fa-spinner fa-spin"></span></span>'
                );
                submit_button.attr('disabled', true);
            },
            success(response) {
                // console.log(response);
                if (response.has_previous_subscriptions) {
                    location.reload();
                    return;
                }

                is_sending = false;
                submit_button.attr('disabled', false);
                submit_button.find('.atbdp-loading').remove();

                if (response.status.log) {
                    for (const feedback in response.status.log) {
                        console.log(response.status.log[feedback]);
                        const alert_type = response.status.log[feedback].type === 'success';
                        let alert = `<div class="atbdp-form-alert"`;
                        const alert_message = response.status.log[feedback].message;
                        alert = `<div class="atbdp-form-alert ${alert_type}">${alert_message}<div>`;

                        $('.atbdp-form-feedback').append(alert);
                    }
                }

                if (response.status.success) {
                    form.attr('id', 'atbdp-product-download-form');
                    form.find('.atbdp-form-page').remove();

                    const form_response_page = form.find('.atbdp-form-response-page');
                    form_response_page.removeClass('atbdp-d-none');

                    // Append Response
                    form_response_page.append('<div class="atbdp-form-feedback"></div>');

                    const themes =
                        response.license_data && response.license_data.themes
                            ? response.license_data.themes
                            : [];
                    const plugins =
                        response.license_data && response.license_data.plugins
                            ? response.license_data.plugins
                            : [];

                    const total_theme = themes.length;
                    const total_plugin = plugins.length;

                    // console.log( { plugins, themes } );

                    if (!plugins.length && !themes.length) {
                        var title =
                            '<h3 class="h3 form-header-title">There is no product in your purchase, redirecting...</h3>';
                        form_response_page.find('.atbdp-form-feedback').append(title);
                        location.reload();

                        return;
                    }

                    var title = '<h3 class="h3 form-header-title">Activate your products</h3>';
                    form_response_page.find('.atbdp-form-feedback').append(title);

                    // Show Log - Themes
                    if (total_theme) {
                        const theme_section =
                            '<div class="atbdp-checklist-section atbdp-themes-list-section"></div>';
                        form_response_page.find('.atbdp-form-feedback').append(theme_section);

                        const theme_title = `<h4 class="atbdp-theme-title">Themes <span class="atbdp-count">(${themes.length
                            })</span></h4>`;
                        const theme_check_lists =
                            '<ul class="atbdp-check-lists atbdp-themes-list"></ul>';

                        form_response_page
                            .find('.atbdp-themes-list-section')
                            .append(theme_title);
                        form_response_page
                            .find('.atbdp-themes-list-section')
                            .append(theme_check_lists);

                        var counter = 0;
                        for (const theme of themes) {
                            // console.log( theme );
                            var checkbox = `<input type="checkbox" class="atbdp-checkbox atbdp-theme-checkbox-item-${theme.item_id
                                }" value="${theme.item_id}" id="${theme.item_id}">`;
                            var label = `<label for="${theme.item_id}">${theme.title
                                }</label>`;
                            var list_action = `<span class="atbdp-list-action">${checkbox}</span> `;
                            var li = `<li class="atbdp-check-list-item atbdp-theme-checklist-item check-list-item-${theme.item_id
                                }">${list_action}${label}</li>`;
                            form_response_page.find('.atbdp-themes-list').append(li);
                            counter++;
                        }
                    }

                    // Show Log - Extensions
                    if (total_plugin) {
                        const plugin_section =
                            '<div class="atbdp-checklist-section atbdp-extensions-list-section"></div>';
                        form_response_page.find('.atbdp-form-feedback').append(plugin_section);

                        const plugin_title = `<h4 class="atbdp-extension-title">Extensions <span class="atbdp-count">(${plugins.length
                            })</span></h4>`;
                        const plugin_check_lists =
                            '<ul class="atbdp-check-lists atbdp-extensions-list"></ul>';

                        form_response_page
                            .find('.atbdp-extensions-list-section')
                            .append(plugin_title);
                        form_response_page
                            .find('.atbdp-extensions-list-section')
                            .append(plugin_check_lists);

                        var counter = 0;
                        for (const extension of plugins) {
                            // console.log( extension );
                            var checkbox = `<input type="checkbox" class="atbdp-checkbox atbdp-plugin-checkbox-item-${extension.item_id
                                }" value="${extension.item_id}" id="${extension.item_id}">`;
                            var list_action = `<span class="atbdp-list-action">${checkbox}</span> `;
                            var label = `<label for="${extension.item_id}">${extension.title
                                }</label>`;
                            var li = `<li class="atbdp-check-list-item atbdp-plugin-checklist-item check-list-item-${extension.item_id
                                }">${list_action}${label}</li>`;

                            form_response_page.find('.atbdp-extensions-list').append(li);
                            counter++;
                        }
                    }

                    const continue_button =
                        '<div class="account-connect__form-btn"><button type="button" class="account-connect__btn atbdp-download-products-btn">Continue <span class="la la-arrow-right"></span></button></div>';
                    const skip_button =
                        '<a href="#" class="atbdp-link atbdp-link-secondery reload">Skip</a>';

                    form_response_page.append(continue_button);
                    form_response_page.append(skip_button);

                    $('.atbdp-download-products-btn').on('click', function (e) {
                        $(this).prop('disabled', true);

                        let skiped_themes = 0;
                        $(
                            '.atbdp-theme-checklist-item .atbdp-list-action .atbdp-checkbox'
                        ).each(function (i, e) {
                            const is_checked = $(e).is(':checked');

                            if (!is_checked) {
                                const id = $(e).attr('id');
                                const list_item = $(`.check-list-item-${id}`);
                                list_item.remove();

                                skiped_themes++;
                            }
                        });

                        let skiped_plugins = 0;
                        $(
                            '.atbdp-plugin-checklist-item .atbdp-list-action .atbdp-checkbox'
                        ).each(function (i, e) {
                            const is_checked = $(e).is(':checked');

                            if (!is_checked) {
                                const id = $(e).attr('id');
                                const list_item = $(`.check-list-item-${id}`);
                                list_item.remove();

                                skiped_plugins++;
                            }
                        });

                        const new_theme_count = total_theme - skiped_themes;
                        const new_plugin_count = total_plugin - skiped_plugins;

                        $('.atbdp-theme-title')
                            .find('.atbdp-count')
                            .html(`(${new_theme_count})`);
                        $('.atbdp-extension-title')
                            .find('.atbdp-count')
                            .html(`(${new_plugin_count})`);

                        $('.atbdp-check-list-item .atbdp-list-action .atbdp-checkbox').css(
                            'display',
                            'none'
                        );
                        $('.atbdp-check-list-item .atbdp-list-action').prepend(
                            '<span class="atbdp-icon atbdp-text-danger"><span class="fas fa-times"></span></span> '
                        );

                        const files_download_states = {
                            succeeded_plugin_downloads: [],
                            failed_plugin_downloads: [],
                            succeeded_theme_downloads: [],
                            failed_theme_downloads: [],
                        };

                        // Download Files
                        var download_files = function (file_list, counter, callback) {
                            if (counter > file_list.length - 1) {
                                if (callback) {
                                    callback();
                                }

                                return;
                            }
                            const next_index = counter + 1;
                            const file_item = file_list[counter];
                            const { file } = file_item;
                            const file_type = file_item.type;

                            const list_item = $(`.check-list-item-${file.item_id}`);
                            const icon_elm = list_item.find(
                                '.atbdp-list-action .atbdp-icon'
                            );
                            const list_checkbox = $(
                                `.atbdp-${file_type}-checkbox-item-${file.item_id}`
                            );
                            const is_checked = list_checkbox.is(':checked');

                            if (!is_checked) {
                                download_files(file_list, next_index, callback);
                                return;
                            }

                            const form_data = {
                                action: 'atbdp_download_file',
                                download_item: file,
                                type: file_type,
                            };
                            jQuery.ajax({
                                type: 'post',
                                url: atbdp_admin_data.ajaxurl,
                                data: form_data,
                                beforeSend() {
                                    icon_elm.removeClass('atbdp-text-danger');
                                    icon_elm.html(
                                        '<span class="fas fa-circle-notch fa-spin"></span>'
                                    );
                                },
                                success(response) {
                                    console.log('success', counter, response);

                                    if (response.status.success) {
                                        icon_elm.addClass('atbdp-text-success');
                                        icon_elm.html(
                                            '<span class="fas fa-check"></span>'
                                        );

                                        if (file_type == 'plugin') {
                                            files_download_states.succeeded_plugin_downloads.push(
                                                file
                                            );
                                        }

                                        if (file_type == 'theme') {
                                            files_download_states.succeeded_theme_downloads.push(
                                                file
                                            );
                                        }
                                    } else {
                                        const msg = `<span class="atbdp-list-feedback atbdp-text-danger">${response.status.message
                                            }</span>`;
                                        list_item.append(msg);
                                        icon_elm.addClass('atbdp-text-danger');
                                        icon_elm.html(
                                            '<span class="fas fa-times"></span>'
                                        );

                                        if (file_type == 'plugin') {
                                            files_download_states.failed_plugin_downloads.push(
                                                file
                                            );
                                        }

                                        if (file_type == 'theme') {
                                            files_download_states.failed_theme_downloads.push(
                                                file
                                            );
                                        }
                                    }

                                    download_files(file_list, next_index, callback);
                                },
                                error(error) {
                                    console.log(error);

                                    icon_elm.addClass('atbdp-text-danger');
                                    icon_elm.html(
                                        '<span class="fas fa-times"></span>'
                                    );
                                },
                            });
                        };

                        // Remove Unnecessary Sections
                        if (!new_theme_count) {
                            $('.atbdp-themes-list-section').remove();
                        }

                        if (!new_plugin_count) {
                            $('.atbdp-extensions-list-section').remove();
                        }

                        if (new_theme_count || new_plugin_count) {
                            const form_header_title = 'Activating your products';
                            form_response_page
                                .find('.atbdp-form-feedback .form-header-title')
                                .html(form_header_title);
                        }

                        const downloading_files = [];

                        // Download Themes
                        if (new_theme_count) {
                            for (const theme of themes) {
                                downloading_files.push({ file: theme, type: 'theme' });
                            }
                        }

                        // Download Plugins
                        if (new_plugin_count) {
                            for (const plugin of plugins) {
                                downloading_files.push({
                                    file: plugin,
                                    type: 'plugin',
                                });
                            }
                        }

                        const self = this;
                        const after_download_callback = function () {
                            // Check invalid themes
                            let all_thmes_are_invalid = false;
                            const failed_download_themes_count =
                                files_download_states.failed_theme_downloads.length;
                            if (
                                new_theme_count &&
                                failed_download_themes_count === new_theme_count
                            ) {
                                all_thmes_are_invalid = true;
                            }

                            // Check invalid plugin
                            let all_plugins_are_invalid = false;
                            const failed_download_plugins_count =
                                files_download_states.failed_plugin_downloads.length;
                            if (
                                new_plugin_count &&
                                failed_download_plugins_count === new_plugin_count
                            ) {
                                all_plugins_are_invalid = true;
                            }

                            let all_products_are_invalid = false;
                            if (all_thmes_are_invalid && all_plugins_are_invalid) {
                                all_products_are_invalid = true;
                            }

                            $(form_response_page)
                                .find(
                                    '.account-connect__form-btn .account-connect__btn'
                                )
                                .remove();

                            const finish_btn_label = all_products_are_invalid
                                ? 'Close'
                                : 'Finish';
                            const finish_btn = `<button type="button" class="account-connect__btn reload">${finish_btn_label}</button>`;
                            $(form_response_page)
                                .find('.account-connect__form-btn')
                                .append(finish_btn);
                        };

                        if (downloading_files.length) {
                            download_files(downloading_files, 0, after_download_callback);
                        }
                    });
                }
            },

            error(error) {
                console.log(error);
                is_sending = false;
                submit_button.attr('disabled', false);
                submit_button.find('.atbdp-loading').remove();
            },
        });
    });

    // Reload Button
    $('body').on('click', '.reload', function (e) {
        e.preventDefault();
        console.log('reloading...');
        location.reload();
    });

    // Extension Update Button
    $('.ext-update-btn').on('click', function (e) {
        e.preventDefault();

        $(this).prop('disabled', true);

        const plugin_key = $(this).data('key');
        const button_default_html = $(this).html();

        const form_data = {
            action: 'atbdp_update_plugins',
        };

        if (plugin_key) {
            form_data.plugin_key = plugin_key;
        }

        const self = this;

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                const icon = '<i class="fas fa-circle-notch fa-spin"></i> Updating';
                $(self).html(icon);
            },
            success(response) {
                console.log(response);

                if (response.status.success) {
                    $(self).html('Updated');

                    location.reload();
                } else {
                    $(self).html(button_default_html);
                    alert(response.status.massage);
                }
            },
            error(error) {
                console.log(error);
                $(self).html(button_default_html);
                $(this).prop('disabled', false);
            },
        });
    });

    // Install Button
    $('.file-install-btn').on('click', function (e) {
        e.preventDefault();

        if ($(this).hasClass('in-progress')) {
            console.log('Wait...');
            return;
        }

        const data_key = $(this).data('key');
        const data_type = $(this).data('type');
        const form_data = {
            action: 'atbdp_install_file_from_subscriptions',
            item_key: data_key,
            type: data_type,
        };
        const btn_default_html = $(this).html();

        ext_is_installing = true;
        const self = this;
        $(this).prop('disabled', true);
        $(this).addClass('in-progress');

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(self).html('Installing');
                const icon = '<i class="fas fa-circle-notch fa-spin"></i> ';

                $(self).prepend(icon);
            },
            success(response) {
                console.log(response);

                if (response.status && !response.status.success && response.status.message) {
                    alert(response.status.message);
                }

                if (response.status && response.status.success) {
                    $(self).html('Installed');
                } else {
                    $(self).html('Failed');
                }

                location.reload();
            },
            error(error) {
                console.log(error);
                $(this).prop('disabled', false);
                $(this).removeClass('in-progress');

                $(self).html(btn_default_html);
            },
        });
    });


    // Plugin Active Button
    $('.plugin-active-btn').on('click', function (e) {
        e.preventDefault();

        if ($(this).hasClass('in-progress')) {
            console.log('Wait...');
            return;
        }

        const data_key = $(this).data('key');
        const form_data = {
            action: 'atbdp_activate_plugin',
            item_key: data_key,
        };
        const btn_default_html = $(this).html();

        const self = this;
        $(this).prop('disabled', true);
        $(this).addClass('in-progress');

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(self).html('Activating');
                const icon = '<i class="fas fa-circle-notch fa-spin"></i> ';

                $(self).prepend(icon);
            },
            success(response) {
                console.log(response);

                // return;

                if (response.status && !response.status.success && response.status.message) {
                    alert(response.status.message);
                }

                if (response.status && response.status.success) {
                    $(self).html('Activated');
                } else {
                    $(self).html('Failed');
                }

                location.reload();
            },
            error(error) {
                console.log(error);
                $(this).prop('disabled', false);
                $(this).removeClass('in-progress');

                $(self).html(btn_default_html);
            },
        });
    });

    // Purchase refresh btn
    $('.purchase-refresh-btn').on('click', function (e) {
        e.preventDefault();

        const purchase_refresh_btn_wrapper = $(this).parent();
        const auth_section = $('.et-auth-section');

        $(purchase_refresh_btn_wrapper).animate(
            {
                width: 0,
            },
            500
        );

        $(auth_section).animate(
            {
                width: 290,
            },
            500
        );
    });

    // et-close-auth-btn
    $('.et-close-auth-btn').on('click', function (e) {
        e.preventDefault();

        const auth_section = $('.et-auth-section');
        const purchase_refresh_btn_wrapper = $('.purchase-refresh-btn-wrapper');

        $(purchase_refresh_btn_wrapper).animate(
            {
                width: 182,
            },
            500
        );

        $(auth_section).animate(
            {
                width: 0,
            },
            500
        );
    });

    // purchase-refresh-form
    $('#purchase-refresh-form').on('submit', function (e) {
        e.preventDefault();
        // console.log( 'purchase-refresh-form' );

        const submit_btn = $(this).find('button[type="submit"]');
        const btn_default_html = submit_btn.html();
        const close_btn = $(this).find('.et-close-auth-btn');
        const form_feedback = $(this).find('.atbdp-form-feedback');

        $(submit_btn).prop('disabled', true);
        $(close_btn).addClass('atbdp-d-none');

        const password = $(this)
            .find('input[name="password"]')
            .val();

        const form_data = {
            action: 'atbdp_refresh_purchase_status',
            password,
        };

        form_feedback.html('');

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(submit_btn).html('<i class="fas fa-circle-notch fa-spin"></i>');
            },
            success(response) {
                console.log(response);

                if (response.status.message) {
                    var feedback_type = response.status.success ? 'success' : 'danger';
                    var message = `<span class="atbdp-text-${feedback_type}">${response.status.message
                        }</span>`;

                    form_feedback.html(message);
                }

                if (response.status.massage) {
                    var feedback_type = response.status.success ? 'success' : 'danger';
                    var message = `<span class="atbdp-text-${feedback_type}">${response.status.massage
                        }</span>`;

                    form_feedback.html(message);
                }

                if (!response.status.success) {
                    $(submit_btn).html(btn_default_html);
                    $(submit_btn).prop('disabled', false);
                    $(close_btn).removeClass('atbdp-d-none');

                    if (response.status.reload) {
                        location.reload();
                    }
                } else {
                    location.reload();
                }
            },
            error(error) {
                console.log(error);

                $(submit_btn).prop('disabled', false);
                $(submit_btn).html(btn_default_html);

                $(close_btn).removeClass('atbdp-d-none');
            },
        });
    });

    // Logout
    $('.subscriptions-logout-btn').on('click', function (e) {
        e.preventDefault();

        const hard_logout = $(this).data('hard-logout');

        const form_data = {
            action: 'atbdp_close_subscriptions_sassion',
            hard_logout,
        };

        const self = this;

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(self).html('<i class="fas fa-circle-notch fa-spin"></i> Logging out');
            },
            success(response) {
                // console.log( response );
                location.reload();
            },
            error(error) {
                console.log(error);
                $(this).prop('disabled', false);
                $(this).removeClass('in-progress');

                $(self).html(btn_default_html);
            },
        });

        // atbdp_close_subscriptions_sassion
    });

    // Form Actions
    // Bulk Actions - My extensions form
    var is_bulk_processing = false;
    $('#atbdp-my-extensions-form').on('submit', function (e) {
        e.preventDefault();

        if (is_bulk_processing) { return; }

        const task = $(this)
            .find('select[name="bulk-actions"]')
            .val();
        const plugins_items = [];

        $(this)
            .find('.extension-name-checkbox')
            .each(function (i, e) {
                const is_checked = $(e).is(':checked');
                const id = $(e).attr('id');

                if (is_checked) {
                    plugins_items.push(id);
                }
            });

        if (!task.length || !plugins_items.length) {
            return;
        }

        const self = this;
        is_bulk_processing = true;
        form_data = {
            action: 'atbdp_plugins_bulk_action',
            task,
            plugin_items: plugins_items,
        };

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(self)
                    .find('button[type="submit"]')
                    .prepend(
                        '<span class="atbdp-icon"><span class="fas fa-circle-notch fa-spin"></span></span> '
                    );
            },
            success(response) {
                // console.log( response );
                $(self)
                    .find('button[type="submit"] .atbdp-icon')
                    .remove();
                location.reload();
            },
            error(error) {
                console.log(error);
                uninstalling = false;
            },
        });

        // console.log( task, plugins_items );
    });

    // Bulk Actions - My extensions form
    var is_bulk_processing = false;
    $('#atbdp-my-subscribed-extensions-form').on('submit', function (e) {
        e.preventDefault();

        if (is_bulk_processing) { return; }

        const self = this;
        const task = $(this)
            .find('select[name="bulk-actions"]')
            .val();

        const plugins_items = [];
        const tergeted_items_elm = '.extension-name-checkbox';

        $(self)
            .find(tergeted_items_elm)
            .each(function (i, e) {
                const is_checked = $(e).is(':checked');
                const key = $(e).attr('name');

                if (is_checked) {
                    plugins_items.push(key);
                }
            });

        if (!task.length || !plugins_items.length) {
            return;
        }

        // Before Install
        $(this)
            .find('.file-install-btn')
            .prop('disabled', true)
            .addClass('in-progress');

        const loading_icon = '<span class="atbdp-icon"><span class="fas fa-circle-notch fa-spin"></span></span> ';

        $(this)
            .find('button[type="submit"]')
            .prop('disabled', true)
            .prepend(loading_icon);

        is_bulk_processing = true;
        const after_bulk_process = function () {
            is_bulk_processing = false;

            $(self)
                .find('button[type="submit"]')
                .find('.atbdp-icon')
                .remove();
            $(self)
                .find('button[type="submit"]')
                .prop('disabled', false);

            location.reload();
        };

        plugins_bulk_actions('install', plugins_items, after_bulk_process);
    });

    // Bulk Actions - Required extensions form
    var is_bulk_processing = false;
    $('#atbdp-required-extensions-form').on('submit', function (e) {
        e.preventDefault();

        if (is_bulk_processing) { return; }

        const self = this;
        const task = $(this)
            .find('select[name="bulk-actions"]')
            .val();

        const plugins_items = [];
        const tergeted_items_elm = ('install' === task) ? '.extension-install-checkbox' : '.extension-activate-checkbox';

        $(self)
            .find(tergeted_items_elm)
            .each(function (i, e) {
                const is_checked = $(e).is(':checked');
                const key = $(e).attr('value');

                if (is_checked) {
                    plugins_items.push(key);
                }
            });

        if (!task.length || !plugins_items.length) {
            return;
        }

        // Before Install
        $(this)
            .find('.file-install-btn')
            .prop('disabled', true)
            .addClass('in-progress');

        $(this)
            .find('.plugin-active-btn')
            .prop('disabled', true)
            .addClass('in-progress');


        const loading_icon = '<span class="atbdp-icon"><span class="fas fa-circle-notch fa-spin"></span></span> ';
        $(this)
            .find('button[type="submit"]')
            .prop('disabled', true)
            .prepend(loading_icon);

        is_bulk_processing = true;
        const after_bulk_process = function () {
            is_bulk_processing = false;

            $(self)
                .find('button[type="submit"]')
                .find('.atbdp-icon')
                .remove();

            $(self)
                .find('button[type="submit"]')
                .prop('disabled', false);

            location.reload();
        };

        const available_task_list = ['install', 'activate'];

        if ((available_task_list.includes(task))) {
            plugins_bulk_actions(task, plugins_items, after_bulk_process);
        }
    });

    // plugins_bulk__actions
    function plugins_bulk_actions(task, plugins_items, after_plugins_install) {

        const action = {
            install: 'atbdp_install_file_from_subscriptions',
            activate: 'atbdp_activate_plugin',
        };

        const btnLabelOnProgress = {
            install: 'Installing',
            activate: 'Activating',
        };

        const btnLabelOnSuccess = {
            install: 'Installed',
            activate: 'Activated',
        };

        const processStartBtn = {
            install: '.file-install-btn',
            activate: '.plugin-active-btn',
        };

        var bulk_task = function (plugins, counter, callback) {

            if (counter > plugins.length - 1) {
                if (callback) { callback(); }
                return;
            }

            const current_item = plugins[counter];
            const action_wrapper_key = ('install' === task) ? plugins[counter] : plugins[counter].replace(/\/.+$/g, '');
            const action_wrapper = $(`.ext-action-${action_wrapper_key}`);
            const action_btn = action_wrapper.find(processStartBtn[task]);
            const next_index = counter + 1;
            const form_action = (action[task]) ? action[task] : '';

            form_data = {
                action: form_action,
                item_key: current_item,
                type: 'plugin',
            };

            jQuery.ajax({
                type: 'post',
                url: atbdp_admin_data.ajaxurl,
                data: form_data,
                beforeSend() {
                    action_btn.html(
                        `<span class="atbdp-icon">
                        <span class="fas fa-circle-notch fa-spin"></span>
                    </span> ${btnLabelOnProgress[task]}`
                    );
                },

                success(response) {
                    console.log({ response });
                    if (response.status.success) {
                        action_btn.html(btnLabelOnSuccess[task]);
                    } else {
                        action_btn.html('Failed');
                    }

                    bulk_task(plugins, next_index, callback);
                },

                error(error) {
                    console.log(error);
                },
            });
        };

        bulk_task(plugins_items, 0, after_plugins_install);
    }

    // Ext Actions | Uninstall
    var uninstalling = false;
    $('.ext-action-uninstall').on('click', function (e) {
        e.preventDefault();
        if (uninstalling) {
            return;
        }

        const data_target = $(this).data('target');

        const form_data = {
            action: 'atbdp_plugins_bulk_action',
            task: 'uninstall',
            plugin_items: [data_target],
        };

        const self = this;
        uninstalling = true;

        jQuery.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(self).prepend(
                    '<span class="atbdp-icon"><span class="fas fa-circle-notch fa-spin"></span></span> '
                );
            },
            success(response) {
                // console.log( response );
                $(self)
                    .closest('.ext-action')
                    .find('.ext-action-drop')
                    .removeClass('active');
                location.reload();
            },
            error(error) {
                console.log(error);
                uninstalling = false;
            },
        });
    });

    // Bulk checkbox toggle
    $('#atbdp-my-extensions-form')
        .find('input[name="select-all"]')
        .on('change', function (e) {
            const is_checked = $(this).is(':checked');

            if (is_checked) {
                $('#atbdp-my-extensions-form')
                    .find('.extension-name-checkbox')
                    .prop('checked', true);
            } else {
                $('#atbdp-my-extensions-form')
                    .find('.extension-name-checkbox')
                    .prop('checked', false);
            }
        });

    $('#atbdp-my-subscribed-extensions-form')
        .find('input[name="select-all"]')
        .on('change', function (e) {
            const is_checked = $(this).is(':checked');

            if (is_checked) {
                $('#atbdp-my-subscribed-extensions-form')
                    .find('.extension-name-checkbox')
                    .prop('checked', true);
            } else {
                $('#atbdp-my-subscribed-extensions-form')
                    .find('.extension-name-checkbox')
                    .prop('checked', false);
            }
        });

    $('#atbdp-required-extensions-form')
        .find('input[name="select-all"]')
        .on('change', function (e) {
            const is_checked = $(this).is(':checked');

            if (is_checked) {
                $('#atbdp-required-extensions-form')
                    .find('.extension-name-checkbox')
                    .prop('checked', true);
            } else {
                $('#atbdp-required-extensions-form')
                    .find('.extension-name-checkbox')
                    .prop('checked', false);
            }
        });

    //
    $('.ext-action-drop').each(function (i, e) {
        $(e).on('click', function (elm) {
            elm.preventDefault();

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $('.ext-action-drop').removeClass('active');
                $(this).addClass('active');
            }
        });
    });

    // Theme Activation
    let theme_is_activating = false;
    $('.theme-activate-btn').on('click', function (e) {
        e.preventDefault();

        if (theme_is_activating) {
            return;
        }

        const data_target = $(this).data('target');
        if (!data_target) {
            return;
        }
        if (!data_target.length) {
            return;
        }

        const form_data = {
            action: 'atbdp_activate_theme',
            theme_stylesheet: data_target,
        };

        const self = this;
        theme_is_activating = true;

        $.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(self).prepend(
                    '<span class="atbdp-icon"><span class="fas fa-circle-notch fa-spin"></span></span> '
                );
            },
            success(response) {
                console.log({ response });
                $(self)
                    .find('.atbdp-icon')
                    .remove();

                if (response.status && response.status.success) {
                    location.reload();
                }
            },
            error(error) {
                console.log({ error });
                theme_is_activating = false;
                $(self)
                    .find('.atbdp-icon')
                    .remove();
            },
        });
    });

    // Theme Update
    $('.theme-update-btn').on('click', function (e) {
        e.preventDefault();

        $(this).prop('disabled', true);
        if ($(this).hasClass('in-progress')) {
            return;
        }

        const theme_stylesheet = $(this).data('target');
        const button_default_html = $(this).html();
        const form_data = { action: 'atbdp_update_theme' };

        if (theme_stylesheet) {
            form_data.theme_stylesheet = theme_stylesheet;
        }

        const self = this;
        $(this).addClass('in-progress');

        $.ajax({
            type: 'post',
            url: atbdp_admin_data.ajaxurl,
            data: form_data,
            beforeSend() {
                $(self).html(
                    '<span class="atbdp-icon"><span class="fas fa-circle-notch fa-spin"></span></span> Updating'
                );
            },
            success(response) {
                console.log({ response });

                if (response.status && response.status.success) {
                    $(self).html('Updated');
                    location.reload();
                } else {
                    $(self).removeClass('in-progress');
                    $(self).html(button_default_html);
                    $(self).prop('disabled', false);

                    alert(response.status.message);
                }
            },
            error(error) {
                console.log({ error });
                $(self).removeClass('in-progress');
                $(self).html(button_default_html);
                $(self).prop('disabled', false);
            },
        });
    });


    //button primary
    // primary_button = $("#primary_color, #primary_hover_color, #back_primary_color, #back_primary_hover_color, #border_primary_color, #border_primary_hover_color, #primary_example");
    // secondary_button = $("#secondary_color, #secondary_hover_color, #back_secondary_color, #back_secondary_hover_color, #secondary_border_color, #secondary_border_hover_color, #secondary_example");
    // danger_button = $("#danger_color, #danger_hover_color, #back_danger_color, #back_danger_hover_color, #danger_border_color, #danger_border_hover_color, #danger_example");
    // success_button = $("#success_color, #success_hover_color, #back_success_color, #back_success_hover_color, #border_success_color, #border_success_hover_color, #success_example");
    // primary_outline = $("#priout_color, #priout_hover_color, #back_priout_color, #back_priout_hover_color, #border_priout_color, #border_priout_hover_color, #priout_example");
    // primary_outline_light = $("#prioutlight_color, #prioutlight_hover_color, #back_prioutlight_color, #back_prioutlight_hover_color, #border_prioutlight_color, #border_prioutlight_hover_color, #prioutlight_example");
    // danger_outline = $("#danout_color, #danout_hover_color, #back_danout_color, #back_danout_hover_color, #border_danout_color, #border_danout_hover_color, #danout_example");
    primary_button.hide();
    secondary_button.hide();
    danger_button.hide();
    success_button.hide();
    primary_outline.hide();
    primary_outline_light.hide();
    danger_outline.hide();
    $('select[name="button_type"]').on("change", function () {
        if ($(this).val() === "solid_primary") {
            primary_button.show();
            secondary_button.hide();
            danger_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === "solid_secondary") {
            secondary_button.show();
            primary_button.hide();
            danger_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === "solid_danger") {
            danger_button.show();
            primary_button.hide();
            secondary_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === "solid_success") {
            success_button.show();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === "primary_outline") {
            primary_outline.show();
            success_button.hide();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        } else if ($(this).val() === "primary_outline_light") {
            primary_outline_light.show();
            success_button.hide();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline.hide();
            danger_outline.hide();
        } else if ($(this).val() === "danger_outline") {
            danger_outline.show();
            success_button.hide();
            danger_button.hide();
            primary_button.hide();
            secondary_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
        } else {
            primary_button.hide();
            secondary_button.hide();
            danger_button.hide();
            success_button.hide();
            primary_outline.hide();
            primary_outline_light.hide();
            danger_outline.hide();
        }
    });

    if ($('select[name="button_type"]').val() === "solid_primary") {
        primary_button.show();
    } else if ($('select[name="button_type"]').val() === "solid_secondary") {
        secondary_button.show();
    } else if ($('select[name="button_type"]').val() === "solid_danger") {
        danger_button.show();
    } else if ($('select[name="button_type"]').val() === "solid_success") {
        success_button.show();
    } else if ($('select[name="button_type"]').val() === "primary_outline") {
        primary_outline.show();
    } else if ($('select[name="button_type"]').val() === "primary_outline_light") {
        primary_outline_light.show();
    } else if ($('select[name="button_type"]').val() === "danger_outline") {
        danger_outline.show();
    }


    // Helpers
    // -----------------------------------
    // toggle_section
    function toggle_section(show_if_value, subject_elm, terget_elm) {
        if (show_if_value === subject_elm.val()) { terget_elm.show(); }
        else { terget_elm.hide(); }
    }

    // Custom Tab Support Status
    $(".atbds_wrapper a.nav-link").on("click", function (e) {
        e.preventDefault();

        console.log($(this).data("tabarea"));
        const atbds_tabParent = $(this).parent().parent().find("a.nav-link");
        var $href = $(this).attr("href");
        $(atbds_tabParent).removeClass("active");
        $(this).addClass("active");
        console.log($(".tab-content[data-tabarea='atbds_system-info-tab']"));

        switch ($(this).data("tabarea")) {
            case "atbds_system-status-tab":
                $(
                    ".tab-content[data-tabarea='atbds_system-status-tab'] >.tab-pane"
                ).removeClass("active show");
                $(
                    ".tab-content[data-tabarea='atbds_system-status-tab'] " + $href
                ).addClass("active show");
                break;
            case "atbds_system-info-tab":
                $(
                    ".tab-content[data-tabarea='atbds_system-info-tab'] >.tab-pane"
                ).removeClass("active show");
                $(
                    ".tab-content[data-tabarea='atbds_system-info-tab'] " + $href
                ).addClass("active show");
                break;
            default:
                break;
        }
    });

    // Custom Tooltip Support Added
    $(".atbds_tooltip").on("hover", function () {
        const toolTipLabel = $(this).data("label");
        console.log(toolTipLabel);
        $(this).find(".atbds_tooltip__text").text(toolTipLabel);
        $(this).find(".atbds_tooltip__text").addClass("show");
    });

    $(".atbds_tooltip").on("mouseleave", function () {
        $(".atbds_tooltip__text").removeClass("show");
    });

})(jQuery);