<?php

namespace App\Http\Resources\Professor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CourseResourceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'size' => $this->formatSize($this->size),
            'url' => $this->type === 'link' ? $this->url : ($this->file_path ? Storage::url($this->file_path) : null),
            'uploaded_at' => $this->created_at->format('Y-m-d'),
        ];
    }

    private function formatSize(?int $bytes): string
    {
        if (!$bytes) {
            return '-';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 1) . ' ' . $units[$i];
    }
}