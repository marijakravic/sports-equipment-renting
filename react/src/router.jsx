import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import AddItems from "./views/AddItems.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Sports from "./views/Sports.jsx";
import Adults from "./views/Adults.jsx";
import Kids from "./views/Kids.jsx";
import EquipmentList from "./views/EquipmentList.jsx";
import SportEquipment from "./views/SportEquipment.jsx"
import SearchResults from "./views/SearchResults.jsx";
import EquipmentDetails from "./views/EquipmentDetails.jsx";
import Basket from "./views/Basket.jsx";

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
                path: '/adults',
                element: <Adults />
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
                element: <SportEquipment />
            },
            {
                path: '/equipment',
                element: <SearchResults />
            },
            {   path: '/equipment/:id',
                element: <EquipmentDetails />
            },
            {
                path: '/basket',
                element: <Basket/>
            }
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
