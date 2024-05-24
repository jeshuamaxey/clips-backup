import OutletRequestForm from "./OutletRequestForm";

const RequestAnOutletPage = () => {
  return (
    <div className="max-w-4xl flex flex-col gap-4 px-2 py-8">
      <h1 className="font-bold text-3xl">Request an Outlet</h1>
      <p>Want to start using story safe but your outlet isn't supported? Complete this form to register your interest and we'll reach out to you once we've added your outlet.</p>

      <OutletRequestForm />
    </div>
  );
}

export default RequestAnOutletPage;