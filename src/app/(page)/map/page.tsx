// src/app/points/[id]/page.tsx
import MapWithCustomModalMarker from "./map";

export default async function ServerPointPage({}: {
  params: Promise<{ id: string }>;
}) {
  return <MapWithCustomModalMarker zoom={15} />;
}
