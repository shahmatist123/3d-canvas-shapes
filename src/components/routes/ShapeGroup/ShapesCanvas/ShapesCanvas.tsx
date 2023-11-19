import {ShapeItem} from "../types";
import {inspect} from "util";
import styles from "./ShapesCanvas.module.scss"
import {Ref, useEffect, useRef, useState} from "react";
import * as THREE from "three";
interface ShapeCanvasP {
    shapes: ShapeItem[],
    focusedShape?: ShapeItem
    onFocusShape: (shape?: ShapeItem) => void
    onAdd: () => void,
    scene: THREE.Scene
}
const ShapesCanvas = ({shapes, scene, onFocusShape, focusedShape}: ShapeCanvasP) => {
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const canvasRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!canvasRef.current) return;
        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
            canvasRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        }

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.layers.enable(1);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            rendererRef.current?.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = window.innerWidth - 20;
            const height = window.innerHeight - 20;
            rendererRef.current?.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);
        const raycaster = new THREE.Raycaster();
        raycaster.layers.set(1);
        const mouse = new THREE.Vector2();

        const onCanvasClick = (event: MouseEvent) => {
            if (!canvasRef.current) return
            const rect = canvasRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object;

                const selected = shapes.find(shape => shape.mesh.uuid === intersectedObject.uuid);
                if (selected) {
                    shapes.forEach((shape) => {
                        // @ts-ignore
                        shape.mesh.children[0].material = new THREE.LineBasicMaterial({ color: 0x000000 });
                    })
                    if (focusedShape !== selected) {
                        // @ts-ignore
                        selected.mesh.children[0].material = new THREE.LineBasicMaterial({ color: "red" });
                        onFocusShape(selected)
                    } else {
                        onFocusShape()
                    }
                }
            }
        };
        canvasRef.current.addEventListener("click", onCanvasClick)
        return () => {
            canvasRef.current?.removeEventListener("click", onCanvasClick)
            window.removeEventListener('resize', handleResize);
        };
    }, [shapes]);
    return <>
        <div ref={canvasRef}></div>
    </>
}
export default ShapesCanvas