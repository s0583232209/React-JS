import { useState } from "react";
import SavingForm from "./SavingForm"
import './SavingController.css';
export default function SavingController(props) {
    const [formOrButton, setFormOrButton] = useState(false)
    function afterSubmit(file, savingName) {
        onSubmitSavingForm(file, savingName);
    }
    function saveUpdate() {
        const user = JSON.parse(sessionStorage.getItem('current-user'));
        const data = JSON.parse(localStorage.getItem(user));
        const oldFileIndex = data.files.findIndex(file => file.name == props.fileName)
        if (oldFileIndex == -1)
            return setFormOrButton(true)
        data.files[oldFileIndex].text = props.text;
        localStorage.setItem(`${user}`, JSON.stringify(data));
    }
    function onSubmitSavingForm(file, savingName) {
        const user = JSON.parse(sessionStorage.getItem('current-user'));
        let data = JSON.parse(localStorage.getItem(user));
        const isFileExists = data.files.findIndex((f) => f.name == savingName);

        if (isFileExists != -1) {
            alert('this file allready exists')
            return;
        }
        data.files.push({ name: savingName, text: file.text });
        localStorage.setItem(`${user}`, JSON.stringify(data));
        setFormOrButton(false);
        props.setFileName(savingName)
    }
    return (
        <div className="saving-controller">
            {formOrButton ? (
                <SavingForm text={props.currentFile} handleSubmit={afterSubmit} />
            ) : (
                <>
                    <button onClick={() => setFormOrButton(true)}>save as</button>
                    <button onClick={saveUpdate}>save</button>
                </>
            )}
        </div>
    )
}