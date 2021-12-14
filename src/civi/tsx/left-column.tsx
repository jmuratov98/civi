import React, { useState, useEffect, useMemo, memo } from 'react'
import { Game } from '../game'
import { ResourceObjectType } from '../managers/resources'
import { fixFloatingPointNumber } from '../utils'


// RESOURCE ROW
interface ResourceRowProps {
    res: ResourceObjectType
}
const ResourceRow: React.FC<ResourceRowProps> = ({
    res
}: ResourceRowProps) => {
    return (
        <div key={res.amount} className={`res-row res-${res.name}`}>
            <span className="res-cell">{res.label}</span>
            <span className="res-cell">{fixFloatingPointNumber(res.amount)}</span>
            <span className="res-cell">{0}</span>
            <span className="res-cell">{0}</span>
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
}
const ResourceTable: React.FC<ResourceTableProps> = ({
    resources
}: ResourceTableProps) => {

    return (
        <div className="table res-table">
            {
                resources.map((res, i) => (
                    <ResourceRowMemo
                        key={i}
                        res={res}
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
    const [game, setGame] = useState(g);

    useEffect(() => {
        game.observer.on('ui-update', (ga: Game):void => {
            setGame(ga)
        });
    }, []);

    function getResources(): ResourceObjectType[] {
        return Object.values(game.res.resources)
    }

    return (
        <>
            <div className="res-container">
                <label className="table-label">resources</label>
                <ResourceTable
                    resources={getResources()}
                />
            </div>
        </>
    )
}