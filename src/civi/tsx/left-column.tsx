import React, { useState, useEffect, useMemo, memo } from 'react'
import { Game } from '../game'
import { ResourceObjectType } from '../managers/resources'
import { fixFloatingPointNumber } from '../utils'

type getEffectFn = (resName: string) => number;

// RESOURCE ROW
interface ResourceRowProps {
    res: ResourceObjectType;
    getResourcePerTickEffect: getEffectFn;
    getResourceMaxEffect: getEffectFn;
}
const ResourceRow: React.FC<ResourceRowProps> = ({
    res,
    getResourcePerTickEffect,
    getResourceMaxEffect
}: ResourceRowProps) => {
    return (
        <div className={`res-row res-${res.name}${!res.unlocked ? ' hidden': ''}`}>
            <div className="res-cell res-name">{res.label}</div>
            <div className="res-cell res-amount">{fixFloatingPointNumber(res.amount)}</div>
            <div className="res-cell res-max">/{getResourceMaxEffect(res.name)}</div>
            <div className="res-cell res-pertick">{getResourcePerTickEffect(res.name)}</div>
        </div>
    )
}

function areEqual(a: ResourceRowProps, b: ResourceRowProps): boolean {
    return !(
        a.res.amount === b.res.amount
    )
}

const ResourceRowMemo = memo(ResourceRow, areEqual)


// RESOURCE TABLE
interface ResourceTableProps {
    resources: ResourceObjectType[];
    getResourcePerTickEffect: getEffectFn;
    getResourceMaxEffect: getEffectFn;
}
const ResourceTable: React.FC<ResourceTableProps> = ({
    resources,
    getResourcePerTickEffect,
    getResourceMaxEffect
}: ResourceTableProps) => {

    return (
        <div className="table res-table">
            {
                resources.map((res, i) => (
                    <ResourceRowMemo
                        key={i}
                        res={res}
                        getResourcePerTickEffect={getResourcePerTickEffect}
                        getResourceMaxEffect={getResourceMaxEffect}
                    />
                ))
            }
        </div>
    );
}


// RESOURCE LEFT COLUMN
interface LeftColumnProps {
    game: Game
}
export const LeftColumn: React.FC<LeftColumnProps> = ({ 
    game: g
}: LeftColumnProps) => {
    const [game, _] = useState(g);

    function getResources(): ResourceObjectType[] {
        return Object.values(game.res.resources)
    }

    function getResourcePerTickEffect(resName: string): number {
        return game.getEffect(resName + 'PerTickBase')
    }

    function getResourceMaxEffect(resName: string): number {
        const effectName = resName + 'Max';
        return game.getEffect(effectName);
    }

    return (
        <>
            <div className="res-container">
                <label className="table-label">resources</label>
                <ResourceTable
                    resources={getResources()}
                    getResourcePerTickEffect={getResourcePerTickEffect}
                    getResourceMaxEffect={getResourceMaxEffect}
                />
            </div>
        </>
    )
}