"use client";
import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  CssBaseline,
  Toolbar,
  Collapse,
  AppBar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiUsers, logout } from "../../app/redux/slice";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

const Home = ({ children }) => {
  const [openMaster, setOpenMaster] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userAPIData, isLoading, error } = useSelector(
    (state) => state.user || {}
  );

  const handleClickMaster = () => {
    setOpenMaster(!openMaster);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchApiUsers()).unwrap();
      } catch (err) {
        if (err.message === "Unauthorized. Redirecting to login.") {
          router.push("/");
        }
      }
    };

    fetchData();
  }, [dispatch, router]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const Name = userAPIData?.name || "John";
  const role = userAPIData?.role || "user";
  const image = userAPIData?.image_url || "";

  // Utility function to get initials from the name
  const getInitials = (name) => {
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
  };

  const renderDashboardText = (role) => {
    switch (role) {
      case "admin":
        return "Admin Dashboard";
      case "teamlead":
        return "TL Dashboard";
      case "employee":
        return "Employee Dashboard";
      default:
        return "Dashboard";
    }
  };

  const sidebarContent = (
    <div
      role="presentation"
      className="flex flex-col h-full p-4 bg-gray-800 text-white"
    >
      <div className="flex justify-end mb-4">
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </div>
      <Link href="/dashboard">
        <div className="flex items-center mb-4">
          <Avatar src={image} alt="Profile" className="mr-4">
            {!image && getInitials(Name)}
          </Avatar>
          <div>
            <h2 className="text-lg font-bold">{renderDashboardText(role)}</h2>
            <p className="text-sm">{Name}</p>
          </div>
        </div>
      </Link>
      <Divider />
      <div
        role="presentation"
        className="flex flex-col h-full p-4 bg-gray-800 text-white"
      >
        <List className="mt-4">
          {role === "admin" && (
            <>
              <ListItem button onClick={handleClickMaster}>
                <ListItemText primary="Master" />
                {openMaster ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={openMaster} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Link href="/dashboard/client" passHref>
                    <ListItem button className="pl-8">
                      <ListItemText primary="Manage Clients" />
                    </ListItem>
                  </Link>
                  <Link href="/dashboard/project" passHref>
                    <ListItem button className="pl-8">
                      <ListItemText primary="Manage Projects" />
                    </ListItem>
                  </Link>
                </List>
              </Collapse>
              <Divider />
              <Link href="/dashboard/user">
                <ListItem button>
                  <ListItemText primary="Employees" />
                </ListItem>
              </Link>
              <Link href="/dashboard/task">
                <ListItem button>
                  <ListItemText primary="Assign Task" />
                </ListItem>
              </Link>
            </>
          )}
          {["manager", "employee", "teamlead"].includes(role) && (
            <Link href="/dashboard/taskwork" passHref>
              <ListItem button>
                <ListItemText primary="Work Task" />
              </ListItem>
            </Link>
          )}
        </List>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <CssBaseline />
      <AppBar position="fixed" className="bg-blue-500 z-10">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <span className="text-white ml-4 text-lg flex-1">
            Task Management
          </span>
          <div className="flex items-center space-x-2 relative">
            {isLoading ? (
              <BeatLoader color="#ffffff" loading={isLoading} size={15} />
            ) : (
              <div
                className="flex items-center cursor-pointer"
                onClick={handleProfileMenuOpen}
              >
                <Avatar src={image} alt="Profile">
                  {!image && getInitials(Name)}
                </Avatar>
                <span className="text-white ml-2">{Name}</span>
                <ArrowDropDownIcon className="text-white ml-1" />
              </div>
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  maxHeight: 200,
                  width: "200px",
                  mt: 1,
                },
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Link href="/dashboard/profile" passHref>
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              </Link>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        classes={{ paper: "w-64" }}
      >
        {sidebarContent}
      </Drawer>
      <div
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-0"
        }`}
      >
        <main className="p-4 mt-16">{children}</main>
      </div>
    </div>
  );
};

export default Home;
