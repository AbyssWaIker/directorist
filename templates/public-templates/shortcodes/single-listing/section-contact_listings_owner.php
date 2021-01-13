<?php
/**
 * @author  AazzTech
 * @since   6.7
 * @version 6.7
 */

$hide_contact_owner = get_post_meta($listing->id, '_hide_contact_owner', true);
$hide_contact_owner = false;
$email = get_post_meta($listing->id, '_email', true);
?>
<div class="atbd_content_module <?php echo esc_attr( $class );?>" <?php echo $id ? 'id="'.$id.'"' : '';?>>
	<div class="atbd_content_module_title_area">
		<div class="atbd_area_title">
			<h4><?php directorist_icon( $icon );?><?php echo esc_html( $label );?></h4>
		</div>
	</div>
	<div class="atbdb_content_module_contents">
		<?php
		if (!$hide_contact_owner) { ?>
			<form action="atbdp_public_send_contact_email" class="atbdp-form form-vertical contact_listing_owner_form" data-form-id="atbdp_stcode_contact_email">

				<div class="form-group">
					<input type="text" class="form-control atbdp-form-field" name="atbdp-contact-name" placeholder="<?php esc_attr_e('Name', 'directorist'); ?>" required />
				</div>

				<div class="form-group">
					<input type="email" class="form-control atbdp-form-field" name="atbdp-contact-email" placeholder="<?php esc_attr_e('Email', 'directorist'); ?>" required />
				</div>

				<div class="form-group">
					<textarea class="form-control atbdp-form-field" name="atbdp-contact-message" rows="3" placeholder="<?php esc_attr_e('Message', 'directorist'); ?>..." required></textarea>
				</div>

				<input type="hidden" name="atbdp-post-id" class="atbdp-form-field" value="<?php echo esc_attr($listing->id); ?>" />
				<input type="hidden" name="atbdp-listing-email" class="atbdp-form-field" value="<?php echo esc_attr($email); ?>" />

				<?php
		        /**
		         * It fires before contact form in the widget area
		         * @since 4.4.0
		         */

		        do_action('atbdp_before_contact_form_submit_button');
		        ?>
		        <p class="atbdp-contact-message-display"></p> 
		        <button type="submit" class="btn btn-primary"><?php esc_html_e('Submit', 'directorist'); ?></button>
		    </form>
		    <?php
		}
		?>
	</div>
</div>