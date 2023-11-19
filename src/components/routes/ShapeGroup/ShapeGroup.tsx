import ShapeButtons from "./ShapeButtons/ShapeButtons";
import {useEffect, useRef, useState} from "react";
import {ShapeItem} from "./types";
import ShapesCanvas from "./ShapesCanvas/ShapesCanvas";
import * as THREE from "three";
import {Font, FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const width = 1.4
const height = 0.5
const offsetX = 0.1
const offsetY = 1

const ShapeGroup = () => {
    const [scene] = useState(new THREE.Scene());
    const [shapes, setShapes] = useState<ShapeItem[]>([])
    const [focusedShape, setFocusedShape] = useState<ShapeItem>()
    const [font, setFont] = useState<Font>()

    useEffect(() => {
        scene.background = new THREE.Color(0xffffff);
        const loader = new FontLoader();
        loader.load('/fonts/helvetiker_regular.typeface.json', function (font) {
            setFont(font)
        });
    }, []);

    const createArrow = (firstElem: THREE.Mesh, lastElem: THREE.Mesh) => {
        const start = new THREE.Vector3().copy(firstElem.position);
        const end = new THREE.Vector3().copy(lastElem.position);
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const length = start.distanceTo(end);
        const color = 0x000000;
        return new THREE.ArrowHelper(direction, start, length, color);
    }

    const onAdd = () => {
        if (!font) return
        const geometry = new THREE.BoxGeometry(width, height, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const shape = new THREE.Mesh(geometry, material);
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const border = new THREE.LineSegments(edges, lineMaterial);
        shape.add(border)
        const textGeometry = new TextGeometry(`Shape${shapes.length + 1}`, {
            font: font,
            size: 0.2,
            height: 0.05
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.x = -width * 0.46;
        textMesh.position.y = -height * 0.2;
        shape.add(textMesh);
        let prevArrow = undefined

        if (shapes.length > 0) {
            const lastShape = shapes[shapes.length - 1];
            shape.position.x = lastShape.mesh.position.x + width*0.75;
            if (lastShape.mesh.position.y !== 0) {
                shape.position.y = lastShape.mesh.position.y +  height + offsetY;
            } else {
                shape.position.y = lastShape.mesh.position.y - height - offsetY;
            }
            prevArrow = createArrow(shapes[shapes.length - 1].mesh, shape);
            scene.add(prevArrow);
        }
        shape.layers.set(1);
        scene.add(shape);
        setShapes([...shapes, { mesh: shape, name: `Shape${shapes.length + 1}`, prevArrow }]);
    }

    const onDelete = () => {
        if (!focusedShape) return
        const shapeIndex = shapes.indexOf(focusedShape)
        const newShapes = [...shapes]
        newShapes.splice(shapes.indexOf(focusedShape), 1)
        scene.remove(focusedShape.mesh);
        if (focusedShape.prevArrow) {
            scene.remove(focusedShape.prevArrow);
        }
        const nextShape = shapes[shapeIndex + 1]
        const prevShape = shapes[shapeIndex - 1]
        if (nextShape) {
            const nextArrow = nextShape?.prevArrow
            if (shapes.length > shapeIndex && nextArrow) {
                scene.remove(nextArrow);
            }
            if (prevShape) {
                const newArrow = createArrow(prevShape.mesh, nextShape.mesh);
                newShapes[shapeIndex].prevArrow = newArrow
                scene.add(newArrow)
            }
        }
        setFocusedShape(undefined)
        setShapes(newShapes)
    }

    return <div>
        <ShapeButtons focusedShape={focusedShape} shapes={shapes} onAdd={onAdd} onDelete={onDelete}/>
        <ShapesCanvas scene={scene} shapes={shapes} focusedShape={focusedShape} onAdd={onAdd} onFocusShape={(shape?: ShapeItem) => setFocusedShape(shape)}/>
    </div>
}
export default ShapeGroup