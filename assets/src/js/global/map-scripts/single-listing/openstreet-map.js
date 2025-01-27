/* Single listing OSMap */

(function ($) {
    jQuery(document).ready(function () {
        // Localized Data
        if ($('.directorist-single-map').length) {
            document.querySelectorAll('.directorist-single-map').forEach(mapElm => {
                const mapData = JSON.parse(mapElm.getAttribute('data-map'));
                const loc_default_latitude = parseFloat(mapData.default_latitude);
                const loc_default_longitude = parseFloat(mapData.default_longitude);
                let loc_manual_lat = parseFloat(mapData.manual_lat);
                let loc_manual_lng = parseFloat(mapData.manual_lng);
                const loc_map_zoom_level = parseInt(mapData.map_zoom_level);
                const {
                    display_map_info
                } = mapData;
                const {
                    cat_icon
                } = mapData;
                const {
                    info_content
                } = mapData;

                loc_manual_lat = isNaN(loc_manual_lat) ? loc_default_latitude : loc_manual_lat;
                loc_manual_lng = isNaN(loc_manual_lng) ? loc_default_longitude : loc_manual_lng;

                $manual_lat = $('#manual_lat');
                $manual_lng = $('#manual_lng');

                saved_lat_lng = {
                    lat: loc_manual_lat,
                    lng: loc_manual_lng,
                };

                function mapLeaflet(lat, lon) {
                    const fontAwesomeIcon = L.divIcon({
                        html: `<div class="atbd_map_shape"><span class="">${cat_icon}</span></div>`,
                        iconSize: [20, 20],
                        className: 'myDivIcon',
                    });

                    const mymap = L.map(mapElm).setView([lat, lon], loc_map_zoom_level);

                    if (display_map_info) {
                        L.marker([lat, lon], {
                                icon: fontAwesomeIcon
                            })
                            .addTo(mymap)
                            .bindPopup(info_content);
                    } else {
                        L.marker([lat, lon], {
                            icon: fontAwesomeIcon
                        }).addTo(mymap);
                    }

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    }).addTo(mymap);
                }

                mapLeaflet(loc_manual_lat, loc_manual_lng);
            })
        }
    });
})(jQuery);