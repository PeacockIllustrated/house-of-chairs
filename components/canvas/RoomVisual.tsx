import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import BallChair from "./BallChair";
import Silhouette from "./Silhouette";
import Grove from "./Grove";
import Strata from "./Strata";
import ProvenanceRings from "./ProvenanceRings";
import Tubular from "./Tubular";
import Weave from "./Weave";
import Orbit from "./Orbit";
import Terrazzo from "./Terrazzo";
import Arcade from "./Arcade";
import Facet from "./Facet";
import Stack from "./Stack";
import Brushed from "./Brushed";
import PanelPlaceholder from "./PanelPlaceholder";

/**
 * Chooses the live generative visual for a room. The hero carries the house
 * mark rather than a canvas, so nothing here serves it.
 *
 * Only the two studies written for the scroll take scrollBound; the rest run
 * on their own clock and ignore the scroll position entirely, which is why
 * they can be dropped into a dashboard picker without one.
 */
export default function RoomVisual({
  visual,
  label,
  scrollBound = true,
}: {
  visual: RoomVisualKind;
  label: string;
  scrollBound?: boolean;
}) {
  switch (visual) {
    case "chair":
      return <BallChair label={label} scrollBound={scrollBound} />;
    case "grove":
      return <Grove label={label} scrollBound={scrollBound} />;
    case "strata":
      return <Strata label={label} />;
    case "rings":
      return <ProvenanceRings label={label} />;
    case "silhouette":
      return <Silhouette label={label} />;
    case "tubular":
      return <Tubular label={label} />;
    case "weave":
      return <Weave label={label} />;
    case "orbit":
      return <Orbit label={label} />;
    case "terrazzo":
      return <Terrazzo label={label} />;
    case "arcade":
      return <Arcade label={label} />;
    case "facet":
      return <Facet label={label} />;
    case "stack":
      return <Stack label={label} />;
    case "brushed":
      return <Brushed label={label} />;
    default:
      return <PanelPlaceholder visual={visual} label={label} />;
  }
}
