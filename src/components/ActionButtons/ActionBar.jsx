import { useState } from 'react';
import OldFileList from '../FileManager/OpenCloseFile.jsx/OldFileList';
import ActionButton from './ActionButton';
import './ActionBar.css';
export default function ActionBar(props) {
    const [oldFileList, setOldFileList] = useState(null);
    function deleteAll(e) {
        props.setText(prev => {
            props.setBackupText(prevBackup => [...prevBackup, JSON.parse(JSON.stringify(prev))]);
            prev[props.activeTextArea.number] = []
            return prev;
        });
    }
    function undo() {
        if (props.backupText.length > 1) {
            const newBackup = [...props.backupText];
            newBackup.pop();
            const previousState = newBackup[newBackup.length - 1];
            props.setBackupText(newBackup);
            props.setText(JSON.parse(JSON.stringify(previousState)));
        } else {
            props.setText([[]]);
        }
    }
    function onDeleteOneClick() {
        props.setText(prev => {
            const updated = [...prev];
            updated[props.activeTextArea.number] = updated[props.activeTextArea.number].slice(0, -1);
            return updated;
        });
    }
    function deleteOneWord() {
        props.setText(prev => {
            const updated = [...prev];
            const textArr = updated[props.activeTextArea.number];
            const validValues = [" ", "enter"];
            const chars = textArr.map(obj => obj.char);
            const lastIndexes = validValues.map(val => chars.lastIndexOf(val));
            const lastIndex = Math.max(...lastIndexes);
            const newText = lastIndex === -1 ? [] : textArr.slice(0, lastIndex);
            updated[props.activeTextArea.number] = newText;
            props.setBackupText(prevBackup => [
                ...prevBackup,
                JSON.parse(JSON.stringify(updated))
            ]);

            return updated;
        });
    }
    function deleteAll() {
        props.setText(prev => {
            prev[props.activeTextArea.number] = []
            return prev;
        });
        props.setBackupText(prev => [...prev, JSON.parse(JSON.stringify(props.text))]);

    }

    function openOldFiles() {
        if (oldFileList) return;
        const user = JSON.parse(sessionStorage.getItem('current-user'));
        const data = JSON.parse(localStorage.getItem(user));
        const files = data.files
        if (files.length === 0) return;
        files.map(file => { name: file.name; text: file.text })
        setOldFileList(<OldFileList openTextArea={props.openNewFile} closeFileList={closeFileList}
            setText={props.setText} activeTextArea={props.activeTextArea} list={files}></OldFileList>);

    }
    function closeFileList() {
        setOldFileList(null)
    }
    const buttons = [
        { onActionButtonClick: undo, name: '↪' },
        { onActionButtonClick: onDeleteOneClick, name: 'Delete One' },
        { onActionButtonClick: deleteAll, name: 'Delete all' },
        { onActionButtonClick: deleteOneWord, name: 'Delete One Word' },
        { onActionButtonClick: props.searchChar, name: 'Search' },
        { onActionButtonClick: openOldFiles, name: 'Open Old File' },
        { onActionButtonClick: props.openNewFile, name: 'Open New Document' }]
    return (
        <div className="action-bar"> {/* Added action-bar class */}
            {buttons.map((button, i) => <ActionButton key={i} onClick={button.onActionButtonClick}
                name={button.name}></ActionButton>)}
            {oldFileList}
        </div>
    )
}