interface StatusFailedProps {
  errorMessage: string | null;
}

const StatusFailed = ({ errorMessage }: StatusFailedProps) => {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-xl">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-12 w-12 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-800">{errorMessage}</h2>
    </div>
  );
};

export default StatusFailed;
