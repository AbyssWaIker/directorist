<?php
/**
 * @author  AazzTech
 * @since   6.7
 * @version 6.7
 */
?>
<div class="atbd_action atbd_report atbd_tooltip" aria-label="<?php esc_html_e('Report', 'directorist'); ?>">
	<?php if (atbdp_logged_in_user() || apply_filters('atbdp_allow_public_report', false)): ?>
	<a href="javascript:void(0)" data-target="atbdp-report-abuse-modal" class="atbdp-report-abuse-modal"><?php directorist_icon( $icon );?></a>
	<?php else: ?>
		<a href="javascript:void(0)" class="atbdp-require-login"><?php directorist_icon( $icon );?><?php esc_html_e('Report', 'directorist'); ?></a>
	<?php endif; ?>
	<input type="hidden" id="atbdp-post-id" value="<?php echo esc_attr( $listing->id ); ?>"/>
</div>
 
<div class="at-modal atm-fade" id="atbdp-report-abuse-modal">
	<div class="at-modal-content at-modal-md">
		<div class="atm-contents-inner">
			<a href="" class="at-modal-close"><span aria-hidden="true">&times;</span></a>
			<div class="row align-items-center">
				<div class="col-lg-12">
					<form id="atbdp-report-abuse-form" class="form-vertical tst">
						<div class="modal-header">
							<h3 class="modal-title" id="atbdp-report-abuse-modal-label"><?php esc_html_e('Report Abuse', 'directorist'); ?></h3>
						</div>
						<div class="modal-body">
							<div class="form-group">
								<label for="atbdp-report-abuse-message"><?php esc_html_e('Your Complaint', 'directorist'); ?><span class="atbdp-star">*</span></label>
								<textarea class="form-control" id="atbdp-report-abuse-message" rows="3" placeholder="<?php esc_html_e('Message', 'directorist'); ?>..." required></textarea>
							</div>
							<div id="atbdp-report-abuse-g-recaptcha"></div>
							<div id="atbdp-report-abuse-message-display"></div>
						</div>
						<div class="modal-footer">
							<button type="submit" class="btn btn-primary"><?php esc_html_e('Submit', 'directorist'); ?></button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>