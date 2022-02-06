import React from 'react';
import { game, Effects, $I } from '../../../game';

import { Building, Price } from '../../../managers/buildings';
import { Resource } from '../../../managers/resources';
import { fixFloatingPoint } from '../../../utils';
import { Tooltip, TooltipBody, TooltipSection } from './tooltip';

interface CivilizationTooltipProps {
    description: string;
    model: Building;
}
export function CivilizationTooltip({
    description,
    model
}: CivilizationTooltipProps): JSX.Element {
    return (
        <Tooltip>
            <TooltipBody>
                <div>{description}</div>

                {model && (
                    <>
                        <hr />
                        <PriceSection model={model} />
                        <hr />
                        <EffectSection model={model} />
                    </>
                )}

            </TooltipBody>
        </Tooltip>
    );
}


// PRIVATE COMPONENTS
interface PriceSectionProps {
    model: Building
}
function PriceSection({
    model
}: PriceSectionProps): JSX.Element {
    function formatTime(res: Resource, goal: number): JSX.Element {
        const resPerTick = game.getEffect(`${res.name}PerTickBase`);
        const resAmt = res.amount;
        let seconds = Math.ceil(((goal - resAmt) / resPerTick) / game.tickRate);

        let minutes = Math.floor(seconds / 60);
        seconds %= 60;

        const hours = Math.floor(minutes / 60);
        minutes %= 60;

        return Number.isFinite(seconds) && (
            <div>( {hours} h {minutes} m {seconds} s )</div>
        )
    }

    function getPrice(price: Price): number {
        return game.bld.getTotalPrice(model, price)
    }

    return (
        <TooltipSection label='prices'>
            {model.prices.map((price: Price, i: number) => {
                const res = game.res.resources[price.name];
                return <PriceElement
                    label={res.label}
                    amount={fixFloatingPoint(res.amount)}
                    time={formatTime(res, getPrice(price))}
                    price={getPrice(price)}
                    key={i}
                />
            })}
        </TooltipSection>
    )
}

interface PriceElementProps {
    label: string;
    amount: number;
    price: number;
    time: JSX.Element;
}
function PriceElement({
    label, amount, price, time
}: PriceElementProps): JSX.Element {
    return (
        <div className="tooltip__price">
            <span className="tooltip__price-label">{label}</span>
            {
                amount < price ? (
                    <div className="tooltip__price-rs">
                        <span className="tooltip__price-amount">{amount}</span>
                        <span className="tooltip__price-max">{price}</span>
                        <span className="tooltip__price-time">{time}</span>
                    </div>
                ) : (
                    <div className="tooltip__price-rs">
                        {price}
                    </div>
                )
            }
        </div>
    )
}

interface EffectSectionProps {
    model: Building
}
function EffectSection({
    model
}: EffectSectionProps): JSX.Element {
    return (
        <TooltipSection label='effects'>
            {Object.entries(model.effects).map(([effectName, effectValue], i: number) => (
                <div className="tooltip__price">
                    <span>{$I(effectName)}</span>
                    <span>{effectValue}</span>
                </div>
            ))}
        </TooltipSection>
    )
}