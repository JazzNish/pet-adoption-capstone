import { Link } from "react-router-dom";

function Footer() {

  const handleAbout = (e) => {
        e.preventDefault(); // Stop standard link behavior
        
        if (location.pathname === "/") {
            // If on homepage, find the section and scroll immediately
            const element = document.getElementById("about");
            if (element) {
                // The setTimeout ensures the browser doesn't get confused
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 10);
            }
        } else {
            // If on another page (like Browse), go to home with the hash
            navigate("/#about");
        }
    };

    return(
      <footer className="p-8 flex items-center bg-white justify-between">

        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center">
              <img src="src/assets/FurEver.png" alt="FurEver Logo" className="h-8" />
              <h4>FurEver</h4>
          </div>

          <p className="text-gray-500 w-120">
            Connecting pets with loving people. Responsible rehoming made simple and safety.
          </p>

          <span className="text-gray-500">
            © 2023 FurEver Inc. 
          </span>
        </div>

        <div className="flex grid grid-cols-3 gap-12">
          <div className="flex flex-col gap-2 justify-start">
            <h4 className="font-semibold">EXPLORE</h4>
            <ul className="flex flex-col gap-2 text-gray-500 text-sm">
              <li>
                <Link to="/" className="hover:text-stone-400 duration-300">Home</Link>
              </li>
              <li>
                <Link to="/public-browse-pets" className="hover:text-stone-400 duration-300">Browse Pets</Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-stone-400 duration-300" onClick={handleAbout}>About</a>
              </li>
              <li>
                <Link to="/mission" className="hover:text-stone-400 duration-300">Our Mission</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-start">
            <h4 className="font-semibold mb-2">RESOURCES</h4>
            <ul className="flex flex-col gap-2 text-gray-500  text-sm">
              <li>
                <Link to="/animal-welfare" className="hover:text-stone-400 duration-300">Animal Welfare</Link>
              </li> 
              <li>
                <Link to="/help-center" className="hover:text-stone-400 duration-300">Help Center</Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-stone-400 duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="font-semibold mb-2">LEGAL</h4>
            <ul className="flex flex-col gap-2 text-gray-500 text-sm">
              <li>
                <Link to="/terms" className="hover:text-stone-400 duration-300">Terms</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-stone-400 duration-300">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>

      </footer>
    );
}

export default Footer;