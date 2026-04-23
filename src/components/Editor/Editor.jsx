
import { useState } from 'react';
import ActionBar from '../ActionButtons/ActionBar';
import TextAreasDisplayer from '../TextArea/TextAreasDisplayer';
import DesignRuller from '../DesignRuller/DesignRuller';
import Keyboard from '../Keyboard/Keyboard'
import './Editor.css';

let idChar = 0;
let functionToRunAfterKeyClick = null;
let charToChange = null;
let removeChooneBackgournd = false;
let currentActiveTextArea = 0;
export default function Editor(props) {
    const [textAreas, setTextAreas] = useState([]);
    const [activeTextArea, setActiveTextArea] = useState({
        number: 0,
        fileName: undefined
    })
    const [text, setText] = useState([[]]);
    const [i, setI] = useState(0);
    const [backupText, setBackupText] = useState([[]]);
    const [currentStyle, setCurrentStyle] = useState({
        color: 'white',
        fontFamily: 'arial',
        fontSize: '20px',
        backgroundColor: 'none'
    });
    const [language, changeLanguage] = useState(2);
    const [direction, changeDirection] = useState('rtl');

    function addTextArea(e, newText = [], fileName = undefined) {
        setTextAreas(prev => [...prev, { id: i, fileName: fileName }]);
        currentActiveTextArea = i;
        setActiveTextArea(prev => {
            prev.number = i
            return prev
        })
        setText(prev => {
            prev[i] = newText.map(char => {
                char.textArea = i;
                return char
            }) || []
            setBackupText(prevBackup => [...prevBackup, prev])
            return prev
        })
        setI(i + 1);
    }

    function regularKeyClick(e, style = currentStyle) {
        let charObj = {
            char: e.target.value,
            style: style,
            id: idChar++,
            textArea: currentActiveTextArea
        };
        setText(prev => {
            let newText = [...prev];
            if (newText.length <= currentActiveTextArea)
                newText.push([]);
            if (!Array.isArray(newText[currentActiveTextArea]))
                newText[currentActiveTextArea] = [];
            newText[currentActiveTextArea] = [...newText[currentActiveTextArea], charObj];
            setBackupText(prevBackup => [...prevBackup, JSON.parse(JSON.stringify(newText))]);
            return newText;
        });
    }

    function removeBackground() {
        removeChooneBackgournd = false;
        setText(prev => {
            const newText = prev.map(textAreaArr =>
                textAreaArr.map(obj => ({
                    ...obj,
                    style: {
                        ...obj.style,
                        backgroundColor: 'transparent'
                    }
                }))
            );
            setBackupText(prevBackup => [...prevBackup, JSON.parse(JSON.stringify(newText))]);
            return newText;
        });
    }

    function onKeyClick(e) {
        if (removeChooneBackgournd) {
            removeBackground();
        }
        if (!functionToRunAfterKeyClick)
            functionToRunAfterKeyClick = regularKeyClick;
        functionToRunAfterKeyClick(e, currentStyle);
        functionToRunAfterKeyClick = regularKeyClick;
    }

    function changeChar2(e) {
        setText(prev => {
            const newText = [...prev];
            newText[activeTextArea.number] = newText[activeTextArea.number].map(charObj =>
                charObj.id == charToChange.target.id ? {
                    ...charObj,
                    char: e.target.value
                } : charObj
            );
            setBackupText(prevBackup => [...prevBackup, JSON.parse(JSON.stringify(newText))]);
            return newText;
        });
    }

    function changeChar(e) {
        charToChange = e;
        setText(prev => {
            const newText = [...prev];
            newText[activeTextArea.number] = newText[activeTextArea.number].map(charObj =>
                charObj.id == charToChange.target.id ? {
                    ...charObj,
                    style: {
                        ...charObj.style,
                        backgroundColor: 'aqua'
                    }
                } : charObj
            );
            setBackupText(prevBackup => [...prevBackup, JSON.parse(JSON.stringify(newText))]);
            return newText;
        });
        removeChooneBackgournd = true;
        functionToRunAfterKeyClick = changeChar2;
    }

    function searchChar(e) {
        functionToRunAfterKeyClick = searchCharLevel2;
    }

    function searchCharLevel2(e) {
        setText(prev => {
            const newText = [...prev];
            newText[activeTextArea.number] = newText[activeTextArea.number].map(obj =>
                obj.char === e.target.value ? {
                    ...obj,
                    style: {
                        ...obj.style,
                        backgroundColor: 'orange'
                    }
                } : obj
            );
            setBackupText(prevBackup => [...prevBackup, JSON.parse(JSON.stringify(newText))]);
            return newText;
        });
        removeChooneBackgournd = true;
    }

    function makeActiveTextArea(e) {
        const newActiveNumber = Number(e.target.parentElement.id);
        currentActiveTextArea = newActiveNumber;
        setActiveTextArea(prev => ({ ...prev, number: newActiveNumber }));
        if (text.length <= newActiveNumber) {
            setText(prev => [...prev, []]);
        }
    }

    return (
        <div className="editor-container">
            <DesignRuller
                text={text}
                setBackupText={setBackupText}
                setCurrentStyle={setCurrentStyle}
                activeTextArea={activeTextArea}
                setText={setText}
            />
            <div className="text-display-section">
                <TextAreasDisplayer
                    text={text}
                    direction={direction}
                    changeChar={changeChar}
                    makeActiveTextArea={makeActiveTextArea}
                    setActiveTextArea={setActiveTextArea}
                    add={addTextArea}
                    textAreas={textAreas}
                    setTextAreas={setTextAreas}
                    setText={setText}

                />
            </div>

            <ActionBar
                backupText={backupText}
                setBackupText={setBackupText}
                activeTextArea={activeTextArea}
                text={text}
                setText={setText}
                searchChar={searchChar}
                openNewFile={addTextArea}
            />
            <Keyboard
                changeDirection={changeDirection}
                onClick={onKeyClick}
                language={language}
                changeLanguage={changeLanguage}
            />
        </div>
    );
}