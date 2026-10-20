import Link from "next/link";
import { Picture } from "@/components/ui/Picture";

export default function NotFound() {
  return (
    <main className="container-jm flex min-h-[100svh] flex-col items-center justify-center py-24 text-center">
      <div className="w-56 mix-blend-lighten sm:w-72">
        <Picture
          name="mascot-hero"
          alt="Maskotka Jelly Match — orzeł z galaretki"
          sizes="18rem"
          priority
          imgClassName="h-auto w-full [mask-image:radial-gradient(closest-side,#000_70%,transparent)]"
        />
      </div>
      <h1 className="h2 mt-8">Tej strony tu nie ma.</h1>
      <p className="lead mt-4">Ale rekrutacja wciąż zaczyna się za darmo.</p>
      <Link href="/" className="btn btn-primary mt-10">Wróć na stronę główną</Link>
    </main>
  );
}
