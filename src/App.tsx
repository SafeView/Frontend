// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import {useEffect, useState} from "react";
import useUserStore from "./stores/userStore.ts";
import SnackbarContainer from "./components/Snackbar/SnackbarContainer.tsx";

const App = () => {
    const { isLoggedIn, user, fetchUserInfo } = useUserStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserInfo().finally(() => setLoading(false));
    }, []);
    if (loading) return <div>로딩 중...</div>;

    // if (!isLoggedIn) {
    //     return (
    //         <div>
    //             <h1>로그인이 필요합니다.</h1>
    //             <p>로그인 후 서비스를 이용할 수 있습니다.</p>
    //         </div>
    //     );
    // }
    // if (!user) {
    //     return <div>사용자 정보를 불러오는 중...</div>;
    // }

    return (
        <>
            <SnackbarContainer />
            <RouterProvider router={router} />
        </>
    );
};

export default App;
