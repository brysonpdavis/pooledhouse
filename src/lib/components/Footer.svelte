<script>
	let show = true;
</script>

<input class="modal-toggle" type="checkbox" id="show-footer" bind:checked={show} />
{#if show}
	<footer class="min-h-10 bg-accent ">
		<div class="dynamic-layout py-4 text-accent-content">
			<div class="footer footer-center h-fit w-full">
				<label
					class="btn-outline btn-xs btn-circle btn absolute right-2 rounded-full border-black bg-black hover:bg-opacity-0"
					for="show-footer"
				>
					x
				</label>
				<div class="w-full px-8 flex flex-row justify-center">
					⚠️ 
					<p class="font-semibold tracking-tight">
						current data is for placeholder purposes only while the app is in pre-release
					</p>
					⚠️ 
				</div>
			</div>
		</div>
	</footer>
{/if}
