<?php
/**
 * @author  wpWax
 * @since   6.6
 * @version 6.7
 */
?>
<div class="directorist-advanced-filter">
	<form action="<?php atbdp_search_result_page_link(); ?>" class="atbd_ads-form">

		<div class="atbdp-search-form atbdp-basic-search-fields">
			<?php foreach ( $searchform->form_data[0]['fields'] as $field ){ ?>
				<div class="atbdp-basic-search-fields-each"><?php $searchform->field_template( $field ); ?></div>
			<?php } ?>
		</div>

		<div class="atbdp-adv-search-fields">
			<?php foreach ( $searchform->form_data[1]['fields'] as $field ){ ?>
				<div class="form-group atbdp-search-field-<?php echo esc_attr( $field['widget_name'] )?>"><?php $searchform->field_template( $field ); ?></div>
			<?php } ?>
		</div>

		<?php $searchform->buttons_template(); ?>
	</form>
</div>