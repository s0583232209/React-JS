import Key from './Key';
import { lang } from './KeyboardData';
import './Keyboard.css';
export default function Keyboard(prop) {
    function changeLanguageKeyboard(e) {
        prop.changeLanguage((prev) => (prev + 1) % 3);
        prop.changeDirection((prev) => {
            if ((prop.language) % 3 == 1) return prev;
            if ((prop.language) % 3 == 0) return 'rtl';
            if ((prop.language) % 3 == 2) return 'ltr';
        });
    }
    const keysArray = lang[prop.language].letters.map(letter => <Key key={letter} value={letter}
        onClick={prop.onClick} />);
    const changeLanguage = <Key changeLanguage={true} key='changeLanguage'
        value={'Change Language ( ' + lang[(prop.language + 1) % 3].language + ' )'}
        onClick={changeLanguageKeyboard} />;
    return (
        <div className="keyboard">
            {keysArray}
            {changeLanguage}
        </div>
    )
}
