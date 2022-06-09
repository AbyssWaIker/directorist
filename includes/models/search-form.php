<?php
/**
 * @author wpWax
 */

namespace wpWax\Directorist\Model;

use Directorist\Script_Helper;
use Directorist\Helper;

if ( ! defined( 'ABSPATH' ) ) exit;

class Search_Form {

	/**
	 * Load deprecated methods to avoid fatal error.
	 */
	use Deprecated_Search_Form;

	/**
	 * Singleton instance of the class.
	 *
	 * @var Search_Form|null
	 */
	protected static $instance = null;

	/**
	 * Data is based on shortcode attributes and settings.
	 *
	 * @var array
	 */
	public $data = [];

	/**
	 * In which page this form is being displayed, possible values: shortcode, all_listings, search_result
	 *
	 * @var string
	 */
	public $source;


	public $current_directory_type;
	public $form_data;

	public $atts;


	private function __construct() {

	}

	public static function instance() {
		if ( null == self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;
	}

	public function display_title_area() {
		return $this->data['show_title_subtitle'] == 'yes' ? true : false;
	}

	public function dispaly_search_button() {
		return $this->data['search_button'] == 'yes' ? true : false;
	}

	public function dispaly_search_button_icon() {
		$search_button_icon = $this->data['display_search_button_icon'];
		return !empty( $search_button_icon ) ? true : false;
	}

	public function dispaly_more_filters_button() {
		return $this->data['more_filters_button'] == 'yes' ? true : false;
	}

	public function dispaly_more_filters_button_icon() {
		$more_filters_icon = $this->data['display_more_filter_icon'];
		return !empty( $more_filters_icon ) ? true : false;
	}

	public function display_reset_filter_button() {
		return $this->data['reset_filters_button'] == 'yes' ? true : false;
	}

	public function display_apply_filter_button() {
		return $this->data['apply_filters_button'] == 'yes' ? true : false;
	}

	public function dispaly_popular_categories() {
		return $this->data['show_popular_category'] == 'yes' ? true : false;
	}

	public function search_bar_title_label() {
		return $this->data['search_bar_title'];
	}

	public function search_bar_subtitle_label() {
		return $this->data['search_bar_sub_title'];
	}

	public function search_button_label() {
		return $this->data['search_button_text'];
	}

	public function more_filters_button_label() {
		return $this->data['more_filters_text'];
	}

	public function reset_filters_button_label() {
		return $this->data['reset_filters_text'];
	}

	public function apply_filters_button_label() {
		return $this->data['apply_filters_text'];
	}

	public function is_search_result_page() {
		return atbdp_is_page( 'search_result' );
	}

	public function filter_open_method() {
		return $this->data['more_filters_display'];
	}

	public function category_id() {
		return ( $this->source == 'all_listings' ) ? 'cat-type' : '';
	}

	public function category_class() {
		return ( $this->source == 'all_listings' ) ? 'directory_field bdas-category-search' : 'search_fields directorist-category-select';
	}

	public function location_id() {
		return ( $this->source == 'all_listings' ) ? 'loc-type' : '';
	}

	public function location_class() {
		return ( $this->source == 'all_listings' ) ? 'directory_field bdas-category-location' : 'search_fields directorist-location-select';
	}

	public function currency_symbol() {
		return atbdp_currency_symbol( get_directorist_option( 'g_currency', 'USD' ) );
	}

	public function categories_fields() {
		return search_category_location_filter( $this->search_category_location_args(), ATBDP_CATEGORY );
	}

	public function locations_fields() {
		return search_category_location_filter( $this->search_category_location_args(), ATBDP_LOCATION );
	}

	public function setup_data( $args = [] ) {
		$defaults = [
			'source'                  => 'shortcode', // shortcode, all_listings, search_result
			'current_directory_type'  => '',
			'shortcode_atts'          => [],
		];

		$args = wp_parse_args( $args, $defaults );

		$this->atts   = $args['shortcode_atts'];
		$this->source = $args['source'];
		$this->data   = apply_filters( 'directorist_search_form_data', $this->build_data( $args['shortcode_atts'] ), $args );

		$this->current_directory_type = $this->build_current_directory_type( $args['current_directory_type'] );
		$this->form_data = $this->build_form_data();
	}

	public function get_current_directory_type() {
		return $this->current_directory_type;
	}

	public function get_default_listing_type() {
		// deprecated
		return $this->get_current_directory_type();
	}

	public function build_current_directory_type( $directory_type = '' ) {
		if ( $directory_type ) {
			// For listings and search result page
			$type = $directory_type;
		} elseif( $this->data['default_directory_type'] ) {
			// For shortcode when value is given
			$type = get_term_by( 'slug', $this->data['default_directory_type'], ATBDP_TYPE );
			return $type->term_taxonomy_id;
		} else {
			$types = get_terms( ['taxonomy' => ATBDP_TYPE, 'hide_empty' => false] );
			foreach ( $types as $type ) {
				$is_default = get_term_meta( $type->term_id, '_default', true );
				if ( $is_default ) {
					$type = $type->term_id;
					break;
				}
			}
		}
		return $type;
	}

	/**
	 * Applicaple only for search form shortcode.
	 *
	 * @return array
	 */

	public function get_directory_types() {
		$args =[
			'taxonomy'   => ATBDP_TYPE,
			'hide_empty' => false,
		];

		if( $this->data['directory_types'] ) {
			$args['slug'] = explode( ',', $this->data['directory_types'] );
		}

		return get_terms( $args );
	}

	public function get_listing_type_data() {
		$listing_types = array();
		$all_types = $this->get_directory_types();

		foreach ( $all_types as $type ) {
			$listing_types[ $type->term_id ] = [
				'term' => $type,
				'name' => $type->name,
				'data' => get_term_meta( $type->term_id, 'general_config', true ),
			];
		}
		return $listing_types;
	}

	public function reset_data() {
		$this->setup_data();
	}

	private function build_data( $shortcode_atts ) {
		$options = [];

		if ( $this->source == 'shortcode' ) {
			$options = $this->get_search_form_options();
		} elseif ( $this->source == 'search_result' ) {
			$options = $this->get_search_result_options();
		} elseif ( $this->source == 'all_listings' ) {
			$options = $this->get_all_listings_options();
		}

		$shortcode_data = $this->get_shortcode_atts( $shortcode_atts, $options );

		$data = [
			'show_title_subtitle'     => $shortcode_data['show_title_subtitle'],
			'search_bar_title'        => $shortcode_data['search_bar_title'],
			'search_bar_sub_title'    => $shortcode_data['search_bar_sub_title'],
			'search_button'           => $shortcode_data['search_button'],
			'search_button_text'      => $shortcode_data['search_button_text'],
			'more_filters_button'     => $shortcode_data['more_filters_button'],
			'more_filters_text'       => $shortcode_data['more_filters_text'],
			'logged_in_user_only'     => $shortcode_data['logged_in_user_only'],
			'redirect_page_url'       => $shortcode_data['redirect_page_url'],
			'directory_types'         => $shortcode_data['directory_type'],
			'default_directory_type'  => $shortcode_data['default_directory_type'],
			'show_popular_category'   => $shortcode_data['show_popular_category'],

			'reset_filters_button'    => $shortcode_data['reset_filters_button'],
			'apply_filters_button'    => $shortcode_data['apply_filters_button'],
			'reset_filters_text'      => $shortcode_data['reset_filters_text'],
			'apply_filters_text'      => $shortcode_data['apply_filters_text'],
			'more_filters_display'    => $shortcode_data['more_filters_display'],
			'display_more_filter_icon'   => $options['display_search_button_icon'],
			'display_search_button_icon' => $options['display_search_button_icon'],
		];

		return $data;
	}

	public function get_shortcode_atts( $atts = [], $options ) {
		$defaults = [
			'show_title_subtitle'     => ( $this->source == 'shortcode' ) ? 'yes' : '',
			'search_bar_title'        => get_directorist_option( 'search_title', __( 'Search here', 'directorist' ) ),
			'search_bar_sub_title'    => get_directorist_option( 'search_subtitle', __( 'Find the best match of your interest', 'directorist' ) ),
			'search_button'           => get_directorist_option( 'search_button', 1 ) ? 'yes' : '',
			'search_button_text'      => get_directorist_option( 'search_listing_text', __( 'Search Listing', 'directorist') ),
			'more_filters_button'     => $options['more_filters_button'] ? 'yes' : '',
			'more_filters_text'       => get_directorist_option( 'search_more_filters', __( 'More Filters', 'directorist') ),
			'logged_in_user_only'     => '',
			'redirect_page_url'       => '',
			'directory_type'          => '',
			'default_directory_type'  => '',
			'show_popular_category'	  => ( $this->source == 'shortcode' ) && get_directorist_option( 'show_popular_category', 1 ) ? 'yes' : '',

			'reset_filters_button'    => array_intersect( ['reset_button', 'search_reset_filters'], $options['search_filters'] ) ? 'yes' : '',
			'apply_filters_button'    => array_intersect( ['apply_button', 'search_apply_filters'], $options['search_filters'] ) ? 'yes' : '',
			'reset_filters_text'      => $options['reset_filters_text'],
			'apply_filters_text'      => $options['apply_filters_text'],
			'more_filters_display'    => $options['open_filter_fields'],
		];

		return shortcode_atts( $defaults, $atts );
	}

	public function get_all_listings_options() {
		$options = [
			'search_filters'             => get_directorist_option( 'listings_filters_button', ['search_reset_filters', 'search_apply_filters'] ),
			'more_filters_button'        => get_directorist_option( 'listing_filters_button', 1 ),
			'reset_filters_text'         => get_directorist_option( 'listings_reset_text', __( 'Reset Filters', 'directorist')),
			'apply_filters_text'         => get_directorist_option( 'listings_apply_text', __( 'Apply Filters', 'directorist' ) ),
			'display_more_filter_icon'   => get_directorist_option( 'listing_filters_icon', 1 ),
			'display_search_button_icon' => get_directorist_option( 'listing_filters_icon', 1 ),
			'open_filter_fields'         => get_directorist_option( 'listings_display_filter', 'sliding' ),
		];

		return $options;
	}

	public function get_search_result_options() {
		$options = [
			'search_filters'             => get_directorist_option( 'search_result_filters_button', ['reset_button', 'apply_button'], true ),
			'more_filters_button'        => get_directorist_option( 'search_result_filters_button_display', 1 ),
			'reset_filters_text'         => get_directorist_option( 'sresult_reset_text', __( 'Reset Filters', 'directorist')),
			'apply_filters_text'         => get_directorist_option( 'sresult_apply_text', __( 'Apply Filters', 'directorist' ) ),
			'display_more_filter_icon'   => get_directorist_option( 'listing_filters_icon', 1 ),
			'display_search_button_icon' => get_directorist_option( 'listing_filters_icon', 1 ),
			'open_filter_fields'         => get_directorist_option( 'listings_display_filter', 'sliding' ),
		];

		return $options;
	}

	public function get_search_form_options() {
		$options = [
			'search_filters'             => get_directorist_option( 'search_filters', ['search_reset_filters', 'search_apply_filters'], true ),
			'more_filters_button'        => get_directorist_option( 'search_more_filter', 1 ),
			'reset_filters_text'         => get_directorist_option( 'search_reset_text', __( 'Reset Filters', 'directorist')),
			'apply_filters_text'         => get_directorist_option( 'search_apply_filter', __( 'Apply Filters', 'directorist' ) ),
			'display_more_filter_icon'   => get_directorist_option( 'search_more_filter_icon', 1 ),
			'display_search_button_icon' => get_directorist_option( 'search_button_icon', 1 ),
			'open_filter_fields'         => get_directorist_option( 'home_display_filter', 'sliding' ),
		];

		return $options;
	}

	public function build_form_data() {
		$form_data          = array();
		$search_form_fields     = get_term_meta( $this->current_directory_type, 'search_form_fields', true );
		$submission_form_fields = get_term_meta( $this->current_directory_type, 'submission_form_fields', true );

		if ( !empty( $search_form_fields['fields'] ) ) {

			foreach ( $search_form_fields['fields'] as $key => $value ) {

				if ( ! is_array( $value) ) {
					continue;
				}

				$search_form_fields['fields'][$key]['field_key'] = '';
				$search_form_fields['fields'][$key]['options'] = [];

				$form_key = isset( $value['original_widget_key'] ) ? $value['original_widget_key'] : '';

				unset( $search_form_fields['fields'][$key]['widget_key'] );
				unset( $search_form_fields['fields'][$key]['original_widget_key'] );

				if ( $form_key ) {
					if ( !empty( $submission_form_fields['fields'][$form_key]['field_key'] ) ) {
						$search_form_fields['fields'][$key]['field_key'] = $submission_form_fields['fields'][$form_key]['field_key'];
					}

					if ( !empty( $submission_form_fields['fields'][$form_key]['options'] ) ) {
						$search_form_fields['fields'][$key]['options'] = $submission_form_fields['fields'][$form_key]['options'];
					}
				}

			}
		}

		if ( !empty( $search_form_fields['groups'] ) ) {
			foreach ( $search_form_fields['groups'] as $group ) {
				$section           = $group;
				$section['fields'] = array();

				foreach ( $group['fields'] as $field ) {
					$search_field = $search_form_fields['fields'][$field];

					if ( $this->is_field_allowed_in_atts( $search_field['widget_name'] ) ) {
						$section['fields'][ $field ] = $search_field;
					}
				}

				$form_data[] = $section;
			}
		}

		return $form_data;
	}

	public function display_only_for_logged_in() {
		return $this->data['logged_in_user_only'] == 'yes' ? true : false;
	}

	public function redirect_page_url() {
		return $this->data['redirect_page_url'];
	}

	public function is_field_allowed_in_atts( $widget_name ) {
		$atts = ! empty( $this->atts[ 'filter_' . $widget_name ] ) ? $this->atts[ 'filter_' . $widget_name ] : '';

		if ( 'no' == $atts ){
			return false;
		}
		return true;
	}

	public function buttons_template() {
		if ($this->display_reset_filter_button() || $this->display_apply_filter_button()) {
			Helper::get_template( 'search-form/buttons', array('searchform' => $this) );
		}
	}

	public function load_radius_search_scripts( $data ) {
		_deprecated_function( 'load_radius_search_scripts', '7.1' );
	}

	public function get_pricing_type() {
		$submission_form_fields = get_term_meta( $this->current_directory_type, 'submission_form_fields', true );
		$ptype = !empty( $submission_form_fields['fields']['pricing']['pricing_type'] ) ? $submission_form_fields['fields']['pricing']['pricing_type'] : 'both';
		return $ptype;
	}

	public function field_template( $field_data ) {
		$key = $field_data['field_key'];

		if ( $this->is_custom_field( $field_data ) ) {
			$value = !empty( $_REQUEST['custom_field'][$key] ) ? $_REQUEST['custom_field'][$key] : '';
		}
		else {
			$value = $key && isset( $_REQUEST[$key] ) ? $_REQUEST[$key] : '';
		}

		$args = array(
			'searchform' 		=> $this,
			'data'       		=> $field_data,
			'value'      		=> wp_unslash( $value ),
		);

		if ( $this->is_custom_field( $field_data ) && ( ! in_array( $field_data['field_key'], $this->assign_to_category()['custom_field_key'] ) ) ) {
			$template = 'search-form/custom-fields/' . $field_data['widget_name'];
		}
		else {
			$template = 'search-form/fields/' . $field_data['widget_name'];
		}

		$template = apply_filters( 'directorist_search_field_template', $template, $field_data );
		Helper::get_template( $template, $args );
	}

	public function is_custom_field( $data ) {
		$fields = [ 'checkbox', 'color_picker', 'date', 'file', 'number', 'radio', 'select', 'text', 'textarea', 'time', 'url' ];
		return in_array( $data['widget_name'], $fields ) ? true : false;
	}

	public function directory_type_nav_template() {
		$enable_multi_directory = get_directorist_option( 'enable_multi_directory', false );

		if( count( $this->get_listing_type_data() ) < 2 || empty( $enable_multi_directory ) ) {
			return;
		}

		Helper::get_template( 'search-form/directory-type-nav', [ 'searchform' => $this ] );
	}

	public function more_buttons_template() {
		Helper::get_template( 'search-form/more-buttons', [ 'searchform' => $this ] );
	}

	public function advanced_search_form_fields_template() {
		Helper::get_template( 'search-form/adv-search', array('searchform' => $this) );
	}

	public function top_categories() {
		$top_categories = [];

		$args = array(
			'type'          => ATBDP_POST_TYPE,
			'parent'        => 0,
			'orderby'       => 'count',
			'order'         => 'desc',
			'hide_empty'    => 1,
			'number'        => (int) get_directorist_option( 'popular_cat_num', 10 ),
			'taxonomy'      => ATBDP_CATEGORY,
			'no_found_rows' => true,
		);

		$cats = get_categories( $args );

		foreach ( $cats as $cat ) {
			$directory_type 	 = get_term_meta( $cat->term_id, '_directory_type', true );
			$directory_type 	 = ! empty( $directory_type ) ? $directory_type : array();
			$listing_type_id     = $this->current_directory_type;

			if( in_array( $listing_type_id, $directory_type ) ) {
				$top_categories[] = $cat;
			}
		}

		return $top_categories;
	}

	public function top_categories_template() {
		if ( $this->dispaly_popular_categories() ) {
			$top_categories = $this->top_categories();
			$title = get_directorist_option( 'popular_cat_title', __( 'Browse by popular categories', 'directorist' ) );

			if ( !empty($top_categories) ) {
				$args = array(
					'searchform'      => $this,
					'top_categories'  => $top_categories,
					'title'           => $title,
				);
				Helper::get_template( 'search-form/top-cats', $args );
			}
		}
	}

	public function search_category_location_args() {
		return array(
			'parent'             => 0,
			'term_id'            => 0,
			'hide_empty'         => 0,
			'orderby'            => 'name',
			'order'              => 'asc',
			'show_count'         => 0,
			'single_only'        => 0,
			'pad_counts'         => true,
			'immediate_category' => 0,
			'active_term_id'     => 0,
			'ancestors'          => array(),
			'listing_type'		 => $this->current_directory_type,
			'assign_to_category' => $this->assign_to_category()
		);
	}

	public function price_value($arg) {
		if ( $arg == 'min' ) {
			return isset( $_REQUEST['price'] ) ? $_REQUEST['price'][0] : '';
		}

		if ( $arg == 'max' ) {
			return isset( $_REQUEST['price'] ) ? $_REQUEST['price'][1] : '';
		}

		return '';
	}

	public function the_price_range_input($range) {
		$checked = ! empty( $_REQUEST['price_range'] ) && $_REQUEST['price_range'] == $range ? ' checked="checked"' : '';
		printf('<input type="radio" name="price_range" value="%s"%s>', $range, $checked);
	}

	public function get_atts_data() {
		return json_encode( $this->data );
	}

	public function listing_type_slug() {
		$term_data = get_term( $this->current_directory_type, ATBDP_TYPE );
		return $term_data->slug;
	}

	public function background_img_style() {
		$bgimg = get_directorist_option('search_home_bg');
		$style = !empty( $bgimg ) ? sprintf( "background-image: url(%s)", esc_url( $bgimg ) ) : '';
		return $style;
	}

	public function border_class() {
		$search_border = get_directorist_option( 'search_border', 1 );
		return empty( $search_border ) ? 'directorist-no-search-border' : 'directorist-with-search-border';
	}

	public function category_icon_class($cat) {
		$icon = get_cat_icon($cat->term_id);
		$icon_type = substr($icon, 0, 2);
		$icon_class = ('la' === $icon_type) ? $icon_type . ' ' . $icon : 'fa ' . $icon;
		return $icon_class;
	}

	/**
	 * @todo new/refactor
	 */
	public function build_search_data( $data ) {
		$search_form_fields = get_term_meta( $this->current_directory_type, 'search_form_fields', true );
		return $search_form_fields['fields'][ $data ];
	}

	/**
	 * @todo new/refactor
	 */
	public function zip_code_class() {
		$class 					= 'directorist-form-element';
		$radius_search 			= $this->build_search_data( 'radius_search' );
		$radius_search_based_on = ! empty( $radius_search['radius_search_based_on'] ) ? $radius_search['radius_search_based_on'] : 'address';

		if( ! empty( $radius_search ) && 'zip' == $radius_search_based_on ) {
			$class .= ' zip-radius-search';
		}
		return $class;
	}

	public function rating_field_data() {
		$rating_options = array(
			array(
				'selected' => '',
				'value'    => '',
				'label'    => __( 'Select Ratings', 'directorist' ),
			),
			array(
				'selected' => ( ! empty( $_REQUEST['search_by_rating'] ) && '5' == $_REQUEST['search_by_rating'] ) ? ' selected' : '',
				'value'    => '5',
				'label'    => __( '5 Star', 'directorist' ),
			),
			array(
				'selected' => ( ! empty( $_REQUEST['search_by_rating'] ) && '4' == $_REQUEST['search_by_rating'] ) ? ' selected' : '',
				'value'    => '4',
				'label'    => __( '4 Star & Up', 'directorist' ),
			),
			array(
				'selected' => ( ! empty( $_REQUEST['search_by_rating'] ) && '3' == $_REQUEST['search_by_rating'] ) ? ' selected' : '',
				'value'    => '3',
				'label'    => __( '3 Star & Up', 'directorist' ),
			),
			array(
				'selected' => ( ! empty( $_REQUEST['search_by_rating'] ) && '2' == $_REQUEST['search_by_rating'] ) ? ' selected' : '',
				'value'    => '2',
				'label'    => __( '2 Star & Up', 'directorist' ),
			),
			array(
				'selected' => ( ! empty( $_REQUEST['search_by_rating'] ) && '1' == $_REQUEST['search_by_rating'] ) ? ' selected' : '',
				'value'    => '1',
				'label'    => __( '1 Star & Up', 'directorist' ),
			),
		);

		return $rating_options;
	}

	public function listing_tag_terms($tag_source='all_tags') {
		$category_slug   = get_query_var( 'atbdp_category' );
		$category        = get_term_by( 'slug', $category_slug, ATBDP_CATEGORY );
		$category_id     = ! empty( $category->term_id ) ? $category->term_id : '';
		$category_select = ! empty( $_REQUEST['in_cat'] ) ? $_REQUEST['in_cat'] : $category_id;

		if ( 'all_tags' == $tag_source || empty( $category_select ) ) {
			$terms = get_terms( ATBDP_TAGS );
		} else {
			$tag_args = array(
				'post_type' => ATBDP_POST_TYPE,
				'tax_query' => array(
					array(
						'taxonomy' => ATBDP_CATEGORY,
						'terms'    => ! empty( $_REQUEST['in_cat'] ) ? $_REQUEST['in_cat'] : $category_id,
					),
				),
			);

			$tag_posts       = get_posts( $tag_args );
			if ( ! empty( $tag_posts ) ) {
				foreach ( $tag_posts as $tag_post ) {
					$tag_id[] = $tag_post->ID;
				}
			}
			$tag_id = ! empty( $tag_id ) ? $tag_id : '';
			$terms  = wp_get_object_terms( $tag_id, ATBDP_TAGS );
		}

		if ( ! empty( $terms ) ) {
			return $terms;
		} else {
			return array();
		}
	}

	/**
	 * @todo new/refactor
	 */
	public function assign_to_category(){
		$submission_form_fields = get_term_meta( $this->current_directory_type , 'submission_form_fields', true );
		$category_id = isset( $_REQUEST['cat_id'] ) ? $_REQUEST['cat_id'] : '';
		$custom_field_key = array();
		$assign_to_cat = array();

		if( $submission_form_fields['fields'] ) {
			foreach( $submission_form_fields['fields'] as $field ) {
				if( ! empty( $field['assign_to'] ) && $field['assign_to'] == 'category' && $category_id != $field['category'] ) {
					$custom_field_key[] = $field['field_key'];
					$assign_to_cat[]	= $field['category'];
				}
			}
		}

		$category_custom_field = array(
			'custom_field_key'	=> $custom_field_key,
			'assign_to_cat'		=> $assign_to_cat,
		);
		return $category_custom_field;
	}

	/**
	 * @todo new/refactor
	 */
	public static function get_selected_category_option_data() {
		$id = ( isset( $_REQUEST['in_cat'] ) ) ? $_REQUEST['in_cat'] : '';
		$id = ( isset( $_REQUEST['cat_id'] ) ) ? $_REQUEST['cat_id'] : $id;

		return self::get_taxonomy_select_option_data( $id );
	}

	/**
	 * @todo new/refactor
	 */
	public static function get_selected_location_option_data() {
		$id = ( isset( $_REQUEST['in_loc'] ) ) ? $_REQUEST['in_loc'] : '';
		$id = ( isset( $_REQUEST['loc_id'] ) ) ? $_REQUEST['loc_id'] : $id;

		return self::get_taxonomy_select_option_data( $id );
	}

	/**
	 * @todo new/refactor
	 */
	public static function get_taxonomy_select_option_data( $id ) {
		$item = [ 'id' => '', 'label' => '' ];

		if ( empty( $id ) ) {
			return $item;
		}

		$taxonomy = get_term( $id );

		if ( is_wp_error( $taxonomy ) ) {
			return $item;
		}

		$item[ 'id' ]    = $taxonomy->term_id;
		$item[ 'label' ] = $taxonomy->name;

		return $item;
	}

	/**
	 * @todo new/refactor
	 */
	public function range_slider_data( $data ) {
		$radius_search_unit = !empty( $data['radius_search_unit'] ) ? $data['radius_search_unit'] : '';
		if ( 'kilometers' == $radius_search_unit ) {
			$miles = __( ' Kilometers', 'directorist' );
		}
		else {
			$miles = __( ' Miles', 'directorist' );
		}

		$value = !empty( $_REQUEST['miles'] ) ? $_REQUEST['miles'] : $data['default_radius_distance'];

		$data = [
			'miles' => $miles,
			'minValue' => $value,
		];

		return json_encode( $data );;
	}

}