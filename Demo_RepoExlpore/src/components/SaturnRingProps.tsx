import * as THREE from 'three'

interface SaturnRingsProps {
    planetScale: number
    commitsCount: number
}

function RingLayer({ inner, outer, color, opacity, tilt = 0 }: {
    inner: number
    outer: number
    color: number
    opacity: number
    tilt?: number
}) {
    return (
        <mesh rotation={[Math.PI / 2, 0, tilt]}>
            <ringGeometry args={[inner, outer, 256]} />
            <meshBasicMaterial
                color={color}
                side={THREE.DoubleSide}
                transparent
                opacity={opacity}
            />
        </mesh>
    )
}

export function SaturnRing({ planetScale, commitsCount }: SaturnRingsProps) {
    const baseInner = planetScale * 1.4
    const cappedCommits = Math.min(commitsCount, 40000)
    const thickness = cappedCommits * 0.00002

    const rings = [
        { inner: baseInner, outer: baseInner + thickness * 0.5, color: 0x3c3c3c, opacity: 0.9 },
        { inner: baseInner + thickness * 0.5, outer: baseInner + thickness, color: 0xb0a89b, opacity: 0.8 },
        { inner: baseInner + thickness, outer: baseInner + thickness * 1.5, color: 0x8b7355, opacity: 0.7 },
        { inner: baseInner + thickness * 1.5, outer: baseInner + thickness * 2, color: 0x6d6152, opacity: 0.6 },
        { inner: baseInner + thickness * 2, outer: baseInner + thickness * 2.5, color: 0x4a4a4a, opacity: 0.4 },
    ]

    return (
        <group rotation={[0.1, 0.1, 0]}>
            {rings.map((r, i) => (
                <RingLayer key={i} {...r} tilt={Math.PI / 12} />
            ))}
        </group>
    )
}
