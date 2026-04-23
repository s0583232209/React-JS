import { useState } from 'react';
import SavingController from '../FileManager/Saving/SavingController'
import './TextArea.css';
export default function TextArea(props) {
    const end = <span className='blinking-cursor'>|</span>;
    let theText = <span> </span>;
    const [form, setForm] = useState(false)
    const [fileName, setFileName] = useState(props.fileName)
    if (props.text.length) {
        theText = props.text.map((charObj) => {
            if (charObj.textArea != props.id)
                return null;
            if (charObj.char == 'enter') {
                return <br id={charObj.id} onClick={props.changeChar} key={charObj.id} />;
            }
            if (charObj.char == " ")
                return <span id={charObj.id} className="space" onClick={props.changeChar}
                    key={charObj.id} style={charObj.style}>{charObj.char}</span>;

            return <span id={charObj.id} onClick={props.changeChar} key={charObj.id}
                style={charObj.style}>{charObj.char}</span>;
        });
    }
    function handleConfirmation(e) {
        const userConfirmed = window.confirm("Are you sure you saved all your files?");
        if (userConfirmed) {
            props.close(e)
        }
    };

    return (
        <div id={props.id} dir={props.dir} className="form-group" onDoubleClick={props.makeActive} >
            <button type='button' onClick={handleConfirmation}>X</button>
            <label >{props.label}</label>
            <div dir={props.dir} className="form-control" style={{
                minHeight: `${props.rows * 20}px`,
                width: '100%', border: '1px solid #ccc', padding: '8px'
            }} >
                {theText}
                {end}
            </div>
            <SavingController text={props.text} fileName={fileName} setFileName={setFileName}
                handleSubmit={props.handleSubmit} currentFile={{ name: props.id, text: props.text }}
                form={form} popForm={() => setForm(true)}></SavingController>
        </div>
    )
}