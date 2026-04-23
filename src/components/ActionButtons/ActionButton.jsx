import './ActionButton.css'; 

export default function ActionButton(props) {
    const getDataAction = (name) => {
        if (name.toLowerCase().includes('delete')) return 'delete';
        if (name === '↪') return 'undo';
        if (name.toLowerCase().includes('log out')) return 'logout';
        return 'default';
    };
    return (
        <button
            type='button'
            className="action-button"
            data-action={getDataAction(props.name)}
            onClick={props.onClick}>
            {props.name}
        </button>
    )
}