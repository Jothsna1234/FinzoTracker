import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter =Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finzo",
  description: "One stop Finance Platform",
};

export default function RootLayout({ 
  children,
}: {
  children: React.ReactNode; 
}) {
  return (
  <ClerkProvider> 
    {/* //  signInUrl="/sign-in"
    //       signUpUrl="/sign-up" */}


    <html lang="en">
      <body
        className={`${ inter.className}`}>
        
          
 
          { /*header*/ }
     <Header />

        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
{ /* footer */ }
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>
             Built with passion❤️
            </p>
          </div>
        </footer>
        
      </body>
    </html>
       </ClerkProvider> 
  );
}
