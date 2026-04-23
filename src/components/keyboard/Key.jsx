import './Key.css';
import './Key.css';

export default function Key(prop) {
    let className;
    if (prop.changeLanguage)
        className = 'key changeLanguage'
    else
        className = 'key'
    return (
        <button className={className} onClick={prop.onClick} value={prop.value}>{prop.value}</button>
    );
}