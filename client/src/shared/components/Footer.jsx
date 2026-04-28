export default function Footer() {
  return (
    <footer className="w-full h-40 flex gap-10">
      <div className="h-full w-1/2 flex flex-col gap-3 justify-center">
        <h2 className="text-3xl italic font-bold">BeatCloud</h2>
        <p className="opacity-60 italic font-semibold">Your music. Your world. One platform.</p>
      </div>
      <div className="h-full w-1/2 flex justify-end italic items-center opacity-60">
        © {new Date().getFullYear()} BeatCloud. All rights reserved.
      </div>
    </footer>
  );
}