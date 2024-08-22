"use client";
import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Typography,
    Divider,
    Box,
    Button,
    Paper,
    Grid,
    IconButton,
    Tooltip,
    TextField,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DefaultPage from "../DefaultPage/DefaultPage.jsx";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApiUsers } from '../../app/redux/slice';
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import axios from 'axios'; 

// Validation schema excluding address
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phonenumber: Yup.string().matches(/^\+?\d+$/, 'Invalid phone number').required('Phone number is required'),
});

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true); 
    const router = useRouter();
    const dispatch = useDispatch();
    const { userAPIData, isLoading } = useSelector((state) => state.user || {});

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchApiUsers()).unwrap();
            } catch (err) {
                if (err.message === "Unauthorized. Redirecting to login.") {
                    router.push('/');
                }
            } finally {
                setIsLoadingData(false); 
            }
        };

        fetchData();
    }, [dispatch, router]);

    useEffect(() => {
        if (userAPIData) {
            setUser(userAPIData);
        }
    }, [userAPIData]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size exceeds 10 MB limit.');
                return;
            }
            setUser((prev) => ({ ...prev, profileImage: file }));
        }
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const formData = createFormData(values);

            const response = await axios.put(`/api/users/profileUpdate/${user._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const result = response.data;

            if (response.status === 200) {
                toast.success(result.msg || 'Profile updated successfully');
                setIsEditing(false);
                setError(null);
                setUser(prev => ({ ...prev, ...result.updateMe }));

                dispatch(fetchApiUsers());

            } else {
                toast.error(result.msg || 'Profile update failed');
                setError(result.error || 'Failed to update profile');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };


    const createFormData = (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phonenumber", values.phonenumber);

        if (user.profileImage) {
            formData.append("image", user.profileImage);
        }

        return formData;
    };

    if (isLoadingData) {
        return (
            <DefaultPage>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgcolor="rgba(255, 255, 255, 0.8)"
                    zIndex={1200} 
                >
                    <BeatLoader color="#1976d2" />
                </Box>
            </DefaultPage>
        );
    }

    if (!user) return null;

    return (
        <DefaultPage>
            <ToastContainer />
            <Box sx={{ padding: 5, maxWidth: 600, margin: 'auto', backgroundColor: '#f0f4f8', position: 'relative' }}>
                <Paper elevation={5} sx={{ padding: 4, borderRadius: 2, backgroundColor: '#ffffff' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative">
                            <Avatar
                                src={user.image_url}
                                alt={user.name}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    border: '2px solid #1976d2',
                                    transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.05)' },
                                }}
                            />
                            {isEditing && (
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: '#1976d2',
                                        color: '#fff',
                                        '&:hover': {
                                            bgcolor: '#1565c0',
                                        },
                                    }}
                                >
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <CameraAltIcon />
                                </IconButton>
                            )}
                        </Box>

                        {isEditing ? (
                            <Formik
                                initialValues={{
                                    name: user.name || '',
                                    email: user.email || '',
                                    phonenumber: user.phonenumber || ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSave}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            variant="outlined"
                                            label="Name"
                                            name="name"
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                            sx={{ mb: 2 }}
                                        />
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            variant="outlined"
                                            label="Email"
                                            name="email"
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                            sx={{ mb: 2 }}
                                        />
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            variant="outlined"
                                            label="Phone"
                                            name="phonenumber"
                                            error={touched.phonenumber && Boolean(errors.phonenumber)}
                                            helperText={touched.phonenumber && errors.phonenumber}
                                            sx={{ mb: 2 }}
                                        />
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" gap={2}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={loading}
                                                    sx={{
                                                        '&:hover': { backgroundColor: '#1565c0', transform: 'scale(1.05)' },
                                                        borderRadius: '20px',
                                                    }}
                                                >
                                                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Form>
                                )}
                            </Formik>

                        ) : (
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {`${user.name}`}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Email: </strong> {user.email}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                        <strong>Phone: </strong> {user.phonenumber}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Tooltip title={isEditing ? "Cancel editing" : "Edit your profile"} arrow>
                                <IconButton
                                    onClick={() => setIsEditing(!isEditing)}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: isEditing ? '#e57373' : '#1976d2',
                                        '&:hover': {
                                            backgroundColor: isEditing ? '#c62828' : '#0d47a1',
                                            transform: 'scale(1.05)',
                                        },
                                        borderRadius: '20px',
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={6}>
                            {error && (
                                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </DefaultPage>
    );
};

export default Profile;
