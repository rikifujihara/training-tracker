export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] w-full flex py-5 px-5">
      {children}
    </div>
  );
}
