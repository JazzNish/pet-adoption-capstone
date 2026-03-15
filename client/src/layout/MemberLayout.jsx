
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";


function MemberLayout(){
    
    return(
        <>
        <div className="flex flex-col h-full relative">
            <header className="sticky top-0 z-99 flex items-center justify-center py-2">
                <NavBar />
            </header>
            <main className="flex flex-col h-full">
                <Outlet />
            </main>
        </div>
        </>
    );
}

export default MemberLayout;