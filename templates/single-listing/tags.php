<?php
/**
 * @author  wpWax
 * @since   6.6
 * @version 6.6
 */

if(!empty($tags) && !empty($enable_single_tag)) { ?>
	<div class="atbd_content_module atbd-listing-tags">

		<?php if(!empty($tags_section_lable)) {  ?>
			<div class="atbd_content_module_title_area">
				<div class="atbd_area_title">
					<h4><span class="<?php echo apply_filters('atbdp_single_listing_tag_icon', atbdp_icon_type().'-tags'); ?>"></span> <?php echo esc_html( $tags_section_lable ); ?></h4>
				</div>
			</div>
			<?php
		}
		?>

		<div class="atbdb_content_module_contents">
			<ul>
				<?php foreach ($tags as $tag) {
					$link = ATBDP_Permalink::atbdp_get_tag_page($tag);
					$name = $tag->name;
					?>
					<li><a href="<?php echo esc_url($link); ?>"><span class="<?php echo apply_filters('atbdp_single_listing_tags_icon', atbdp_icon_type().'-tag'); ?>"></span> <?php echo esc_html($name); ?></a></li>
					<?php
				}
				?>
			</ul>
		</div>

	</div>
	<?php
}