import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import AddItems from "./views/AddItems.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Sports from "./views/Sports.jsx";
import Women from "./views/Women.jsx";
import Men from "./views/Men.jsx";
import Kids from "./views/Kids.jsx";
import EquipmentList from "./views/EquipmentList.jsx";
import SportEquipment from "./views/SportEquipment.jsx"

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to = "/dashboard" />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/additems',
                element: <AddItems />
            },
            {
                path: '/sports',
                element: <Sports />
            },
            {
                path: '/women',
                element: <Women />
            },
            {
                path: '/men',
                element: <Men />
            },
            {
                path: '/kids',
                element: <Kids />
            },
            {
                path: '/items',
                element: <EquipmentList />
            },
            {
                path: '/sports/:id',
                element: <SportEquipment /> }
        ],
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound/>
    },
    ]
)

export default router;
