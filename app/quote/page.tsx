import { permanentRedirect } from "next/navigation";

export default function LegacyQuotePage() {
  permanentRedirect("/schedule");
}
