import GamePage from "../../../games/[slug]/page";
import { getAllGames } from "@/lib/games";

export async function generateStaticParams() {
  const games = await getAllGames();
  const locales = ["en", "es"] as const;
  return games.flatMap((game) =>
    locales.map((locale) => ({ slug: game.slug, locale }))
  );
}

export default function LocalizedGamePage(props: any) {
  return <GamePage {...props} />;
}


