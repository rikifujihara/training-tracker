export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#e5e7eb] w-full flex py-5 px-5">
      {children}
    </div>
  );
}
