import Link from 'next/link';
import s from './MainNavigation.module.css';
import {signOut, useSession} from "next-auth/client";

function MainNavigation() {
    const [session, loading] = useSession();

    function logOutHandle() {
        signOut();
    }

    return (
        <header className={s.header}>
            <Link href='/'>
                <div className={s.logo}>Next Auth</div>
            </Link>
            <nav>
                <ul>
                    {!session && !loading && (
                        <li>
                            <Link href='/auth'>Login</Link>
                        </li>
                    )}
                    {session && (
                        <>
                            <li>
                                <Link href='/profile'>Profile</Link>
                            </li>

                            <li>
                                <button onClick={logOutHandle}>Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;
