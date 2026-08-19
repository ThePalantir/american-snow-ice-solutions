import { permanentRedirect } from "next/navigation";

export default function LegacySchedulePage() {
  permanentRedirect("/quote");
}
