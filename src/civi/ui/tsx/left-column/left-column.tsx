import React from 'react';

import { game } from '../../../game';
import { Resource } from '../../../managers/resources';
import { fixFloatingPoint } from '../../../utils';

interface ResourceRowProps {
    res: Resource
}
export function ResourceRow({
    res
}: ResourceRowProps): JSX.Element {
    return (
        <tr className={`res-row ${res.unlocked ? '' : 'hidden'}`} id={`${res.name}`}>
            <td className="res-cell res-name">{res.label}</td>
            <td className="res-cell res-amount">{fixFloatingPoint(res.amount)}</td>
            <td className="res-cell res-max">{game.getEffect(`${res.name}Max`)}</td>
            <td className="res-cell res-persec">{game.getEffect(`${res.name}PerTickBase`)}</td>
        </tr>
    )
}

export function ResourceContainer(): JSX.Element {
    return (
        <div className="res-container">
            <div className="res-container__label"></div>
            <table className="res-table">
                <tbody>
                {Object.values(game.res.resources).map((res: Resource, i: number) => {
                    return <ResourceRow res={res} key={i} />
                })}
                </tbody>
            </table>
        </div>
    )
}

export function LeftColumn(): JSX.Element {
    return (
        <ResourceContainer />
    )
}