import { TypewriterGroup, TypewriterMultiline } from "@/components/ui/typewriter";
import { Button } from "@/components/ui/button";
import labelsPic from "@/images/mailclerk-labels.png";
import Image from "next/image";

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:max-w-2xl md:mx-auto lg:col-span-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
              Keep your email inbox organized with an{" "}
              <span className="block mt-1 text-blue-600">AI assistant</span>
            </h1>
            <p className="animate-typing"></p>
            <div className="flex justify-center">
              <TypewriterGroup
                className="mt-6 text-lg min-w-[600px]"
                typewriters={[
                  {
                    content:
                      "Stop marketing, political, and other spam from cluttering your inbox.",
                  },
                  {
                    content: "Automatically categorize incoming emails with zero configuration.",
                  },
                  {
                    content: "Find flight check-ins, online orders, receipts, and more with ease.",
                  },
                  {
                    content: "Fight back against mass email marketing with state-of-the-art A.I.",
                  },
                ]}
              />
            </div>
            <div className="mt-8 max-w-lg mx-auto sm:text-center">
              <a href="" target="_blank">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg px-6 py-6 inline-flex items-center justify-center">
                  Get early access
                  {/* <ArrowRight className='ml-2 h-5 w-5' /> */}
                </Button>
              </a>
            </div>
          </div>
          {/* <div className='mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center'>
              <Terminal />
            </div> */}
        </div>
      </section>

      <section className="py-16 bg-slate-200 w-full text-black">
        <h2 className="mx-auto mb-8 w-fit text-4xl sm:text-5xl md:text-5xl">Meet the Mailclerk</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="w-[340px]">
              <div className="h-[342px] rounded-md overflow-hidden">
                <Image
                  src={labelsPic}
                  className="-ml-[2px]"
                  alt="Mailclerk labels"
                  width="340"
                  height="400"
                />
              </div>
              <div className="mt-5">
                <h2 className="text-2xl font-medium text-gray-900">Automated Organization</h2>
                <p className="mt-2 text-base text-black">
                  Mailclerk continously scans your inbox and sorts emails into common categories.
                  Fully automatic, no effort required.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="w-[340px]">
                <div className="h-[342px] rounded-md overflow-hidden">
                  {/* <Image
                    src={labelsPic}
                    className='-ml-[2px]'
                    alt='Mailclerk labels'
                    width='340'
                    height='400'
                    /> */}
                </div>
              </div>
              <div className="mt-5">
                <h2 className="text-2xl font-medium text-gray-900">Secure and Confidential</h2>
                <p className="mt-2 text-base text-black">
                  Emails scanned by Mailclerk are NEVER stored or shared with third parties. No
                  human will ever read an email.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="h-[342px] rounded-md overflow-hidden"></div>
              <div className="mt-5">
                <h2 className="text-2xl font-medium text-gray-900">Daily Reports and More</h2>
                <p className="mt-2 text-base text-black">
                  Get a daily summary of how Mailclerk has sorted your emails for the day. Set rules
                  for automated cleanup. And more features on the way!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">Pricing TBD</div>
        </div>
      </section>
    </main>
  );
}
