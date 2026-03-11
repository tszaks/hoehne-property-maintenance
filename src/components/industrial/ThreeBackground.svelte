<script lang="ts">
    import { Canvas } from "@threlte/core";
    import ThreeScene from "./ThreeScene.svelte";
</script>

<div class="absolute inset-0 w-full h-full pointer-events-none z-15 opacity-60">
    <Canvas>
        <ThreeScene />
    </Canvas>
</div>
