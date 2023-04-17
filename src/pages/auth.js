import { getSession } from 'next-auth/client';
import AuthForm from '../components/auth/AuthForm';

function AuthPage() {
    return <AuthForm />;
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
            props: {
                session,
            },
        };
    }
    return {
        props: {
            session,
        },
    };
}

export default AuthPage;
