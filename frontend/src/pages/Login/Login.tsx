import { Button, TextField, Box } from "@mui/material";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/Grouper-croped.png";
import "./Login.css";
import { login } from "../../api/api-client";
import { UserContext } from "../../contexts/UserContext";
import { useMutation } from "@tanstack/react-query";

interface Info {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const emptyState = {
    email: "",
    password: "",
  };
  const [info, setInfo] = useState<Info>(emptyState);
  const navigate = useNavigate();
  const loginMutation = useMutation(login, {
    onError: () => {
      setInfo(emptyState);
    },
    onSuccess: (data) => {
      userContext?.setUserState({
        loggedIn: true,
        user: data.user,
      });
      navigate("/projects");
    },
  });

  const userContext = useContext(UserContext);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    loginMutation.mutate(info);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInfo((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={600}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginBottom={10}
          padding={10}
          borderRadius={1}
          bgcolor={"#FFFFFF"}
        >
          <img src={logo} />
          {loginMutation.isError && <span>Login Failed</span>}
          <TextField
            name="email"
            margin="normal"
            type={"email"}
            variant="outlined"
            placeholder="Email"
            value={info.email}
            onChange={handleChange}
            sx={{
              input: { bgcolor: "white" },
            }}
          />
          <TextField
            name="password"
            margin="normal"
            type={"password"}
            variant="outlined"
            placeholder="Password"
            value={info.password}
            onChange={handleChange}
            sx={{
              input: { bgcolor: "white" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loginMutation.isLoading}
            sx={{
              marginTop: 5,
              borderRadius: 5,
              marginBottom: 5,
              width: 200,
            }}
          >
            Login
          </Button>
          <Link to="/Register">Register</Link>
        </Box>
      </form>
    </div>
  );
};
export default Login;
