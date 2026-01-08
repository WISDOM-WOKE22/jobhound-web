"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import homeImage from "../../../../public/home.png";
// import homeImageDark from "../../../../public/home-dark.png";
import { useRouter } from "next/navigation";
// import { useTheme } from "next-themes";

export default function Features() {
  // const { theme } = useTheme();
  const router = useRouter();

  return (
    <section className="py-20 px-5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative flex flex-col gap-10">
        {/* Section header */}

        <Card
          className="px-5 pb-5 md:pb-0 md:px-10 h-[350px] flex justify-center items-center md:h-[550px] lg:h-[700px] lg:flex-col lg:justify-start lg:items-start"
          // style={{
          //   backgroundImage: `url(${theme === "dark" ? homeImageDark.src : homeImage.src})`,
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
        />
        {/* CTA section */}
        <div className="text-center mt-16 md:mst-0">
          <Button
            onClick={() => router.push("/home")}
            className="px-10 py-7 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 dark:bg-white"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
