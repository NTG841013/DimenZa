import { PencilRuler } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";
import type { AuthContext } from "../type";

const Navbar = () => {
    const {isSignedIn, userName, signIn, signOut} = useOutletContext<AuthContext>();


    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }
            return;
        }
        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }

    };
    return (
        <header className="navbar">
            <div className="inner">
                <div className="left">
                    <div className="brand">
                        <PencilRuler className="logo"/>
                        <span className="name">DimenZa</span>

                    </div>
                    <ul className="links">
                        <a href="#">Product</a>
                        <a href="#">Pricing</a>
                        <a href="#">Community</a>
                        <a href="#">Enterprise</a>
                    </ul>
                </div>
                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                {userName ? `Hello, ${userName}!`: 'Signed In'}
                            </span>
                            <Button size="sm" onClick={handleAuthClick} className="btn">Log Out</Button>
                        </>
                        ):(
                            <>
                        <Button onClick={handleAuthClick} size="sm" variant = "ghost">
                            Log In
                        </Button>
                        <a href="#upload" className="cta">Get Started</a>
                        </>
                        )}

                </div>

            </div>
        </header>
    )
}
export default Navbar
