import fontsData from './fontsData';
import { useState } from 'react';
import './DesignRuller.css';
export default function DesignRuller(props) {
    const [rangeValue, setRangeValue] = useState(10);
    const [colorValue, setColorValue] = useState('#000000');
    const [fontValue, setFontValue] = useState('arial');
    const [activeMode, setActiveMode] = useState('future');
    function onToolClick(type, value) {
        props.setCurrentStyle((prev) => ({ ...prev, [type]: value }));

    }
    function onToolClickAll(type, value) {
        props.setText(prev => {
            prev[props.activeTextArea.number] = prev[props.activeTextArea.number].map(charObj =>
            ({
                ...charObj,
                style: {
                    ...charObj.style,
                    [type]: value
                }
            }))
            return prev
        });
        props.setCurrentStyle(prev => ({ ...prev, [type]: value }));
        props.setBackupText(prev => [...prev, props.text]);
    }

    return (
        <div className="designRuller">
            <div id="changeState">
                <button type="button" id="styleFuture"
                    className={activeMode === 'future' ? 'active' : 'not-active'}
                    onClick={() => setActiveMode('future')}
                >Style Future Text</button>
                <button type="button" id="styleAll"
                    className={activeMode === 'all' ? 'active' : 'not-active'}
                    onClick={() => setActiveMode('all')}
                >Style All Text</button>
            </div>

            <div className="control-group">
                <label htmlFor='color'>Color</label>
                <input name='color' type='color' value={colorValue} onChange={(e) => {
                    setColorValue(e.target.value);
                    activeMode === 'future' ? onToolClick('color', e.target.value)
                        : onToolClickAll('color', e.target.value);
                }}></input>
            </div>

            <div className="control-group">
                <label htmlFor='font'>Font</label>
                <select name='font' value={fontValue} onChange={(e) => {
                    setFontValue(e.target.value);
                    activeMode === 'future' ? onToolClick('fontFamily', e.target.value)
                        : onToolClickAll('fontFamily', e.target.value);
                }}>
                    {fontsData.map((font, key) => {
                        return <option value={font} key={key} style={{ fontFamily: font }}>
                            {font}</option>
                    })}
                </select>
            </div>

            <div className="control-group">
                <label htmlFor='font-size'>Font Size</label>
                <input name='font-size' type='range' min='10' max='50' step='2' value={rangeValue}
                    onChange={(e) => {
                        setRangeValue(e.target.value);
                        activeMode === 'future' ? onToolClick('fontSize', e.target.value + 'px')
                            : onToolClickAll('fontSize', e.target.value + 'px');
                    }}></input>
                <span>{rangeValue}px</span>
            </div>
        </div>
    )
}
