import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, ImagePlus, ArrowRight } from "lucide-react";
import { 
  FaLinkedin, 
  FaXTwitter, 
  FaInstagram 
} from "react-icons/fa6";
const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/ananyasharma-n-organics",
    icon: FaLinkedin,
  },
  {
    name: "Twitter",
    href: "https://x.com/ananyasharma_n",
    icon: FaXTwitter,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/ananyasharma.norganics",
    icon: FaInstagram,
  },
];

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    text: "N-Organics, Vijayawada, Andhra Pradesh, India",
  },
  {
    icon: Mail,
    title: "Email",
    text: "support@norganics.com",
  },
  {
    icon: Phone,
    title: "Phone",
    text: "+91 98765 43210",
  },
];

const ContactContent = () => {
  const [formData, setFormData] = React.useState({
  name: "",
  email: "",
  description: "",
});

const [loading, setLoading] = React.useState(false);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:2101/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send message");
    }

    alert(data.message);
    setFormData({
      name: "",
      email: "",
      description: "",
    });
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <section className="bg-[#faf8f5] pb-16 sm:py-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="rounded-[28px] border border-[#e7dfd4] bg-white p-6 shadow-[0_10px_30px_rgba(20,60,47,0.06)] sm:p-8 lg:p-10"
          >
            <h3 className="text-2xl font-medium text-[#143c2f]">
              Contact Details
            </h3>

            <div className="mt-6 space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-[#ece4d8] bg-[#faf8f5] p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#143c2f] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#143c2f]">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-[#6f6a61]">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-medium text-[#143c2f]">
                Social Links
              </h3>

              <div className="mt-5 space-y-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between rounded-2xl border border-[#ece4d8] bg-[#faf8f5] px-4 py-4 transition hover:border-[#d9cbb6] hover:bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-[#143c2f]" />
                        <span className="text-sm font-medium text-[#143c2f]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#8b8277]">
                        Follow
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right side form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="rounded-[28px] border border-[#e7dfd4] bg-white p-6 shadow-[0_10px_30px_rgba(20,60,47,0.06)] sm:p-8 lg:p-10"
          >
          <div className="flex h-full flex-col justify-center">
              <h3 className="text-2xl font-medium text-[#143c2f]">
              Send a Message
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#6f6a61]">
              Fill in your details and we&apos;ll get back to you as soon as
              possible.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#143c2f]">
                    Name
                  </label>
                  <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Your full name"
  className="w-full rounded-2xl border border-[#ddd4c7] bg-[#faf8f5] px-4 py-3 text-sm text-[#143c2f] outline-none transition placeholder:text-[#9b9489] focus:border-[#457358] focus:bg-white"
/>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#143c2f]">
                    Email
                  </label>
                 <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Your email address"
  className="w-full rounded-2xl border border-[#ddd4c7] bg-[#faf8f5] px-4 py-3 text-sm text-[#143c2f] outline-none transition placeholder:text-[#9b9489] focus:border-[#457358] focus:bg-white"
/>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#143c2f]">
                  Description
                </label>
                <textarea
  rows="5"
  name="description"
  value={formData.description}
  onChange={handleChange}
  placeholder="Write your message here..."
  className="w-full resize-none rounded-2xl border border-[#ddd4c7] bg-[#faf8f5] px-4 py-3 text-sm text-[#143c2f] outline-none transition placeholder:text-[#9b9489] focus:border-[#457358] focus:bg-white"
/>
              </div>

             <button
  type="submit"
  disabled={loading}
  className="inline-flex items-center gap-2 rounded-full bg-[#457358] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#1c402f] shadow-md hover:shadow-lg group cursor-pointer disabled:opacity-70"
>
  {loading ? "Sending..." : "Submit Message"}
  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
</button>
            </form>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactContent;