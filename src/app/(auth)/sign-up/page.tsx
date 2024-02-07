import SignUpForm from "@/components/form/SignUpForm";

const page = () => {
  return (
    <main>
      &nbsp;
      <div className="w-full md:w-1/2 md: md:mt-10 md:-top-60 md:mx-auto lg:hidden">
        <SignUpForm />
      </div>
      <div className=" space-y-2 hidden md:block ">
        <SignUpForm />
      </div>
    </main>
  );
};

export default page;
