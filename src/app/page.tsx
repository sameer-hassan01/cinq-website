import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Work } from "@/components/sections/work";
import { Studio } from "@/components/sections/studio";
import { Products } from "@/components/sections/products";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Founders } from "@/components/sections/founders";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Marquee />
      <Work />
      <Studio />
      <Products />
      <Services />
      <Process />
      <Founders />
      <Contact />
      <Footer />
    </main>
  );
}
