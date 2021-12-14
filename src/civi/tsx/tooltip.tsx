import React, { ReactElement } from 'react'
import { Game } from '../game'
import { Button } from '../ui'
import { Price } from '../managers/buildings'


interface TooltipSectionProps {
    label: string;
    children: ReactElement[] | string
}
const TooltipSection: React.FC<TooltipSectionProps> = ({
    label,
    children
}: TooltipSectionProps) => {
    return (
        <div className="tooltip__section">
            <p className="tooltip__label">{label}</p>
            {children}
        </div>
    )
}

interface TooltipProps {
    game: Game;
    button: Button
}
export const Tooltip: React.FC<TooltipProps> = ({
    game,
    button
}: TooltipProps) => {
    const getPrice = (price: Price): number => game.bld.getTotalPrice(button.model, price)

    const formatTime = (currAmt: number, maxAmount: number, rate: number): ReactElement => {
        const diff = maxAmount - currAmt;
        const seconds = (diff / rate) / game.tickrate;
        return (
            Number.isFinite(seconds) && (<div>( {seconds} s )</div>)
        )
    }

    return (
        <React.Fragment>
            <header className="tooltip__header"></header>
            <div className="tooltip__body">
                <p>{button.description}</p>

                {button.model && (
                    <React.Fragment>
                        <hr />
                        <TooltipSection label="prices">
                            {button.model.prices.map((price: Price, i) => (
                                <div className="tooltip__price" key={i}>
                                    <span className="tooltip__price-label">{game.res.resources[price.name].label}</span>
                                    {
                                        game.res.resources[price.name].amount < getPrice(price) ? (
                                            <div className="tooltip__price-rs">
                                                <span className="tooltip__price-amount">{game.res.resources[price.name].amount}</span>
                                                <span className="tooltip__price-max">{getPrice(price)}</span>
                                                <span className="tooltip__price-time">{formatTime(game.res.resources[price.name].amount, getPrice(price), 0)}</span>
                                            </div>
                                        ) : (
                                            <span className="tooltip__price-rs">{getPrice(price)}</span>
                                        )

                                    }
                                </div>
                            ))}

                        </TooltipSection>
                        <hr />
                        <TooltipSection label="effects">
                            {Object.entries(button.model.effects).map(([ effectName, effectValue ], i) => (
                                <div key={i}>
                                    <span>{game.stringifyEffect(effectName)}</span>
                                    <span>{effectValue}</span>
                                </div>
                            ))}
                        </TooltipSection>
                    </React.Fragment>
                )}
            </div>
            <footer className="tooltip__footer"></footer>
        </React.Fragment>
    )
}