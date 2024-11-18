import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
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

        <p>2024 Evently. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
