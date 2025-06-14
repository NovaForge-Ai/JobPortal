const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mt-8 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Job Portal. Built by{" "}
            <a
              href="https://novaforge.ai"
              className="font-semibold text-indigo-600 hover:text-gray-900"
              target="_blank"
            >
              NovaForge.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
