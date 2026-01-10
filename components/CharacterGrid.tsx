import { Code, Package, Users, Settings, Megaphone } from "lucide-react";
import Link from "next/link";

interface Character {
  id: string;
  name: string;
  class: "engineers" | "product" | "board" | "operations" | "marketing";
  avatar: string;
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
  { id: "ion-petropoulos", name: "Ion", class: "engineers", avatar: "" },
  { id: "abed-hamami", name: "Abed", class: "engineers", avatar: "" },
  // Product
  { id: "hunter-klehm", name: "Hunter", class: "product", avatar: "" },
  // Board
  { id: "stephan-nicklow", name: "Stephan", class: "board", avatar: "" },
  { id: "bill-klehm", name: "Bill", class: "board", avatar: "" },
  // Operations
  { id: "billy-edwards", name: "Billy", class: "operations", avatar: "", selected: true },
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
                      className="character-portrait w-14 h-14 opacity-50 hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]}`} />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-lg font-bold">
                        ?
                      </div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={character.id}
                    onClick={() => onSelect(character)}
                    className={`character-portrait w-14 h-14 relative ${
                      selectedId === character.id ? "selected" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]}`} />
                    {selectedId === character.id && (
                      <>
                        <div 
                          className="absolute inset-0 border-2 rounded-sm"
                          style={{ 
                            borderColor: classBorderColors[classType],
                            boxShadow: `0 0 12px ${classBorderColors[classType]}80, inset 0 0 8px ${classBorderColors[classType]}40`
                          }}
                        />
                        <div 
                          className="absolute -inset-1 border border-white/50 rounded-sm pointer-events-none"
                          style={{ 
                            boxShadow: `0 0 16px ${classBorderColors[classType]}60`
                          }}
                        />
                      </>
                    )}
                    {/* Placeholder for avatar */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                      {character.name.slice(0, 2)}
                    </div>
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
                      className="character-portrait w-14 h-14 opacity-50 hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]}`} />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-lg font-bold">
                        ?
                      </div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={character.id}
                    onClick={() => onSelect(character)}
                    className={`character-portrait w-14 h-14 relative ${
                      selectedId === character.id ? "selected" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${classColors[classType]}`} />
                    {selectedId === character.id && (
                      <>
                        <div 
                          className="absolute inset-0 border-2 rounded-sm"
                          style={{ 
                            borderColor: classBorderColors[classType],
                            boxShadow: `0 0 12px ${classBorderColors[classType]}80, inset 0 0 8px ${classBorderColors[classType]}40`
                          }}
                        />
                        <div 
                          className="absolute -inset-1 border border-white/50 rounded-sm pointer-events-none"
                          style={{ 
                            boxShadow: `0 0 16px ${classBorderColors[classType]}60`
                          }}
                        />
                      </>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                      {character.name.slice(0, 2)}
                    </div>
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
