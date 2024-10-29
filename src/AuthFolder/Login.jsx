import { supabase2 } from "../DBConnect/SupabaseClient2.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addLogin } from "../Redux/GameSlice";
import "./login.css"

function LoginPage() {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false); // To toggle between login and signup
    const [session, setSession] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's an active session
        const getSession = async () => {
            const { data: { session } } = await supabase2.auth.getSession();
            setSession(session);
            localStorage.setItem("session", JSON.stringify(session));
        };
        getSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase2.auth.onAuthStateChange((event, session) => {
            setSession(session);
            localStorage.setItem("session", JSON.stringify(session));

            if (session && event === "SIGNED_IN") {
                const user = {
                    email: session.user.email,
                    u_id: session.user.id,
                    userName: session.user.user_metadata?.userName || "", // Get username if stored in metadata
                };
                dispatch(addLogin(user));
                navigate("/game-scout/home"); // Navigate after successful login
            }
        });

        return () => subscription.unsubscribe();
    }, [dispatch, navigate]);

    // Function for regular email/password login
    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase2.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error.message);
            alert("Login failed, please check your credentials.");
        }
    };

    // Function for creating a new account with username
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase2.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        userName, // Save username in user's metadata
                    },
                },
            });

            if (error) {
                console.error("Signup error:", error.message);
                alert(`Signup failed: ${error.message}`);
            } else {
                alert("Signup successful! Please check your email to confirm your account.");
            }
        } catch (err) {
            console.error("Unexpected error during signup:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };


    // Function for password reset
    const handleForgotPassword = async () => {
        const { error } = await supabase2.auth.resetPasswordForEmail(email);

        if (error) {
            console.error("Password reset error:", error.message);
            alert("Password reset failed. Please make sure the email is correct.");
        } else {
            alert("Password reset email sent! Please check your inbox.");
        }
    };

    // Function for GitHub login
    const handleGithubLogin = async () => {
        const { error } = await supabase2.auth.signInWithOAuth({
            provider: 'github',
        });

        if (error) {
            console.error("GitHub login error:", error.message);
            alert("GitHub login failed, please try again.");
        }
    };

    if (session) {
        // User is already logged in, navigate to user list
        navigate("/game-scout/home/");
        return null;
    }

    return (
        <div className={"sign-up"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {/*<h2>{isSignUp ? "Create Account" : "Login Page"}</h2>*/}

            {/* GitHub Login Button fill="currentColor"*/}
            <div className={"git-login-container"}>
            <button className={"git-signup-submit-button"} onClick={handleGithubLogin}>Login with GitHub
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-github" viewBox="0 0 16 16">
                    <path
                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                </svg>
            </button>
            </div>
            {/* Form for Login or Signup */}
            {/*style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}*/}
            <div className={"signup-container"}>
                <form onSubmit={isSignUp ? handleSignUp : handleLogin}
                      style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <input
                        className={"signup-email-input"}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className={"signup-submit-button"} type="submit">{isSignUp ? "Sign Up" : "Login with Email"}</button>
                </form>

                {/* Toggle between Login and Signup */}
                <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: "pointer", color: "blue" }}>
                    {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                </p>

                {/* Forgot Password */}
                {!isSignUp && (
                    <p onClick={handleForgotPassword} style={{ cursor: "pointer", color: "blue" }}>
                        Forgot Password?
                    </p>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
