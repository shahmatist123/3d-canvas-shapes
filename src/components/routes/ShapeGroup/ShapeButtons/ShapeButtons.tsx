import styles from "./ShapeButtons.module.scss"
import Button from "../../../common/Button/Button";
import {ShapeItem} from "../types";
import * as THREE from "three";
import { ReactComponent as DeleteSvg } from "../../../../assets/trash.svg"
interface ShapeButtonsP {
    onAdd: () => void,
    onDelete: () => void,
    shapes: ShapeItem[],
    focusedShape?: ShapeItem,
}
const ShapeButtons = ({onAdd, onDelete, shapes, focusedShape}: ShapeButtonsP) => {
    return <div className={styles.Wrapper}>
        <Button onClick={onAdd}>
            + Add
        </Button>
        <Button type="delete" disabled={!focusedShape} onClick={onDelete}>
            <DeleteSvg/>
            Delete
        </Button>
    </div>
}
export default ShapeButtons