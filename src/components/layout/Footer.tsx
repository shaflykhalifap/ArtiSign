import Container from "../common/Container";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 py-6 text-center z-10">
      <Container>
        <div className="mb-4 md:mb-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ArtiSign | hak cipta dilindungi
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
