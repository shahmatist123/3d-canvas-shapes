import * as THREE from "three";

export interface ShapeItem {
    onClick?: () => void,
    mesh: THREE.Mesh,
    name: string,
    prevArrow?: THREE.ArrowHelper
}