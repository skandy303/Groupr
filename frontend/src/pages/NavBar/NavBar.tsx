import React, {
  useState,
  KeyboardEvent,
  MouseEvent,
  Fragment,
  useContext,
} from "react";
import {
  Box,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { logout } from "api";
import { UserContext } from "../../contexts";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ClassIcon from "@mui/icons-material/Class";
import logo from "../../assets/logo/Grouper-croped.png";
export const NavBar = () => {
  const [open, setOpen] = useState(false); //open or not

  const location = "left"; //location of the drawer

  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  const toggleDrawer = () => (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" ||
        (event as KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(!open);
  };

  const logoutMutation = useMutation(logout, {
    onError: () => {},
    onSuccess: () => {
      userContext?.setUserState({
        loggedIn: false,
        user: undefined,
      });
      navigate("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const list = () => (
    <Box
      sx={{
        width: 150,
        marginTop: 2,
      }}
    >
      <List>
        <ListItem
          key={"Projects"}
          disablePadding
          onClick={() => navigate("/projects")}
        >
          <ListItemButton>
            <ClassIcon />
            <ListItemText primary={"Projects"} sx={{ marginLeft: 2 }} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Logout"} disablePadding onClick={handleLogout}>
          <ListItemButton>
            <ExitToAppIcon />
            <ListItemText primary={"Logout"} sx={{ marginLeft: 2 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Fragment>
      <Box display="flex">
        <Box role="presentation" onClick={toggleDrawer()}></Box>
        {
          <Fragment>
            <Button onClick={toggleDrawer()}>
              <MenuIcon />
            </Button>
            <Drawer anchor={location} open={open} onClose={toggleDrawer()}>
              {list()}
            </Drawer>
          </Fragment>
        }
        <img src={logo} height="30vh"></img>
      </Box>
    </Fragment>
  );
};
