import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import { authOptions } from '../../lib/authOptions';

export default async function Home() {


  const session = await getServerSession(authOptions)
  console.log("session =",session);

 
  return (
    <>
    <Head>
      <title>RoTrade</title>
      <meta name="description" content="Welcome to my website, explore our services!" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
      <div className="text-center text-white px-4 py-8">
        <h1 className="text-5xl font-bold mb-4"> Welcome to RoTrade! {session?.user.name} </h1>
        <p className="text-xl mb-6">We are glad to have you here. Automate your Forex trading!</p>
        <div>

          <a
            href="#explore"
            className="bg-transparent border-2 border-white text-white rounded-full px-6 py-3 text-lg hover:bg-white hover:text-gray-800 transition duration-300"
          >
            Explore Now
          </a>
        </div>
      </div>
    </div>

    
  </>
   
  );
}
