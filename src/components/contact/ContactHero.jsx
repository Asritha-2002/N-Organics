import React from "react";

const ContactHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-28 sm:pt-32 lg:pt-36">
      {/* top line */}
      <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#457358]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 text-center sm:px-6 sm:pb-16 lg:px-8 lg:pb-4">
        <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.32em] text-[#457358] sm:text-xs">
          Get In Touch
        </span>

        <h1 className="text-4xl font-light tracking-tight text-[#143c2f] sm:text-5xl lg:text-6xl">
          Contact <span className="italic font-medium">Us</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6f6a61] sm:text-base">
           Reach out for product inquiries, partnerships, support, or custom
            skincare-related questions. We&apos;d love to hear from you.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;