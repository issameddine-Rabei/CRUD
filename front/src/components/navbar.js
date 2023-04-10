import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/"> Home</Link>
      <Link to="/create-user"> Create User</Link>
      <Link to="/auth"> Login/Register</Link>
      <Link to="/saved"> Saved</Link>
    </div>
  );
};
