import { Outlet,} from "react-router-dom";
import NavBar from "../components/NavBar";

function PublicLayout() {

    return (
        <>
        <div className="flex flex-col">
            <header className="sticky top-0 z-50 bg-white">
                <NavBar />
            </header>
            <main className="flex h-full flex-col">
                <Outlet />
            </main>
        </div>
        </>
    );
}

export default PublicLayout;