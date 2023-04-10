import { useState } from "react";
import axios from "axios";

export const Auth = () => {
  return (
    <div className="auth">
      <Login />
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault()
    try{
      await axios
    }
    catch(err){
      console.error(err)
    }
  }  
  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
    />
  );
};

/*const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault(); // when we submit the form it won't refresh the page
    try {
      await axios.post("http://localhost:8000/api/v1/users/create", {
        username,
        name,
        email,
        password,
      });
      alert("User successfully created ");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      label="Create user"
      onSubmit={onSubmit}
    />
  );
};*/

const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  name,
  setName,
  email,
  setEmail,
  label,
  onSubmit,
}) => {
  const showNameandEmail = label === "Create user";
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit}>
        <h2> {label} </h2>
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        {showNameandEmail && (
          <>
            <div className="form-group">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">email: </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="password"> Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">{label}</button>
      </form>
    </div>
  );
};
