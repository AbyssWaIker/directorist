<?php
/**
 * @author  wpWax
 * @since   6.7
 * @version 6.7
 */
?>
<div class="single_search_field ">
	<?php
    if ( !empty($data['label']) ): ?>
        <label><?php echo esc_html( $data['label'] ); ?></label>
    <?php endif; ?>

    <div class="search-form-field">
        <textarea name="custom_field[<?php echo esc_attr( $data['field_key'] ); ?>]" id="<?php echo esc_attr( $data['field_key'] ); ?>" class="form-control" rows="<?php echo (int) $data['rows']; ?>" placeholder="<?php echo esc_attr( $data['placeholder'] ); ?>" <?php echo ! empty( $data['required'] ) ? 'required="required"' : ''; ?> ><?php echo esc_attr( $value ); ?></textarea>
    </div>
</div>