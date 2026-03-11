<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { Float } from "@threlte/extras";

    let rotationY = $state(0);
    let rotationZ = $state(0);

    useTask((delta) => {
        rotationY += delta * 0.15;
        rotationZ += delta * 0.1;
    });
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />

<!-- Dramatic Industrial Lighting -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 10]} intensity={4} color="#ff5a00" />
<T.DirectionalLight position={[-10, -10, -10]} intensity={2} color="#4a5568" />
<T.PointLight
    position={[0, 0, 5]}
    intensity={2}
    color="#ffffff"
    distance={20}
/>

<Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
    <!-- Wireframe cage -->
    <T.Mesh rotation.y={rotationY} rotation.z={rotationZ}>
        <T.IcosahedronGeometry args={[7.5, 1]} />
        <T.MeshStandardMaterial
            color="#ff5a00"
            wireframe={true}
            emissive="#ff5a00"
            emissiveIntensity={0.4}
            transparent={true}
            opacity={0.3}
        />
    </T.Mesh>

    <!-- Solid brutalist core -->
    <T.Mesh rotation.y={rotationY * -0.5} rotation.x={rotationZ}>
        <T.IcosahedronGeometry args={[7.2, 1]} />
        <T.MeshStandardMaterial
            color="#0a0a0a"
            roughness={0.9}
            metalness={0.8}
        />
    </T.Mesh>

    <!-- Inner glowing core -->
    <T.Mesh rotation.y={rotationY * 2}>
        <T.IcosahedronGeometry args={[3, 0]} />
        <T.MeshBasicMaterial
            color="#ff5a00"
            transparent={true}
            opacity={0.15}
        />
    </T.Mesh>
</Float>
