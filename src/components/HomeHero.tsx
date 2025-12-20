"use client";

import Image from "next/image";
import Link from "next/link";
import { Scan, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function HomeHero() {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-900/80 text-white py-28">
      <div className="w-full px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-center max-w-full">
          <span className="block">You and I,</span>
          <span className="block">in U&apos;n&apos;IVERSE.</span>
        </h1>
      </div>

      <div className="container mx-auto px-4 max-w-3xl text-center">
        <p className="mt-10 text-lg md:text-xl text-gray-300">
          Create your own profile card easily and share it with the people you
          meet to expand your universe.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 bg-white text-gray-900 rounded-md px-5 py-1 font-medium shadow"
          >
            <Scan size={16} />
            <span>Scan Now</span>
          </Link>
          <Button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("openAuth", { detail: { type: "signup" } })
              )
            }
            className="bg-slate-700 text-white rounded-md px-5 py-2 font-medium"
          >
            <span>Sign up</span>
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="mt-3">
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("openAuth", { detail: { type: "login" } })
              )
            }
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm bg-transparent"
          >
            <span>Log in</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-12">
          <Logo className="w-auto max-w-[80vw] md:max-w-[60vw] max-h-[60vh] mx-auto text-white" />
        </div>
      </div>

      {/* Cards / Features */}
      <div className="container mx-auto px-4 mt-16 space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-6 py-6">
          <div className="w-full md:w-1/2">
            <div className="w-full max-w-none -mx-4 px-4">
              <h3 className="text-4xl md:text-5xl leading-tight text-left">
                <span className="block">Easy to create</span>
                <span className="block">your profile.</span>
              </h3>
            </div>
            <p className="mt-6 text-base md:text-lg text-gray-300 max-w-prose leading-relaxed">
              At U&apos;n&apos;IVERSE, you can easily create your own profile
              card by simply entering your username, icon, affiliation, and
              social links. We recommend linking your various SNS accounts and
              portfolio pages.
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <div className="w-full rounded-xl overflow-hidden shadow-xl mt-4">
              <Image
                src="/images/uni-mycard.png"
                alt="Profile card"
                width={720}
                height={400}
                className="block w-full h-auto"
              />
            </div>
            <div className="w-full flex justify-center mt-6">
              <Button
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
                className="bg-white hover:bg-gray-100 text-gray-900 rounded-md px-6 py-2 font-medium"
              >
                <span>Try Now</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-6 py-6">
          <div className="w-full md:w-1/2 md:pr-8 text-left">
            <div className="w-full max-w-none -mx-4 px-4">
              <h3 className="text-4xl md:text-5xl leading-tight">
                <span className="block">Smart exchange</span>
                <span className="block">profile cards.</span>
              </h3>
            </div>
            <p className="mt-4 text-base md:text-lg text-gray-300 max-w-prose">
              To display the QR code on the back of the created profile card,
              press the button in the lower right corner.
            </p>

            <div className="mt-6">
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <span className="text-gray-300">→</span>
                <span className="ml-1 font-medium">Just scan it.</span>
              </Link>
              <p className="mt-3 text-gray-400 text-sm">
                Simply scan the QR code to smartly exchange profile cards and
                register as friends simultaneously.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-8 flex flex-col items-center">
            <div className="mb-6">
              <Image
                src="/images/uni-card.png"
                alt="QR card"
                width={420}
                height={260}
                className="block mx-auto"
              />
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center sm:justify-between gap-4 mt-6">
              <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                <Button
                  asChild
                  className="bg-white text-gray-900 px-6 py-3 rounded"
                >
                  <Link
                    href="/scanner"
                    className="inline-flex items-center gap-2"
                  >
                    <Scan size={16} />
                    <span>Scan Now</span>
                  </Link>
                </Button>
              </div>
              <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("openAuth", { detail: { type: "login" } })
                    )
                  }
                  className="text-gray-300 hover:text-white inline-flex items-center gap-2"
                >
                  <span>Log in</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sparkle / Big visual */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col items-center py-6">
          <Image
            src="/images/uni-sparkle.png"
            alt="Sparkle"
            width={880}
            height={280}
            className="block mx-auto"
          />
        </div>
      </div>

      {/* Universe / Friends */}
      <div className="container mx-auto px-4 mt-12 text-center">
        <h3 className="text-xl">And the universe expands.</h3>
        <p className="mt-3 text-gray-300">
          Exchanging profile cards expands your universe. Tap a friend&apos;s
          card to check their profile and connect in real life.
        </p>
        <div className="mt-6 flex justify-center gap-6 items-center flex-wrap -mx-4 md:mx-0">
          <div className="w-full md:w-1/2 px-4 md:px-0 flex justify-start">
            <Image
              src="/images/uni-universe.png"
              alt="Universe"
              width={420}
              height={220}
            />
          </div>
          <div className="w-full md:w-1/2 px-4 md:px-0 flex justify-center">
            <Image
              src="/images/uni-friends.png"
              alt="Friends"
              width={420}
              height={220}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 text-center">
        <h3 className="text-lg">Let&apos;s get started.</h3>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("openAuth", { detail: { type: "signup" } })
              )
            }
            className="inline-flex items-center gap-2 bg-slate-700 text-white px-6 py-3 rounded"
          >
            <span>Sign up</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("openAuth", { detail: { type: "login" } })
              )
            }
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded"
          >
            <span>Log in</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
