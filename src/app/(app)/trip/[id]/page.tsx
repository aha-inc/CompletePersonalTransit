// Sprint 6: Active navigation page (HX-04, HX-05, RT-01)
type Props = { params: Promise<{ id: string }> };

export default async function ActiveNavPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="flex flex-col h-dvh">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* TODO Sprint 6: <JourneyProgress /> animated segment visualization */}
        {/* TODO Sprint 6: <MicroDelightBanner /> situational messages */}
        {/* TODO Sprint 6: <ActiveNavigation tripPlanId={id} /> */}
        <p className="text-sm text-gray-400 text-center">Active navigation for trip {id} — coming in Sprint 6</p>
      </div>
    </main>
  );
}
