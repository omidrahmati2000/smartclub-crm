'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@smartclub/ui/button';
import { Input } from '@smartclub/ui/input';
import type { AssetImage } from '@smartclub/types';

interface ImageUploadZoneProps {
  images: AssetImage[];
  onImagesChange: (images: AssetImage[]) => void;
  maxImages?: number;
}

export function ImageUploadZone({
  images,
  onImagesChange,
  maxImages = 6,
}: ImageUploadZoneProps) {
  const t = useTranslations('venue-admin.assets');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: AssetImage[] = [];
    const remainingSlots = maxImages - images.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: AssetImage = {
            id: `temp-${Date.now()}-${Math.random()}`,
            url: e.target?.result as string,
            order: images.length + newImages.length,
          };
          newImages.push(newImage);

          if (newImages.length === Math.min(files.length, remainingSlots)) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = images
      .filter((img) => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index }));
    onImagesChange(updatedImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {canAddMore && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
            hover:border-primary hover:bg-muted/50 cursor-pointer
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{t('uploadImages')}</p>
              <p className="text-xs text-muted-foreground">
                {t('dragDropOrClick')}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {images.length} / {maxImages} {t('images')}
            </p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-video rounded-lg border bg-muted overflow-hidden group"
            >
              <img
                src={image.url}
                alt={image.caption || `Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    {t('primaryImage')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-2" />
          <p className="text-sm">{t('noImagesYet')}</p>
        </div>
      )}
    </div>
  );
}
