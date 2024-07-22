import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../utils/functions";

// eslint-disable-next-line no-unused-vars
export default function PriceRange({ max = 0, min = 0, onChange = (max, min) => {}, onMaxChange = (newMax) => {}, onMinChange = (newMin) => {} }) {

    const sliderMin = useRef(null);
    const sliderMax = useRef(null);

    const spanRef = useRef(null);
    const [ fontSize, setFontSize ] = useState('30px');
    const [ fontMode, setFontMode ] = useState('add');
    
    const [ values, setValues ] = useState(`00.00lv. - ${max}lv.`);

    useEffect(() => {
        setValues(`00.00lv. - ${max}lv.`);
    }, [max])

    useEffect(() => {
        if(spanRef.current) {
            if(spanRef.current.offsetHeight > 44) {
                setFontSize((prev) => `${ parseInt(prev) - 1 }px`);
            } else if(fontMode !== 'add') {
                setFontSize((prev) => `${ parseInt(prev) + 1 }px`);
                setFontMode('add');
            }
        }
    }, [values, fontSize]);

    function handlePriceRangeChange() {
        
        if(sliderMin.current.value * 1 > sliderMax.current.value * 1) {
            onMaxChange(sliderMin.current.value);
            onMinChange(sliderMax.current.value);
            onChange(formatNumber(sliderMin.current.value / 100), formatNumber(sliderMax.current.value / 100));
            setValues(`${formatNumber(sliderMax.current.value / 100)}lv. - ${formatNumber(sliderMin.current.value / 100)}lv.`);
        } else {
            onMinChange(sliderMin.current.value);
            onMaxChange(sliderMax.current.value);
            onChange(formatNumber(sliderMax.current.value / 100), formatNumber(sliderMin.current.value / 100));
            setValues(`${formatNumber(sliderMin.current.value / 100)}lv. - ${formatNumber(sliderMax.current.value / 100)}lv.`);
        }
    } 
    return (
        <div className="price-range-box">
            <p className="title">Price Range</p>
            <span className="range-values" style={{ fontSize: fontSize }} ref={spanRef}>{values}</span>
            <div className="range-slider">
                <input
                    ref={sliderMin}
                    onChange={handlePriceRangeChange}
                    defaultValue={min}
                    min={min * 100}
                    max={max * 100}
                    type="range"
                    className="range-input"
                />
                <input
                    ref={sliderMax}
                    onChange={handlePriceRangeChange}
                    defaultValue={max * 100}
                    min={min * 100}
                    max={max * 100}
                    type="range"
                    className="range-input"
                />
            </div>
        </div>
    )
}