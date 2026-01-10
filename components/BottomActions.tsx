import { ArrowLeft, Eye } from "lucide-react";

export const BottomActions = () => {
  return (
    <div className="flex items-center gap-8 px-6 py-4">
      <button className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
        <div className="w-8 h-8 rounded-full border border-muted-foreground flex items-center justify-center group-hover:border-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="font-display font-semibold tracking-wider">Back</span>
      </button>

      <button className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
        <div className="w-8 h-8 rounded-full border border-muted-foreground flex items-center justify-center group-hover:border-foreground transition-colors">
          <Eye className="w-4 h-4" />
        </div>
        <span className="font-display font-semibold tracking-wider">Mark All As Seen</span>
      </button>
    </div>
  );
};
