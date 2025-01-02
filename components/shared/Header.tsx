import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import { BaggageClaim } from "lucide-react";
import { useStateContext } from "@/components/context/CartContext";
import Cart from "@/components/shared/Cart";
const Header = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <div className="flex gap-0 items-center">
            <Image
              src="/assets/images/logo.png"
              width={55}
              height={38}
              alt="Evently logo"
            />
            <span>EventEase</span>
          </div>
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        <div className="flex w-32 justify-end gap-10">
          <SignedIn>
            <button
              type="button"
              className="cart-icon"
              onClick={() => setShowCart(true)}
            >
              <BaggageClaim />
              <span className="cart-item-qty">{totalQuantities}</span>
            </button>
            {showCart && <Cart />}{" "}
          </SignedIn>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
