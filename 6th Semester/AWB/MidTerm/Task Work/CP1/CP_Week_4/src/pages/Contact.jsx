function Contact() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-red-500 text-center">
          Contact Us
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded bg-gray-700 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded bg-gray-700 focus:outline-none"
          />

          <textarea
            placeholder="Your Message"
            className="w-full p-3 rounded bg-gray-700 focus:outline-none"
          />

          <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
