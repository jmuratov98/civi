import React from 'react';

import { game } from '../../../game'
import { Resource } from '../../../managers/resources'

interface ResourceRowProps {
    res: Resource
}
export function ResourceRow({
    res
}: ResourceRowProps): JSX.Element {
    return (
        <tr className={`res-row ${res.unlocked ? '' : 'hidden'}`} id={`${res.name}`}>
            <td className="res-cell res-name">{res.label}</td>
            <td className="res-cell res-amount">{res.amount}</td>
            <td className="res-cell res-max">0</td>
            <td className="res-cell res-persec">0</td>
        </tr>
    )
}

export function ResourceContainer(): JSX.Element {
    return (
        <div className="res-container">
            <div className="res-container__label"></div>
            <table className="res-table">
                {Object.values(game.res.resources).map((res: Resource, i: number) => {
                    return <ResourceRow res={res} key={i} />
                })}
            </table>
        </div>
    )
}

export function LeftColumn(): JSX.Element {
    return (
        <ResourceContainer />
    )
}