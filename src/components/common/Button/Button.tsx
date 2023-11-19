import cn from "classnames"
import styles from "./Button.module.scss"
import {ReactNode} from "react";
interface ButtonP {
    onClick: () => void,
    disabled?: boolean,
    type?: string,
    children: ReactNode ,
    className?: string
}
const Button = ({type, children, className, ...other}: ButtonP) => {
    return <button
        className={cn(className, styles.button, {
            [styles.deleteType]: type === "delete",
        })}
        {...other}
    >
        {children}
    </button>
}
export default Button