import { useState } from 'react';
import './SavingForm.css';
export default function SavingForm(props) {
    const [savingName, setSavingName] = useState('');
    function handleSubmit(e) {
        e.preventDefault();
        props.handleSubmit(props.text, savingName);
    }
    return (
        <form className="saving-form" method='POST'>
            <label htmlFor="saving">Saving</label>
            <input type="text" name="saving" id="saving" onChange={(e) => setSavingName(e.target.value)}
                value={savingName} />
            <button type='button' onClick={handleSubmit} >Submit</button>
        </form>
    )
}