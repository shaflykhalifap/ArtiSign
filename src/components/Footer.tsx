import Container from "./Container";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 py-6 text-center">
      <Container>
        <div className="mb-4 md:mb-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ArtiSign. All rights reserved |
            hak cipta dilindungi
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
