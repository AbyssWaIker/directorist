<?php
/**
 * @author  wpWax
 * @since   6.6
 * @version 6.7
 */

if ( ! defined( 'ABSPATH' ) ) exit;
?>

<div class="single_search_field ">

	<?php if ( !empty($data['label']) ): ?>
		<label><?php echo esc_html( $data['label'] ); ?></label>
	<?php endif; ?>

	<select name='search_by_rating' class="select-basic form-control" <?php echo ! empty( $data['required'] ) ? 'required="required"' : ''; ?>>
		<?php
		foreach ( $searchform->rating_field_data() as $option ) {
			printf('<option value="%s"%s>%s</option>', $option['value'], $option['selected'], $option['label']);
		}
		?>
	</select>
	
</div>