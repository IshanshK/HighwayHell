import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const LandingPage = () => {
   const navigate = useNavigate();
   const goToLoginPage = () => {
    navigate("/login");
   }
   const goToSignup = () => {
    navigate("/signup");
   }
  return (
    <>
      <div className="font-sans text-gray-800">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="User avatar"
              className="w-12 h-12 rounded-full"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              HighwayHell
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-28 px-4">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            We&apos;re changing the way
            <br /> people
            <span className="relative whitespace-nowrap text-blue-600">
              <span className="relative font-wavy bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> CONNECT</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-600 mt-12 max-w-xl mx-auto text-lg leading-relaxed">
            Plan meetups made easy! Our website helps you and your friends find
            a spot that&apos;s fair for everyone and even suggests great cafes and
            restaurants nearby.
          </p>
          {/* Buttons */}
          <div className="mt-12 flex justify-center space-x-10">
            <button className="bg-black text-white px-8 py-4 rounded-full"
            onClick={goToSignup}
            >
              Get started today
            </button>
            <button className="flex items-center space-x-2 bg-white px-6 py-4 rounded-full shadow-lg border border-gray-300" 
              onClick ={goToLoginPage}
            >
              <span className="text-blue-600 font-semibold">
                Already a Member? Sign in
              </span>
            </button>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-32 text-center">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            About Us
          </h2>
          {/* Updated Description */}
          <p className="mt-8 max-w-lg mx-auto text-lg leading-relaxed">
            We are 3 friends from MNNIT Allahabad, tech-heads who enjoy building
            websites and exploring cutting-edge technology.
          </p>
          <div className="flex flex-col items-center justify-center mt-12">
            {/* Overlapping Avatar Group */}
            <div className="flex -space-x-4">
              <img
                alt="Avatar 1"
                className="w-16 h-16 border-4 border-white rounded-full dark:bg-gray-500 dark:border-gray-300"
                src="/images/ishanshimg.png"
              />
              <img
                alt="Avatar 2"
                className="w-16 h-16 border-4 border-white rounded-full dark:bg-gray-500 dark:border-gray-300"
                src="/images/shlokimg.png"
              />
              <img
                alt="Avatar 3"
                className="w-16 h-16 border-4 border-white rounded-full dark:bg-gray-500 dark:border-gray-300"
                src="/images/aashishimg.png"
              />
            </div>
          </div>
          {/* Button */}
          <button className="bg-black text-white px-8 py-4 rounded-full mt-12">
            Click here to know more
          </button>
        </section>

        <div className="font-sans text-gray-800">
          {/* Footer Section */}
          <footer className="bg-black text-white py-12">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                {/* Logo and Description */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <img
                      src="/images/logo.png"
                      alt="HighwayHell Logo"
                      className="w-10 h-10"
                    />
                    <span className="text-2xl font-bold">HighwayHell</span>
                  </div>
                  <p className="text-gray-400 mt-4">
                    We are a passionate team of innovators from MNNIT Allahabad,
                    crafting exceptional websites for a better tomorrow.
                  </p>
                </div>

                {/* Social Media Links */}
                <div className="mt-8 md:mt-0">
                  <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
                    Follow Us
                  </h3>
                  <div className="flex justify-center md:justify-start space-x-6">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition"
                    >
                      <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition"
                    >
                      <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-500 transition"
                    >
                      <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition"
                    >
                      <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>

              <div className=" border-gray-700 mt-8 pt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Stay connected with us for the latest updates and news!
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Add the custom font for "wavy" text */}
      <style>
        {`
          .font-wavy {
            font-family: 'Pacifico', cursive;
          }
            
        `}
      </style>
    </>
  );
};

export default LandingPage;