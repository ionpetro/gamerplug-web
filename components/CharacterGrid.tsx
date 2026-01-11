import { Code, Package, Users, Settings, Megaphone, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Character {
  id: string;
  name: string;
  class: "engineers" | "product" | "board" | "operations" | "marketing";
  avatar: string;
  thumbnailPath?: string;
  selected?: boolean;
}

const classIcons = {
  engineers: <Code className="w-3 h-3" />,
  product: <Package className="w-3 h-3" />,
  board: <Users className="w-3 h-3" />,
  operations: <Settings className="w-3 h-3" />,
  marketing: <Megaphone className="w-3 h-3" />,
};

const classColors = {
  engineers: "bg-[#D64045]/80",
  product: "bg-[#9ED8DB]/80",
  board: "bg-[#1D3354]/80",
  operations: "bg-[#467599]/80",
  marketing: "bg-[#E9FFF9]/80",
};

const classBorderColors = {
  engineers: "#D64045",
  product: "#9ED8DB",
  board: "#1D3354",
  operations: "#467599",
  marketing: "#E9FFF9",
};

// Team member data
const characters: Character[] = [
  // Engineers
  { id: "ion-petropoulos", name: "Ion", class: "engineers", avatar: "", thumbnailPath: "/models/thumbnails/ion.png" },
  { id: "abed-hamami", name: "Abed", class: "engineers", avatar: "", thumbnailPath: "/models/thumbnails/abed.png" },
  // Product
  { id: "hunter-klehm", name: "Hunter", class: "product", avatar: "", thumbnailPath: "/models/thumbnails/hunter.png" },
  // Board
  { id: "bill-klehm", name: "Bill", class: "board", avatar: "", thumbnailPath: "/models/thumbnails/bill.png" },
  { id: "billy-edwards", name: "Billy", class: "board", avatar: "", thumbnailPath: "/models/thumbnails/billy.png" },
  // Operations
  { id: "stephan-nicklow", name: "Stephan", class: "operations", avatar: "", thumbnailPath: "/models/thumbnails/stephan.png", selected: true },
];

interface CharacterGridProps {
  onSelect: (character: Character) => void;
  selectedId: string;
}

export const CharacterGrid = ({ onSelect, selectedId }: CharacterGridProps) => {
  const groupedCharacters = {
    engineers: characters.filter((c) => c.class === "engineers"),
    product: characters.filter((c) => c.class === "product"),
    board: characters.filter((c) => c.class === "board"),
    operations: characters.filter((c) => c.class === "operations"),
    marketing: characters.filter((c) => c.class === "marketing"),
  };

  const classLabels = {
    engineers: "ENGINEERS",
    product: "PRODUCT",
    board: "BOARD",
    operations: "OPERATIONS",
    marketing: "MARKETING",
  };

  // Max slots per category
  const maxSlotsPerCategory = {
    engineers: 5,
    product: 3,
    board: 3,
    operations: 4,
    marketing: 2,
  };
  
  const getCharactersWithSlots = (category: keyof typeof groupedCharacters) => {
    const chars = groupedCharacters[category];
    const maxSlots = maxSlotsPerCategory[category];
    const slots = Array(maxSlots).fill(null).map((_, i) => 
      chars[i] || { id: `empty-${category}-${i}`, name: "", class: category, avatar: "", isEmpty: true }
    );
    return slots;
  };

  return (
    <div className="animate-fade-in-up">
      {/* Top row: Engineers + Product */}
      <div className="flex justify-center gap-8 mb-2">
        {(["engineers", "product"] as const).map((classType) => (
          <div key={classType} className="flex flex-col items-center">
            <div className="flex gap-1">
              {getCharactersWithSlots(classType).map((character, index) => {
                if ((character as any).isEmpty) {
                  return (
                    <Link
                      key={character.id}
                      href="https://www.linkedin.com/company/gamerplug/jobs/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="character-portrait w-14 h-14 opacity-50 hover:opacity-70 transition-opacity cursor-pointer group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]}`} />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-lg font-bold group-hover:hidden">?</span>
                        <ExternalLink className="w-5 h-5 hidden group-hover:block" />
                      </div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={character.id}
                    onClick={() => onSelect(character)}
                    className={`character-portrait w-14 h-14 relative focus:outline-none overflow-hidden ${
                      selectedId === character.id ? "selected" : ""
                    }`}
                  >
                    {/* Background gradient - only show if no thumbnail */}
                    {!character.thumbnailPath && (
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                    )}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]} z-20`} />
                    {/* Character thumbnail */}
                    {character.thumbnailPath ? (
                      <div className="absolute inset-0 z-0 opacity-60 grayscale">
                        <Image
                          src={character.thumbnailPath}
                          alt={character.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs z-10">
                        {character.name.slice(0, 2)}
                      </div>
                    )}
                    {selectedId === character.id && (
                      <>
                        <div 
                          className="absolute inset-0 border-2 rounded-sm z-30"
                          style={{ 
                            borderColor: classBorderColors[classType],
                            boxShadow: `0 0 12px ${classBorderColors[classType]}80, inset 0 0 8px ${classBorderColors[classType]}40`
                          }}
                        />
                        <div 
                          className="absolute -inset-1 rounded-sm pointer-events-none z-30"
                          style={{ 
                            boxShadow: `0 0 16px ${classBorderColors[classType]}60`
                          }}
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              {classIcons[classType]}
              <span className="text-xs font-display tracking-wider">
                {classLabels[classType]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: Board + Operations + Marketing */}
      <div className="flex justify-center gap-8">
        {(["board", "operations", "marketing"] as const).map((classType) => (
          <div key={classType} className="flex flex-col items-center">
            <div className="flex gap-1">
              {getCharactersWithSlots(classType).map((character, index) => {
                if ((character as any).isEmpty) {
                  return (
                    <Link
                      key={character.id}
                      href="https://www.linkedin.com/company/gamerplug/jobs/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="character-portrait w-14 h-14 opacity-50 hover:opacity-70 transition-opacity cursor-pointer group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]}`} />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-lg font-bold group-hover:hidden">?</span>
                        <ExternalLink className="w-5 h-5 hidden group-hover:block" />
                      </div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={character.id}
                    onClick={() => onSelect(character)}
                    className={`character-portrait w-14 h-14 relative focus:outline-none overflow-hidden ${
                      selectedId === character.id ? "selected" : ""
                    }`}
                  >
                    {/* Background gradient - only show if no thumbnail */}
                    {!character.thumbnailPath && (
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                    )}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]} z-20`} />
                    {/* Character thumbnail */}
                    {character.thumbnailPath ? (
                      <div className="absolute inset-0 z-0 opacity-60 grayscale">
                        <Image
                          src={character.thumbnailPath}
                          alt={character.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs z-10">
                        {character.name.slice(0, 2)}
                      </div>
                    )}
                    {selectedId === character.id && (
                      <>
                        <div 
                          className="absolute inset-0 border-2 rounded-sm z-30"
                          style={{ 
                            borderColor: classBorderColors[classType],
                            boxShadow: `0 0 12px ${classBorderColors[classType]}80, inset 0 0 8px ${classBorderColors[classType]}40`
                          }}
                        />
                        <div 
                          className="absolute -inset-1 rounded-sm pointer-events-none z-30"
                          style={{ 
                            boxShadow: `0 0 16px ${classBorderColors[classType]}60`
                          }}
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              {classIcons[classType]}
              <span className="text-xs font-display tracking-wider">
                {classLabels[classType]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
