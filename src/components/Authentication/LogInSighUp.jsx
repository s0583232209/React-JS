import { useState } from "react";
import '../Authentication/LogInSignUp.css'
function logIn(e, userName, password) {
    e.preventDefault();
    let existedUser = JSON.parse(localStorage.getItem(userName)) || null;
    if (!existedUser) {
        return false;
    }
    else {
        {
            if (existedUser.password == password) {
                sessionStorage.setItem('current-user', JSON.stringify(userName));
                return true;
            }
            else {
                alert('Pleas Check All Details')
                return false;
            }
        }
    }
}
function signUp(e, userName, password) {
    e.preventDefault();
    if (userName == '' || password == '') {

        return false;
    }
    let user = JSON.parse(localStorage.getItem(userName)) || null;
    if (user) {
        alert("The user name is not valid")
        return false;

    }
    let userDtl = {
        name: userName,
        password: password,
        files: []
    }
    localStorage.setItem(`${userName}`, JSON.stringify(userDtl));
    sessionStorage.setItem('current-user', JSON.stringify(userName));
    return true;
}
export default function LogInSignUp(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div id="enter">
            <div id="form">
                <form method="POST">
                    <div id="userNameDiv">
                        <label htmlFor="userName">User Name</label>
                        <input type="text" name="userName" id="userName" value={userName}
                            onChange={(e) => { setUserName(e.target.value) }} />
                        <p id="userNameMessage"></p>
                    </div>
                    <div id="passwordDiv">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <p id="passwordMessage"></p>
                    </div>
                    <div id="formMessage"></div>
                    <div id="buttons">
                        <button type="button" id="signUp" onClick={(e) => {
                            if (signUp(e, userName, password))
                                props.end()
                        }}>Sign Up</button>
                        <button type="button" id="logIn" onClick={(e) => {
                            if (logIn(e, userName, password))
                                props.end()
                        }}>Log In</button>
                    </div>
                </form>
            </div>
        </div>
    )
}