import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Container } from "react-bootstrap";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer"; 
import { UserPhotoProvider } from "../../contexts/UserPhotoContext"


export function Root() {
    return (
        <>  
             <UserPhotoProvider>
            <NavBar />
            <Container style={{marginBottom: 100}}>
            <Outlet />
            </Container>
            <Toaster />
            <Footer />
            </UserPhotoProvider>
        </>
    )
}
