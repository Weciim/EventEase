import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { Calendar, Gift, Music, Utensils } from "lucide-react";
import { CldImage } from "next-cloudinary";
// import "./styles2.css";
import BitFtour from "@/components/shared/BitFtour";
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
import Slider from "@/components/shared/slider";
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
      {/* <section className=" bg-dotted-pattern bg-contain py-5 md:py-10">
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
      </section> */}
      <section id="banner">
        <a></a>
        <div className="wrapper">
          <div className="banner-content">
            <span className="subtitle">EventEase</span>
            <h2>
              Host, Connect, Celebrate<br></br> Your Events, Our Platform!
            </h2>
            <p>We brought for you everything to host an amazing event.</p>
          </div>
        </div>
      </section>
      <section className="featured-articles-section">
        <div className="wrapper">
          <h3 className="text-3xl font-extrabold">Who are we ?</h3>
          <div className="cards-container">
            <div
              className="article-card card-large"
              style={{
                backgroundImage: `url("/assets/images/TSH_139_original.jpg")`,
              }}
            >
              <div className="article-card-content">
                <h4 className="font-bold sec-title">EventEase</h4>
                <p className="text-[#000] font-semibold">
                  We are an events furnitures platform that connects providers
                  to clients with an easy click .
                </p>
              </div>
            </div>
            <div
              className="article-card card-small"
              style={{
                backgroundImage: `url("/assets/images/bridge.jpg")`,
              }}
            >
              <div className="article-card-content">
                <h4 className="sec-title">Indoor</h4>
              </div>
            </div>
            <div
              className="article-card article-card-alt card-small"
              style={{
                backgroundImage: `url("/assets/images/cosy.jpg")`,
              }}
            >
              <div className="article-card-content">
                <h4 className="sec-title">Cosy</h4>
              </div>
            </div>

            <div
              className="article-card card-medium"
              style={{
                backgroundImage: `url("/assets/images/hero.png")`,
              }}
            >
              <div className="article-card-content">
                <h4 className="sec-title">Outdoor</h4>
              </div>
            </div>
            <div
              className="article-card article-card-alt card-medium"
              style={{
                backgroundImage: `url("/assets/images/TSH_075_original.jpg")`,
              }}
            >
              <div className="article-card-content">
                <h4 className="sec-title">Traditional</h4>
              </div>
            </div>
            <br className="clear" />
          </div>
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12 mt-28"
      >
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <Card className={`h-full transition-shadow duration-300`}>
              <CardHeader className="bg-gray-100 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Wedding Bliss
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {true && (
                  <Image
                    src={
                      "https://res.cloudinary.com/dqpvunhhn/image/upload/v1732572979/lxuehwhmhmx4086cfl7r.jpg"
                    }
                    alt={"Wedding Bliss"}
                    width="500"
                    height="500"
                    crop={{
                      type: "auto",
                      source: true,
                    }}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <CardDescription className="text-base mb-2">
                  {"An amazing pack including all necessities for your best day ." ||
                    "No description available."}
                </CardDescription>
                {true && (
                  <p className="text-lg font-semibold text-blue-500">4200$</p>
                )}
              </CardContent>
              <CardFooter>
                {/* <Link>
                  <Button className="w-full">View Details</Button>
                </Link> */}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <section
        className="full-width-section mt-20"
        style={{
          backgroundImage: `url("/assets/images/full-width-bg.jpg")`,
        }}
      >
        <div className="wrapper">
          <div className="text align-left">
            <h2 className="text-4xl font-bold">Have A 3D Experience</h2>
            <p>
              Try to explore yourself some products with an immersive experience
              using our 3d models .
            </p>
            <a href="/showroom" className="button-1">
              Visit page
            </a>
          </div>
          <div className="clear"></div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
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
