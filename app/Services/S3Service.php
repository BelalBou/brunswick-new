<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class S3Service
{
    public function upload(UploadedFile $file, string $path = ''): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $fullPath = $path ? $path . '/' . $filename : $filename;

        Storage::disk('s3')->putFileAs(
            $path,
            $file,
            $filename,
            'public'
        );

        return Storage::disk('s3')->url($fullPath);
    }

    public function delete(string $path): bool
    {
        return Storage::disk('s3')->delete($path);
    }

    public function exists(string $path): bool
    {
        return Storage::disk('s3')->exists($path);
    }
} 