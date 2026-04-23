import './OldFileList.css';
export default function OldFileList(props) {
    function openOldFile(file) {
        props.openTextArea(null, file.text, file.name)
    }
    return (
        <ul className="old-file-list">
            {props.list.map((file, index) => <li key={index} onClick={() => {
                openOldFile(file)
                props.closeFileList()
            }}>{file.name}</li>)}
        </ul>
    )
}