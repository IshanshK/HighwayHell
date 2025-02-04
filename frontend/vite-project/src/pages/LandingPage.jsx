import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="HighwayHell Logo" className="w-12 h-12 rounded-full" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            HighwayHell
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-28 px-4">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          We&apos;re changing the way <br /> people{" "}
          <span className="relative whitespace-nowrap text-blue-600">
            <span className="relative font-wavy bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CONNECT
            </span>
          </span>
        </h1>

        <p className="text-gray-600 mt-12 max-w-xl mx-auto text-lg leading-relaxed">
          Plan meetups easily! Our platform helps you and your friends find a fair meetup spot
          with great nearby cafes and restaurants.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          <button
            className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-900 transition"
            onClick={() => navigate("/signup")}
          >
            Get started today
          </button>
          <button
            className="flex items-center justify-center space-x-2 bg-white px-6 py-4 rounded-full shadow-lg border border-gray-300 hover:shadow-xl transition"
            onClick={() => navigate("/login")}
          >
            <span className="text-blue-600 font-semibold">Already a Member? Sign in</span>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-32 text-center">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">About Us</h2>
        <p className="mt-8 max-w-lg mx-auto text-lg leading-relaxed">
          We are 3 friends from MNNIT Allahabad, tech-heads who enjoy building websites and
          exploring cutting-edge technology.
        </p>

        {/* Avatar Group */}
        <div className="flex justify-center space-x-6 mt-8">
          {["ishanshimg.png", "shlokimg.png", "aashishimg.png"].map((img, index) => (
            <img
              key={index}
              src={`/images/${img}`}
              alt={`Team Member ${index + 1}`}
              className="w-16 h-16 border-4 border-white rounded-full transition transform hover:scale-110"
            />
          ))}
        </div>

        <button className="bg-black text-white px-8 py-4 rounded-full mt-12 hover:bg-gray-900 transition">
          Click here to know more
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            {/* Logo and Description */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <img src="/images/logo.png" alt="HighwayHell Logo" className="w-10 h-10" />
                <span className="text-2xl font-bold">HighwayHell</span>
              </div>
              <p className="text-gray-400 mt-4">
                We are a passionate team of innovators from MNNIT Allahabad, crafting exceptional
                websites for a better tomorrow.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 md:mt-0">
              <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-6">
                {[
                  { icon: faFacebook, color: "hover:text-blue-500", link: "https://facebook.com" },
                  { icon: faTwitter, color: "hover:text-blue-400", link: "https://twitter.com" },
                  { icon: faInstagram, color: "hover:text-pink-500", link: "https://instagram.com" },
                  { icon: faLinkedin, color: "hover:text-blue-600", link: "https://linkedin.com" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition ${social.color}`}
                  >
                    <FontAwesomeIcon icon={social.icon} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">Stay connected with us for the latest updates and news!</p>
          </div>
        </div>
      </footer>

      {/* Custom Font for Wavy Text */}
      <style>
        {`
          .font-wavy {
            font-family: 'Pacifico', cursive;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
