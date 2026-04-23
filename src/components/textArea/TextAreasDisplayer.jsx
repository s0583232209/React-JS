import { useState } from 'react';
import TextArea from "./TextArea";
import './TextAreasDisplayer.css';
export default function TextAreasDisplayer(props) {

    function removeTextArea(e) {
        props.setTextAreas(prev => prev.filter(textarea => textarea.id != e.target.parentElement.id))
        props.setText(prev => prev.filter((textArea,i)=>i!=e.target.parentElement.id))
    }
    return (
        <div className="text-areas">
            {props.textAreas.map(textArea =>
                <TextArea
                    makeActive={props.makeActiveTextArea}
                    id={textArea.id}
                    key={textArea.id}
                    changeChar={props.changeChar}
                    dir={props.direction}
                    label='text'
                    rows='10'
                    placeholder='place holder'
                    text={props.text[textArea.id] || []}
                    onChange={(e) => (e.target.textContent)}
                    close={removeTextArea}
                    handleSubmit={props.handleSubmit}
                    fileName={textArea.fileName}
                />
            )}
        </div>
    )
}
