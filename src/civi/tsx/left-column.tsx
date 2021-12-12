import React, { useState, memo } from 'react'
import { Game } from '../game'
import { ResourceObjectType } from '../managers/resources'


// RESOURCE ROW
interface ResourceRowProps {
    res: ResourceObjectType
}
const ResourceRow: React.FC<ResourceRowProps> = ({
    res
}: ResourceRowProps) => {
    console.log(res.amount);
    
    return (
        <div className={`res-row res-${res.name}`}>
            <span className="res-cell">{res.label}</span>
            <span className="res-cell">{res.amount}</span>
            <span className="res-cell">{res.max}</span>
            <span className="res-cell">{res.pertick}</span>
        </div>
    )
}

function areEqual(a: ResourceRowProps, b: ResourceRowProps): boolean {
    return !(
        a.res.amount === b.res.amount &&
        a.res.max === b.res.max &&
        a.res.pertick === b.res.pertick
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
    const [game, _] = useState(g);

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