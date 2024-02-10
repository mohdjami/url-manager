import Link from "next/link";
import React from "react";

const Features = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t" id="features">
      <div className=" grid items-center gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
            Performance
          </div>
          <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
            Traffic spikes should be exciting, not scary.
          </h2>
          <Link
            className="inline-flex h-9 items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="#"
          >
            Get Started
          </Link>
        </div>
        <div className="flex flex-col items-start space-y-4">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
            Security
          </div>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
            Fully managed infrastructure designed to scale dynamically with your
            traffic, a global edge to ensure your site is fast for every
            customer, and the tools to monitor every aspect of your app.
          </p>
          <Link
            className="inline-flex h-9 items-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            href="#"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
