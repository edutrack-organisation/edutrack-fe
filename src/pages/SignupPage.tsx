import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState<string>('');

    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);

    const [reenterPassword, setReenterPassword] = useState<string>('');
    const [showReenterPassword, setShowReenterPassword] = useState<boolean>(false);
    const [isReenterPasswordValid, setIsReenterPasswordValid] = useState<boolean>(true);

    const navigate = useNavigate();

    const handleSignup = () => {
        // TODO: wire in logic with BE
        if (password != reenterPassword) {
            alert("Password inconsistent.");
        } else {
            alert("Thank you for signing up!");
            navigate('/login');
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const invalidPasswordMessage = 'Password must be at least 8 characters long';
    const validatePassword = (password: string) => {
        setIsPasswordValid(password.length >= 8); // Check if password meets the criteria
    };

    const handleToggleReenterPasswordVisibility = () => {
        setShowReenterPassword(!showReenterPassword);
    };

    const invalidReenterPasswordMessage = "Your password does not match";
    const validateReenterPassword = (reenterPassword: string) => {
        setIsReenterPasswordValid(reenterPassword == password); // Check if reentered password is the same as the password
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
                <Typography variant="h5" gutterBottom>Sign up</Typography>

                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        validatePassword(e.target.value);
                    }}
                    error={!isPasswordValid} // Apply error styling when invalid
                    helperText={
                        !isPasswordValid ? invalidPasswordMessage : ''
                    } // Show error message when invalid
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Re-enter Password"
                    type={showReenterPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={reenterPassword}
                    onChange={(e) => {
                        setReenterPassword(e.target.value);
                        validateReenterPassword(e.target.value);
                    }}
                    error={!isReenterPasswordValid} // Apply error styling when invalid
                    helperText={
                        !isReenterPasswordValid ? invalidReenterPasswordMessage : ''
                    } // Show error message when invalid
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleToggleReenterPasswordVisibility}
                                    edge="end"
                                >
                                    {showReenterPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSignup}
                    sx={{ marginTop: 2 }}
                >
                    Sign Up
                </Button>
            </Box>
        </Container>
    );
};

export default SignupPage;
