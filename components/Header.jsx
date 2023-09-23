import { useSession } from "next-auth/react";
import Image from "next/image";

export const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="flex justify-between my-2">
      <h2 className="mt-0">
        <div className="flex items-center gap-2">
          <Image
            src={session?.user?.image}
            alt="Avatar"
            width={100}
            height={100}
            className="w-8 h-8 rounded-full sm:hidden"
          />
          <div>
            Hello, <b>{session?.user?.name}</b>
          </div>
        </div>
      </h2>
      <div className="hidden md:flex bg-gray-300 text-black gap-1 rounded-sm overflow-hidden">
        <Image
          src={session?.user?.image}
          alt="Avatar"
          width={100}
          height={100}
          className="w-8 h-8"
        />
        <span className="px-2 py-1">{session?.user?.name}</span>
      </div>
    </div>
  );
};
