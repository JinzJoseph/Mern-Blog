import React from "react";
import { Link,useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { Button, Navbar, TextInput } from "flowbite-react";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg">
          Jk's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:outline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="/sign-in">
          <Button className="bg-gradient-to-r from-blue-500 to-green-500 ">
            Sign In
          </Button>
        </Link>
     <Navbar.Toggle/>
      </div>
      <Navbar.Collapse>
          <Navbar.Link>
            <Link to="/" active={path==="/"} as={'div'}>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link>
            <Link to="/about" active={path==="/about"} as={'div'} >
              About
            </Link>
          </Navbar.Link>
          <Navbar.Link>
            <Link to="/project" active={path==="/project"} as={'div'}>
              Projects
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
