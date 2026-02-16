import type { TemplateType } from "@/types/template"

import ArtistLayout from "@/templates/artist/layout"
import ArenaLayout from "@/templates/arena/layout"
import TournamentLayout from "@/templates/tournament/layout"

export function resolveTemplate(type: TemplateType) {
  switch (type) {
    case "artist":
      return ArtistLayout
    case "arena":
      return ArenaLayout
    case "tournament":
      return TournamentLayout
    default:
      return TournamentLayout
  }
}
