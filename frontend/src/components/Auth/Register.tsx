import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth();
    const { showSuccess, showError } = useToast();
    const navigate = useNavigate();

    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasMinLength = password.length >= 6;
        
        return {
            isValid: hasUpperCase && hasLowerCase && hasNumber && hasMinLength,
            errors: [
                !hasMinLength && 'Password must be at least 6 characters',
                !hasUpperCase && 'Password must contain at least one uppercase letter',
                !hasLowerCase && 'Password must contain at least one lowercase letter',
                !hasNumber && 'Password must contain at least one number'
            ].filter(Boolean)
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Client-side validation
        if (!name.trim()) {
            const errorMessage = 'Name is required';
            setError(errorMessage);
            showError(errorMessage);
            return;
        }
        
        if (!email.trim()) {
            const errorMessage = 'Email is required';
            setError(errorMessage);
            showError(errorMessage);
            return;
        }
        
        if (password !== confirmPassword) {
            const errorMessage = 'Passwords do not match';
            setError(errorMessage);
            showError(errorMessage);
            return;
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            const errorMessage = passwordValidation.errors.join(', ');
            setError(errorMessage);
            showError(errorMessage);
            return;
        }
        
        try {
            await register(name, email, password);
            showSuccess('Account created successfully! Welcome to Task Manager.');
            navigate('/');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
            showError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-card-foreground">Create Account</h1>
                        <p className="text-muted-foreground mt-2">Sign up to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                                placeholder="Create a password"
                                required
                            />
                            {password && (
                                <div className="mt-2 space-y-1">
                                    {validatePassword(password).errors.map((error, index) => (
                                        <p key={index} className="text-xs text-destructive">
                                            • {error}
                                        </p>
                                    ))}
                                    {validatePassword(password).isValid && (
                                        <p className="text-xs text-green-500">
                                            ✓ Password meets all requirements
                                        </p>
                                    )}
                                </div>
                            )}
                            {!password && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Password must be at least 6 characters with uppercase, lowercase, and number
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-destructive/20 border border-destructive text-destructive-foreground px-3 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;