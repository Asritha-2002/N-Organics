import { Leaf, Sparkles, HeartHandshake } from "lucide-react";
import aboutLogoVideo from "../../assets/aboutLogoVideo.mp4";
import smallLogo from "../../assets/smallLogo.png"

export default function LogoSection() {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <span className="inline-block rounded-full border border-[#d9cabb] bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6f8f72]">
            About Our Identity
          </span>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#143c2f] sm:text-4xl">
            Why We Chose This Logo
          </h2>

          <p className="mt-4 text-base leading-7 text-[#6f6a61]">
            Our logo is more than a symbol. It represents the purity of natural
            ingredients, gentle care, and the calm confidence we want every
            customer to feel when using our skincare products.
          </p>
        </div>

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div className="relative rounded-[28px] border border-[#e4d7ca] bg-[#efe4d8] p-3 shadow-[0_20px_60px_rgba(90,70,50,0.08)]">
            <div className="relative overflow-hidden rounded-[24px] bg-[#d9c8b7]">
              <video
                className="h-[300px] w-full object-cover sm:h-[420px]"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={aboutLogoVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/80 p-4 backdrop-blur">
                <p className="text-sm font-medium text-[#2f3a32]">
                  A closer look at the inspiration, shape, and feeling behind
                  our brand mark.
                </p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[30px] border border-[#e6dbd0] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(90,70,50,0.06)] sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3ee] text-[#6f8f72]">
                <Leaf className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#7c8a7f]">
                  Logo Meaning
                </p>

                <h3 className="text-xl font-semibold text-[#2f3a32]">
                  Rooted in Nature, Designed with Intention
                </h3>
              </div>
            </div>

            <p className="text-base leading-7 text-[#5c675f]">
              The soft curves reflect gentleness, the natural tones symbolize
              purity and plant-based care, and the minimal structure represents
              honesty in every ingredient we use.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#ece2d8] bg-[#faf7f2] p-4">
                <Sparkles className="mb-3 h-5 w-5 text-[#8da78d]" />
                <h4 className="text-sm font-semibold text-[#2f3a32]">Purity</h4>
                <p className="mt-2 text-sm leading-6 text-[#66756b]">
                  Clean design inspired by honest skincare.
                </p>
              </div>

              <div className="rounded-2xl border border-[#ece2d8] bg-[#faf7f2] p-4">
                <Leaf className="mb-3 h-5 w-5 text-[#8da78d]" />
                <h4 className="text-sm font-semibold text-[#2f3a32]">Nature</h4>
                <p className="mt-2 text-sm leading-6 text-[#66756b]">
                  Shapes that connect with leaves, balance, and growth.
                </p>
              </div>

              <div className="rounded-2xl border border-[#ece2d8] bg-[#faf7f2] p-4">
                <HeartHandshake className="mb-3 h-5 w-5 text-[#8da78d]" />
                <h4 className="text-sm font-semibold text-[#2f3a32]">Care</h4>
                <p className="mt-2 text-sm leading-6 text-[#66756b]">
                  A warm visual identity built around trust and comfort.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f3ece4] px-5 py-4">
              <p className="text-sm italic leading-6 text-[#4f5c53]">
                “This logo is our promise to stay gentle, natural, and true to
                what skincare should feel like.”
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#dccdbf] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] lg:flex">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf3ee] text-lg font-semibold text-[#6f8f72]">
              <img src={smallLogo} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-[#dfe9df]/40 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#eadfd3]/60 blur-3xl" />
    </section>
  );
}