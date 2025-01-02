import FurnitureForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs";

const CreateEvent = () => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Add furniture
        </h3>
      </section>

      <div className="wrapper my-8">
        <FurnitureForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreateEvent;