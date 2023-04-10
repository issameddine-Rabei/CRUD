import axios from "axios";
import { useState } from "react";

export const CreateUser = () => {
  return (
    <div className="auth">
      <Create />
    </div>
  );
};

const Create = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [role, setRole] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault(); // when we submit the form it won't refresh the page
    try {
      await axios.post("http://localhost:8000/api/v1/users/create", {
        username,
        name,
        email,
        password,
        phone,
        profileImg,
        role,
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
      phone={phone}
      setPhone={setPhone}
      profileImg={profileImg}
      setProfileImg={setProfileImg}
      role={role}
      setRole={setRole}
      label="Create user"
      onSubmit={onSubmit}
    />
  );
};

const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  profileImg,
  setProfileImg,
  role,
  set,
  setRole,
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
            required
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
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">email: </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">phone: </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profileImg">profileImg: </label>
          <input
            type="file"
            id="profileImg"
            value={profileImg}
            onChange={(event) => setProfileImg(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Select One</option>
            <option value="Employee">Employee</option>
            <option value="Superadmin">Superadmin</option>
            <option value="Production Manager">Production Manager</option>
          </select>
        </div>

        <button type="submit">{label}</button>
      </form>
    </div>
  );
};
