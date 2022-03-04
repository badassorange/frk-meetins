import React, { ReactChild, ReactChildren } from "react";
import LeftNavMenu from "../../global/LeftNavMenu/LeftNavMenu";
import s from "./pageContainer.module.scss";

export default function PageContainer(props: {children: ReactChild}): JSX.Element {
    return (
        <div className={s.nav}>
            <div className={s.menu}>
                <LeftNavMenu/>
            </div>
            <div className={s.content}>
                {props.children}
            </div>
        </div>
    )
}