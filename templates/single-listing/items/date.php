<?php
/**
 * @author  wpWax
 * @since   6.7
 * @version 6.7
 */
$date_format = get_option( 'date_format' );
?>
<div class="directorist-single-info directorist-single-info-fax">
	<div class="directorist-single-info-label"><?php directorist_icon( $icon );?><?php echo esc_html( $data['label'] ); ?></div>
	<div class="directorist-single-info-value"><?php echo date($date_format, strtotime( esc_html( $value ) )); ?></div>
</div>