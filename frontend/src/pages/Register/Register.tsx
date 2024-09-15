import { Button, TextField, Box, Typography } from "@mui/material";
import React, { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/Grouper-croped.png";
import { UserContext } from "../../contexts";
import { AxiosError } from "axios";
import {
  RegisterRequest,
  RegisterResponse,
  UserType,
} from "../../api/api-client-types";
import "./Register.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { register } from "api";

export const Register: React.FC = () => {
  const [info, setInfo] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    user_type: "professor",
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  const registerMutation = useMutation(register, {
    onError: (error) => {
      setInfo({
        name: "",
        email: "",
        password: "",
        user_type: "professor",
      });
      setError(true);

      // Jank last minute error message implementation
      if (error instanceof AxiosError) {
        const err = error?.response?.data?.reason as AxiosError;
        Object.values(err).forEach((key: any, i) => {
          if (i === 0) {
            setErrorMessage(key);
          }
        });
      }
    },
    onSuccess: (data) => {
      userContext?.setUserState({
        loggedIn: true,
        user: data.user,
      });
      navigate("/projects");
    },
  });

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log(info);
    registerMutation.mutate(info);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInfo((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfession = (e: SelectChangeEvent<UserType>) => {
    let value: UserType = e.target.value as UserType;
    info.user_type = value;
  };

  return (
    <div className="register">
      <form onSubmit={handleRegister}>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={600}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          padding={10}
          borderRadius={1}
          bgcolor={"#FFFFFF"}
        >
          <img src={logo} />
          <TextField
            required
            name="name"
            margin="dense"
            type={"text"}
            variant="outlined"
            label="Name"
            helperText="Please enter your name"
            value={info.name}
            onChange={handleChange}
            sx={{
              input: { bgcolor: "white" },
              mt: 5,
            }}
          />
          <TextField
            required
            name="email"
            margin="normal"
            type={"email"}
            variant="outlined"
            label="Email"
            helperText="Please enter your email"
            value={info.email}
            onChange={handleChange}
            sx={{
              input: { bgcolor: "white" },
            }}
          />
          <TextField
            required
            name="password"
            margin="normal"
            type={"password"}
            variant="outlined"
            label="Password"
            helperText="Please choose a password"
            value={info.password}
            onChange={handleChange}
            sx={{
              input: { bgcolor: "white" },
            }}
          />

          <FormControl required sx={{ m: 3, minWidth: 195 }}>
            <InputLabel>Profession</InputLabel>
            <Select
              defaultValue={info.user_type}
              label="Profession *"
              onChange={handleProfession}
            >
              <MenuItem value={"student"}>Student</MenuItem>
              <MenuItem value={"professor"}>Professor</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: 5,
              borderRadius: 5,
              marginBottom: 5,
              width: 200,
            }}
          >
            Register
          </Button>
          {error && (
            <Typography sx={{ color: "red", textAlign: "center" }}>
              {errorMessage}
            </Typography>
          )}
          <Link to="/login">Login</Link>
        </Box>
      </form>
    </div>
  );
};
export default Register;
