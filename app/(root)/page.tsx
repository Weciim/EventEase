import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { Calendar, Gift, Music, Utensils } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchParamProps } from "@/types";
import Link from "next/link";
import Image from "next/image";
const eventPacks = [
  {
    title: "Wedding Bliss",
    description: "Everything you need",
    icon: <Gift className="h-6 w-6" />,
    image: "/assets/images/TSH_139_original.jpg",
  },
  {
    title: "Birthday Bash",
    description: "Celebrate another year in style",
    icon: <Calendar className="h-6 w-6" />,
    image: "/assets/images/home-pack.jpg",
  },
  {
    title: "Corporate Event",
    description: "Impress your clients and colleagues",
    icon: <Utensils className="h-6 w-6" />,
    image: "/assets/images/enreprise-pack.jpg",
  },
  {
    title: "Music Festival",
    description: "Rock the night away",
    icon: <Music className="h-6 w-6" />,
    image: "/assets/images/university-pack.jpg",
  },
];

const mustHaveFurniture = [
  { name: "Folding Chairs", image: "/assets/images/chaise.jpg" },
  { name: "Banquet Tables", image: "/assets/images/table-buffet-cage.jpg" },
  { name: "Stage Platform", image: "/assets/images/lounge.jpg" },
  { name: "Portable Bar", image: "/assets/images/minuity.jpg" },
  { name: "Lighting Truss", image: "/assets/images/wedding-pack.jpg" },
  { name: "Dance Floor", image: "/assets/images/TSH_126_original.jpg" },
];
export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  });

  return (
    <>
      <section className=" bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              We brought for you everything to host an amazing event.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <video src="/assets/images/hero-video.mp4" autoPlay loop />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Event Packs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventPacks.map((pack, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {pack.icon}
                    {pack.title}
                  </CardTitle>
                  <CardDescription>{pack.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={pack.image}
                    alt={pack.title}
                    width={200}
                    height={100}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-44">
          <h2 className="text-3xl font-bold mb-6">Must-Have Event Furniture</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mustHaveFurniture.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-full mb-2"
                />
                <span className="text-center text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
