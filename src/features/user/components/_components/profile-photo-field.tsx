import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProfilePhotoFieldProps {
  photo?: string | null;
  nom: string;
  prenom: string;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}

export function ProfilePhotoField({
  photo,
  nom,
  prenom,
  uploading,
  onFileChange,
  onRemovePhoto,
}: ProfilePhotoFieldProps) {
  const initials = `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="flex flex-col items-center gap-3 border-b pb-6">
      <div className="relative size-28 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
        {photo ? (
          <Image
            src={photo}
            alt="Photo de profil"
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-muted-foreground">
            {initials}
          </span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="photo-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={uploading}
            asChild
          >
            <span>
              <Camera className="mr-2 size-4" />
              {photo ? "Changer la photo" : "Ajouter une photo"}
            </span>
          </Button>
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={uploading}
        />

        {photo && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemovePhoto}
            disabled={uploading}
            className="text-destructive hover:text-destructive"
          >
            Supprimer
          </Button>
        )}
      </div>
    </div>
  );
}
