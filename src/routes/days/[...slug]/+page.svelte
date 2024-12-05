<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div>

<h1>Výsledek</h1>
    <div class="text-4xl">{data.res}</div>
</div>
