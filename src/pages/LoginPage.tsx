import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { AuthContextType, User } from '../types/types';

const LoginPage = () => {
    const [username, setUsername] = useState<string | null>('');
    const [password, setPassword] = useState<string | null>('');
    const [showPassword, setShowPassword] = useState<boolean | null>(false);

    const { login }: AuthContextType = useAuthContext();
    const navigate = useNavigate();

    const handleLogin = () => {
        // TODO: wire in logic with BE
        alert(`Username: ${username}\nPassword: ${password}`);
        // TODO: API logic
        const user: User = { userId: 123 };
        login(user);
        navigate('/');
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Container maxWidth="xs">
                <Box sx={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
                    <Typography variant="h5" gutterBottom>Login</Typography>
                    
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
                        onChange={(e) => setPassword(e.target.value)}
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

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogin}
                        sx={{ marginTop: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
