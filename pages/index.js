import Layout from "@/components/layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between w-full">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt="user Image"
            className="w-12 h-12"
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
